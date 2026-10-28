/** A display name. Email addresses are not names. */
export function usablePersonName(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed.includes("@")) return "";
  return trimmed;
}

export function splitPersonName(full: string | null | undefined): { firstName: string; lastName: string } {
  const name = usablePersonName(full);
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

export function formatPersonName(profile: {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}): string {
  const first = usablePersonName(profile.firstName);
  const last = usablePersonName(profile.lastName);
  if (first) return last ? `${first} ${last}` : first;
  return usablePersonName(profile.displayName) || "You";
}
