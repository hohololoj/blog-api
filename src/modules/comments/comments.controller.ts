import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { AuthGuard, UserPayload } from "../../guards/auth.guard";
import { ExtractUser } from "../../decorators/extractUser.decorator";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller('comments')
export class CommentsController{
	constructor(private readonly commentsService: CommentsService){}

	@ApiOperation({summary: 'Удалить пост'})
	@ApiParam({name: 'cid', description: 'commentId', type: 'number'})
	@ApiResponse({ status: 400, description: 'cid не корректный' })
	@ApiResponse({ status: 404, description: 'Комментарий не найден' })
	@ApiResponse({ status: 200, description: 'Комментарий удален' })
	@Delete(':cid')
	@UseGuards(AuthGuard)
	deleteComment(@Param('cid') cid: string, @ExtractUser() user: UserPayload){
		return this.commentsService.deleteComment(cid, user)
	}

}