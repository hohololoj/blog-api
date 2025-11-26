import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Comment } from "./comment.entity";
import { Category } from "./category.entity";

@Entity('posts')
export class Post{
	
	@ApiProperty({example: 1, description: 'Уникальный id поста', type: 'number'})
	@PrimaryGeneratedColumn()
	id: number;
	
	@ApiProperty({example: 'Вышло новое обновление API', description: 'Заголовок поста', type: 'string', maxLength: 48})
	@Column({type: 'varchar', length: 48})
	title: string;

	@ManyToOne(() => Category, category => category.posts, {
		onDelete: 'CASCADE'
	})
	category: Category;

	@ApiProperty({example: 'Новое обновление API затронуло систему валидации', description: 'Краткое описание поста', type: 'string', maxLength: 96})
	@Column({type: 'varchar', length: 96})
	description: string;

	@ApiProperty({example: '...', description: 'Содержание поста', type: 'string', maxLength: 512})
	@Column({type: 'varchar', length: 512})
	content: string;

	@Column({type: 'varchar', length: 128, nullable: true})
	poster: string;

	@ManyToOne(() => User, user => user.posts, {onDelete: 'CASCADE'})
	author: User;
	
	@OneToMany(() => Comment, comment => comment.post)
	comments: Comment[]

	@ApiProperty({example: '2023-01-01T00:00:00.000', description: 'Дата создания поста', type: 'string'})
	@CreateDateColumn()
	createdAt: Date;
	
	@ApiProperty({example: '2023-01-01T00:00:00.000', description: 'Дата обновления поста', type: 'string'})
	@UpdateDateColumn()
	updatedAt: Date;
	
}