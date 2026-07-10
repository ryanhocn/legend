import { describe, expect, test } from "vitest";
import { caseNow, formatDate, formatNoteStamp, formatTime } from "./simTime";

// 16/06/2026 17:00:00 UTC — the cholangitis001 anchor used across the plan.
const anchor = Date.UTC(2026, 5, 16, 17, 0) / 1000;

describe("formatDate", () => {
  test("formats DD/MM/YYYY in UTC with zero padding", () => {
    expect(formatDate(anchor)).toBe("16/06/2026");
    expect(formatDate(Date.UTC(2026, 0, 3, 0, 0) / 1000)).toBe("03/01/2026");
  });
});

describe("formatTime", () => {
  test("formats HH:MM in UTC", () => {
    expect(formatTime(anchor)).toBe("17:00");
    expect(formatTime(Date.UTC(2026, 5, 16, 9, 5) / 1000)).toBe("09:05");
  });
});

describe("formatNoteStamp", () => {
  test("formats DD/MM/YY HHMM in UTC", () => {
    expect(formatNoteStamp(anchor)).toBe("16/06/26 1700");
    expect(formatNoteStamp(Date.UTC(2026, 6, 4, 9, 5) / 1000)).toBe("04/07/26 0905");
  });
});

describe("caseNow", () => {
  test("returns the anchor when present", () => {
    expect(caseNow(anchor)).toBe(anchor);
  });
  test("falls back to the real clock when anchor is undefined", () => {
    const before = Math.floor(Date.now() / 1000);
    const now = caseNow(undefined);
    expect(now).toBeGreaterThanOrEqual(before);
  });
});
