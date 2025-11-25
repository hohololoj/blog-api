import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserPayload } from "../../guards/auth.guard";
import { AddCommentDto } from "./dto/addComment.dto";
import { Repository } from "typeorm";
import { Comment } from "../../db/entities/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentsService{
	constructor(
		@InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>
	){}

	async addComment(pid: string, user: UserPayload, commentData: AddCommentDto){
		
		const postId = parseInt(pid);
		if(isNaN(postId)){throw new BadRequestException('pid is not valid')}

		const newComment = this.commentsRepository.create({
			...commentData,
			author: {id: user.id},
			post: {id: postId}
		})

		const res = await this.commentsRepository.save(newComment);

		if(!res){throw new InternalServerErrorException('Something went wrong with saving comment')}

		return res;

	}

}