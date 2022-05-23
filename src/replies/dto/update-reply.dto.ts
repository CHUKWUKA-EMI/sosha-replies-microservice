import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateReplyDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  reply: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
