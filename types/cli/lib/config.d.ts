import { FastifyListenOptions } from "fastify";
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { FastifyStaticOptions } from "@fastify/static";
import { debug, fastifyRegister } from "../../src/lib/anotherback";

interface configAnotherback {
    listenParams?: FastifyListenOptions;
    registerParamsCookie?: FastifyCookieOptions;
    registerParamsCors?: FastifyCorsOptions;
	registerParamsStatic?: FastifyStaticOptions | boolean;
    prefix?: string;
	debug?: debug;
    plugins?: Array<AnotherbackPlugin>;
    fastifyRegister?: fastifyRegister;
    listenCallback?(err: Error | null, address: string): void;
}

interface configAnotherbackCli {
    linter: boolean;
	hotReload: boolean;
}

export default function config(config: configAnotherback, configCli: configAnotherbackCli | false): void;