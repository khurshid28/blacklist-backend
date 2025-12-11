import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PhoneService } from './phone.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Controller('phones')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  create(@Body() createPhoneDto: CreatePhoneDto) {
    return this.phoneService.create(createPhoneDto);
  }

  @Get()
  findAll() {
    return this.phoneService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.phoneService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.phoneService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    return this.phoneService.update(id, updatePhoneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.phoneService.remove(id);
  }
}
