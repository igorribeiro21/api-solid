import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckinUseCaseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckinUseCaseCase;
let gymsRepository: InMemoryGymsRepository;

describe('Check-in Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckinUseCaseCase(checkInsRepository,gymsRepository);

		await gymsRepository.create({
			id: 'gym01',
			title: 'JavaScript Gym',
			description: '',
			latitude: -20.5698661,
			longitude: -47.3804479,
			phone: ''
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shoud be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym01',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('shoud not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym01',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		});

		await expect(() => sut.execute({
			gymId: 'gym01',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		})).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('shoud not be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym01',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gym01',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('shoud not be able to check in on distant gym', async () => {
		gymsRepository.items.push({
			id: 'gym02',
			title: 'JavaScript Gym',
			description: '',
			latitude: new Decimal(-20.571775),
			longitude: new Decimal(-47.369569),
			phone: ''
		});

		await expect(() => sut.execute({
			gymId: 'gym02',
			userId: 'user01',
			userLatitude: -20.5698661,
			userLongitude: -47.3804479
		})).rejects.toBeInstanceOf(MaxDistanceError);
	});
});