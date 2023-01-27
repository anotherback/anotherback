import { FastifyListenOptions } from "fastify";
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { fastifyRegister } from "../../dist/lib/anotherback";

interface configAnotherback {
    listenParams: FastifyListenOptions;
    registerParamsCookie: FastifyCookieOptions;
    registerParamsCors: FastifyCorsOptions;
    prefix: string;
    plugins: Array<AnotherbackPlugin>;
    fastifyRegister: fastifyRegister;
    listenCallback(err: Error | null, address: string): void;
}

export default function config(obj: configAnotherback): void;