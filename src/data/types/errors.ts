export class ClientError extends Error {
  code?: string;
  constraint?: string;

  constructor(message: string, code?: string, constraint?: string) {
    super(message);
    this.name = 'ClientError';
    this.code = code;
    this.constraint = constraint;
  }
}