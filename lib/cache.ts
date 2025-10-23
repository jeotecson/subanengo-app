import { get, set } from "idb-keyval";

const CACHE_PREFIX = "api-cache-";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; 

export async function getCachedData(key: string) {
  try {
    const cached = await get(CACHE_PREFIX + key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to read from cache:", error);
    return null;
  }
}

export async function setCachedData(key: string, data: any) {
  try {
    await set(CACHE_PREFIX + key, {
      data,
      expiry: Date.now() + CACHE_EXPIRY_MS,
    });
  } catch (error) {
    console.error("Failed to write to cache:", error);
  }
}