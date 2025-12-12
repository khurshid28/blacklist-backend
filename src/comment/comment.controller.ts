import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('users/:userId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Param('userId') userId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(+userId, createCommentDto);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.commentService.findAll(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('content') content: string) {
    return this.commentService.update(+id, content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
