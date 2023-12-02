import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPassword', async: false })
export class CustomPasswordValidator implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return (
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar &&
      password.length >= 6
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
}

export function CustomPassword(
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomPasswordValidator,
    });
  };
}
