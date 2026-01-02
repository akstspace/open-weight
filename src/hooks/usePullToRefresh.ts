import { useState, useRef, useCallback, TouchEvent } from "react";
import { hapticFeedback } from "./useHaptics";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: UsePullToRefreshOptions) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const wasAboveThresholdRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return;
    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      // Apply resistance to the pull
      const resistance = 0.5;
      const newDistance = Math.min(diff * resistance, maxPull);
      setPullDistance(newDistance);
      
      // Haptic feedback when threshold is crossed from below to above
      if (newDistance >= threshold && !wasAboveThresholdRef.current) {
        hapticFeedback('medium');
        wasAboveThresholdRef.current = true;
      } else if (newDistance < threshold) {
        wasAboveThresholdRef.current = false;
      }
    }
  }, [isRefreshing, maxPull, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      hapticFeedback('success');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    wasAboveThresholdRef.current = false;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const isTriggered = pullDistance >= threshold;
  const progress = Math.min(pullDistance / threshold, 1);

  return {
    pullDistance,
    isRefreshing,
    isTriggered,
    progress,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
