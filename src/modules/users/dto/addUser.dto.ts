import { applyDecorators } from "@nestjs/common";
import { IsDefined, IsEmail, IsString, MaxLength, MinLength } from "class-validator";

function IsDefinedString(){
	return applyDecorators(IsString(), IsDefined())
}

export class AddUserDto{

	@IsDefinedString()
	@IsEmail()
	@MaxLength(320)
	email: string;

	@IsDefinedString()
	@MaxLength(32)
	@MinLength(3)
	username: string;

	@IsDefinedString()
	@MaxLength(32)
	@MinLength(6)
	password: string;

}