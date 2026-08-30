export type TimelineScale = "linear" | "relative";

export const TIME_CONSTANT = 5;
export const MAX_AGE = 100;

const LINEAR_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;
const RELATIVE_TICKS = [0, 3, 6, 10, 15, 20, 30, 40, 50, 65, 80, 100] as const;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundTick(value: number, span: number): number {
  if (span <= 1) return Number(value.toFixed(2));
  if (span <= 4) return Number(value.toFixed(1));
  return Math.round(value);
}

export function ageToPosition(age: number, scale: TimelineScale): number {
  const safeAge = clamp(Number.isFinite(age) ? age : 0, 0, MAX_AGE);
  if (scale === "linear") return safeAge / MAX_AGE;

  return (
    Math.log((safeAge + TIME_CONSTANT) / TIME_CONSTANT) /
    Math.log((MAX_AGE + TIME_CONSTANT) / TIME_CONSTANT)
  );
}

export function positionToAge(position: number, scale: TimelineScale): number {
  const safePosition = clamp(Number.isFinite(position) ? position : 0, 0, 1);
  if (scale === "linear") return safePosition * MAX_AGE;

  const denominator = Math.log((MAX_AGE + TIME_CONSTANT) / TIME_CONSTANT);
  return clamp(
    TIME_CONSTANT * (Math.exp(safePosition * denominator) - 1),
    0,
    MAX_AGE,
  );
}

export function ageToRangePosition(
  age: number,
  startAge: number,
  endAge: number,
  scale: TimelineScale,
): number {
  const safeStart = clamp(startAge, 0, MAX_AGE);
  const safeEnd = clamp(Math.max(endAge, safeStart + 0.001), 0, MAX_AGE);
  const startPosition = ageToPosition(safeStart, scale);
  const endPosition = ageToPosition(safeEnd, scale);
  const agePosition = ageToPosition(clamp(age, safeStart, safeEnd), scale);
  return clamp((agePosition - startPosition) / Math.max(0.000001, endPosition - startPosition), 0, 1);
}

export function getAgeTicks(
  scale: TimelineScale,
  startAge = 0,
  endAge = MAX_AGE,
): number[] {
  const start = clamp(startAge, 0, MAX_AGE);
  const end = clamp(Math.max(endAge, start), 0, MAX_AGE);

  if (start === 0 && end === MAX_AGE) {
    return [...(scale === "linear" ? LINEAR_TICKS : RELATIVE_TICKS)];
  }

  const span = Math.max(0.001, end - start);
  const divisions = span <= 1 ? 4 : span <= 4 ? 5 : 6;
  const startPosition = ageToPosition(start, scale);
  const endPosition = ageToPosition(end, scale);
  const ticks = Array.from({ length: divisions + 1 }, (_, index) => {
    const position = startPosition + ((endPosition - startPosition) * index) / divisions;
    return roundTick(positionToAge(position, scale), span);
  });

  ticks[0] = start;
  ticks[ticks.length - 1] = end;
  return [...new Set(ticks)];
}

export function getRelativeYearWeight(age: number): number | null {
  if (!Number.isFinite(age) || age < 1) return null;
  return 100 / age;
}
