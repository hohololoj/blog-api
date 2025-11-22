import { FileInterceptor } from "@nestjs/platform-express";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { PostsService } from './posts.service';
import { Body, Controller, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) { }

	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Создать новый пост' })
	@ApiResponse({ status: 400, description: 'Некорректное расширение картинки' })
	@ApiResponse({ status: 500, description: 'Ошибка сохранения' })
	@ApiResponse({
		status: 200, description: 'Пост успешно создан', schema: {
			type: 'object',
			properties: {
				id: { type: 'number', description: 'id нового поста' },
				title: { type: 'string', description: 'Сохраненный заголовок поста' },
				category: { type: 'number', description: 'Сохраненный id категории' },
				description: { type: 'string', description: 'Сохраненное краткое описание поста' },
				content: { type: 'string', description: 'Сохраненное содержание поста' },
				poster: { type: 'string', description: 'Путь до сохраненной картинки' },
				createdAt: { type: 'string', description: 'Дата создания поста' },
				updatedAt: { type: 'string', description: 'Дата последнего обновления поста' }
			}
		}
	})
	@Post()
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('poster'))
	@UsePipes(new ValidationPipe({ transform: true }))
	updatePostImage(@ExtractUser() user: UserPayload, @Body() postData: AddPostDto, @UploadedFile() poster: Express.Multer.File) {
		return this.postsService.createPost(user, postData, poster)
	}
}