import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User{

	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'varchar', length: 320, unique: true})
	email: string;

	@Column({type: 'varchar', length: 32, unique: true})
	username: string;

	@Column({type: 'varchar', length: 255})
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({type: 'bool', default: true})
	isActive: boolean;

	@Column({type: 'varchar', length: 64})
	hashSalt: string

}