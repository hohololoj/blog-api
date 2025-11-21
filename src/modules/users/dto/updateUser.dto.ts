import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

	@ApiProperty({
		description: 'новый email',
		example: 'ivan.ivanov@yandex.ru',
		maxLength: 320,
		type: 'string',
	})
	@IsOptional()
	@IsString()
	@MaxLength(320)
	@IsEmail()
	email?: string;

	@ApiProperty({
		description: 'новый username',
		example: 'ivan2',
		maxLength: 32,
		minLength: 3,
		type: 'string',
	})
	@IsOptional()
	@IsString()
	@MaxLength(32)
	@MinLength(3)
	username?: string;

}