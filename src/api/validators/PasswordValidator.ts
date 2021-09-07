import { Service } from 'typedi';
import Password from '../password/Password';
import RuleObject from '../types/RuleObject';

const PasswordRules = require('../config/PasswordRules.json');

@Service()
class PasswordValidator {
  constructor() {}

  validate(password: Password) {
    const PASSWORD_RULES: RuleObject = PasswordRules.initialRuleset;

    Object.entries(PASSWORD_RULES).forEach(([rule, errorMessage]) => {
      const regexRule = new RegExp(rule);
      if (!regexRule.test(password.getValue())) {
        password.addErrorMessage(errorMessage);
      }
    });
  }
}

export default PasswordValidator;
