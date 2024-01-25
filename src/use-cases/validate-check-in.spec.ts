import { expect, describe, it, beforeEach, afterEach,vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckinUseCaseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckinUseCaseCase;

describe('Validate Check-in Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckinUseCaseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shoud be able to validate the check-in', async () => {
		const createdCheckIn = await  checkInsRepository.create({
			gym_id: 'gym01',
			user_id: 'user01'
		});

		const {checkIn} = await sut.execute({
			checkInId: createdCheckIn.id
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it('shoud not be able to validate an inexistent check-in', async () => {
		await expect(() =>  sut.execute({
			checkInId: 'checkIn Inexistent'
		})).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to validate the check-in after 20 minutes of its creation',async () => {
		vi.setSystemTime(new Date(2023,0,1,13,40));

		const createdCheckIn = await  checkInsRepository.create({
			gym_id: 'gym01',
			user_id: 'user01'
		});

		const twentyOneMinutusInMs = 1000 * 60 * 21;

		vi.advanceTimersByTime(twentyOneMinutusInMs);

		await expect(() => sut.execute({
			checkInId: createdCheckIn.id
		})).rejects.toBeInstanceOf(Error);
	});
});