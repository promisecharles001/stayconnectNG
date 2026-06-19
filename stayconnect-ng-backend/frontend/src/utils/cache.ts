import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@stayconnect_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Simple AsyncStorage cache with TTL support
 */
export class Cache {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const fullKey = `${CACHE_PREFIX}${key}`;
      const json = await AsyncStorage.getItem(fullKey);
      if (!json) return null;

      const entry: CacheEntry<T> = JSON.parse(json);
      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set<T>(key: string, data: T): Promise<void> {
    try {
      const fullKey = `${CACHE_PREFIX}${key}`;
      const entry: CacheEntry<T> = { data, timestamp: Date.now() };
      await AsyncStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async isValid(key: string, ttl = DEFAULT_TTL): Promise<boolean> {
    try {
      const fullKey = `${CACHE_PREFIX}${key}`;
      const json = await AsyncStorage.getItem(fullKey);
      if (!json) return false;

      const entry: CacheEntry<unknown> = JSON.parse(json);
      return Date.now() - entry.timestamp < ttl;
    } catch {
      return false;
    }
  }

  static async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = DEFAULT_TTL
  ): Promise<T> {
    const isCacheValid = await Cache.isValid(key, ttl);
    if (isCacheValid) {
      const cached = await Cache.get<T>(key);
      if (cached !== null) return cached;
    }

    const data = await fetcher();
    await Cache.set(key, data);
    return data;
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export default Cache;
