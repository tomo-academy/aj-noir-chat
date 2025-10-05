import { useState, useEffect, useCallback, useMemo } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  isSlowConnection: boolean;
  shouldUseLazyLoading: boolean;
  optimizeForMobile: boolean;
}

export const usePerformanceOptimization = (): PerformanceMetrics => {
  const [renderTime, setRenderTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [optimizeForMobile, setOptimizeForMobile] = useState(false);

  // Detect connection speed
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    }
  }, []);

  // Detect mobile device
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setOptimizeForMobile(isMobile);
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage(memory.usedJSHeapSize / memory.jsHeapSizeLimit);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Measure render time
  const measureRenderTime = useCallback((callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    setRenderTime(end - start);
  }, []);

  const shouldUseLazyLoading = useMemo(() => {
    return isSlowConnection || memoryUsage > 0.8 || optimizeForMobile;
  }, [isSlowConnection, memoryUsage, optimizeForMobile]);

  return {
    renderTime,
    memoryUsage,
    isSlowConnection,
    shouldUseLazyLoading,
    optimizeForMobile
  };
};
