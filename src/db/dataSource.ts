import { DataSource } from "typeorm";

export default new DataSource({
	type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'blog',
    entities: ['dist/db/entities/*.entity.js'],
	migrations: ['dist/db/migrations/*.js'],
    synchronize: true,
})