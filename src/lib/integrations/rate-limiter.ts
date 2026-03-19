// ============================================================
// ViberQC — Token Bucket Rate Limiter (in-memory)
// ============================================================

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private readonly maxTokens: number,
    private readonly refillIntervalMs: number,
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd =
      Math.floor(elapsed / this.refillIntervalMs) * this.maxTokens;

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Try to acquire a token. Returns true if successful.
   */
  acquire(): boolean {
    this.refill();

    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }

    return false;
  }

  /**
   * Wait until a token is available, then acquire it.
   * Throws if wait exceeds maxWaitMs.
   */
  async waitForToken(maxWaitMs: number = 10_000): Promise<void> {
    const start = Date.now();

    while (!this.acquire()) {
      if (Date.now() - start >= maxWaitMs) {
        throw new RateLimitExceededError(
          `Rate limit: waited ${maxWaitMs}ms without getting a token`,
        );
      }
      await sleep(100);
    }
  }

  getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }
}

export class RateLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitExceededError";
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
