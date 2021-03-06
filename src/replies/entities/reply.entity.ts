import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'replies' })
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  reply: string;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userFirstName: string;

  @Column({ nullable: false })
  userLastName: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  userImageUrl?: string;

  @Index()
  @Column({ nullable: false })
  commentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
