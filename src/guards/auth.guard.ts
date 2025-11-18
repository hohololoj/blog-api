import { BadRequestException, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { UsersService } from "../modules/users/users.service";

export class AuthGuard implements CanActivate{
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService
	){}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest() as Request;
		
		const authHeader = req.headers.authorization;

		if(!authHeader){throw new UnauthorizedException('No header present')}

		const [type, token] = authHeader?.split(' ');

		if(type !== 'Bearer' || !token){
			throw new UnauthorizedException('Invalid token format')
		}

		const allowed = await this.authService.verify(token);
		if(!allowed){throw new UnauthorizedException('Invalid token')}
		
		const user = await this.userService.findById(allowed.id);
		if(!user){throw new BadRequestException('Пользователь не найден')}
		req.user = user
		return true
	}
}