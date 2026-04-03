# MatchMatrix

MatchMatrix is a full-stack portfolio project for exploring team-balancing algorithms in FPS-style matchmaking.

It started as a Java data structures and algorithms assignment, then grew into a Spring Boot API and React frontend that lets you generate a player graph, run multiple search strategies, compare outcomes, and replay how the algorithm reached its result.

## What It Does

- Builds a weighted player graph where each edge represents past synergy between two players
- Runs three matchmaking strategies against the same graph
- Compares score and runtime side by side
- Replays algorithm decisions step by step in a visualiser
- Turns the original assignment into a more complete, interactive full-stack project

## Core Idea

Players are modelled as nodes in a weighted undirected graph.

- Each player is a node
- Each edge stores how well two players have performed together in the past
- A split is scored by summing the synergy values that cross between the two teams

In other words, the system is trying to place strong past teammates on opposite sides to create a more competitive matchup.

## Algorithms

Three search strategies are available:

| Algorithm | Approach | Time Complexity | Notes |
|---|---|---:|---|
| `localSearchFirst` | Takes the first improving add/remove move it finds | `O(n²)` | Fast, but can stop at a local optimum |
| `localSearchBest` | Checks all one-step improvements and picks the best | `O(n²)` | Slower than first improvement, usually stronger |
| `guaranteedBestTeam` | Exhaustively searches all possible splits | `O(2^n)` | Always returns the optimal score |

## App Walkthrough

### 1. Graph Builder

Generate a random player graph and estimate how expensive exhaustive search will be before you run anything.

- Random graph generation
- Edge list preview
- Performance estimate panel
- One-click graph load into the backend

### 2. Dashboard

Run a single algorithm against the currently loaded graph.

- Optional starting team input
- Score and runtime output
- Both resulting teams shown clearly
- Cancel support for in-flight requests

### 3. Compare

Run all three algorithms on the same graph and inspect the trade-off between speed and quality.

- Side-by-side comparison
- Best score highlighting
- Fastest runtime highlighting

### 4. Visualise

Replay the search process to see how the algorithm moved from one state to the next.

- SVG-based graph visualisation
- Step history table
- Playback controls
- Special handling for exhaustive search

## Tech Stack

| Layer | Technology |
|---|---|
| Core algorithms | Java 17 |
| API | Spring Boot 3 |
| Frontend | React 19 + TypeScript |
| Build tooling | Maven + Vite |
| Styling | Tailwind CSS 4 |
| Visualisation | Pure SVG + React |
| Testing | JUnit 5 + MockMvc |

## Project Structure

```text
MatchMatrix/
├── pom.xml
├── matchmaking-algorithms/
│   └── src/main/java/com/matchmaking/algorithms/
│       ├── DataRow.java
│       ├── PastPlayDeets.java
│       ├── Team.java
│       └── TeamChoose.java
├── matchmaking-api/
│   └── src/main/java/com/matchmaking/api/
│       ├── controller/
│       ├── dto/
│       └── service/
└── matchmaking-ui/
    └── src/
        ├── api/
        ├── components/
        ├── context/
        ├── pages/
        ├── types/
        └── utils/
```

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/graph` | Get the currently loaded graph |
| `POST` | `/api/graph` | Load a graph into the backend |
| `POST` | `/api/matchmaking/run` | Run one algorithm |
| `POST` | `/api/matchmaking/compare` | Run all algorithms |
| `POST` | `/api/matchmaking/steps` | Get step-by-step algorithm output |

## Running Locally

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+

### Backend

```bash
cd matchmaking-api
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

### Frontend

```bash
cd matchmaking-ui
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

Vite is configured to proxy `/api` requests to the Spring Boot backend on port `8080`.

## Running Tests

### Algorithm module

```bash
cd matchmaking-algorithms
mvn test
```

### API module

```bash
cd matchmaking-api
mvn test
```

If you only want the service-layer tests:

```bash
cd matchmaking-api
mvn -Dtest=MatchmakingServiceTest test
```

## Why This Project Exists

This project is meant to show more than just a working algorithm.

It brings together:

- graph-based reasoning
- heuristic vs exhaustive search trade-offs
- backend API design
- frontend state management
- interactive algorithm visualisation

The result is a portfolio piece that is both technical and explorable.

## Current Status

Implemented today:

- Graph Builder
- Dashboard
- Compare view
- Step-by-step Visualiser
- Spring Boot REST API
- Backend unit and integration tests

Next likely area of expansion:

- deeper performance benchmarking
- richer graph input workflows
- more polished landing-page storytelling
