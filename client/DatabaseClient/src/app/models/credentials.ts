export class Credentials {
  loginValue: string;
  passwordValue: string;

  constructor() {
    this.loginValue = '';
    this.passwordValue = '';
  }

  isEmpty(): boolean {
    return this.loginValue === '' || this.loginValue.includes(" ") ||
      this.passwordValue === '' || this.passwordValue.includes(" ");
  }
}
