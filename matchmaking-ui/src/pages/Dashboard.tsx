import { useRef, useState } from "react";
import { runAlgorithm } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import { ALGORITHMS } from "../constants/algorithms";
import { useGraph } from "../context/GraphContext";
import { parseTeamInput } from "../utils/parseTeamInput";
import { formatPlayerList, getPlayerName } from "../utils/playerNames";

const DASHBOARD_MODES: Record<string, {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}> = {
  localSearchFirst: {
    eyebrow: "Fastest Read",
    title: "Local Search (First Improvement)",
    description: "Stops as soon as it finds a better swap, which makes it the quickest way to sanity-check a graph.",
    bullets: [
      "Best for rapid iteration on freshly generated graphs.",
      "Good when you want to test several starting teams quickly.",
      "Can settle on a good-enough split rather than the best one.",
    ],
  },
  localSearchBest: {
    eyebrow: "Balanced Heuristic",
    title: "Local Search (Best Improvement)",
    description: "Checks every possible swap each round before choosing the strongest one, so it trades a little speed for better decisions.",
    bullets: [
      "A strong default when you want a solid split without exhaustive search.",
      "Useful for showing the value of a smarter heuristic.",
      "Still much faster than checking every possible team combination.",
    ],
  },
  guaranteedBestTeam: {
    eyebrow: "Exact Result",
    title: "Guaranteed Best Team",
    description: "Exhaustive search checks every valid team combination and returns the exact best split for the current graph.",
    bullets: [
      "Most accurate option for small-to-medium graphs.",
      "Best for demonstrating the assignment's exact optimum.",
      "Slows down sharply as the player count climbs.",
    ],
  },
};

export default function Dashboard() {
  const { allPlayers } = useGraph();
  const [algorithm, setAlgorithm] = useState<string>(ALGORITHMS[0].value);
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<MatchmakingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");
  const selectedMode = DASHBOARD_MODES[algorithm] ?? DASHBOARD_MODES.localSearchFirst;

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const res = await runAlgorithm({ algorithm, initialTeam: team }, controller.signal);
      setResult(res);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request cancelled.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to run algorithm. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  function handleCancel() {
    abortControllerRef.current?.abort();
  }

  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Execute</p>
        <h1 className="theme-title mt-2">Dashboard</h1>
        <p className="theme-subtitle mt-3">
          Pick an algorithm, set an optional starting team, and run it against
          your loaded graph.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
        <section className="theme-panel rounded p-6 animate-scale-in">
          <div className="theme-console-panel">
            <div className="theme-console-header">
              <div>
                <p className="theme-section-title">Run A Match</p>
                <h2 className="theme-console-title mt-2">
                  Choose one algorithm and inspect the split.
                </h2>
                <p className="theme-console-copy mt-3">
                  This page is for one focused run at a time. Pick a search strategy,
                  optionally seed Team 1, and inspect the resulting balance.
                </p>
              </div>
              <GraphStatus />
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto] md:items-end">
              <div>
                <label className="theme-label block">
                  Algorithm
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="theme-input mt-2 w-full rounded px-3 py-2.5 text-sm"
                >
                  {ALGORITHMS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="theme-label block">
                  Initial Team (optional)
                </label>
                <input
                  type="text"
                  value={initialTeam}
                  onChange={(e) => setInitialTeam(e.target.value)}
                  placeholder={`e.g. ${inputExample}`}
                  className="theme-input mt-2 w-full rounded px-3 py-2.5 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="theme-btn-primary min-h-11 px-6 py-2 text-sm"
                >
                  {loading ? "Running..." : "Run"}
                </button>
                {loading && (
                  <button
                    onClick={handleCancel}
                    className="theme-btn-danger min-h-11 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {loading && (
              <div className="animate-fade-in">
                <p className="theme-note mb-2 text-sm">
                  Running algorithm — exhaustive search may take a while on large graphs...
                </p>
                <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
                  <div className="theme-loading-fill h-full w-full animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            {error && (
              <p className="theme-error text-sm">{error}</p>
            )}
          </div>
        </section>

        <aside className="theme-panel-subtle rounded p-5 animate-fade-in delay-1">
          <p className="theme-label">{selectedMode.eyebrow}</p>
          <h3 className="mt-2 text-xl font-bold theme-text-primary">
            {selectedMode.title}
          </h3>
          <p className="theme-note mt-3">
            {selectedMode.description}
          </p>
          <ul className="theme-preview-list mt-4 text-sm">
            {selectedMode.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Result card */}
      {result && (
        <div className="theme-panel mt-6 rounded p-6 animate-scale-in">
          <h2 className="theme-section-title">
            {ALGORITHMS.find((a) => a.value === result.algorithm)?.label ?? result.algorithm}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="theme-team-card theme-team-card--1 p-4">
              <p className="theme-label theme-team-value--1">Team 1 ({result.team.length})</p>
              <p className="theme-team-value--1 mt-2 text-lg font-bold leading-relaxed">
                {formatPlayerList(result.team)}
              </p>
            </div>
            <div className="theme-team-card theme-team-card--2 p-4">
              <p className="theme-label theme-team-value--2">Team 2 ({result.opposingTeam.length})</p>
              <p className="theme-team-value--2 mt-2 text-lg font-bold leading-relaxed">
                {formatPlayerList(result.opposingTeam)}
              </p>
            </div>
            <div className="theme-panel-subtle rounded p-4">
              <p className="theme-label">Score</p>
              <p className="mt-2 text-xl font-bold theme-text-primary">{formatScore(result.score)}</p>
            </div>
            <div className="theme-panel-subtle rounded p-4">
              <p className="theme-label">Runtime</p>
              <p className="theme-mono mt-2 text-xl font-bold theme-text-primary">
                {result.runtimeMs} ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
