export function formatMeetingCode(code: string): string {
  return `${code.slice(0, 3)} ${code.slice(3, 7)} ${code.slice(7)}`;
}

export function extractMeetingCode(input: string): string | null {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    return url.searchParams.get("meetingId");
  } catch {
    const digits = trimmed.replace(/[\s-]/g, "");
    return /^\d{9,11}$/.test(digits) ? digits : null;
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
