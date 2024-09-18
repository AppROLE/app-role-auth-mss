export function getRequesterUser(event: Record<string, any>) {
  return event.requestContext.authorizer.claims
}