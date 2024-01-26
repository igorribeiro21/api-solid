import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckinUseCaseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const useCase = new ValidateCheckinUseCaseCase(checkInsRepository);

	return useCase;
}