import { Link } from "react-router-dom";
import { useGraph } from "../context/GraphContext";

export default function GraphStatus() {
  const { graphLoaded, allPlayers, apiEdges } = useGraph();

  if (graphLoaded === null) return null;

  if (!graphLoaded) {
    return (
      <div className="theme-panel-subtle rounded-lg px-4 py-3 text-sm flex items-center gap-2">
        <span className="text-amber-400">&#9888;</span>
        <span className="theme-note">
          No graph loaded yet —{" "}
          <Link to="/graph-builder" className="text-sky-400 underline hover:text-sky-300">
            go to Graph Builder
          </Link>{" "}
          to create one.
        </span>
      </div>
    );
  }

  return (
    <div className="theme-panel-subtle rounded-lg px-4 py-3 text-sm flex items-center gap-2">
      <span className="text-green-400">&#10003;</span>
      <span className="theme-note">
        Graph loaded: {allPlayers.length} players, {apiEdges.length} edges
      </span>
    </div>
  );
}
