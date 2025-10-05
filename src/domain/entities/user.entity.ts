export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public role: 'admin' | 'user',
  ) {}

  toSafeUser() {
    const { password, ...safe } = this;
    return safe;
  }
}
