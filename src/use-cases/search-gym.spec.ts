import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymUseCase(gymsRepository);
	});

	it('shoud be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			latitude: -20.5698661,
			longitude: -47.3804479,
			description: null,
			phone: null
		});

		await gymsRepository.create({
			title: 'TypeScript Gym',
			latitude: -20.5698661,
			longitude: -47.3804479,
			description: null,
			phone: null
		});

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 1
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		]);
	});

	it('shoud be able to fetch paginated gym search', async () => {
		for(let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				latitude: -20.5698661,
				longitude: -47.3804479,
				description: null,
				phone: null
			});
		}

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 2
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym 21' }),
			expect.objectContaining({ title: 'JavaScript Gym 22' }),
		]);
	});
});