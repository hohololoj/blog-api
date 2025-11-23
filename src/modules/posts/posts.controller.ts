import { FileInterceptor } from "@nestjs/platform-express";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { PostsService } from './posts.service';
import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_CONFIG } from "../../const/api.config";

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) { }

	@ApiOperation({ summary: 'Получить список постов' })
	@ApiQuery({name: 'page', required: false, type: 'number', description: 'Номер страницы >0', example: 1})
	@ApiQuery({name: 'fill', required: false, type: 'number', description: `Количество элементов на странице <=${API_CONFIG.MAX_FILL}`, example: 10, default: 12})
	@ApiQuery({name: 'lastId', required: false, type: 'number', description: 'ID последнего полученного элемента для cursor-based пагинации', example: 72})
	@ApiResponse({ status: 400, description: 'Ошибка query-параметров' })
	@ApiResponse({
		status: 200,
		description: 'Массив постов',
		schema: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: { type: 'number', example: 72, description: 'Уникальный идентификатор поста' },
					title: { type: 'string', example: '...', description: 'Заголовок поста' },
					category: { type: 'number', example: 3, description: 'ID категории поста' },
					description: { type: 'string', example: '...', description: 'Краткое описание поста' },
					content: { type: 'string', example: '...', description: 'Полное содержание поста' },
					poster: { type: 'string', nullable: true, example: 'api/res/posters/example.jpg', description: 'URL изображения поста' },
					createdAt: { type: 'string', format: 'date-time', example: '2025-11-23T08:22:06.658Z', description: 'Дата создания поста' },
					updatedAt: { type: 'string', format: 'date-time', example: '2025-11-23T08:22:06.658Z', description: 'Дата последнего обновления поста' }
				}
			}
		}
	})
	@Get('/list')
	getPostsList(@Query() queryParams: { [key: string]: string | undefined }) {
		return this.postsService.getPostsList(queryParams)
	}


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