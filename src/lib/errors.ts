export class NotAdminError extends Error {
  constructor(message = "Not signed in as an admin.") {
    super(message);
    this.name = "NotAdminError";
  }
}
