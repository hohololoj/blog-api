import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

interface Endpoint{
	endpoint: string,
	description: string
}

const tags: Endpoint[] = [
	{
		endpoint: 'users',
		description: 'Операции с пользователями'
	},
	{
		endpoint: 'auth',
		description: 'Авторизация через jwt'
	}
]

const configRaw = new DocumentBuilder()
	.setTitle('Blog API')
	.setDescription('Blog API Documentation')
	.setVersion('1.0')
	.addBearerAuth()
	tags.forEach((tag) => {
		configRaw.addTag(tag.endpoint, tag.description)
	})
	const config = configRaw.build()

export function createAPIDocument(app: INestApplication<any>){
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			persistAuthorization: true
		}
	})
}