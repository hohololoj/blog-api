import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../db/entities/user.entity";

export const ExtractUser = createParamDecorator((data: keyof User | undefined, context: ExecutionContext) => {
	const req = context.switchToHttp().getRequest();
	const user = {id: req.id, username: req.username, email: req.email};
	return data ? user[data] : user;
})