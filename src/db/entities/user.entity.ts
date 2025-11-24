import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity('users')
export class User{

	@ApiProperty({example: 1, description: 'Уникальный id', type: 'number'})
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({example: 'ivan.ivanov@yandex.ru', description: 'email пользователя'})
	@Column({type: 'varchar', length: 320, unique: true})
	email: string;

	@ApiProperty({example: 'ivan', description: 'Логин пользователя'})
	@Column({type: 'varchar', length: 32, unique: true})
	username: string;

	@ApiProperty({example: 'ivan32', description: 'Пароль пользователя'})
	@Column({type: 'varchar', length: 255})
	password: string;

	@ApiProperty({example: '2023-01-01T00:00:00.000', description: 'Дата создания'})
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty({example: '2023-01-01T00:00:00.000', description: 'Дата обновления'})
	@UpdateDateColumn()
	updatedAt: Date;

	@ApiProperty({example: 'true', description: 'Активный ли пользователь'})
	@Column({type: 'bool', default: true})
	isActive: boolean;

	@ApiProperty({example: '0x345f31112415125124', description: 'Соль для хеша пароля конкретного пользователя'})
	@Column({type: 'varchar', length: 64})
	hashSalt: string

	@OneToMany(() => Post, post => post.author)
	posts: Post[]

	@OneToMany(() => Comment, comment => comment.author)
	comments: Comment[]
}