import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  root(): string {
    return this.appService.root();
  }
}
