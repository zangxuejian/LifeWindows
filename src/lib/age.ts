export const MIN_AGE = 0;
export const MAX_AGE = 100;

export function clampAge(value: number): number {
  if (!Number.isFinite(value)) return 30;
  return Math.min(MAX_AGE, Math.max(MIN_AGE, Math.round(value)));
}

export function ageToPercent(age: number): number {
  return (clampAge(age) / MAX_AGE) * 100;
}

export function getAgeFromBirthDate(birthDate: string, now = new Date()): number | null {
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > now) return null;

  let age = now.getFullYear() - birth.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (now < birthdayThisYear) age -= 1;
  return clampAge(age);
}
