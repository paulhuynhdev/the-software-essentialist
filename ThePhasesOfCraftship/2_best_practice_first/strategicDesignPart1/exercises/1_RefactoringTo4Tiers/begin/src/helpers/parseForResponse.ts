export function parseForResponse(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}
