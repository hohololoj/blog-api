import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { LessThan, Repository } from "typeorm";
import { Post } from "../../db/entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FSService } from "../fs/fs.service";
import { API_CONFIG } from "../../const/api.config";

@Injectable()
export class PostsService {

	constructor(
		@InjectRepository(Post) private readonly postsRepository: Repository<Post>,
		private readonly fsService: FSService
	) { }

	async savePoster(uid: number, poster: Express.Multer.File) {
		if (!poster) { return undefined }

		const posterName = `${uid}${Date.now()}`;
		const posterPath = await this.fsService.saveImage(poster, 'posters', posterName);
		return posterPath
	}

	async createPost(user: UserPayload, postData: AddPostDto, poster: Express.Multer.File) {

		const posterPath = await this.savePoster(user.id, poster)

		const newPost = this.postsRepository.create({
			...postData,
			poster: posterPath,
			author: { id: user.id }
		})

		const res = await this.postsRepository.save(newPost)

		if (!res) {
			if (posterPath) { this.fsService.undoSavingImage(posterPath) }
			throw new InternalServerErrorException('Something went wrong saving post');
		}

		return res;

	}

	async getPostsWithSkip(page: number, fill: number){

		const res = await this.postsRepository.find({order: {id: 'DESC'}, skip: (page-1)*fill, take: fill})

		if(res === null){throw new NotFoundException('Страница не найдена')}

		return res;
	}
	async getPostWithLastPid(lastPid: number, fill: number){

		const res = await this.postsRepository.find({order: {id: 'DESC'}, where: {id: LessThan(lastPid)}, take: fill})

		if(res === null){throw new NotFoundException('Страница не найдена')}

		return res
	}
	async getFirstPage(fill: number){
		return this.getPostsWithSkip(1, fill)
	}

	extractNumber(str: string | undefined): number{
		if(!str){return NaN}
		return parseInt(str)
	}

	async getPostsList(queryParams: { [key: string]: string | undefined }) {

		const extractPage = this.extractNumber(queryParams.page)
		const page = !isNaN(extractPage) ? extractPage : null;
		if(page && page < 1){throw new BadRequestException('page не может быть меньше 1')} 
		
		const extractLastPid = this.extractNumber(queryParams.lastId);
		const lastPid = !isNaN(extractLastPid) ? extractLastPid : null;
		
		
		const extractFill = this.extractNumber(queryParams.fill)
		const fill = !isNaN(extractFill) ? extractFill : API_CONFIG.DEFAULT_PAGE_FILL;
		if(fill > API_CONFIG.MAX_FILL){throw new BadRequestException('fill превышает допустимое значение')}
		
		if(!page && !lastPid){
			return this.getFirstPage(fill)
		}

		if(lastPid){
			return this.getPostWithLastPid(lastPid, fill);
		}

		return this.getPostsWithSkip(page!, fill);
	}

}