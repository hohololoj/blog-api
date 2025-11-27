import { CategoriesController } from './categories.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "../../db/entities/category.entity";
import { PostsModule } from "../posts/posts.module";
import { CategoriesService } from "./categories.service";
import { LoggerModule } from "../logger/logger.module";

@Module({
	imports: [TypeOrmModule.forFeature([Category]), PostsModule, LoggerModule],
	controllers: [CategoriesController],
	providers: [CategoriesService]
})
export class CategoriesModule{}