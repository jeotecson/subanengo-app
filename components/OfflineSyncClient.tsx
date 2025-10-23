"use client";

import { useEffect, useCallback } from "react";
import { get, set } from "idb-keyval";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const QUEUE_KEY = "subanengo-offline-queue";

type OfflineAction =
  | { id?: number; type: "challengeProgress"; payload: { challengeId: number } }
  | { id?: number; type: "challengeScramble"; payload: { challengeId: number; userOrder: number[] } }
  | { id?: number; type: "reduceHearts"; payload: { challengeId: number } }
  | { id?: number; type: "refillHearts"; payload: {} };

async function getQueue(): Promise<OfflineAction[]> {
  return (await get(QUEUE_KEY)) || [];
}

async function setQueue(q: OfflineAction[]) {
  await set(QUEUE_KEY, q);
}

export async function enqueueAction(action: OfflineAction) {
  const q = await getQueue();
  action.id = Date.now();
  q.push(action);
  await setQueue(q);
}

async function flushQueueOnce() {
  const q = await getQueue();
  if (!q.length) return { ok: true, flushed: 0 };

  for (const item of q.slice()) {
    try {
      const res = await fetch("/api/offline/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("sync failed");

      const newQ = (await getQueue()).filter((x) => x.id !== item.id);
      await setQueue(newQ);
    } catch (err) {
      console.error("Offline sync failed for item", item, err);
      return { ok: false, flushed: 0 };
    }
  }
  return { ok: true, flushed: q.length };
}

export default function OfflineSyncClient() {
  const router = useRouter();

  const tryFlush = useCallback(async () => {
    const res = await flushQueueOnce();
    if (res.ok && res.flushed > 0) {
      toast.success(`Synced ${res.flushed} offline action(s)`);
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    tryFlush();

    window.addEventListener("online", () => {
      console.log("Back online — syncing queued actions...");
      tryFlush();
    });

    window.addEventListener("offline", () => {
      console.log("Offline mode enabled");
    });

    return () => {
      window.removeEventListener("online", tryFlush);
    };
  }, [tryFlush]);

  return null;
}