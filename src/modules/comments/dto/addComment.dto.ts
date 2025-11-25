import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MaxLength, MinLength } from "class-validator";

export class AddCommentDto{

	@ApiProperty({example: 'Классная статья!', description: 'Заголовок комментария', type: 'string', maxLength: 32, minLength: 3})
	@IsString()
	@IsDefined()
	@MaxLength(32)
	@MinLength(3)
	title: string;
	
	@ApiProperty({example: '...', description: 'Текст комментария', type: 'string', maxLength: 256, minLength: 12})
	@IsString()
	@IsDefined()
	@MaxLength(256)
	@MinLength(12)
	content: string;

}