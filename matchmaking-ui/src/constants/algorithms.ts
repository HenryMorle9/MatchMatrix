export const ALGORITHMS = [
  { value: "localSearchFirst", label: "Local Search (First Improvement)" },
  { value: "localSearchBest", label: "Local Search (Best Improvement)" },
  { value: "guaranteedBestTeam", label: "Guaranteed Best Team (Exhaustive)" },
] as const;

export const ALGORITHM_LABELS: Record<string, string> = Object.fromEntries(
  ALGORITHMS.map((a) => [a.value, a.label]),
);
