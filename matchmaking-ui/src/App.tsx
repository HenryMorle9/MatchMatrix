import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { GraphProvider } from "./context/GraphContext";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import GraphBuilder from "./pages/GraphBuilder";
import Landing from "./pages/Landing";
import Visualise from "./pages/Visualise";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/graph-builder", label: "Graph Builder", end: undefined },
  { to: "/dashboard", label: "Dashboard", end: undefined },
  { to: "/compare", label: "Compare", end: undefined },
  { to: "/visualise", label: "Visualise", end: undefined },
] as const;

function AppFrame() {
  return (
    <div className="broadcast-theme">
      <nav className="theme-nav">
        <div className="theme-nav-inner max-w-7xl mx-auto px-4 flex gap-5 h-14 items-center">
          <NavLink to="/" end className="theme-brand mr-2">
            Match<span className="theme-brand-accent">/</span>Matrix
          </NavLink>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? "theme-nav-link theme-nav-link--active"
                  : "theme-nav-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto theme-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/graph-builder" element={<GraphBuilder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/visualise" element={<Visualise />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GraphProvider>
        <AppFrame />
      </GraphProvider>
    </BrowserRouter>
  );
}

export default App;
