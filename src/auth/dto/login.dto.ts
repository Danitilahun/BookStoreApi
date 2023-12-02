import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CustomPassword } from 'src/validator/custom-password.validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @CustomPassword()
  readonly password: string;
}
