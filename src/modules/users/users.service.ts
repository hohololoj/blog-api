import { BadRequestException, ImATeapotException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AddUserDto } from "./dto/addUser.dto";
import { CryptoService } from "../crypto/crypto.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../db/entities/user.entity";
import { Repository } from "typeorm";
import { LoggerService } from "../logger/logger.service";

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
			return {status: false, message: 'Что-то пошло не так'}}
		)
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

}