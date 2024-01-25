import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let usersRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Casoe', () => {
	beforeEach(() => {
		usersRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(usersRepository);
	});

	it('shoud be able to create gym', async () => {
		const { gym } = await sut.execute({
			title: 'JavaScript Gym',
			latitude: -20.5698661,
			longitude: -47.3804479,
			description: null,
			phone: null
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});