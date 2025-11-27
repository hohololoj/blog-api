import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { PostsService } from "../posts/posts.service";

@Controller('categories')
export class CategoriesController{

	constructor(
		private readonly categoriesService: CategoriesService,
		private readonly postsService: PostsService
	){}

	@Get()
	getCategories(@Query() query: {[key: string]: string}){
		return this.categoriesService.getCategories(query)
	}

	@Get(':cid/posts')
	getCategoryPosts(@Param('cid') cid: string, @Query() query: {[key: string]: string}){
		return this.postsService.getCategoryPosts(cid, query)
	}

	// @Post()
	// addCategory(@Body() categoryData: AddCategoryDto){
	// 	return this.categoriesService.addCategory(categoryData);
	// }

}