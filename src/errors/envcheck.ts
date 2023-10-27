export const NODE_ENV = requireEnvVar("NODE_ENV", process.env.NODE_ENV) as 
  | "development"
  | "test"
  | "staging"
  | "production";

export function requireEnvVar(name: string, val: string | undefined): string {
    if (val === undefined || val == null) {
        throw new Error(NODE_ENV === 'development' ? `Missing env variable: ${name}` : 'Service unavailable.');
    }
    return val
}
