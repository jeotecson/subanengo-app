// components/sentence-scramble.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Option = {
  id: number;
  text: string;
  order: number; // this should match the DB 'order' field for the correct sequence
};

export function SentenceScramble({
  options,
  onSubmit,
}: {
  options: Option[];
  onSubmit: (userOrder: number[]) => void;
}) {
  // pool = tokens available to place (shuffled)
  const [pool, setPool] = useState<Option[]>(() =>
    shuffle(options.map((o) => ({ ...o })))
  );
  // slots = fixed-length left-to-right slots (null when empty)
  const [slots, setSlots] = useState<(Option | null)[]>(
    () => Array(options.length).fill(null)
  );
  // optional: track a selected slot for swapping
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    // reset when options change
    setPool(shuffle(options.map((o) => ({ ...o }))));
    setSlots(Array(options.length).fill(null));
    setSelectedSlot(null);
  }, [options]);

  const placeIntoFirstEmpty = (poolIndex: number) => {
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) {
      toast("All slots filled");
      return;
    }

    const token = pool[poolIndex];
    const newPool = pool.filter((_, i) => i !== poolIndex);
    const newSlots = [...slots];
    newSlots[emptyIdx] = token;

    setPool(newPool);
    setSlots(newSlots);
  };

  // click a token in pool: if a slot is selected, place into that slot (swap if occupied).
  // otherwise place into first empty slot
  const handlePoolClick = (poolIndex: number) => {
    if (selectedSlot !== null) {
      const token = pool[poolIndex];
      const newPool = [...pool];
      newPool.splice(poolIndex, 1);

      const newSlots = [...slots];
      const prev = newSlots[selectedSlot];

      newSlots[selectedSlot] = token;
      if (prev) newPool.push(prev);

      setPool(newPool);
      setSlots(newSlots);
      setSelectedSlot(null);
      return;
    }

    placeIntoFirstEmpty(poolIndex);
  };

  // click a slot: if slot has token remove it back to pool; if slot is empty mark it selected
  // if a slot is already selected, swap them
  const handleSlotClick = (slotIndex: number) => {
    const newSlots = [...slots];

    if (selectedSlot === null) {
      // no selected slot
      if (newSlots[slotIndex]) {
        // non-empty -> select this slot for swapping or allow removal on second click
        setSelectedSlot(slotIndex);
      } else {
        // empty slot clicked: do nothing (user should click pool token to place)
        setSelectedSlot(slotIndex);
      }
      return;
    }

    // there is a previously selectedSlot: swap selectedSlot and clicked slot
    if (selectedSlot === slotIndex) {
      // toggle off selection
      setSelectedSlot(null);
      return;
    }

    // swap the two slots
    [newSlots[selectedSlot], newSlots[slotIndex]] = [
      newSlots[slotIndex],
      newSlots[selectedSlot],
    ];
    setSlots(newSlots);
    setSelectedSlot(null);
  };

  const removeFromSlot = (slotIndex: number) => {
    const token = slots[slotIndex];
    if (!token) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setPool((prev) => [...prev, token]);
    setSelectedSlot(null);
  };

  const reset = () => {
    setPool(shuffle(options.map((o) => ({ ...o }))));
    setSlots(Array(options.length).fill(null));
    setSelectedSlot(null);
  };

  const allFilled = slots.every(Boolean);

  const handleSubmit = () => {
    if (!allFilled) {
      toast.error?.("Please complete the sentence first");
      return;
    }
    const userOrder = slots.map((s) => (s as Option).order);
    onSubmit(userOrder);
  };

  return (
    <div className="w-full">
      {/* Slots (target area) */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {slots.map((slot, idx) => {
          const isSelected = selectedSlot === idx;
          return (
            <div
              key={idx}
              onClick={() => {
                // if it has token, click toggles selection or removes (double click to remove)
                if (slot) {
                  handleSlotClick(idx);
                } else {
                  // empty slot: select to allow placing a pool token into it
                  setSelectedSlot(idx);
                }
              }}
              className={`min-w-[80px] px-3 py-2 rounded-lg border-2 text-center ${
                slot ? "bg-white border-slate-300" : "bg-slate-50 border-dashed border-slate-200"
              } ${isSelected ? "ring-2 ring-yellow-400" : ""}`}
            >
              {slot ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{slot.text}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromSlot(idx);
                    }}
                    aria-label="Remove word"
                    className="text-xs text-muted-foreground px-2 py-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">slot {idx + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Pool (tokens to drag/place) */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {pool.map((token, i) => (
          <button
            key={token.id}
            onClick={() => handlePoolClick(i)}
            className="px-3 py-2 rounded-lg bg-yellow-50 border hover:bg-yellow-100 text-sm font-medium"
          >
            {token.text}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button onClick={handleSubmit} disabled={!allFilled} variant="secondary">
          Submit
        </Button>
        <Button onClick={reset} variant="ghost">
          Shuffle
        </Button>
        <Button
          onClick={() => {
            // helpful tip: clear selection
            setSelectedSlot(null);
          }}
          variant="ghost"
        >
          Clear selection
        </Button>
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  // Fisher-Yates shuffle
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
