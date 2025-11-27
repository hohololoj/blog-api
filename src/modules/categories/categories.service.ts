import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { FindManyOptions, MoreThan, Repository } from "typeorm";
import { Category } from "../../db/entities/category.entity";
import { LoggerService } from "../logger/logger.service";
import { InjectRepository } from "@nestjs/typeorm";
import { API_CONFIG } from "../../const/api.config";

@Injectable()
export class CategoriesService{

	constructor(
		@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>,
		private readonly loggerService: LoggerService
	){}

	async addCategory(categoryData: AddCategoryDto){

		const newCategory = this.categoriesRepository.create({name: categoryData.name});

		return this.categoriesRepository.save(newCategory)
		.catch((err) => {
			if(err.code == '23505'){throw new ConflictException('Category with this name already exists')}
			else{
				this.loggerService.logError(err)
				throw new InternalServerErrorException('Something went wrong with saving category')
			}
		})

	}

	async getCategories(query: {[key: string]: string}){
		
		const lastId = query.lastId;
		const id = parseInt(`${lastId}`);

		const options: FindManyOptions = {
			where: isNaN(id) ? undefined : {id: MoreThan(id)},
			order: {id: 'ASC'},
			take: API_CONFIG.MAX_CATEGORIES
		}

		const res = await this.categoriesRepository.find(options);
		return res		
	}

}