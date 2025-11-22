import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Request } from "express";
import * as fs from 'node:fs';
import { imagesMimeTypes } from "../../const/mimetypes.images";

@Injectable()
export class FSService{

	async saveImage(image: Express.Multer.File, resDirName: string, fileName: string){

		const mime = image.mimetype;
		const ext = imagesMimeTypes[mime];

		if(!ext){throw new BadRequestException('Invalid image extension')}

		const imagePath = `res/${resDirName}/${fileName}${ext}`;

		return fs.promises.writeFile(imagePath, image.buffer)
		.then(() => imagePath)
		.catch(() => {throw new InternalServerErrorException('Something went wrong with saving image')})
	}

	async undoSavingImage(filePath: string){
		fs.promises.unlink(filePath)
	}
	
}