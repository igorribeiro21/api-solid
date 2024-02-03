import request from 'supertest';
import { app } from '@/app';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it('shoud be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Javascript Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -20.5698661,
				longitude: -47.3804479,
			});

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Typescript Gym',
				description: 'Some description',
				phone: '11999999999',
				latitude: -20.476380,
				longitude: -47.409976,
			});

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -20.5698661,
				longitude: -47.3804479,
			})
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Javascript Gym'
			})
		]);
	});
}); 