import { NotAdminError } from "@/lib/errors";

/**
 * Standard return shape for every mutating/reading function in
 * `lib/controllers/`. Callers should always check `ok` before touching
 * `data` rather than relying on a thrown exception.
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(error: string): ActionResult<T> {
  return { ok: false, error };
}

/**
 * Wraps a controller function so every possible failure (a thrown
 * NotAdminError, a Postgres/PostgREST error object, or an unexpected
 * exception) comes back as a typed `ActionResult` instead of throwing.
 */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return ok(data);
  } catch (error) {
    if (error instanceof NotAdminError) {
      return fail(error.message);
    }
    if (error && typeof error === "object" && "message" in error) {
      return fail(String((error as { message: unknown }).message));
    }
    return fail("Something went wrong. Please try again.");
  }
}
