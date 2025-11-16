import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'node:crypto'

@Injectable()
export class CryptoService{

	private readonly SALT_LENGTH: number;
	private readonly ITERATIONS: number;
	private readonly KEY_LENGTH: number;

	constructor(private readonly configService: ConfigService){

		this.SALT_LENGTH = parseInt(this.configService.getOrThrow('HASH_SALT_LENGTH'))
		this.ITERATIONS = parseInt(this.configService.getOrThrow('HASH_ITERATIONS'))
		this.KEY_LENGTH = parseInt(this.configService.getOrThrow('HASH_KEYLENGTH'))

	}

	async hash(str: string): Promise<{hash: string, salt: string}>{
		const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(str, salt, this.ITERATIONS, this.KEY_LENGTH, 'sha256', (err, hashRaw) => {
				if(err){return reject(err)}
				resolve({
					hash: hashRaw.toString('hex'),
					salt: salt
				})
			})
		})
	}

	async compareHash(str: string, hash: string, salt: string): Promise<boolean>{
		return new Promise((resolve, reject) => {
			crypto.pbkdf2(str, salt, this.ITERATIONS, this.KEY_LENGTH, 'sha256', (err, hashRaw) => {
				if(err){return reject(err)}
				resolve(hashRaw.toString('hex') === hash)
			})
		})
	}

}