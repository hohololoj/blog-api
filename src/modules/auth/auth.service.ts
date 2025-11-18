import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { CryptoService } from "../crypto/crypto.service";
import { Payload } from "../../types/types.payload";

@Injectable()
export class AuthService{
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService
	){}

	throwWrongAuth(): never{
		throw new BadRequestException('Пользователь с таким email и паролем не найден')
	}

	async login(identifier: string, promptPassword: string){
		const user = await this.userService.findByEmailOrLogin(identifier);

		if(!user){return this.throwWrongAuth()}

		const pass = user.password;
		const salt = user.hashSalt;

		const correct = await this.cryptoService.compareHash(promptPassword, pass, salt);
		if(!correct){return this.throwWrongAuth()}
		
		const accessToken = this.jwtService.sign({id: user.id, email: user.email, username: user.username});
		return {accessToken: accessToken}
	}

	async verify(token: string): Promise<false | Payload>{
		return this.jwtService.verifyAsync(token)
		.then((data: Payload) => data)
		.catch(() => false)
	}

}