// Haptic feedback hook for touch interactions
// Uses the Vibration API where available

type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

const hapticPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  selection: 5,
  success: [10, 50, 10],
  warning: [20, 30, 20],
  error: [30, 50, 30, 50, 30],
};

export const useHaptics = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (style: HapticStyle = 'light') => {
    if (!isSupported) return;
    
    try {
      const pattern = hapticPatterns[style];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail if vibration is not allowed
    }
  };

  const impactLight = () => trigger('light');
  const impactMedium = () => trigger('medium');
  const impactHeavy = () => trigger('heavy');
  const selectionChanged = () => trigger('selection');
  const notificationSuccess = () => trigger('success');
  const notificationWarning = () => trigger('warning');
  const notificationError = () => trigger('error');

  return {
    isSupported,
    trigger,
    impactLight,
    impactMedium,
    impactHeavy,
    selectionChanged,
    notificationSuccess,
    notificationWarning,
    notificationError,
  };
};

// Utility function for quick haptic feedback
export const hapticFeedback = (style: HapticStyle = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(hapticPatterns[style]);
    } catch {
      // Silently fail
    }
  }
};
