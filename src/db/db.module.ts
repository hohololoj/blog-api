import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
      			host: configService.get('DB_HOST', 'localhost'),
      			port: parseInt(configService.get('DB_PORT', '5432')),
      			username: configService.get('DB_USER', 'not-correct'),
      			password: configService.get('DB_PASSWORD', 'not-correct'),
      			database: configService.get('DB_NAME', 'blog'),
      			entities: ['dist/db/entities/*.entity.js'],
      			synchronize: configService.get('ENV') === 'dev',
			})
		})
	]
})
export class DBModule{}