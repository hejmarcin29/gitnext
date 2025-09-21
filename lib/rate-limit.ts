type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
};

const defaultOptions: RateLimitOptions = {
  maxRequests: 5, // 5 requests
  windowMs: 60 * 1000, // per 60 seconds
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  ip: string,
  options: RateLimitOptions = defaultOptions
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Jeśli nie ma rekordu lub minął czas okna, stwórz nowy
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + options.windowMs,
    });
    return false;
  }

  // Zwiększ licznik i sprawdź limit
  record.count += 1;
  return record.count > options.maxRequests;
}