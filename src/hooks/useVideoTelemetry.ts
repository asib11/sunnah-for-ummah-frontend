"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight video telemetry — logs buffering, stalls, and loop smoothness.
 */
export function useVideoTelemetry(
  ref: React.RefObject<HTMLVideoElement>,
  label: string
) {
  const mountedAt = useRef<number>(performance.now());
  const lastWaitingAt = useRef<number | null>(null);
  const lastTimeBeforeLoop = useRef<number>(0);
  const loopStartedAt = useRef<number | null>(null);
  const reported = useRef({ ttff: false, buffered: false });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const tag = `[vid:${label}]`;

    const onPlaying = () => {
      if (!reported.current.ttff) {
        reported.current.ttff = true;
        const ttff = Math.round(performance.now() - mountedAt.current);
        console.info(`${tag} ttff`, { ms: ttff });
      }
      if (lastWaitingAt.current != null) {
        const gap = Math.round(performance.now() - lastWaitingAt.current);
        console.info(`${tag} stall`, { resumedMs: gap });
        lastWaitingAt.current = null;
      }
      if (loopStartedAt.current != null) {
        const gap = Math.round(performance.now() - loopStartedAt.current);
        console.info(`${tag} loop`, { restartGapMs: gap });
        loopStartedAt.current = null;
      }
    };

    const onWaiting = () => {
      lastWaitingAt.current = performance.now();
      console.info(`${tag} waiting`, { currentTime: v.currentTime.toFixed(2) });
    };

    const onStalled = () => console.info(`${tag} stalled`, { currentTime: v.currentTime.toFixed(2) });

    const onTimeUpdate = () => {
      if (v.currentTime < lastTimeBeforeLoop.current - 0.3) {
        loopStartedAt.current = performance.now();
      }
      lastTimeBeforeLoop.current = v.currentTime;
    };

    const onCanPlayThrough = () => {
      if (reported.current.buffered) return;
      reported.current.buffered = true;
      const ranges: Array<[number, number]> = [];
      for (let i = 0; i < v.buffered.length; i++) {
        ranges.push([v.buffered.start(i), v.buffered.end(i)]);
      }
      console.info(`${tag} canplaythrough`, {
        duration: v.duration?.toFixed?.(2),
        buffered: ranges,
      });
    };

    const onError = () => {
      const err = v.error;
      console.warn(`${tag} error`, { code: err?.code, message: err?.message });
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("stalled", onStalled);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("canplaythrough", onCanPlayThrough);
    v.addEventListener("error", onError);

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("stalled", onStalled);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("canplaythrough", onCanPlayThrough);
      v.removeEventListener("error", onError);
    };
  }, [ref, label]);
}
