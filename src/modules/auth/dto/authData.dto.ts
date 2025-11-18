import { IsDefined, IsString, MaxLength } from "class-validator";

export class AuthDataDto{
	@IsString()
	@MaxLength(320)
	@IsDefined()
	identifier!: string;

	@IsString()
	@MaxLength(32)
	@IsDefined()
	password!: string;
}