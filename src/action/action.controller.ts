import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('actions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async createAction(@Request() req, @Body() createDto: CreateActionDto) {
    const isSuperAdmin = req.user.role === 'SUPER';
    return this.actionService.createAction(req.user.id, createDto, isSuperAdmin);
  }

  @Get()
  async getActions(@Request() req) {
    const isSuperAdmin = req.user.role === 'SUPER';
    return this.actionService.getActions(req.user.id, isSuperAdmin);
  }

  @Get(':id')
  async getAction(@Request() req, @Param('id') id: string) {
    const isSuperAdmin = req.user.role === 'SUPER';
    return this.actionService.getAction(+id, req.user.id, isSuperAdmin);
  }
}
