import { FileInterceptor } from "@nestjs/platform-express";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { PostsService } from './posts.service';
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_CONFIG } from "../../const/api.config";
import { GET_POST_SCHEMA } from "../../const/schema.getPostsList";
import { EditPostDto } from "./dto/editPost.dto";

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
			items: GET_POST_SCHEMA
		}
	})
	@Get('/list')
	getPostsList(@Query() queryParams: { [key: string]: string | undefined }) {
		return this.postsService.getPostsList(queryParams)
	}


	@ApiOperation({ summary: 'Получить пост' })
	@ApiParam({name: 'pid', required: true, type: 'number', description: 'id поста'})
	@ApiResponse({ status: 400, description: 'Невалидный id / Пост не найден' })
	@ApiResponse({ status: 200, description: 'Найденный пост', schema: GET_POST_SCHEMA})
	@Get(':pid')
	getPost(@Param('pid') pid: string){
		return this.postsService.getPost(pid);
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

	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Обновить пост' })
	@ApiResponse({ status: 404, description: 'Пост не найден / нет доступа к обновлению поста' })
	@ApiResponse({ status: 400, description: 'Данные не прошли валидацию' })
	@ApiResponse({ status: 200, description: 'Пост был обновлен' })
	@Patch(':pid')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('poster'))
	updatePost(@Param('pid') pid: string, @ExtractUser() user: UserPayload, @Body() postData: EditPostDto, @UploadedFile() poster: Express.Multer.File | undefined){
		return this.postsService.updatePost(user, pid, postData, poster)
	}

}