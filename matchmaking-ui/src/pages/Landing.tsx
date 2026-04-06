import { Link } from "react-router-dom";
import { getPlayerName } from "../utils/playerNames";

const workflowCards = [
  {
    step: "01",
    title: "Graph Builder",
    description:
      "Load pairwise player synergy as a weighted graph and estimate runtime before you run.",
    cta: "Open Builder",
    to: "/graph-builder",
  },
  {
    step: "02",
    title: "Dashboard",
    description:
      "Run one algorithm at a time, seed an initial team, and inspect the resulting split.",
    cta: "Run A Match",
    to: "/dashboard",
  },
  {
    step: "03",
    title: "Compare",
    description:
      "Benchmark score and runtime side by side to see how local search stacks up against exhaustive search.",
    cta: "Compare Modes",
    to: "/compare",
  },
  {
    step: "04",
    title: "Visualise",
    description:
      "Replay the search step by step and see the graph evolve as players are added or removed.",
    cta: "Watch Replay",
    to: "/visualise",
  },
];

const algorithmCards = [
  {
    name: "Local Search (First)",
    complexity: "O(n\u00B2)",
    summary:
      "Takes the first improving move it finds, making it quick and intuitive to trace.",
    accentColor: "#38bdf8",
  },
  {
    name: "Local Search (Best)",
    complexity: "O(n\u00B2)",
    summary:
      "Evaluates every one-step improvement and chooses the strongest move available.",
    accentColor: "#38bdf8",
  },
  {
    name: "Guaranteed Best",
    complexity: "O(2^n)",
    summary:
      "Explores every possible team split to provide the optimal benchmark for comparison.",
    accentColor: "#FF4655",
  },
];

const systemNotes = [
  { label: "Core", text: "Java algorithm core with graph-based team scoring" },
  { label: "API", text: "Spring Boot REST API for graph loading, runs, comparisons, and step traces" },
  { label: "UI", text: "React + TypeScript interface for exploration and visual explanation" },
  { label: "Output", text: "Runtime, score, and team output surfaced for portfolio-ready analysis" },
];

const spotlightNodes = [
  { id: 0, x: 160, y: 32, fill: "#38bdf8" },
  { id: 1, x: 246, y: 70, fill: "#38bdf8" },
  { id: 2, x: 282, y: 154, fill: "#38bdf8" },
  { id: 3, x: 240, y: 240, fill: "#FF4655" },
  { id: 4, x: 160, y: 278, fill: "#FF4655" },
  { id: 5, x: 78, y: 242, fill: "#FF4655" },
  { id: 6, x: 36, y: 154, fill: "#38bdf8" },
  { id: 7, x: 76, y: 70, fill: "#FF4655" },
];

const spotlightEdges = [
  [0, 2], [0, 3], [0, 5], [1, 3], [1, 4],
  [2, 4], [2, 6], [3, 6], [4, 7], [5, 1],
  [6, 1], [7, 2],
] as const;

const previewCards = [
  {
    label: "Players",
    title: "Each circle is a player",
    description:
      "Every node is a player in the lobby waiting to be sorted into one of two teams.",
  },
  {
    label: "Connections",
    title: "Lines are synergy scores",
    description:
      "Each edge carries a weight based on how well two players have performed together in past matches.",
  },
  {
    label: "Team Split",
    title: "Colours show the split",
    description:
      "Blue and red mark opposite teams. The algorithm places high-synergy players on opposing sides for a balanced match.",
  },
];

export default function Landing() {
  return (
    <div className="theme-page theme-home space-y-16">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="animate-fade-in-up">
            <p className="theme-kicker">
              Portfolio Project // Graph Search // FPS Team Balance
            </p>
          </div>

          <div className="space-y-5">
            <h1 className="theme-title animate-fade-in-up delay-1">
              Match<span className="text-[#FF4655]">/</span>Matrix
            </h1>
            <p className="animate-fade-in-up delay-2 max-w-4xl text-2xl font-semibold leading-snug text-[#ECE8E1] sm:text-3xl">
              A hands-on way to explore how team-balancing algorithms work in
              First-Person Shooter games.
            </p>
            <div className="theme-accent-line animate-fade-in delay-3" />
            <p className="theme-subtitle animate-fade-in-up delay-3">
              MatchMatrix is a technical full-stack portfolio app built on top
              of a data structures and algorithms project I originally started
              while learning about graphs. I later expanded it into a sandbox
              for exploring new DSA concepts, applying them to matchmaking
              problems, and visualising the results.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-in-up delay-4">
            <Link
              to="/graph-builder"
              className="theme-btn-primary px-6 py-3 text-sm"
            >
              Start Building
            </Link>
            <Link
              to="/visualise"
              className="theme-btn-secondary px-5 py-3 text-sm"
            >
              Watch The Visualiser
            </Link>
            <Link
              to="/compare"
              className="theme-btn-secondary px-5 py-3 text-sm"
            >
              Compare Algorithms
            </Link>
          </div>
        </div>

        {/* ── Hero Preview Panel ─────────────────────── */}
        <div className="theme-panel theme-home-stage rounded-2xl p-5 animate-scale-in delay-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="theme-section-title">Quick Preview</p>
              <p className="mt-2 text-lg font-semibold text-[#ECE8E1]">
                See how MatchMatrix turns a group of players into two teams.
              </p>
            </div>
            <span className="theme-home-tag">Visual Guide</span>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="theme-panel-subtle rounded-xl p-3">
              <svg viewBox="0 0 320 310" className="h-auto w-full">
                {spotlightEdges.map(([start, end], index) => {
                  const from = spotlightNodes[start];
                  const to = spotlightNodes[end];
                  const isCross = from.fill !== to.fill;
                  return (
                    <line
                      key={index}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isCross ? "#FF4655" : "#1e3048"}
                      strokeWidth={isCross ? 1.5 : 1}
                      opacity={isCross ? 0.35 : 0.5}
                    />
                  );
                })}
                {spotlightNodes.map((node) => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="rgba(255,255,255,0.04)"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="18"
                      fill={node.fill}
                      stroke={node.fill === "#FF4655" ? "#ff6b77" : "#67e8f9"}
                      strokeWidth="2"
                    />
                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {getPlayerName(node.id)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {previewCards.map((card) => (
                <div
                  key={card.label}
                  className="theme-panel-subtle rounded-xl p-3"
                >
                  <p className="theme-label">{card.label}</p>
                  <p className="mt-1.5 text-sm font-semibold text-[#ECE8E1]">
                    {card.title}
                  </p>
                  <p className="theme-note mt-1.5 text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflows ────────────────────────────────── */}
      <section className="space-y-6">
        <div className="max-w-3xl animate-fade-in-up">
          <p className="theme-section-title">Core Workflows</p>
          <h2 className="mt-3 text-3xl font-bold text-[#ECE8E1]">
            From graph to replay in four steps.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowCards.map((card, i) => (
            <div
              key={card.title}
              className={`theme-panel rounded-2xl p-5 animate-fade-in-up delay-${i + 1} group`}
            >
              <span className="text-[#FF4655] font-mono text-xs font-bold opacity-50">
                {card.step}
              </span>
              <h3 className="mt-2 text-xl font-bold text-[#ECE8E1]">
                {card.title}
              </h3>
              <p className="theme-note mt-3 text-sm leading-7">
                {card.description}
              </p>
              <Link
                to={card.to}
                className="theme-btn-secondary mt-5 inline-flex px-4 py-2 text-xs group-hover:border-[rgba(255,70,85,0.3)]"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Algorithms + System ──────────────────────── */}
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="theme-panel rounded-2xl p-6 animate-fade-in-up">
          <p className="theme-section-title">Algorithms</p>
          <h2 className="mt-3 text-3xl font-bold text-[#ECE8E1]">
            Three approaches to the strongest team split.
          </h2>
          <div className="mt-6 grid gap-3">
            {algorithmCards.map((card) => (
              <div
                key={card.name}
                className="theme-panel-subtle rounded-xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#ECE8E1]">
                    {card.name}
                  </h3>
                  <span
                    className="theme-home-tag"
                    style={{
                      color: card.accentColor,
                      borderColor: `${card.accentColor}33`,
                      background: `${card.accentColor}14`,
                    }}
                  >
                    {card.complexity}
                  </span>
                </div>
                <p className="theme-note mt-2 text-sm leading-7">
                  {card.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-panel rounded-2xl p-6 animate-fade-in-up delay-2">
          <p className="theme-section-title">Under The Hood</p>
          <h2 className="mt-3 text-3xl font-bold text-[#ECE8E1]">
            Built to showcase algorithm design and full-stack delivery.
          </h2>
          <div className="mt-6 space-y-3">
            {systemNotes.map((note) => (
              <div key={note.label} className="theme-home-note rounded-xl px-4 py-4">
                <span className="theme-label text-[#FF4655]">{note.label}</span>
                <p className="mt-1 text-sm font-medium text-[#ECE8E1]">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
