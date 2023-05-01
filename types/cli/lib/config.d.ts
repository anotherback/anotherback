import { FastifyListenOptions } from "fastify";
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { FastifyStaticOptions } from "@fastify/static";
import { fastifyRegister } from "../../src/lib/anotherback";

interface configAnotherback {
    listenParams?: FastifyListenOptions;
    registerParamsCookie?: FastifyCookieOptions;
    registerParamsCors?: FastifyCorsOptions;
	registerParamsStatic?: FastifyStaticOptions | boolean;
    prefix?: string;
	debug?: boolean;
    plugins?: Array<AnotherbackPlugin>;
    fastifyRegister?: fastifyRegister;
    listenCallback?(err: Error | null, address: string): void;
}

export default function config(obj: configAnotherback): void;