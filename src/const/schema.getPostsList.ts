export const GET_POST_SCHEMA = {
	type: 'object',
	properties: {
		id: { type: 'number', example: 72, description: 'Уникальный идентификатор поста' },
		title: { type: 'string', example: '...', description: 'Заголовок поста' },
		category: { type: 'number', example: 3, description: 'ID категории поста' },
		description: { type: 'string', example: '...', description: 'Краткое описание поста' },
		content: { type: 'string', example: '...', description: 'Полное содержание поста' },
		poster: { type: 'string', nullable: true, example: 'api/res/posters/example.jpg', description: 'URL изображения поста' },
		createdAt: { type: 'string', format: 'date-time', example: '2025-11-23T08:22:06.658Z', description: 'Дата создания поста' },
		updatedAt: { type: 'string', format: 'date-time', example: '2025-11-23T08:22:06.658Z', description: 'Дата последнего обновления поста' }
	}
}