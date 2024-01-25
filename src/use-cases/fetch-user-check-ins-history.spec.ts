import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check-in History Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
	});

	it('shoud be able to fetch check-in history', async () => {
		await checkInsRepository.create({
			gym_id: 'gym01',
			user_id: 'user01'
		});

		await checkInsRepository.create({
			gym_id: 'gym02',
			user_id: 'user01'
		});

		const { checkIns } = await sut.execute({
			userId: 'user01',
			page: 1
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: 'gym01' }),
			expect.objectContaining({ gym_id: 'gym02' }),
		]);
	});

	it('shoud be able to fetch paginated user check-in history', async () => {
		for(let i = 1; i <= 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym${i}`,
				user_id: 'user01'
			});
		}

		const { checkIns } = await sut.execute({
			userId: 'user01',
			page: 2
		});

		expect(checkIns).toHaveLength(2);
	});
});