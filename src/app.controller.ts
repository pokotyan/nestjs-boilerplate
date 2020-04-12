import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import config from './config';

@ApiTags('ヘルスチェック')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Header('X-Rem-Api-Revision', config.remApiRevision)
  @Get('status')
  getStatus(): string {
    return this.appService.getStatus();
  }
}
