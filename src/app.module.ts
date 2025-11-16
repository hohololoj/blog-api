import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { PostsModule } from "./modules/posts/posts.module";
import { DBModule } from "./db/db.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		DBModule,
		UsersModule,
		PostsModule
	]
})
export class AppModule{}