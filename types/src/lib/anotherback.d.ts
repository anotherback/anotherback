import { FastifyListenOptions, FastifyRequest, FastifyReply, HTTPMethods, FastifyRegister } from "fastify";
import { FastifyInstance } from "fastify/types/instance"
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { AccessCtx, CheckerCtx, MethodCtx, RequestCtx } from "./ctx";
import Joi from "joi";


type exactSchema = {
	[key: string]: string | {
		schema: string,
		key: string,
	}
}

interface requestDescribe {
    method: HTTPMethods,
    path: string,
    checkers: Array<string>,
    access: string,
	schema: {
		params: exactSchema,
		body: exactSchema,
		query: exactSchema,
	},
    ignoreRegisterAccess: boolean,
	ignoreRegisterPrefix: boolean,
}

export interface registerDescribe {
    prefix: string,
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

export type createMethodFnc = (this: MethodCtx, ...args: any) => any | Promise<any>;

export type schemaErrorFnc = (sender: CheckerCtx["sender"]) => void;

export default class Anotherback{
    static readonly app: FastifyInstance;

    static async init(): void;

    static listenCallback: FastifyInstance["listen"];

    static listenParams: FastifyListenOptions;

    static registerParamsCookie: FastifyCookieOptions;

    static registerParamsCors: FastifyCorsOptions;

    static prefix: string;

	static createAccess(name: string, fnc: createAccessFnc): void;

	static createSchema(name: string, schema: Joi.AnySchema, fnc: schemaErrorFnc): void;

    static createChecker<R extends {}>(name: string, launchers:createCheckerObj<R>, fnc: createCheckerFnc<R>): void;
	
	static createSender(name: string, fnc: createSenderFnc): void;

	static createMethod(name: string, fnc: createMethodFnc): void;
	
	static setNotFoundSender(fnc: createSenderFnc): void;

	static setErrorSender(fnc: createSenderFnc): void;

    static register(obj: registerDescribe, fnc: register): void;

    static fastifyRegister(fnc: fastifyRegister): void;
}