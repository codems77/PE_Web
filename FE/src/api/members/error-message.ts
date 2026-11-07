import { HTTPError } from "ky";

export function memberErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HTTPError) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
      return data.message;
    }
    return fallback;
  }
  if (error instanceof Error && error.name === "Error") return error.message;
  return fallback;
}
