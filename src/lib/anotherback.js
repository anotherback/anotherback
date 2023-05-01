import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import sttc from "@fastify/static";
import Route from "./route.js";
import Sender from "./sender.js";
import pathCorrector from "./pathCorrector.js";
import {resolve} from "path";
import {override} from "./debug/override.js";
import {checkUpstreamError} from "./debug/upstream.js";

export default class Anotherback{
	static app = undefined;

	static snack = {
		accesses: {
			"": () => undefined
		},

		schemas: {},

		checkers: {
			"": {
				launchers: {default: () => undefined},
				fnc: () => undefined
			}
		},

		methods: {

		},

		handlers: {

		},

		senders: {

		},

		register: [],
	};

	static createAccess(name, fnc){
		this.snack.accesses[name] = fnc;
	}

	static createSchema(name, schema, fnc){
		this.snack.schemas[name] = {
			schema,
			error: () => fnc((index, info, data) => {
				throw (
					this.snack.senders[index]?.init(info, data) || 
					new Sender(() => ({code: 400, info: "SCHEMA_ERROR"}))
				);
			}),
		};
	}

	static createChecker(name, launchers, fnc){
		this.snack.checkers[name] = {launchers, fnc};
	}

	static createMethod(name, fnc){
		this.snack.methods[name] = fnc;
	}

	static createHandler(name, fnc){
		this.snack.handlers[name] = fnc;
	}

	static createSender(name, fnc){
		this.snack.senders[name] = new Sender(fnc);
	}

	static async register(options, fnc){
		this.snack.register.push(async(app) => {
			const route = new Route(app, options);
			await fnc((...args) => route.register(...args), (...args) => this.app.addHook(...args));
		});
	}

	static setNotFoundSender(fnc){
		this.#notFoundSender = fnc;
	}
	static #notFoundSender = (res, info, data) => ({info, data: `Route '${data.method}:${data.url}' not found.`});

	static setErrorSender(fnc){
		this.#errorSender = fnc;
	}
	static #errorSender = (res, info, error) => ({info, data: error});

	static async init(){
		this.app = fastify();

		this.app.setNotFoundHandler(async(req, res) => {
			let result = await this.#notFoundSender(res, "NOT_FOUND", {method: req.method, url: req.url});
			if(result !== undefined){
				res.header("aob-info", result.info || undefined);
				res.status(404).send(result.data || undefined);
			}
		});
		this.app.setErrorHandler(async(error, req, res) => {
			console.error(error);
			let result = await this.#errorSender(res, "ERROR", error);
			if(result !== undefined){
				res.header("aob-info", result.info || undefined);
				res.status(500).send({ERROR: result.data});
			}
		});

		if(this.debug === true || (typeof this.debug === "object" && this.debug.override === true))override();

		await this.app.register(cookie, {hook: "onRequest", ...this.#registerParamsCookie});

		await this.app.register(cors, {credentials: true, ...this.#registerParamsCors, exposedHeaders: ["aob-info", ...(this.#registerParamsCors.exposedHeaders || [])]});

		if(this.#registerParamsStatic !== false) await this.app.register(sttc, {...this.#registerParamsStatic, prefix: pathCorrector(this.prefix, this.#registerParamsStatic.prefix), root: resolve(this.#registerParamsStatic.root)});

		for(const reg of this.snack.register) await this.app.register(reg);
		
		if(this.debug === true || (typeof this.debug === "object" && this.debug.upstream === true))checkUpstreamError();

		this.app.listen({port: 80, ...this.#listenParams}, this.#listenCallback);
	}

	static #listenParams = {};
	static get listenParams(){
		return this.#listenParams;
	}
	static set listenParams(arg){
		if(typeof arg !== "object") throw new Error("ListenParams must be an object.");
		this.#listenParams = arg;
	}
	static #listenCallback = () => {
		console.log("ready");
	};
	static listenCallback(fnc){
		if(typeof fnc !== "function") throw new Error("ListenCallback must be a function.");
		this.#listenCallback = fnc;
	}

	static #registerParamsCookie = {};
	static get registerParamsCookie(){
		return this.#registerParamsCookie;
	}
	static set registerParamsCookie(arg){
		if(typeof arg !== "object") throw new Error("RegisterParamsCookie must be an object.");
		this.#registerParamsCookie = arg;
	}

	static #registerParamsCors = {};
	static get registerParamsCors(){
		return this.#registerParamsCors;
	}
	static set registerParamsCors(arg){
		if(typeof arg !== "object") throw new Error("RegisterParamsCors must be an object.");
		this.#registerParamsCors = arg;
	}

	static #registerParamsStatic = false;
	static get registerParamsStatic(){
		return this.#registerParamsStatic;
	}
	static set registerParamsStatic(arg){
		if(arg === true) arg = {root: "public", prefix: "public"};
		if(typeof arg !== "object" && arg !== false) throw new Error("RegisterParamsStatic must be an object or boolean.");
		if(typeof arg === "object" && (arg.prefix === undefined || arg.root === undefined)) throw new Error("RegisterParamsStatic must have the properties prefix and root");
		this.#registerParamsStatic = arg;
	}

	static async fastifyRegister(fnc){
		await fnc((...args) => this.app.register(...args));
	}

	static prefix = "";

	static #debug = false;
	static get debug(){
		return this.#debug;
	}
	static set debug(arg){
		if(typeof arg !== "object" && typeof arg !== "boolean") throw new Error("debug must be an object or boolean.");
		this.#debug = arg;
	}
}
