import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AddUserDto } from "./dto/addUser.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) { }

	@ApiOperation({ summary: 'Получить приватный профиль текущего пользователя' })
	@ApiResponse({ status: 400, description: 'Невалидный id / Пользователь не найден', })
	@ApiResponse({ status: 200, description: 'Приватные данные пользователя', schema: {
		type: 'object',
		properties: {
			id: {type: 'number', description: 'id пользователя'},
			email: {type: 'string', description: 'email пользователя'},
			username: {type: 'string', description: 'username пользователя'}
		}
	}})
	@Get('me')
	@UseGuards(AuthGuard)
	getProfile(@ExtractUser() user: UserPayload) {
		return this.usersService.getPrivateUser(user.id)
	}

	@ApiOperation({ summary: 'Получить публичный профиль пользователя' })
	@ApiResponse({ status: 400, description: 'Невалидный id / Пользователь не найден', })
	@ApiResponse({ status: 200, description: 'Публичные данные пользователя', schema: {
		type: 'object',
		properties: {
			id: {type: 'number', description: 'id пользователя'},
			email: {type: 'string', description: 'email пользователя'},
			username: {type: 'string', description: 'username пользователя'}
		}
	}})
	@Get(':uid')
	getUser(@Param('uid') uid: string) {
		return this.usersService.getPublicUser(uid)
	}

	@ApiOperation({ summary: 'Обновить данные пользователя' })
	@ApiResponse({ status: 400, description: 'Невалидный id / Ошибка доступа / Пользователь не найден в БД', })
	@ApiResponse({ status: 200, description: 'Данные пользователя обновлены' })
	@Patch(':uid')
	@UseGuards(AuthGuard)
	updateUser(@Param('uid') uid: string, @ExtractUser() user: UserPayload, @Body() updateUserBody: UpdateUserDto) {
		return this.usersService.updateUser(uid, user, updateUserBody)
	}

	@Post()
	@ApiOperation({ summary: 'Зарегистрироваться' })
	@ApiResponse({ status: 400, description: 'Пользователь уже существует / Что-то пошло не так / Данные не прошли валидацию', })
	@ApiResponse({ status: 200, description: 'Пользователь зарегистрирован' })
	addUser(@Body() userData: AddUserDto) {
		return this.usersService.addUser(userData)
	}
}