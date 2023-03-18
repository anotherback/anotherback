import { FastifyListenOptions, FastifyRequest, FastifyReply, HTTPMethods, FastifyRegister } from "fastify";
import { FastifyInstance } from "fastify/types/instance"
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { AccessCtx, CheckerCtx, RequestCtx } from "./ctx";

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

export type createAccessFnc = (this: AccessCtx, req: FastifyRequest) => void;

export type createCheckerObj<R> = {
	[key: string]: (req: FastifyRequest) => R;
}
export type createCheckerFnc<R> = (this: CheckerCtx, arg: R) => void;

export type register = (reg: reg, hook: FastifyInstance["addHook"]) => void;
type reg = (obj: requestDescribe) => (fnc: (this: RequestCtx, req: FastifyRequest, res: FastifyReply) => void) => void;

export type fastifyRegister = (fastReg: FastifyRegister) => void;

type senderObjReturn = {code?: number, info?: string, data?: any}
export type createSenderFnc = (res: FastifyReply, info?: string, data?: any) => (senderObjReturn | undefined) | Promise<senderObjReturn | undefined>;

export type createMethodFnc = (...args: any) => any | Promise<any>;

export default class Anotherback{
    static readonly app: FastifyInstance;

    static init(): void;

    static listenCallback: FastifyInstance["listen"];

    static listenParams: FastifyListenOptions;

    static registerParamsCookie: FastifyCookieOptions;

    static registerParamsCors: FastifyCorsOptions;

    static prefix: string;

	static createAccess(name: string, fnc: createAccessFnc): void;

    static createChecker<R extends {}>(name: string, launchers:createCheckerObj<R>, fnc: createCheckerFnc<R>): void;
	
	static createSender(name: string, fnc: createSenderFnc): void;

	static createMethod(name: string, fnc: createMethodFnc): void;
	
	static setNotFoundSender(fnc: createSenderFnc): void;

    static register(fnc: register, obj: registerDescribe): void;

    static fastifyRegister(fnc: fastifyRegister): void;
}