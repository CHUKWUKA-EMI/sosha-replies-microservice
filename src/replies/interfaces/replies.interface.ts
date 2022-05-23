/* eslint-disable prettier/prettier */

import { Reply } from '../entities/reply.entity';

export interface Replies {
  data: Reply[];
  currentPage: number;
  size: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationPayload {
  commentId: string;
  page?: number;
  limit?: number;
}
