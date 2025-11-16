import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";

let port: number;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	port = parseInt(configService.get("PORT", "3000"));

	await app.listen(port);
}
bootstrap()
.then(() => {
	console.log(`server running at: localhost:${port}`);
})