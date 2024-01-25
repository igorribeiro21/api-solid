import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';
import { Decimal } from '@prisma/client/runtime/library';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('shoud be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			latitude: -20.5698661,
			longitude: -47.3804479,
			description: null,
			phone: null
		});
 
		await gymsRepository.create({
			title: 'Far Gym',
			latitude: new Decimal(-20.476380),
			longitude: new Decimal(-47.409976),
			description: null,
			phone: null
		});

		const { gyms } = await sut.execute({
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Near Gym' }),
		]);
	});
});