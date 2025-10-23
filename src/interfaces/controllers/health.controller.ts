import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    return { status: 'ok', message: 'Backend Starwars is healthy' };
  }
}
