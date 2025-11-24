import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

function IsDefinedString(){
	return applyDecorators(IsString(), IsDefined())
}

function IsRangedString(min:number, max:number){
	return applyDecorators(MinLength(min), MaxLength(max)) 
}

export class EditPostDto{

	@ApiProperty({example: 'Вышло новое обновление API', description: 'Заголовок поста', type: 'string', maxLength: 48})
	@IsDefinedString()
	@IsRangedString(6, 48)
	@IsOptional()
	title?: string;
	
	@ApiProperty({example: 1, description: 'id категории', type: 'number'})
	@IsInt()
	@Transform((props) => JSON.parse(props.value))
	@IsOptional()
	category?: number;
	
	@ApiProperty({example: 'Новое обновление API затронуло систему валидации', description: 'Краткое описание поста', type: 'string', maxLength: 96})
	@IsDefinedString()
	@IsRangedString(12, 96)
	@IsOptional()
	description?: string;
	
	@ApiProperty({example: '...', description: 'Содержание поста', type: 'string', maxLength: 512})
	@IsDefinedString()
	@IsRangedString(24, 512)
	@IsOptional()
	content?: string;

	@ApiProperty({ type: 'string', format: 'binary', description: 'Постер поста' })
	@IsOptional()
	poster?: string;

}