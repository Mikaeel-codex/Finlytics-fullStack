// src/lib/utils.ts
type ClassInput =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassInput[]) {
  const parts: string[] = [];
  for (const i of inputs) {
    if (!i) continue;
    if (typeof i === 'string') {
      parts.push(i);
    } else {
      for (const [k, v] of Object.entries(i)) {
        if (v) parts.push(k);
      }
    }
  }
  return parts.join(' ');
}
