import fastify from 'fastify';
import { JWTPayload } from '../../src/entities';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    authenticate(): void;
  }
  export interface FastifyContextConfig {
      jwtData?: JWTPayload
  }
}