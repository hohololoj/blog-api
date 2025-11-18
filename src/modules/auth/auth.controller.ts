import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDataDto } from "./dto/authData.dto";

@Controller('/auth')
export class AuthController{
	constructor(private readonly authService: AuthService){}
	@Post()
	login(@Body() authData: AuthDataDto){
		return this.authService.login(authData.identifier, authData.password)
	}
}