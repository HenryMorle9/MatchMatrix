# MatchMatrix

A full-stack team-balancing system that uses graph theory and combinatorial optimisation to split players into fair, competitive teams for First-Person Shooter games based on their historical play data.

Players are modelled as nodes in a weighted undirected graph. Edge weights represent how well two players have performed together in the past. The system finds the team split that maximises cross-team synergy — placing players who work well together on **opposing** sides for a balanced match.

---

## How It Works

### The Scoring Function

A team split is evaluated by summing every edge weight that crosses between the two teams:

```
g(T1, T2) = Σ f(pi, pj)  for all pi ∈ T1, pj ∈ T2
```

The higher the score, the more balanced the match — players with strong past synergy are competing against each other rather than playing together.

### Example

Given this player graph:

```
0 1 2.0     →  f(0,1) = 2.0
0 2 1.0     →  f(0,2) = 1.0
0 4 4.0     →  f(0,4) = 4.0
1 2 3.0     →  ...
1 6 5.0
2 3 2.0
2 5 1.0
2 6 2.0
3 5 3.0
4 5 1.0
```

The optimal split is **T1 = {0, 2, 5, 6}** vs **T2 = {1, 3, 4}** with a score of **20**.

---

## Algorithms

Three strategies are implemented, covering the full spectrum from fast heuristic to guaranteed optimal:

| Algorithm | Strategy | Time Complexity | Finds Optimal? |
|-----------|----------|-----------------|----------------|
| `localSearchFirst` | Iteratively applies the **first** move that improves the score | O(n²) | No — local optimum |
| `localSearchBest` | Iteratively applies the **best** move that improves the score | O(n²) | Often — better local optimum |
| `guaranteedBestTeam` | Exhaustive backtracking over all 2ⁿ splits | O(2ⁿ) | Yes — always |

Both local search variants use add/remove moves: at each step, a single player is either added to or removed from the current team if it improves the cross-team score.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core algorithms | Java 17 |
| REST API | Spring Boot |
| Frontend | React + TypeScript (Vite) |
| Styling | Tailwind CSS |
| Graph visualisation | Pure SVG + React |
| Build | Maven (multi-module) |
| Tests | JUnit 5 + MockMvc |

---

## Features

### Landing Page
Overview of the project with an interactive SVG graph preview explaining the core concepts — players, synergy scores, and team splits.

### Graph Builder
Input player pairs and scores manually or generate random graphs. Shows a performance estimate for exhaustive search based on player count.

### Dashboard
Run a single algorithm with a chosen initial team. Includes loading state and cancel support via AbortController.

### Compare
Runs all three algorithms side by side. Highlights the **Most Accurate** (green badge) and **Fastest** (blue badge) results.

### Visualise
Step-by-step algorithm animation with an SVG graph. Nodes are coloured by team (blue vs red) and update as the algorithm progresses. Playback controls: play/pause, step forward/backward, reset, and skip to end. Includes a step history table.

---

## Core Data Structures

```
Map<Integer, PastPlayDeets>       — player graph (TreeMap, sorted by ID)
  └── Map<Integer, Double>        — adjacency list per player (TreeMap)

Team extends TreeSet<Integer>     — auto-sorted player ID set
```

The graph is stored bidirectionally: each edge `(p1, p2, score)` is inserted from both players' perspectives so score lookups work in O(log n) from either side.

---

## Input Format

```
<player_id> <player_id> <score>
0 1 2.0
0 2 1.0
1 2 3.0
```

One pairing per line. Player IDs are zero-indexed integers. Scores are real-valued.

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+

### Run the full stack

```bash
# Backend
cd matchmaking-api
mvn spring-boot:run

# Frontend (separate terminal)
cd matchmaking-ui
npm install
npm run dev
```

### Run the tests

```bash
# Algorithm unit tests
cd matchmaking-algorithms
mvn test

# API integration tests
cd matchmaking-api
mvn test
```

---

## Project Structure

```
Matchmaking-Algorithm-Project/
├── matchmaking-algorithms/        # Java core — graph model + all algorithms
│   └── src/main/java/com/matchmaking/algorithms/
│       ├── DataRow.java           # Input row: (p1, p2, score)
│       ├── PastPlayDeets.java     # Per-player adjacency list + history
│       ├── Team.java              # Team as a sorted set of player IDs
│       └── TeamChoose.java        # All algorithm logic (includes WithSteps variants)
├── matchmaking-api/               # Spring Boot REST API
│   └── src/main/java/com/matchmaking/api/
│       ├── controller/            # GraphController, MatchmakingController
│       ├── service/               # MatchmakingService
│       └── dto/                   # EdgeDto, GraphInputDto, StepDto, etc.
└── matchmaking-ui/                # React + TypeScript frontend
    └── src/
        ├── api/                   # API client with AbortSignal support
        ├── pages/                 # Landing, GraphBuilder, Dashboard, Compare, Visualise
        └── App.tsx                # Router + nav bar
```
