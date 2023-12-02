import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchPasswords', async: false })
export class MatchPasswordsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `The ${args.property} must match the ${relatedPropertyName}.`;
  }
}

export function MatchPasswords(
  property: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchPasswordsValidator,
    });
  };
}
