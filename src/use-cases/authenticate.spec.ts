import { expect, describe, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {
	it('shoud be able to authenticate', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: 'Jhon Doe',
			email: 'jhondoe@teste.com',
			password_hash: await hash('123456',6)
		});

		const { user } = await sut.execute({
			email: 'jhondoe@teste.com',
			password: '123456'
		});	

		expect(user.id).toEqual(expect.any(String));
	});

	it('shoud not be able to authenticate with wrong email', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await expect(() => sut.execute({
			email: 'jhondoe@teste.com',
			password: '123456'
		})).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('shoud not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: 'Jhon Doe',
			email: 'jhondoe@teste.com',
			password_hash: await hash('123456',6)
		});

		await expect(() => sut.execute({
			email: 'jhondoe@teste.com',
			password: '123123'
		})).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});