import { BadRequestException, ImATeapotException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { AddUserDto } from "./dto/addUser.dto";
import { CryptoService } from "../crypto/crypto.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../db/entities/user.entity";
import { Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service";
import { UserPayload } from "../../guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UsersService{

	constructor(
		private readonly cryptoService: CryptoService,
		private readonly loggerService: LoggerService,
		@InjectRepository(User) private readonly userRepository: Repository<User>
	){}

	async processHash(password: string){
		try{
			return await this.cryptoService.hash(password);
		}
		catch(err){
			this.loggerService.logError(JSON.stringify(err))
			throw new InternalServerErrorException('Что-то пошло не так')
		}
	}

	async addUser(userData: AddUserDto){
		const {password, ...rest} = userData;
		const {hash, salt} = await this.processHash(password);
		
		const user = {
			...rest,
			password: hash,
			hashSalt: salt
		}
		
		const newUser = this.userRepository.create(user);
		return await this.userRepository.save(newUser)
		.then((data) => {return {status: true, id: data.id}})
		.catch((err) => {
			if(err.code === "23505"){
				throw new BadRequestException('Пользователь с таким email уже существует');
			}
			this.loggerService.logError(JSON.stringify(err))
			throw new BadRequestException('Что-то пошло не так');
		})
	}

	async findByEmailOrLogin(identifier: string){
		return this.userRepository.findOne({where: [
			{email: identifier},
			{username: identifier}
		]})
	}

	async findById(id: number){
		return this.userRepository.find({where: {id}})
	}

	async getPrivateUser(id: number){
		const res = await this.userRepository.findOne({where: {id}, select: ['id', 'email', 'username']});
		if(res === null){throw new BadRequestException('User not found')}
		return res
	}

	async getPublicUser(uid: string){
		const id = parseInt(uid);
		if(isNaN(id)){throw new BadRequestException('Invalid user id')}

		const res = await this.userRepository.findOne({where: {id}, select: ['id', 'email', 'username']})
		if(res === null){throw new BadRequestException('User not found')}
		return res
	}

	async updateUser(uid: string, {id: verifiedId}: UserPayload, updateUserBody: UpdateUserDto){
		const id = parseInt(uid);

		if(isNaN(id)){throw new BadRequestException('Invalid user id')}
		if(id !== verifiedId){throw new UnauthorizedException('Forbidden action')}

		const res = await this.userRepository.update({id}, updateUserBody);
		
		if(res.affected && res.affected > 0){
			return {status: true}
		}
		else{
			throw new BadRequestException("Couldn't update user")
		}
	}

}