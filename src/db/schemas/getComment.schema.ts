export const GET_COMMENT_SCHEMA = {
	type: 'object',
	properties: {
		id: {type: 'number', example: 1, description: 'id комментария'},
        title: {type: 'string', example: 'Согласен с автором!', description: 'Заголовок комментария'},
        content: {type: 'string', example: 'Полностью солидарен с автором данного поста!', description: 'Содержание комментария'},
		author: {
			type: 'object',
			properties:{
				id: {type: 'number', example: 1, description: 'id автора'},
				username: {type: 'string', example: 'ivan32', description: 'username автора'},
			}
		},
        createdAt: {type: 'string', example: '2025-11-25T09:25:11.721Z', description: 'timestamp создания комментария'}
	}
}