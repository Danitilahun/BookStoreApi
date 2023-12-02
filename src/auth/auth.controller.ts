import { Controller, Post, Body, Get } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const token = await this.authService.signUp(signUpDto);
      return token;
    } catch (error) {
      // Handle specific error here or rethrow it
      throw new Error('Signup failed: ' + error.message);
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const token = await this.authService.login(loginDto);
      return token;
    } catch (error) {
      // Handle specific error here or rethrow it
      throw new Error('Login failed: ' + error.message);
    }
  }
}
