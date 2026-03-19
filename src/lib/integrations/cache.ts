// ============================================================
// ViberQC — In-memory API Response Cache with TTL
// ============================================================

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(cleanupIntervalMs: number = 60_000) {
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Common TTL constants
export const CACHE_TTL = {
  SSL_GRADE: 24 * 60 * 60 * 1000, // 24 hours
  DOMAIN_AUTHORITY: 12 * 60 * 60 * 1000, // 12 hours
  SCAN_RESULT: 60 * 60 * 1000, // 1 hour
  OBSERVATORY: 6 * 60 * 60 * 1000, // 6 hours
  PERFORMANCE: 30 * 60 * 1000, // 30 minutes
} as const;

// Singleton cache instance
export const apiCache = new ApiCache();
