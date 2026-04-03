export function parseTeamInput(input: string): number[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number);
}
