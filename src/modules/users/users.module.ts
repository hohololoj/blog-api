import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../db/entities/user.entity";
import { CryptoModule } from "../crypto/crypto.module";
import { LoggerModule } from "../logger/logger.module";
import { JwtService } from "@nestjs/jwt";

@Module({
	imports: [TypeOrmModule.forFeature([User]), CryptoModule, LoggerModule],
	controllers: [UsersController],
	providers: [UsersService, JwtService],
	exports: [UsersService]
})
export class UsersModule{}