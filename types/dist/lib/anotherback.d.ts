import { FastifyListenOptions, FastifyRequest, FastifyReply, HTTPMethods, FastifyRegister } from "fastify";
import { FastifyInstance } from "fastify/types/instance"
import { FastifyCookieOptions } from "@fastify/cookie";
import { FastifyCorsOptions } from "@fastify/cors";
import { toolAccess, toolChecker, toolRequest } from "./tool";

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

export type createAccessFnc = (req: FastifyRequest, res: FastifyReply, tools: toolAccess) => (boolean | undefined) | Promise<(boolean | undefined)>;
export type createCheckerFnc = (req: FastifyRequest, res: FastifyReply, tools: toolChecker) => (boolean | undefined) | Promise<(boolean | undefined)>;

export type register = (reg: reg, hook: FastifyInstance["addHook"] ) => void;
type reg = (obj: requestDescribe) => (fnc: (req: FastifyRequest, res: FastifyReply, tools: toolRequest) => void) => void;

export type fastifyRegister = (fastReg: FastifyRegister) => void;

export default class Anotherback{
    static readonly app: FastifyInstance;

    static init(): void;

    static listenCallback: FastifyInstance["listen"];

    static listenParams: FastifyListenOptions;

    static registerParamsCookie: FastifyCookieOptions;

    static registerParamsCors: FastifyCorsOptions;

    static prefix: string;

    static createAccess(name: string, fnc: createCheckerFnc): void;

    static createChecker(name: string, fnc: createAccessFnc): void;

    static register(fnc: register, obj: registerDescribe): void;

    static fastifyRegister(fnc: fastifyRegister): void;
}