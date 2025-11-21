import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString, MaxLength, MinLength } from "class-validator";

function IsDefinedString(){
	return applyDecorators(IsString(), IsDefined())
}

export class AddUserDto{
	@ApiProperty({
		description: 'email пользователя',
		example: 'ivan.ivanov@yandex.ru',
		maxLength: 320,
		type: 'string',
	})
	@IsDefinedString()
	@IsEmail()
	@MaxLength(320)
	email: string;

	@ApiProperty({
		description: 'username пользователя',
		example: 'ivan',
		maxLength: 32,
		minLength: 3,
		type: 'string',
	})
	@IsDefinedString()
	@MaxLength(32)
	@MinLength(3)
	username: string;

	@ApiProperty({
		description: 'Пароль пользователя',
		example: 'ivan32',
		maxLength: 32,
		minLength: 6,
		type: 'string',
	})
	@IsDefinedString()
	@MaxLength(32)
	@MinLength(6)
	password: string;

}