import { Controller } from '@nestjs/common';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}
}
