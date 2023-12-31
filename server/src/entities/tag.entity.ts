import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Problem from './problem.entity';

@Entity()
export default class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // TODO?: enum으로 바꾸기
  @Column({ comment: '문제 태그의 한글 이름' })
  name?: string;

  // 이 태그가 붙은 문제들
  @ManyToMany(() => Problem, (problem) => problem.tags)
  problems?: Problem[];
}
