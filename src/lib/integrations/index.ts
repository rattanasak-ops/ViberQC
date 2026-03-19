// ============================================================
// ViberQC — Integration Layer Exports
// ============================================================

export {
  BaseApiClient,
  ApiRequestError,
  type ApiClientConfig,
  type ApiResponse,
  type ApiError,
} from "./base-client";

export {
  CircuitBreaker,
  CircuitOpenError,
  type CircuitState,
} from "./circuit-breaker";

export { RateLimiter, RateLimitExceededError } from "./rate-limiter";

export { ApiCache, apiCache, CACHE_TTL } from "./cache";

export {
  API_REGISTRY,
  getApiConfig,
  isFreeTier,
  getProvidersByCategory,
  type ApiProvider,
} from "./api-client-factory";
