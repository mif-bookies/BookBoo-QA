export class CustomError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = "CustomError";
  }
}
