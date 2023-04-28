export class ApplicationError extends Error {
  // deno-lint-ignore no-explicit-any
  constructor(message: string, public data: Record<string, any> = {}) {
    super(message)
  }
}

export class UserError extends ApplicationError {}

export function createErrorHandler(err: Error) {
  if (err instanceof UserError) {
    return createError(err.message)
  }
  else if (err instanceof ApplicationError) {
    return createError(err.message)
  }
  else {
    // Print out unexpected errors as is to help with debugging
    console.error(err)
  }

  return createError(err.message || err || 'There was an error processing your request')
}
