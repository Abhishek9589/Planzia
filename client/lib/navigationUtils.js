/**
 * Safe navigation back utility
 * Attempts to navigate back using browser history
 * Falls back to a default route if history is unavailable
 */
export const safeNavigateBack = (navigate, fallbackRoute = '/venues') => {
  // Try to go back in browser history
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    // Fallback to default route if no history available
    navigate(fallbackRoute);
  }
};
