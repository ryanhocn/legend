import { describe, expect, test } from "vitest";
import {
  GRADES,
  gradeAuthorRole,
  gradeCredential,
  gradeLabel,
  gradeRank,
  isOverreach,
} from "./grades";

describe("grade order", () => {
  test("fy < st3 < consultant", () => {
    expect(gradeRank("fy")).toBeLessThan(gradeRank("st3"));
    expect(gradeRank("st3")).toBeLessThan(gradeRank("consultant"));
    expect(GRADES.map((g) => g.key)).toEqual(["fy", "st3", "consultant"]);
  });
});

describe("gradeLabel", () => {
  test("UK-first with US equivalent", () => {
    expect(gradeLabel("fy")).toBe("FY1-2 (PGY1-2 · ST1-2)");
    expect(gradeLabel("st3")).toBe("ST3+ (PGY3+)");
    expect(gradeLabel("consultant")).toBe("Consultant (Attending)");
  });
});

describe("isOverreach", () => {
  test("signing above your grade is overreach", () => {
    expect(isOverreach("fy", "st3")).toBe(true);
    expect(isOverreach("fy", "consultant")).toBe(true);
    expect(isOverreach("st3", "consultant")).toBe(true);
  });

  test("at or below your grade is fine", () => {
    expect(isOverreach("fy", "fy")).toBe(false);
    expect(isOverreach("st3", "fy")).toBe(false);
    expect(isOverreach("st3", "st3")).toBe(false);
    expect(isOverreach("consultant", "st3")).toBe(false);
    expect(isOverreach("consultant", "consultant")).toBe(false);
  });
});

describe("authorship by grade", () => {
  test("all doctors are MD", () => {
    expect(gradeCredential("fy")).toBe("MD");
    expect(gradeCredential("consultant")).toBe("MD");
  });

  test("author role follows grade", () => {
    expect(gradeAuthorRole("fy")).toBe("*PHYSICIAN: RESIDENT");
    expect(gradeAuthorRole("st3")).toBe("*PHYSICIAN: REGISTRAR");
    expect(gradeAuthorRole("consultant")).toBe("*PHYSICIAN: FACULTY");
  });
});
