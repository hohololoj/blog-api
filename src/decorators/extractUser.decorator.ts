import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../db/entities/user.entity";

export const ExtractUser = createParamDecorator((data: keyof User | undefined, context: ExecutionContext): User => {
	const req = context.switchToHttp().getRequest();
	const user = req.user;
	return data ? user[data] : user;
})