import { useState } from "react";
import { compareAlgorithms } from "../api/matchmaking";
import type { MatchmakingResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import { ALGORITHM_LABELS } from "../constants/algorithms";
import { useGraph } from "../context/GraphContext";
import { parseTeamInput } from "../utils/parseTeamInput";
import { formatPlayerList, getPlayerName } from "../utils/playerNames";

const COMPARE_PREVIEW_ROWS = [
  {
    label: "Local Search (First Improvement)",
    summary: "Takes the first swap that helps. It is the fastest way to see how a heuristic behaves on the graph.",
    speed: "Very fast",
    bestFor: "Quick comparisons and starting-point experiments",
  },
  {
    label: "Local Search (Best Improvement)",
    summary: "Checks every swap each round before choosing. Slightly slower, but usually lands on a stronger split.",
    speed: "Fast",
    bestFor: "A balanced trade-off between speed and quality",
  },
  {
    label: "Guaranteed Best Team",
    summary: "Evaluates every possible split and returns the exact best result. Ideal when you want the true benchmark.",
    speed: "Slowest",
    bestFor: "Small graphs and final accuracy checks",
  },
] as const;

export default function Compare() {
  const { allPlayers } = useGraph();
  const [initialTeam, setInitialTeam] = useState("");
  const [results, setResults] = useState<MatchmakingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

  async function handleCompare() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      const res = await compareAlgorithms({
        algorithm: "compare",
        initialTeam: team,
      });
      setResults(res);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to compare. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
    }
  }

  const bestScore = results.length > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;
  const fastestTime = results.length > 0
    ? Math.min(...results.map((r) => r.runtimeMs))
    : 0;
  const bestScoreCount = results.filter((r) => r.score === bestScore).length;
  const fastestTimeCount = results.filter((r) => r.runtimeMs === fastestTime).length;


  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Benchmark</p>
        <h1 className="theme-title mt-2">Compare Algorithms</h1>
        <p className="theme-subtitle mt-3">
          Run every algorithm on the same graph and compare score against speed.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]">
        <section className="theme-panel overflow-hidden rounded animate-scale-in">
          <div className="px-6 py-5 theme-divider border-b">
            <p className="theme-section-title">Benchmark Board</p>
            <h2 className="theme-console-title mt-2">
              See the three search styles side by side before you run.
            </h2>
            <p className="theme-console-copy mt-3">
              Compare is your benchmark page. It runs all three approaches on the
              same graph so you can weigh exactness against runtime.
            </p>
          </div>
          <div>
            {COMPARE_PREVIEW_ROWS.map((row) => (
              <div key={row.label} className="theme-compare-row theme-divider border-t first:border-t-0">
                <div>
                  <p className="font-semibold theme-text-primary">{row.label}</p>
                  <p className="theme-note mt-1">{row.summary}</p>
                </div>
                <div>
                  <p className="theme-label">Speed</p>
                  <p className="mt-2 theme-text-primary">{row.speed}</p>
                </div>
                <div>
                  <p className="theme-label">Best For</p>
                  <p className="mt-2 theme-text-primary">{row.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4 animate-fade-in delay-1">
          <GraphStatus />
          <section className="theme-panel-subtle rounded p-5">
            <p className="theme-section-title">Compare Setup</p>
            <p className="theme-note mt-3">
              Optionally seed Team 1 if you want to see whether the heuristics react
              differently from the same starting point.
            </p>
            <div className="mt-5 grid gap-4">
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
              <button
                onClick={handleCompare}
                disabled={loading}
                className="theme-btn-primary min-h-11 w-full px-6 py-2 text-sm"
              >
                {loading ? "Comparing..." : "Compare All"}
              </button>
            </div>

            {loading && (
              <div className="mt-5 animate-fade-in">
                <p className="theme-note mb-2 text-sm">
                  Running all three algorithms — exhaustive search may take a while on large graphs...
                </p>
                <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
                  <div className="theme-loading-fill h-full w-full animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            {error && <p className="theme-error mt-4 text-sm">{error}</p>}
          </section>
        </aside>
      </div>

      {/* Results table */}
      {results.length > 0 && (
        <div className="theme-panel mt-6 overflow-hidden rounded animate-scale-in">
          <table className="theme-table w-full text-left text-sm">
            <thead className="theme-card-header">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Team 1</th>
                <th className="px-4 py-3">Team 2</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Runtime</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={r.algorithm}
                  className="theme-divider border-b"
                >
                  <td className="px-4 py-3 font-medium theme-text-primary">
                    {ALGORITHM_LABELS[r.algorithm] ?? r.algorithm}
                  </td>
                  <td className="px-4 py-3">
                    <p className="theme-label theme-team-value--1">({r.team.length} players)</p>
                    <p className="theme-team-value--1 mt-1">{formatPlayerList(r.team)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="theme-label theme-team-value--2">({r.opposingTeam.length} players)</p>
                    <p className="theme-team-value--2 mt-1">{formatPlayerList(r.opposingTeam)}</p>
                  </td>
                  <td className="px-4 py-3 font-bold theme-text-primary">
                    {formatScore(r.score)}
                    {bestScoreCount === 1 && r.score === bestScore && (
                      <span className="theme-chip-success ml-2">
                        Most Accurate
                      </span>
                    )}
                  </td>
                  <td className="theme-mono px-4 py-3">
                    {r.runtimeMs} ms
                    {fastestTimeCount === 1 && r.runtimeMs === fastestTime && (
                      <span className="theme-chip-info ml-2">
                        Fastest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
