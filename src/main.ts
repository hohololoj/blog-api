import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { createAPIDocument } from "./config/swagger.config";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

let port: number;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true,
		exceptionFactory: (errs) => {
			return new BadRequestException({
				message: `Что-то пошло не так`,
				errors: errs.map(error => ({
					field: error.property,
					errors: error.constraints ? Object.values(error.constraints) : [],
					value: error.value
				}))
			})
		}
	}))

	port = parseInt(configService.get("PORT", "3000"));

	createAPIDocument(app);

	await app.listen(port);
}
bootstrap()
	.then(() => {
		console.log(`server running at: localhost:${port}`);
	})