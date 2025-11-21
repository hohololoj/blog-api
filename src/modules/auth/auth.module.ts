import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module";
import { CryptoModule } from "../crypto/crypto.module";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "../../guards/auth.guard";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow('JWT_SECRET'),
				signOptions: {expiresIn: '30d'}
			}),
			inject: [ConfigService]
		}),
		UsersModule,
		CryptoModule
	],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule{}