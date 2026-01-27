// Rate Limiting Middleware for Express
// Prevents abuse and DDoS attacks

import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 'Check the Retry-After header'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for form submissions
 * 5 requests per minute
 */
export const formLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: 'Too many submission attempts. Please wait before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter for login attempts
 * 5 attempts per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Admin operations rate limiter
 * 50 requests per 15 minutes
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    error: 'Too many admin requests. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  formLimiter,
  authLimiter,
  adminLimiter
};

