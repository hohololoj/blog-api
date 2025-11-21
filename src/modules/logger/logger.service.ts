import * as fs from 'node:fs'
import { Global, Injectable } from "@nestjs/common";

@Global()
@Injectable()
export class LoggerService{
	async logError(str: string){
		const timestamp = Date.now();
		const logFileName = `${timestamp}-error.txt`;
		return fs.promises.writeFile(`logs/errors/${logFileName}`, str, 'utf8');
	}
}