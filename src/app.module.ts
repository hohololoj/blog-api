import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { PostsModule } from "./modules/posts/posts.module";
import { DBModule } from "./db/db.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CryptoModule } from "./modules/crypto/crypto.module";
import { LoggerModule } from "./modules/logger/logger.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DBModule,
		CryptoModule,
		LoggerModule,
		UsersModule,
		PostsModule,
		AuthModule,
	]
})
export class AppModule{}