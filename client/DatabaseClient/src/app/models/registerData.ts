export class RegisterData {
  loginValue: string;
  email: string;
  passwordValue: string;
  giftcardNumber: string;

  constructor() {
    this.loginValue = '';
    this.passwordValue = '';
    this.giftcardNumber = '';
    this.email = '';
  }

  isEmpty(): boolean {
    return this.loginValue == '' || this.loginValue.includes(" ") ||
      this.passwordValue == '' || this.passwordValue.includes(" ") ||
      this.giftcardNumber == '' || this.giftcardNumber.includes(" ") ||
      this.email == '' || this.email.includes(" ");
  }

  validateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
    {
      return (true)
    }
    return (false)
  }
}
