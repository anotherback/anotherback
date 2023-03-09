import Anotherback from "./anotherback.js";
import Token, {Keys} from "./token.js";

export class Pass{
	state = {};

	handler(key, value){
		if(typeof key === "string" && value === undefined)return structuredClone(this.state[key]);
		else if(typeof key === "string" && value !== undefined)this.state[key] = value;
		else if(typeof key === "object" && value === undefined)this.state = {...this.state, ...key};
		else if(key === undefined && value === undefined)return structuredClone(this.state);
	}
}

export class AccessCtx{
	constructor(req, res, pass){
		this.req = req;
		this.res = res;
		this.#pass = pass;
	}

	req;
	res;
	#pass;
	pass(key, value){
		return this.#pass.handler(key, value);
	}

	otherAccess(name, launcher="default"){
		return Anotherback.snack.accesses[name].fnc.call(this, ...Anotherback.snack.accesses[name].launchers[launcher](this.req));
	}

	static addProperty(name, fnc){
		AccessCtx.prototype[name] = fnc;
	}
	static addGetter(name, fnc){
		Object.defineProperty(
			AccessCtx.prototype,
			name,
			{
				get: fnc,
			}
		);
	}
	static addSetter(name, fnc){
		Object.defineProperty(
			AccessCtx.prototype,
			name,
			{
				set: fnc
			}
		);
	}
}

export class CheckerCtx{
	constructor(req, res, pass){
		this.req = req;
		this.res = res;
		this.#pass = pass;
	}

	req;
	res;
	#pass;
	pass(key, value){
		return this.#pass.handler(key, value);
	}

	otherChecker(name, launcher="default"){
		return Anotherback.snack.checkers[name].fnc.call(this, ...Anotherback.snack.checkers[name].launchers[launcher](this.req));
	}

	static addProperty(name, fnc){
		CheckerCtx.prototype[name] = fnc;
	}
	static addGetter(name, fnc){
		Object.defineProperty(
			CheckerCtx.prototype,
			name,
			{
				get: fnc,
			}
		);
	}
	static addSetter(name, fnc){
		Object.defineProperty(
			CheckerCtx.prototype,
			name,
			{
				set: fnc
			}
		);
	}
}

export class RequestCtx{
	constructor(req, res, pass){
		this.req = req;
		this.res = res;
		this.#pass = pass;
	}

	req;
	res;
	#pass;
	pass(key, value){
		return this.#pass.handler(key, value);
	}

	static addProperty(name, fnc){
		RequestCtx.prototype[name] = fnc;
	}
	static addGetter(name, fnc){
		Object.defineProperty(
			RequestCtx.prototype,
			name,
			{
				get: fnc,
			}
		);
	}
	static addSetter(name, fnc){
		Object.defineProperty(
			RequestCtx.prototype,
			name,
			{
				set: fnc
			}
		);
	}
}

export class SenderCtx{
	constructor(req, res){
		this.req = req;
		this.res = res;
	}

	successful(){
		this.res.status(this.#code).send({data: this.#data, info: this.#info, status: "successful"});
	}

	error(){
		this.res.status(this.#code).send({data: this.#data, info: this.#info, status: "error"});
	}

	redirect(url){
		this.res.status(this.#code).send({url, info: this.#info, status: "redirect"});
	}

	code(code){
		if(code !== undefined)this.#code = code;
		else return this.#code;
	}

	info(info){
		if(info !== undefined)this.#info = info;
		else return this.#info;
	}

	data(data){
		if(data !== undefined)this.#data = data;
		else return this.#data;
	}

	#code = 200;
	#info = "";
	#data = {};

	req;
	res;

	static addProperty(name, fnc){
		SenderCtx.prototype[name] = fnc;
	}
	static addGetter(name, fnc){
		Object.defineProperty(
			SenderCtx.prototype,
			name,
			{
				get: fnc,
			}
		);
	}
	static addSetter(name, fnc){
		Object.defineProperty(
			SenderCtx.prototype,
			name,
			{
				set: fnc
			}
		);
	}
}

export default class Ctx{
	constructor(req, res){
		this.req = req;
		this.res = res;
		this.pass = new Pass();
	}

	req;
	res;
	pass;

	#access;
	#checker;
	#request;

	get access(){
		if(this.#access === undefined)this.#access = new AccessCtx(this.req, this.res, this.pass);
		return this.#access;
	}

	get checker(){
		if(this.#checker === undefined)this.#checker = new CheckerCtx(this.req, this.res, this.pass);
		return this.#checker;
	}

	get request(){
		if(this.#request === undefined)this.#request = new RequestCtx(this.req, this.res, this.pass);
		return this.#request;
	}
}

function defaultConfig(context){
	context.addProperty(
		"sender",
		function(index, ...args){
			Anotherback.snack.senders[index].call(
				new SenderCtx(this.req, this.res),
				this.res,
				...args
			);
		}
	);

	context.addProperty(
		"method",
		(index, ...args) => Anotherback.snack.methods[index](...args)
	);

	context.addGetter(
		"token",
		function(){
			return {
				generate: (nameKey, info) => {
					let token = Token.generate(nameKey, info);
					this.res.setCookie(nameKey, token, Keys.get(nameKey).options.cookie);
					this.req.cookies[nameKey] = token;
				},
				verify: (nameKey) => {
					if(!this.req.cookies[nameKey])return null;
					return Token.verify(this.req.cookies[nameKey], nameKey);
				},
				read: (nameKey) => {
					if(!this.req.cookies[nameKey])return null;
					return Token.read(this.req.cookies[nameKey], nameKey);
				},
				refresh: (nameKey) => {
					if(!this.req.cookies[nameKey])throw new Error("");
					let token = Token.refresh(this.req.cookies[nameKey], nameKey);
					this.res.setCookie(nameKey, token, Keys.get(nameKey).options.cookie);
					this.req.cookies[nameKey] = token;
				},
				delete: (nameKey) => {
					if(!this.req.cookies[nameKey])throw new Error("");
					this.res.clearCookie(nameKey);
					delete this.req.cookies[nameKey];
				}
			};
		}
	);
}

defaultConfig(AccessCtx);
defaultConfig(CheckerCtx);
defaultConfig(RequestCtx);
