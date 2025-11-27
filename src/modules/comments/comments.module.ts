import { Module } from "@nestjs/common";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "../../db/entities/comment.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [TypeOrmModule.forFeature([Comment]), JwtModule],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: [CommentsService]
})
export class CommentsModule{}