import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Post } from "./post.entity";

@Entity('comments')
export class Comment{

	@ApiProperty({example: 1, description: 'Уникальный id', type: 'number'})
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({example: 'Классная статья!', description: 'Заголовок комментария', type: 'string', maxLength: 32, minLength: 3})
	@Column({type: 'varchar', length: 32})
	title: string;

	@ApiProperty({example: '...', description: 'Текст комментария', type: 'string', maxLength: 256, minLength: 12})
	@Column({type: 'varchar', length: 256})
	content: string;

	@ManyToOne(() => User, user => user.comments)
	author: User

	@ManyToOne(() => Post, post => post.comments, {
		onDelete: 'CASCADE'
	})
	post: Post;

	@CreateDateColumn()
	createdAt: Date;

}