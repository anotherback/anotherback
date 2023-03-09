import { FastifyListenOptions, FastifyRequest, FastifyReply, HTTPMethods, FastifyRegister } from "fastify";
import { FastifyInstance } from "fastify/types/instance"
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { AccessCtx, CheckerCtx, defaultContext, SenderCtx } from "./ctx";

interface requestDescribe {
    method: HTTPMethods,
    path: string,
    checkers: Array<string>,
    access: string,
    ignoreRegisterAccess: boolean,
}

export interface registerDescribe {
    prefix: string,
    checkers: Array<string>,
    access: string,
}

export type createAccessObj<R> = {
	[key: string]: (req: FastifyRequest) => R;
}
export type createAccessFnc<R> = (this: AccessCtx, ...args: R) => (boolean | undefined) | Promise<(boolean | undefined)>;

export type createCheckerObj<R> = {
	[key: string]: (req: FastifyRequest) => R & [];
}
export type createCheckerFnc<R> = (this: CheckerCtx, ...args: R) => (boolean | undefined) | Promise<(boolean | undefined)>;

export type register = (reg: reg, hook: FastifyInstance["addHook"]) => void;
type reg = (obj: requestDescribe) => (fnc: (this: defaultContext, req: FastifyRequest, res: FastifyReply) => void) => void;

export type fastifyRegister = (fastReg: FastifyRegister) => void;

export type createSenderFnc = (this: SenderCtx, res: FastifyReply, ...args: any) => any;
export type createMethodFnc = (...args: any) => any | Promise<any>;

export default class Anotherback{
    static readonly app: FastifyInstance;

    static init(): void;

    static listenCallback: FastifyInstance["listen"];

    static listenParams: FastifyListenOptions;

    static registerParamsCookie: FastifyCookieOptions;

    static registerParamsCors: FastifyCorsOptions;

    static prefix: string;

	static createAccess<R>(name: string, launchers:createAccessObj<R>, fnc: createAccessFnc<R>): void;

    static createChecker<R>(name: string, launchers:createCheckerObj<R>, fnc: createCheckerFnc<R>): void;
	
	static createSender(name: string, fnc: createSenderFnc): void;

	static createMethod(name: string, fnc: createMethodFnc): void;

    static register(fnc: register, obj: registerDescribe): void;

    static fastifyRegister(fnc: fastifyRegister): void;
}