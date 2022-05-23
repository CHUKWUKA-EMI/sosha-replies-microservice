import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { lastValueFrom, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { PaginationPayload, Replies } from './interfaces/replies.interface';

const logger = new Logger('RepliesService');

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepo: Repository<Reply>,
    private httpService: HttpService,
  ) {}
  async create(createReplyDto: CreateReplyDto): Promise<Reply> {
    try {
      const reply = this.replyRepo.create(createReplyDto);
      const savedReply = await this.replyRepo.save(reply);
      //increment comment's replies
      lastValueFrom(this.incrementCommentReplies(createReplyDto.commentId));

      return savedReply;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException('Internal server error');
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    commentId,
  }: PaginationPayload): Promise<Replies> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder = this.replyRepo.createQueryBuilder('replies');
      const replies = await queryBuilder
        .where('replies.commentId = :commentId', { commentId })
        .take(limit)
        .skip(offset)
        .orderBy('replies.createdAt', 'DESC')
        .cache({ enabled: true })
        .getMany();

      //pagination metadata
      const totalReplies = await queryBuilder
        .where('replies.commentId = :commentId', { commentId })
        .getCount();

      const totalPages = Math.ceil(totalReplies / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      //return comment's replies
      const resData: Replies = {
        data: replies.length > 0 ? replies : [],
        currentPage: page,
        hasNext,
        hasPrevious,
        size: replies.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findOne(id: string): Promise<Reply> {
    try {
      const reply = await this.replyRepo.findOne(id);
      if (!reply) {
        throw new RpcException('Reply not found');
      }

      return reply;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async update(updateReplyDto: UpdateReplyDto): Promise<Reply> {
    try {
      const queryBuilder = this.replyRepo.createQueryBuilder();
      const updatedReply = await queryBuilder
        .update(Reply, { reply: updateReplyDto.reply })
        .where('id = :id', { id: updateReplyDto.id })
        .andWhere('userId=:userId', { userId: updateReplyDto.userId })
        .returning('*')
        .execute();

      return updatedReply.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async remove(id: string, userId: string): Promise<Reply> {
    try {
      const deletedReply = await this.replyRepo
        .createQueryBuilder()
        .delete()
        .from(Reply)
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .returning('*')
        .execute();

      lastValueFrom(
        this.decrementCommentReplies(deletedReply.raw[0].commentId),
      );

      return deletedReply.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  private incrementCommentReplies(
    commentId: string,
  ): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.patch(
      `${process.env.COMMENTS_URL}/comments/repliesCount/${commentId}`,
    );
    return res$;
  }

  private decrementCommentReplies(
    commentId: string,
  ): Observable<AxiosResponse<void>> {
    const res$ = this.httpService.delete(
      `${process.env.COMMENTS_URL}/comments/repliesCount/${commentId}`,
    );
    return res$;
  }
}
