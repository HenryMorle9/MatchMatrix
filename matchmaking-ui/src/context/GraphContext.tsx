import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Edge } from "../types/matchmaking";
import type { ReactNode } from "react";

function deriveAllPlayers(edges: Edge[]): number[] {
  const players = new Set<number>();
  edges.forEach((e) => {
    players.add(e.p1);
    players.add(e.p2);
  });
  return [...players].sort((a, b) => a - b);
}

interface GraphState {
  /** Edges for the Graph Builder (local, pre-load). */
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  status: string;
  setStatus: (status: string) => void;

  /** Cached API graph data (post-load). */
  apiEdges: Edge[];
  allPlayers: number[];
  graphLoaded: boolean | null;
  refreshGraph: () => Promise<void>;
}

const GraphContext = createContext<GraphState | null>(null);

export function GraphProvider({ children }: { children: ReactNode }) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [status, setStatus] = useState("");

  const [apiEdges, setApiEdges] = useState<Edge[]>([]);
  const [allPlayers, setAllPlayers] = useState<number[]>([]);
  const [graphLoaded, setGraphLoaded] = useState<boolean | null>(null);

  const refreshGraph = useCallback(async () => {
    try {
      const res = await fetch("/api/graph");
      if (!res.ok) {
        setGraphLoaded(false);
        return;
      }
      const data = await res.json();
      if (data?.edges && data.edges.length > 0) {
        setApiEdges(data.edges);
        setAllPlayers(deriveAllPlayers(data.edges));
        setGraphLoaded(true);
      } else {
        setGraphLoaded(false);
      }
    } catch {
      setGraphLoaded(false);
    }
  }, []);

  useEffect(() => {
    refreshGraph();
  }, [refreshGraph]);

  return (
    <GraphContext.Provider
      value={{
        edges, setEdges, status, setStatus,
        apiEdges, allPlayers, graphLoaded, refreshGraph,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error("useGraph must be used within GraphProvider");
  return ctx;
}
