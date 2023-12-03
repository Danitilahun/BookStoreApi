import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CustomPassword } from '../../validator/custom-password.validator';
import { MatchPasswords } from '../../validator/match-passwords.validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @CustomPassword()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MatchPasswords('password', { message: 'Passwords must match' })
  readonly confirmPassword: string;
}
