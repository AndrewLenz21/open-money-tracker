import type { SupportedDateFormat } from "@core/types";
import type { DateParseResult } from "../domain";

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isValidDate(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12) return false;
  if (d < 1) return false;
  if (d > DAYS_IN_MONTH[m - 1]) return false;
  if (m === 2 && d === 29) {
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    if (!leap) return false;
  }
  return true;
}

export function parseRevolutDate(
  value: string,
  format: SupportedDateFormat
): DateParseResult {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: false, error: "Empty date value" };
  }

  const trimmed = value.trim();
  const spaceIdx = trimmed.lastIndexOf(" ");
  const datePart = spaceIdx > 0 ? trimmed.substring(0, spaceIdx) : trimmed;
  const timePart = spaceIdx > 0 ? trimmed.substring(spaceIdx + 1) : null;

  const baseFormat = format.includes("DD/MM/YYYY")
    ? "DD/MM/YYYY"
    : format.includes("MM/DD/YYYY")
      ? "MM/DD/YYYY"
      : "YYYY-MM-DD";
  const expectsTime = format.includes("HH:mm:ss");

  let year: number, month: number, day: number;

  switch (baseFormat) {
    case "DD/MM/YYYY": {
      const m = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return { ok: false, error: `Date "${value}" does not match DD/MM/YYYY format` };
      day = parseInt(m[1], 10);
      month = parseInt(m[2], 10);
      year = parseInt(m[3], 10);
      break;
    }
    case "MM/DD/YYYY": {
      const m = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return { ok: false, error: `Date "${value}" does not match MM/DD/YYYY format` };
      month = parseInt(m[1], 10);
      day = parseInt(m[2], 10);
      year = parseInt(m[3], 10);
      break;
    }
    case "YYYY-MM-DD": {
      const m = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!m) return { ok: false, error: `Date "${value}" does not match YYYY-MM-DD format` };
      year = parseInt(m[1], 10);
      month = parseInt(m[2], 10);
      day = parseInt(m[3], 10);
      break;
    }
    default:
      return { ok: false, error: `Unsupported date format: ${format}` };
  }

  if (!isValidDate(year, month, day)) {
    return { ok: false, error: `Invalid calendar date: ${datePart}` };
  }

  if (expectsTime && !timePart) {
    return { ok: false, error: `Date "${value}" does not match ${format} format` };
  }

  if (!expectsTime && timePart) {
    return { ok: false, error: `Date "${value}" does not match ${format} format` };
  }

  const timeMatch = timePart ? timePart.match(/^(\d{1,2}):(\d{2}):(\d{2})$/) : null;
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
  const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
  const seconds = timeMatch ? parseInt(timeMatch[3], 10) : 0;

  if (expectsTime && !timeMatch) {
    return { ok: false, error: `Date "${value}" does not match ${format} format` };
  }

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return { ok: false, error: `Invalid time: ${timePart}` };
  }

  const date = new Date(year, month - 1, day, hours, minutes, seconds, 0);

  return { ok: true, date };
}
