import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";

export class AddCategoryDto{

	@IsString()
	@IsDefined()
	@MinLength(3)
	@MaxLength(16)
	name: string;

}