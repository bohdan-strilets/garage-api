import { Injectable } from '@nestjs/common';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { PasswordService } from '../password.service';
import { PasswordContext } from '../types';

@ValidatorConstraint({ name: 'PasswordPolicy', async: false })
@Injectable()
export class PasswordPolicyConstraint implements ValidatorConstraintInterface {
  constructor(private readonly passwordService: PasswordService) {}

  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const [contextField] = args.constraints;

    const context: PasswordContext = {};

    if (contextField) {
      const obj = args.object;
      const ctxValue = obj?.[contextField];

      if (typeof ctxValue === 'string') {
        context.email = ctxValue;
      }
    }

    const result = this.passwordService.validate(value, context);

    return result.isValid;
  }

  defaultMessage(args: ValidationArguments): string {
    const [contextField] = args.constraints;

    if (contextField) {
      return `Password does not meet security requirements (checked against ${contextField}).`;
    }

    return 'Password does not meet security requirements.';
  }
}

export const PasswordPolicy = (contextField?: string, validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'PasswordPolicy',
      target: object.constructor,
      propertyName,
      constraints: [contextField],
      options: validationOptions,
      validator: PasswordPolicyConstraint,
    });
  };
};
