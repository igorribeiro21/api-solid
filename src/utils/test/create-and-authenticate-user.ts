import request from 'supertest';
import { FastifyInstance } from 'fastify';

export async function createAndAuthenticateUser(app: FastifyInstance) {
	await request(app.server)
		.post('/users')
		.send({
			name: 'Teste',
			email: 'teste@teste.com',
			password: '123456'
		});

	const authResponse = await request(app.server)
		.post('/sessions')
		.send({
			email: 'teste@teste.com',
			password: '123456'
		});

	const { token } = authResponse.body;

	return {
		token
	};
}