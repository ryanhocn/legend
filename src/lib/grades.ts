import type { Grade } from "../types";

/** Seniority tiers in rank order, UK-first with US equivalents. */
export const GRADES: { key: Grade; label: string; usLabel: string }[] = [
  { key: "fy", label: "FY1-2", usLabel: "PGY1-2 · ST1-2" },
  { key: "st3", label: "ST3+", usLabel: "PGY3+" },
  { key: "consultant", label: "Consultant", usLabel: "Attending" },
];

export function gradeRank(grade: Grade): number {
  return GRADES.findIndex((entry) => entry.key === grade);
}

export function gradeLabel(grade: Grade): string {
  const entry = GRADES.find((e) => e.key === grade);
  return entry ? `${entry.label} (${entry.usLabel})` : grade;
}

/** Signing a case above your own grade. */
export function isOverreach(userGrade: Grade, minGrade: Grade): boolean {
  return gradeRank(userGrade) < gradeRank(minGrade);
}

/** All current tiers are doctors; a function so future professions slot in. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function gradeCredential(_grade: Grade): string {
  return "MD";
}

export function gradeAuthorRole(grade: Grade): string {
  switch (grade) {
    case "fy":
      return "*PHYSICIAN: RESIDENT";
    case "st3":
      return "*PHYSICIAN: REGISTRAR";
    case "consultant":
      return "*PHYSICIAN: FACULTY";
  }
}
