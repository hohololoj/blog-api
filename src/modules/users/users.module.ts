import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { ConfigModule } from "@nestjs/config";
import { CryptoService } from "../crypto/crypto.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../db/entities/user.entity";
import { LoggerService } from "../logger/logger.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService, CryptoService, LoggerService]
})
export class UsersModule{}