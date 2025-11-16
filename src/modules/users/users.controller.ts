import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AddUserDto } from "./dto/addUser.dto";

@Controller('users')
export class UsersController{
	constructor(
		private readonly usersService: UsersService,
	){}

	@Post()
	addUser(@Body() userData: AddUserDto){
		return this.usersService.addUser(userData)
	}
}