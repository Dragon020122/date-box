"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEventHandler,
} from "react";

interface UseLongPressOptions {
  onComplete: () => void;
  duration?: number;
  disabled?: boolean;
  reduceMotion?: boolean;
}

interface LongPressHandlers {
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onPointerLeave: PointerEventHandler<HTMLElement>;
  onPointerCancel: PointerEventHandler<HTMLElement>;
}

interface UseLongPressResult {
  progress: number;
  isPressing: boolean;
  longPressHandlers: LongPressHandlers;
}

function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

export function useLongPress({
  onComplete,
  duration = 1200,
  disabled = false,
  reduceMotion = false,
}: UseLongPressOptions): UseLongPressResult {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const pressStartedAtRef = useRef(0);
  const pressingRef = useRef(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const cancelCompletionTimer = useCallback(() => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const updateProgress = useCallback((nextProgress: number) => {
    const normalizedProgress = clampProgress(nextProgress);
    progressRef.current = normalizedProgress;
    setProgress(normalizedProgress);
  }, []);

  const completePress = useCallback(() => {
    if (!pressingRef.current || completedRef.current) {
      return;
    }

    completedRef.current = true;
    pressingRef.current = false;
    setIsPressing(false);
    updateProgress(1);
    cancelFrame();
    cancelCompletionTimer();
    onCompleteRef.current();
  }, [cancelCompletionTimer, cancelFrame, updateProgress]);

  const handlePointerDown = useCallback<PointerEventHandler<HTMLElement>>(
    (event) => {
      if (
        disabled ||
        completedRef.current ||
        pressingRef.current ||
        event.button !== 0
      ) {
        return;
      }

      cancelFrame();
      cancelCompletionTimer();
      pressingRef.current = true;
      setIsPressing(true);
      pressStartedAtRef.current =
        window.performance.now() - progressRef.current * duration;
      completionTimerRef.current = window.setTimeout(
        completePress,
        Math.max(0, (1 - progressRef.current) * duration),
      );

      function animateForward(timestamp: number) {
        if (!pressingRef.current || completedRef.current) {
          return;
        }

        const nextProgress =
          (timestamp - pressStartedAtRef.current) / Math.max(duration, 1);

        if (nextProgress >= 1) {
          updateProgress(1);
          cancelFrame();
          return;
        }

        updateProgress(nextProgress);
        frameRef.current = window.requestAnimationFrame(animateForward);
      }

      frameRef.current = window.requestAnimationFrame(animateForward);
    },
    [
      cancelCompletionTimer,
      cancelFrame,
      completePress,
      disabled,
      duration,
      updateProgress,
    ],
  );

  const retreatProgress = useCallback(() => {
    cancelFrame();

    const retreatStartProgress = progressRef.current;
    if (retreatStartProgress <= 0 || completedRef.current) {
      return;
    }

    if (reduceMotion) {
      updateProgress(0);
      return;
    }

    const retreatStartedAt = window.performance.now();
    const retreatDuration = Math.max(160, retreatStartProgress * 360);

    function animateRetreat(timestamp: number) {
      const elapsed = timestamp - retreatStartedAt;
      const retreatRatio = clampProgress(elapsed / retreatDuration);
      const easedRatio = 1 - (1 - retreatRatio) ** 3;
      updateProgress(retreatStartProgress * (1 - easedRatio));

      if (retreatRatio < 1) {
        frameRef.current = window.requestAnimationFrame(animateRetreat);
      } else {
        frameRef.current = null;
        updateProgress(0);
      }
    }

    frameRef.current = window.requestAnimationFrame(animateRetreat);
  }, [cancelFrame, reduceMotion, updateProgress]);

  const stopPress = useCallback(() => {
    if (!pressingRef.current || completedRef.current) {
      return;
    }

    pressingRef.current = false;
    setIsPressing(false);
    cancelCompletionTimer();
    retreatProgress();
  }, [cancelCompletionTimer, retreatProgress]);

  useEffect(() => {
    if (disabled && pressingRef.current) {
      stopPress();
    }
  }, [disabled, stopPress]);

  useEffect(() => {
    function handleScroll() {
      if (pressingRef.current) {
        stopPress();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stopPress]);

  useEffect(
    () => () => {
      pressingRef.current = false;
      cancelCompletionTimer();
      cancelFrame();
    },
    [cancelCompletionTimer, cancelFrame],
  );

  return {
    progress,
    isPressing,
    longPressHandlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: stopPress,
      onPointerLeave: stopPress,
      onPointerCancel: stopPress,
    },
  };
}
