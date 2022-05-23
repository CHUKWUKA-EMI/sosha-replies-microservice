import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { PaginationPayload } from './interfaces/replies.interface';
import { AllRPCExceptionsFilter } from 'all-rpc-exception-filters';

interface deleteReplyPayload {
  id: string;
  userId: string;
}

@Controller()
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'replies', cmd: 'create' })
  create(@Payload() createReplyDto: CreateReplyDto) {
    return this.repliesService.create(createReplyDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'replies', cmd: 'findAll' })
  findAll(@Payload() payload: PaginationPayload) {
    return this.repliesService.findAll(payload);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'replies', cmd: 'findOne' })
  findOne(@Payload() id: string) {
    return this.repliesService.findOne(id);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'replies', cmd: 'update' })
  update(@Payload() updateReplyDto: UpdateReplyDto) {
    return this.repliesService.update(updateReplyDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'relpies', cmd: 'delete' })
  remove(@Payload() payload: deleteReplyPayload) {
    return this.repliesService.remove(payload.id, payload.userId);
  }
}
