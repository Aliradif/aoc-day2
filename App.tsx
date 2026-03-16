const { useState } = React;

type Report = number[];
type Result = { levels: Report; safe: boolean };

const isSafe = (levels: Report): boolean => {
  const diffs = levels.slice(1).map((n, i) => n - levels[i]);
  return (
    diffs.every((d) => d >= 1 && d <= 3) ||
    diffs.every((d) => d >= -3 && d <= -1)
  );
};

const isSafeWithDampener = (levels: Report): boolean => {
  if (isSafe(levels)) return true;
  return levels.some((_, i) => {
    const copy = [...levels];
    copy.splice(i, 1);
    return isSafe(copy);
  });
};

const parseInput = (raw: string): Report[] =>
  raw
    .trim()
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.trim().split(/\s+/).map(Number));

const EXAMPLE = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

function App() {
  const [input, setInput] = useState<string>(EXAMPLE);
  const [results, setResults] = useState<Result[] | null>(null);
  const [mode, setMode] = useState<string>("");

  const solve = (useDampener: boolean) => {
    const reports = parseInput(input);
    const check = useDampener ? isSafeWithDampener : isSafe;
    setResults(reports.map((r) => ({ levels: r, safe: check(r) })));
    setMode(useDampener ? "Part 2 — Problem Dampener" : "Part 1 — Strict");
  };

  const safeCount = results?.filter((r) => r.safe).length ?? 0;
  const unsafeCount = (results?.length ?? 0) - safeCount;

  return (
    <div className="container">
      <h1>AoC 2024 — Day 2</h1>
      <p className="subtitle">Red-Nosed Reports — paste your puzzle input below</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste puzzle input here..."
      />

      <div className="buttons">
        <button className="btn-primary" onClick={() => solve(false)}>
          Part 1 — Strict
        </button>
        <button className="btn-secondary" onClick={() => solve(true)}>
          Part 2 — Dampener
        </button>
      </div>

      {results && (
        <>
          <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>
            {mode} — {results.length} reports analyzed
          </p>

          <div className="stats">
            <div className="stat-card">
              <div className="number safe-num">{safeCount}</div>
              <div className="label">Safe reports</div>
            </div>
            <div className="stat-card">
              <div className="number unsafe-num">{unsafeCount}</div>
              <div className="label">Unsafe reports</div>
            </div>
          </div>

          <div className="report-list">
            {results.map((r, i) => (
              <div className="report-row" key={i}>
                <span>{r.levels.join(" ")}</span>
                <span className={`badge ${r.safe ? "badge-safe" : "badge-unsafe"}`}>
                  {r.safe ? "safe" : "unsafe"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
