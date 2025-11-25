import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserPayload } from "../../guards/auth.guard";
import { AddCommentDto } from "./dto/addComment.dto";
import { FindManyOptions, LessThan, Repository } from "typeorm";
import { Comment } from "../../db/entities/comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { API_CONFIG } from "../../const/api.config";

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

	async getComments(pid: string, query: {[key: string]: string | undefined}){

		const postId = parseInt(pid);
		if(isNaN(postId)){throw new BadRequestException('pid is not valid')}

		const options: FindManyOptions = {
			where: {post: {id: postId}},
			take: API_CONFIG.NUM_COMMENTS,
			relations: {author: true},
			order: {id: 'DESC'},
			select: {
				id: true,
				title: true,
				content: true,
				createdAt: true,
				author:{
					id: true,
					username: true,
				}
			}
		}

		const lastId = parseInt(`${query.lastId}`);
		if(!isNaN(lastId)){
			options.where = {...options.where, id: LessThan(lastId)}
		}

		const res = await this.commentsRepository.find(options)

		if(res.length === 0){throw new NotFoundException('No comments found')}

		return res
		
	}

	async deleteComment(cid: string, user: UserPayload){
		
		const id = parseInt(cid);
		if(isNaN(id)){throw new BadRequestException('cid is not valid')}

		const res = await this.commentsRepository.delete({id: id, author: {id: user.id}});

		if(!res.affected || res.affected < 1){throw new NotFoundException('Comment not found')}

		return

	}

}