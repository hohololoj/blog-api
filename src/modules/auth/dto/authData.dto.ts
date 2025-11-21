import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDataDto{
	@ApiProperty({
		description: 'email/username пользователя',
		example: 'ivan.ivanov@yandex.ru',
		maxLength: 320,
		type: 'string',
	})
	@IsString()
	@MaxLength(320)
	@IsDefined()
	identifier!: string;

	@ApiProperty({
		description: 'введенный пароль',
		example: 'ivan32',
		maxLength: 32,
		minLength: 6,
		type: 'string',
	})
	@IsString()
	@MaxLength(32)
	@MinLength(6)
	@IsDefined()
	password!: string;
}