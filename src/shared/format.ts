export function formatTime(value: number) {
  return Math.max(0, Math.ceil(value)).toString().padStart(2, '0');
}
