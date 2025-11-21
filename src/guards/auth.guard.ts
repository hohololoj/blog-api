import { BadRequestException, CanActivate, ExecutionContext, forwardRef, Global, Inject, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export interface UserPayload{
	id: number,
	email: string,
	username: string,
	iat: number,
	exp: number
}

export class AuthGuard implements CanActivate{
	constructor(
		private readonly jwtService: JwtService,
		@Inject(ConfigService) private readonly configService: ConfigService
	){}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest() as Request;
		
		const authHeader = req.headers.authorization;

		if(!authHeader){throw new UnauthorizedException('No header present')}

		const [type, token] = authHeader?.split(' ');

		if(type !== 'Bearer' || !token){
			throw new UnauthorizedException('Invalid token format')
		}

		const allowed = await this.jwtService.verifyAsync<UserPayload>(token, {secret: this.configService.getOrThrow('JWT_SECRET')})
		.then((data) => {return data})
		.catch(() => {
			return null
		})
		if(!allowed){throw new UnauthorizedException('Invalid token')}
		
		req['id'] = allowed.id;
		req['username'] = allowed.username;
		req['email'] = allowed.email;

		return true
	}
}