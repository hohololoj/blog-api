import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../../db/entities/post.entity";
import { JwtService } from "@nestjs/jwt";
import { FSModule } from "../fs/fs.module";
import { CommentsModule } from "../comments/comments.module";

@Module({
	imports: [TypeOrmModule.forFeature([Post]), FSModule, CommentsModule],
	controllers: [PostsController],
	providers: [PostsService, JwtService],
	exports: [PostsService]
})
export class PostsModule{}