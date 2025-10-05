export interface JwtServicePort {
  sign(payload: { sub: number; role: string }): string;
  verify(token: string): any;
}
