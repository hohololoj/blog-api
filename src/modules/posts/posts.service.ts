import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { Repository } from "typeorm";
import { Post } from "../../db/entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FSService } from "../fs/fs.service";

@Injectable()
export class PostsService{

	constructor(
		@InjectRepository(Post) private readonly postsRepository: Repository<Post>,
		private readonly fsService: FSService
	){}

	async savePoster(uid: number, poster: Express.Multer.File){
		if(!poster){return undefined}

		const posterName = `${uid}${Date.now()}`;
		const posterPath = await this.fsService.saveImage(poster, 'posters', posterName);
		return posterPath
	}

	async createPost(user: UserPayload, postData: AddPostDto, poster: Express.Multer.File){
		
		const posterPath = await this.savePoster(user.id, poster)
		
		const newPost = this.postsRepository.create({
			...postData,
			poster: posterPath,
			author: {id: user.id}
		})

		const res = await this.postsRepository.save(newPost)

		if(!res){
			if(posterPath){this.fsService.undoSavingImage(posterPath)}
			throw new InternalServerErrorException('Something went wrong saving post');
		}

		return res;

	}

}