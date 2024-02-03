import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
	const getUserMetricsGymUseCase = makeGetMetricsUseCase();

	const { checkInsCount } = await getUserMetricsGymUseCase.execute({
		userId: request.user.sub
	});

	return reply.status(200).send({
		checkInsCount
	});
}