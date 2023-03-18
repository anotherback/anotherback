import fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import Route from "./route.js";
import Sender from "./sender.js";

export default class Anotherback{
	static app = fastify();

	static snack = {
		accesses: {
			"": () => undefined
		},

		checkers: {
			"": {
				launchers: {default: () => undefined},
				fnc: () => undefined
			}
		},

		methods: {

		}, 

		senders: {

		}
	};

	static createAccess(name, fnc){
		this.snack.accesses[name] = fnc;
	}

	static createChecker(name, launchers, fnc){
		this.snack.checkers[name] = {launchers, fnc};
	}

	static createMethod(name, fnc){
		this.snack.methods[name] = fnc;
	}

	static createSender(name, fnc){
		this.snack.senders[name] = new Sender(fnc);
	}

	static async register(fnc, options){
		if(this.#firstRegisterIsDone === false) this.#firstRegister();
		
		await this.app.register(async(app) => {
			const route = new Route(app, options);
			await fnc((...args) => route.register(...args), (...args) => this.app.addHook(...args));
		});
	}

	static setNotFoundSender(fnc){
		this.#notFoundSender = fnc;
	}
	static #notFoundSender = (res, info, data) => ({code: 404, info, data: `Route '${data.method}:${data.url}' not found.`});

	static init(){
		if(this.#firstRegisterIsDone === false) this.#firstRegister();
		
		this.app.listen({port: 80, ...this.#listenParams}, this.#listenCallback);
	}

	static #listenParams = {};
	static get listenParams(){
		return this.#listenParams;
	}
	static set listenParams(arg){
		if(typeof arg !== "object") throw new Error("");
		this.#listenParams = arg;
	}
	static #listenCallback = () => {
		console.log("ready");
	};
	static listenCallback(fnc){
		if(typeof fnc !== "function") throw new Error("");
		this.#listenCallback = fnc;
	}

	static #registerParamsCookie = {};
	static get registerParamsCookie(){
		return this.#registerParamsCookie;
	}
	static set registerParamsCookie(arg){
		if(typeof arg !== "object") throw new Error("");
		this.#registerParamsCookie = arg;
	}

	static #registerParamsCors = {};
	static get registerParamsCors(){
		return this.#registerParamsCors;
	}
	static set registerParamsCors(arg){
		if(typeof arg !== "object") throw new Error("");
		this.#registerParamsCors = arg;
	}

	static async fastifyRegister(fnc){
		await fnc((...args) => this.app.register(...args));
	}

	static #firstRegister(){
		this.#firstRegisterIsDone = true;

		this.app.register(cookie, {hook: "onRequest", ...this.#registerParamsCookie});
		this.app.register(cors, {credentials: true, ...this.#registerParamsCors});
	}
	static #firstRegisterIsDone = false;

	static prefix = "";

	static {
		this.app.addHook("onError", (req, res, err) => {
			console.error(err);
		});
		this.app.setNotFoundHandler(async(req, res) => {
			let result = await this.#notFoundSender(res, "NOTFOUND", {method: req.method, url: req.url});
			if(result !== undefined)res.status(result.code || 404).send({i: result.info, d: result.data});
		});
	}
}