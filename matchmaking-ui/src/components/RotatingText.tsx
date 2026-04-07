import { useState, useEffect, useRef, useCallback } from "react";

interface RotatingTextProps {
  prefix: string[];
  suffixes: string[][];
  interval?: number;
  wordDelay?: number;
  className?: string;
  dynamicClassName?: string;
}

type Phase = "display" | "deleting" | "building";

export default function RotatingText({
  prefix,
  suffixes,
  interval = 2500,
  wordDelay = 280,
  className,
  dynamicClassName,
}: RotatingTextProps) {
  const [suffixIndex, setSuffixIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(suffixes[0].length);
  const [phase, setPhase] = useState<Phase>("display");
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentSuffix = suffixes[suffixIndex];
  const nextSuffixIndex = (suffixIndex + 1) % suffixes.length;
  const nextSuffix = suffixes[nextSuffixIndex];

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (phase === "display") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), interval);
    }
    return clear;
  }, [phase, interval, clear]);

  useEffect(() => {
    if (phase === "deleting") {
      if (visibleCount > 0) {
        timeoutRef.current = setTimeout(() => {
          setVisibleCount((c) => c - 1);
        }, wordDelay);
      } else {
        // Switch to next suffix and start building
        setSuffixIndex(nextSuffixIndex);
        setVisibleCount(0);
        setAddingIndex(null);
        setPhase("building");
      }
    }
    return clear;
  }, [phase, visibleCount, wordDelay, nextSuffixIndex, clear]);

  useEffect(() => {
    if (phase === "building") {
      const target = nextSuffix.length;
      if (visibleCount < target) {
        timeoutRef.current = setTimeout(() => {
          setAddingIndex(visibleCount);
          setVisibleCount((c) => c + 1);
        }, wordDelay);
      } else {
        setAddingIndex(null);
        setPhase("display");
      }
    }
    return clear;
  }, [phase, visibleCount, wordDelay, nextSuffix.length, clear]);

  // During building phase, we show the NEW suffix (which is now currentSuffix after the index swap)
  const displaySuffix = phase === "building" ? currentSuffix : currentSuffix;
  const wordsToShow = displaySuffix.slice(0, visibleCount);

  return (
    <p className={className}>
      {prefix.map((word, i) => (
        <span key={`p-${i}`}>{word} </span>
      ))}
      {wordsToShow.map((word, i) => (
        <span
          key={`s-${suffixIndex}-${i}`}
          className={`rotating-word${
            phase === "deleting" && i === visibleCount - 1
              ? " rotating-word--removing"
              : ""
          }${
            addingIndex === i ? " rotating-word--adding" : ""
          } ${dynamicClassName ?? ""}`}
        >
          {word}{" "}
        </span>
      ))}
      {/* Blinking cursor during transitions */}
      {phase !== "display" && (
        <span
          className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle"
          style={{
            backgroundColor: "var(--color-accent)",
            animation: "fadeIn 0.5s ease-in-out infinite alternate",
          }}
        />
      )}
    </p>
  );
}
