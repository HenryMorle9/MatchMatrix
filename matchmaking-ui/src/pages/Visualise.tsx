import { useState, useEffect, useRef } from "react";
import { runWithSteps } from "../api/matchmaking";
import type { Step, StepsResult } from "../types/matchmaking";
import GraphStatus from "../components/GraphStatus";
import { ALGORITHMS } from "../constants/algorithms";
import { TEAM_COLORS } from "../constants/colors";
import { parseTeamInput } from "../utils/parseTeamInput";
import { useGraph } from "../context/GraphContext";
import {
  extractPlayerIdFromAction,
  formatPlayerAction,
  formatPlayerList,
  getPlayerName,
} from "../utils/playerNames";

/** Lay nodes evenly around a circle. */
function circularLayout(nodeIds: number[], cx: number, cy: number, radius: number) {
  const positions: Record<number, { x: number; y: number }> = {};
  nodeIds.forEach((id, i) => {
    const angle = (2 * Math.PI * i) / nodeIds.length - Math.PI / 2;
    positions[id] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
  return positions;
}

export default function Visualise() {
  const { apiEdges: edges, allPlayers, graphLoaded, refreshGraph } = useGraph();
  const [algorithm, setAlgorithm] = useState<string>("localSearchFirst");
  const [initialTeam, setInitialTeam] = useState("");
  const [result, setResult] = useState<StepsResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputExample = [allPlayers[0] ?? 0, allPlayers[1] ?? 5]
    .map(getPlayerName)
    .join(", ");

  function formatScore(score: number) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(score);
  }

  // Auto-play timer
  useEffect(() => {
    if (playing && result) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= result.steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, result]);

  async function handleRun() {
    setLoading(true);
    setError("");
    setResult(null);
    setCurrentStep(0);
    setPlaying(false);

    try {
      const team = parseTeamInput(initialTeam, allPlayers);
      await refreshGraph();
      const res = await runWithSteps({ algorithm, initialTeam: team });
      setResult(res);
      setCurrentStep(res.algorithm === "guaranteedBestTeam" ? res.steps.length - 1 : 0);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to run. Is the API running? Did you load a graph first?");
      }
    } finally {
      setLoading(false);
    }
  }

  const step: Step | null = result ? result.steps[currentStep] : null;
  const movedId = step ? extractPlayerIdFromAction(step.action) : null;
  const positions = allPlayers.length > 0
    ? circularLayout(allPlayers, 350, 300, 240)
    : {};
  const hasPreviewGraph = graphLoaded && allPlayers.length > 0;

  return (
    <div className="theme-page">
      <div className="animate-fade-in">
        <p className="theme-section-title">Replay</p>
        <h1 className="theme-title mt-2">Replay Search</h1>
        <p className="theme-subtitle mt-3">
          Step through each move and watch the split change.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.75fr)]">
        <section className="theme-panel theme-svg-panel rounded p-4 animate-scale-in">
          <div className="theme-console-header theme-divider border-b pb-4">
            <div>
              <p className="theme-section-title">Replay Stage</p>
              <h2 className="theme-console-title mt-2">
                {result ? "Follow the search step by step." : "Set the stage before the replay begins."}
              </h2>
              <p className="theme-console-copy mt-3">
                {result
                  ? "Gold edges mark the active move while the right rail updates the current split and score."
                  : hasPreviewGraph
                    ? "The graph is loaded and ready. Choose an algorithm, press Run, and this stage will animate each move."
                    : "Build and load a graph first, then come back here to replay how the split evolves over time."}
              </p>
            </div>

            <div className="theme-legend flex flex-wrap items-center justify-start gap-5 text-xs font-mono uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: TEAM_COLORS.team1 }} /> Team 1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: TEAM_COLORS.team2 }} /> Team 2
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-amber-400" /> Current move
              </span>
            </div>
          </div>

          {result && step ? (
            <>
              <div className="mt-4 mx-auto max-w-[700px] overflow-hidden">
                <svg viewBox="0 0 700 600" className="block h-auto w-full">
                  {edges.map((edge, i) => {
                    const p1 = positions[edge.p1];
                    const p2 = positions[edge.p2];
                    if (!p1 || !p2) return null;
                    const p1InT1 = step.team.includes(edge.p1);
                    const p2InT1 = step.team.includes(edge.p2);
                    const isCrossTeam = p1InT1 !== p2InT1;
                    const involvesMovedPlayer = movedId !== null && (edge.p1 === movedId || edge.p2 === movedId);
                    const otherNode = edge.p1 === movedId ? p2 : p1;
                    const cx = 350;
                    const cy = 300;
                    const dx = otherNode.x - cx;
                    const dy = otherNode.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const labelOffset = 48;
                    const labelX = otherNode.x + (dx / dist) * labelOffset;
                    const labelY = otherNode.y + (dy / dist) * labelOffset;

                    return (
                      <g key={i}>
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke={involvesMovedPlayer ? TEAM_COLORS.highlight : isCrossTeam ? TEAM_COLORS.crossTeamEdge : TEAM_COLORS.sameTeamEdge}
                          strokeWidth={involvesMovedPlayer ? 2.5 : isCrossTeam ? 1.5 : 0.5}
                          opacity={involvesMovedPlayer ? 0.95 : isCrossTeam ? 0.4 : 0.2}
                          className="transition-all duration-500"
                        />
                        {involvesMovedPlayer && (
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize={11}
                            fontWeight="bold"
                            className="select-none fill-amber-300"
                          >
                            {edge.score}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {allPlayers.map((id) => {
                    const pos = positions[id];
                    if (!pos) return null;
                    const inTeam1 = step.team.includes(id);
                    const inTeam2 = step.opposingTeam.includes(id);
                    const isMovedNode = id === movedId;
                    const fill = inTeam1 ? TEAM_COLORS.team1 : inTeam2 ? TEAM_COLORS.team2 : TEAM_COLORS.neutral;
                    const strokeColor = inTeam1 ? TEAM_COLORS.team1Stroke : inTeam2 ? TEAM_COLORS.team2Stroke : TEAM_COLORS.neutralStroke;

                    return (
                      <g key={id}>
                        <title>{getPlayerName(id)}</title>
                        {isMovedNode && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={28}
                            fill="none"
                            stroke={TEAM_COLORS.highlight}
                            strokeWidth={3}
                            className="transition-all duration-500"
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={22}
                          fill={fill}
                          stroke={strokeColor}
                          strokeWidth={2}
                          className="transition-all duration-500"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 1}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-bold select-none"
                          fontSize={10}
                          fontFamily="Inconsolata, monospace"
                        >
                          {getPlayerName(id)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {result.algorithm === "guaranteedBestTeam" && (
                <div className="theme-info-banner mt-3 rounded px-4 py-3 text-sm">
                  <p className="font-semibold">Why only 2 steps?</p>
                  <p className="mt-1">
                    Guaranteed Best does not make step-by-step swaps. It checks every
                    possible team split, then returns the best one. With {allPlayers.length} players,
                    that meant {(2 ** allPlayers.length).toLocaleString()} combinations.
                  </p>
                </div>
              )}
            </>
          ) : hasPreviewGraph ? (
            <div className="mt-4 mx-auto max-w-[700px] overflow-hidden">
              <svg viewBox="0 0 700 600" className="block h-auto w-full">
                {edges.map((edge, i) => {
                  const p1 = positions[edge.p1];
                  const p2 = positions[edge.p2];
                  if (!p1 || !p2) return null;

                  return (
                    <line
                      key={i}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={TEAM_COLORS.sameTeamEdge}
                      strokeWidth={1}
                      opacity={0.45}
                    />
                  );
                })}

                {allPlayers.map((id) => {
                  const pos = positions[id];
                  if (!pos) return null;

                  return (
                    <g key={id}>
                      <title>{getPlayerName(id)}</title>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={22}
                        fill={TEAM_COLORS.neutral}
                        stroke={TEAM_COLORS.neutralStroke}
                        strokeWidth={2}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white font-bold select-none"
                        fontSize={10}
                        fontFamily="Inconsolata, monospace"
                      >
                        {getPlayerName(id)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="theme-stage-placeholder">
              <div className="theme-stage-empty rounded">
                <p className="theme-stage-empty-title">Nothing to replay yet</p>
                <p className="theme-stage-empty-copy">
                  The replay view comes alive once the API has a loaded graph. Generate one in Graph Builder,
                  then return here to step through the search.
                </p>
                <div className="theme-stage-meta">
                  <div>
                    <p className="theme-label">What this page shows</p>
                    <p className="theme-note mt-2">
                      Local search algorithms reveal each move one at a time, while exhaustive search jumps
                      from the starting state to the final optimum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4 animate-fade-in delay-1">
          <section className="theme-panel-subtle rounded p-5">
            <div className="theme-console-panel">
              <div className="theme-console-header">
                <div>
                  <p className="theme-section-title">Replay Controls</p>
                  <p className="theme-console-copy mt-3">
                    Choose an algorithm and optional opening team, then run the replay on the loaded graph.
                  </p>
                </div>
                <GraphStatus />
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="theme-label block">Algorithm</label>
                  <select
                    value={algorithm}
                    onChange={(e) => { setAlgorithm(e.target.value); setResult(null); setCurrentStep(0); setPlaying(false); }}
                    className="theme-input mt-2 w-full rounded px-3 py-2.5 text-sm"
                  >
                    {ALGORITHMS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="theme-label block">
                    Initial Team
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
                  onClick={handleRun}
                  disabled={loading}
                  className="theme-btn-primary min-h-11 w-full px-6 py-2 text-sm"
                >
                  {loading ? "Running..." : "Run"}
                </button>
              </div>

              {loading && (
                <div className="animate-fade-in">
                  <p className="theme-note mb-2 text-sm">
                    Running algorithm and collecting steps...
                  </p>
                  <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
                    <div className="theme-loading-fill h-full w-full animate-pulse rounded-sm" />
                  </div>
                </div>
              )}

              {error && <p className="theme-error text-sm">{error}</p>}
            </div>
          </section>

          {result && step ? (
            <>
              <section className="theme-panel-subtle rounded p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(0)}
                    disabled={currentStep === 0}
                    className="theme-btn-secondary px-3 py-1.5 text-sm"
                    title="Reset"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                    className="theme-btn-secondary px-3 py-1.5 text-sm"
                    title="Previous step"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="theme-btn-primary px-4 py-1.5 text-sm"
                  >
                    {playing ? "⏸ Pause" : "▶ Play"}
                  </button>
                  <button
                    onClick={() => setCurrentStep((s) => Math.min(result.steps.length - 1, s + 1))}
                    disabled={currentStep >= result.steps.length - 1}
                    className="theme-btn-secondary px-3 py-1.5 text-sm"
                    title="Next step"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => setCurrentStep(result.steps.length - 1)}
                    disabled={currentStep >= result.steps.length - 1}
                    className="theme-btn-secondary px-3 py-1.5 text-sm"
                    title="Skip to end"
                  >
                    ⏭
                  </button>
                </div>

                <div className="mt-4">
                  <div className="theme-note mb-1 flex justify-between text-xs font-mono">
                    <span>Step {currentStep} / {result.steps.length - 1}</span>
                    <span>{result.runtimeMs} ms total</span>
                  </div>
                  <div className="theme-loading-track h-1.5 w-full overflow-hidden rounded-sm">
                    <div
                      className="theme-loading-fill h-full rounded-sm transition-all duration-300"
                      style={{ width: `${result.steps.length > 1 ? (currentStep / (result.steps.length - 1)) * 100 : 100}%` }}
                    />
                  </div>
                </div>
              </section>

              <section className="theme-panel-subtle space-y-3 rounded p-4">
                <div>
                  <span className="theme-label">Action</span>
                  <p className="mt-2 text-lg font-semibold theme-text-primary">{formatPlayerAction(step.action)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="theme-label theme-team-value--1">Team 1</span>
                    <p className="theme-team-value--1 mt-2 text-sm">{formatPlayerList(step.team)}</p>
                  </div>
                  <div>
                    <span className="theme-label theme-team-value--2">Team 2</span>
                    <p className="theme-team-value--2 mt-2 text-sm">{formatPlayerList(step.opposingTeam)}</p>
                  </div>
                </div>
                <div>
                  <span className="theme-label">Score</span>
                  <p className="mt-2 text-2xl font-bold theme-text-primary">
                    {formatScore(step.score)}
                  </p>
                </div>
              </section>

              <div className="theme-panel overflow-hidden rounded">
                <table className="theme-table w-full text-sm">
                  <thead className="theme-card-header">
                    <tr>
                      <th className="px-3 py-2 text-left">Step</th>
                      <th className="px-3 py-2 text-left">Action</th>
                      <th className="px-3 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((s, i) => (
                      <tr
                        key={i}
                        onClick={() => { setCurrentStep(i); setPlaying(false); }}
                        className={`theme-divider cursor-pointer border-t ${
                          i === currentStep ? "theme-row-active" : ""
                        }`}
                      >
                        <td className="theme-note px-3 py-2 font-mono">{i}</td>
                        <td className="px-3 py-2">{formatPlayerAction(s.action)}</td>
                        <td className="theme-mono px-3 py-2 text-right theme-text-primary">
                          {formatScore(s.score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <section className="theme-panel-subtle rounded p-5">
              <p className="theme-label">What You&apos;ll See</p>
              <ul className="theme-preview-list mt-4 text-sm">
                <li><strong>Neutral stage</strong> shows the loaded graph before any team assignments.</li>
                <li><strong>Gold edges</strong> appear once a move is active and mark the current decision.</li>
                <li><strong>Step history</strong> lets you jump to any point in the replay after the run begins.</li>
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
