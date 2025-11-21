import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDataDto } from "./dto/authData.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController{
	constructor(private readonly authService: AuthService){}
	@Post('/login')
	@ApiOperation({summary: 'Залогиниться'})
	@ApiResponse({status: 200,description: 'Вход выполнен',schema: {
		type: 'object',
		properties: {
			accessToken: {
				type: 'string',
				description: 'JWT-токен',
				example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
			}
		}
	}})
	@ApiResponse({status: 400,description: 'Вход не выполнен'})
	login(@Body() authData: AuthDataDto){
		return this.authService.login(authData.identifier, authData.password)
	}
}