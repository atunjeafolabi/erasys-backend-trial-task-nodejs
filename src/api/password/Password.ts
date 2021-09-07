class Password {
  private value: string;
  private errors: string[] = [];

  constructor(value: string) {
    this.value = value;
  }

  isValid() {
    return !this.hasErrors();
  }

  getValue() {
    return this.value;
  }

  addErrorMessage(error: string) {
    this.errors.push(error);
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  getErrors() {
    return this.errors;
  }
}

export default Password;
