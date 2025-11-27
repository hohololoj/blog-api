import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserPayload } from "../../guards/auth.guard";
import { AddPostDto } from "./dto/addPost.dto";
import { FindManyOptions, LessThan, Repository } from "typeorm";
import { Post } from "../../db/entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FSService } from "../fs/fs.service";
import { API_CONFIG } from "../../const/api.config";
import { EditPostDto } from "./dto/editPost.dto";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

@Injectable()
export class PostsService {

	constructor(
		@InjectRepository(Post) private readonly postsRepository: Repository<Post>,
		private readonly fsService: FSService
	) { }

	async savePoster(uid: number, poster: Express.Multer.File | undefined) {
		if (!poster) { return undefined }

		const posterName = `${uid}${Date.now()}`;
		const posterPath = await this.fsService.saveImage(poster, 'posters', posterName);
		return posterPath
	}

	async createPost(user: UserPayload, postData: AddPostDto, poster: Express.Multer.File) {

		const posterPath = await this.savePoster(user.id, poster)

		const {category, ...rest} = postData;

		const newPost = this.postsRepository.create({
			...rest,
			poster: posterPath,
			author: { id: user.id },
			category: {id: category}
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

		if(res.length === 0){throw new NotFoundException('Page not found')}

		return res;
	}
	async getPostWithLastPid(lastPid: number, fill: number){

		const res = await this.postsRepository.find({order: {id: 'DESC'}, where: {id: LessThan(lastPid)}, take: fill})

		if(res.length === 0){throw new NotFoundException('Page not found')}

		return res
	}
	async getFirstPage(fill: number){
		console.log(2);
		return this.getPostsWithSkip(1, fill)
	}
	async getCategoryPosts(cid: string, query: {[key: string]: string}){

		const id = parseInt(cid);
		if(isNaN(id)){throw new BadRequestException('cid is not valid')}

		const options: FindManyOptions = {
			order: {id: 'DESC'},
			where: {category: {id: id}},
			take: API_CONFIG.DEFAULT_PAGE_FILL
		}
		if(query.lastId !== undefined){
			const lastId_int = parseInt(query.lastId);
			if(isNaN(lastId_int)){throw new BadRequestException("lastId is not valid")}
			options.where = {...options.where, id: LessThan(lastId_int)}
		}

		const res = await this.postsRepository.find()

		return res;

	}

	extractNumber(str: string | undefined): number{
		if(!str){return NaN}
		return parseInt(str)
	}

	async getPostsList(queryParams: { [key: string]: string | undefined }) {

		const extractPage = this.extractNumber(queryParams.page)
		const page = !isNaN(extractPage) ? extractPage : null;
		if(page && page < 1){throw new BadRequestException('page must be >0')} 
		
		const extractLastPid = this.extractNumber(queryParams.lastId);
		const lastPid = !isNaN(extractLastPid) ? extractLastPid : null;
		
		
		const extractFill = this.extractNumber(queryParams.fill)
		const fill = !isNaN(extractFill) ? extractFill : API_CONFIG.DEFAULT_PAGE_FILL;
		if(fill > API_CONFIG.MAX_FILL){throw new BadRequestException('fill exceeds allowed value')}
		
		if(!page && !lastPid){
			return this.getFirstPage(fill)
		}

		if(lastPid){
			return this.getPostWithLastPid(lastPid, fill);
		}

		return this.getPostsWithSkip(page!, fill);
	}

	async getPost(pid: string){

		const id = parseInt(pid);
		if(isNaN(id)){throw new BadRequestException('id is invalid')}

		const res = await this.postsRepository.findOne({where: {id}})
		if(res === null){throw new NotFoundException('Пост не найден')}

		return res;
	}
	
	async updatePost(user: UserPayload, pid: string, postData: EditPostDto, poster: Express.Multer.File | undefined){

		const id = parseInt(pid);
		if(isNaN(id)){throw new BadRequestException('pid is not valid')}

		const filteredPostData: Partial<AddPostDto> = {};
		for(const key in postData){
			if(postData[key] !== undefined){filteredPostData[key] = postData[key]}
		}

		if(Object.values(filteredPostData).length === 0 && poster === undefined){throw new BadRequestException('Nothing to update')}

		const oldPost = await this.postsRepository.findOne({where: {id: id, author: {id: user.id}}, select: ['id','poster']});

		if(!oldPost){throw new NotFoundException('Post not found')}
		
		const {category, ...rest} = filteredPostData;
		
		const newPostData: QueryDeepPartialEntity<Post> = {
			id: id,
			...rest
		}

		if(category !== undefined){newPostData.category = {id: category}}
		
		const newPosterPath = await this.savePoster(user.id, poster);
		if(newPosterPath){newPostData.poster = newPosterPath}


		const res = await this.postsRepository.update({id: id, author: {id: user.id}}, newPostData);
		if(!res.affected || res.affected === 0){throw new UnauthorizedException('Something went wrong with updating post')}

		if(oldPost.poster){this.fsService.undoSavingImage(oldPost.poster)}

		return
	}

	async deletePost(user: UserPayload, pid: string){

		const id = parseInt(pid);
		if(isNaN(id)){throw new BadRequestException('invalid pid')}

		const res = await this.postsRepository.delete({id: id, author: {id: user.id}})
		if(!res.affected || res.affected < 1){throw new NotFoundException('post not found')}

		return

	}

}