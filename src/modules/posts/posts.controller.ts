import { FileInterceptor } from "@nestjs/platform-express";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { PostsService } from './posts.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { API_CONFIG } from "../../const/api.config";
import { GET_POST_SCHEMA } from "../../db/schemas/getPost.schema";
import { EditPostDto } from "./dto/editPost.dto";
import { AddCommentDto } from "../comments/dto/addComment.dto";
import { CommentsService } from "../comments/comments.service";
import { GET_COMMENT_SCHEMA } from "../../db/schemas/getComment.schema";

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly commentsService: CommentsService
	) { }

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
		console.log(1);
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

	@ApiOperation({ summary: 'Получить массив комментариев к посту' })
	@ApiQuery({name: 'lastId', required: false, type: 'number', description: 'id последнего комментария для cursor поиска', example: 1})
	@ApiResponse({ status: 400, description: 'Ошибка query-параметров / pid не корректный' })
	@ApiResponse({ status: 404, description: 'Комментарии / пост не найден(ы)' })
	@ApiResponse({ status: 200, description: 'Список комментариев', schema: {
		type: 'array',
		items: GET_COMMENT_SCHEMA
	}})
	@Get(':pid/comments')
	getPostComments(@Param('pid') pid: string, @Query() query: {[key: string]: string | undefined}){
		return this.commentsService.getComments(pid, query)
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

	@ApiOperation({ summary: 'Удалить пост' })
	@ApiResponse({ status: 404, description: 'Пост не найден / нет доступа к удалению поста' })
	@ApiResponse({ status: 400, description: 'pid не валидный' })
	@ApiResponse({ status: 200, description: 'Пост был удален' })
	@UseGuards(AuthGuard)
	@Delete(':pid')
	deletePost(@Param('pid') pid: string, @ExtractUser() user: UserPayload){
		return this.postsService.deletePost(user, pid)
	}

	@ApiOperation({ summary: 'Добавить коммент к посту' })
	@ApiResponse({ status: 400, description: 'pid не валидный' })
	@ApiResponse({ status: 500, description: 'не удалось создать запись комментария' })
	@ApiResponse({ status: 200, description: 'Комментарий добавлен' })
	@Post(':pid/comments')
	@UseGuards(AuthGuard)
	addComment(@Param('pid') pid: string, @ExtractUser() user: UserPayload, @Body() commentData: AddCommentDto){
		return this.commentsService.addComment(pid, user, commentData)
	}

}