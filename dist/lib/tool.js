import Anotherback from "./anotherback.js";
import Token, { Keys } from "./token.js";

export default class Tool{
	constructor(req, res){
		this.req = req;
		this.res = res;
	}

	successful(data={}){
		this.res.status(this.status).send({data: {...data, ...this.#data}, info: this.info, status: "successful"});
	}

	error(data={}){
		this.res.status(this.status).send({data: {...data, ...this.#data}, info: this.info, status: "error"});
	}

	redirect(url){
		this.res.status(this.status).send({url, info: this.info, status: "redirect"});
	}

	get token(){
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

	method(name, ...args){
		return Tool.methods[name](this.req, this.res, this, ...args);
	}

	sender(name, ...args){
		Tool.senders[name](this.res, this, ...args);
	}

	status = 200;
	info = undefined;
	#data = {};
	data(key, value){
		if(key === undefined)return this.#data;
		else if(value === undefined)return this.#data[key];
		this.#data[key] = value;
	}
	#pass = {};
	pass(key, value){
		if(key === undefined)return this.#pass;
		if(key === null && typeof value === "object"){
			this.#pass = {...this.#pass, ...value};
			return;
		}
		else if(value === undefined)return this.#pass[key];
		this.#pass[key] = value;
	}

	otherAccess(name){
		return Anotherback.snack.accesses[name](this.req, this.res, this.accessBox);
	}

	otherChecker(name){
		return Anotherback.snack.checkers[name](this.req, this.res, this.checkerBox);
	}

	req = undefined;
	res = undefined;

	get accessBox(){
		const that = this;

		return {
			get otherAccess(){
				return (...args) => that.otherAccess(...args);
			},
			get e(){
				return (...args) => that.error(...args);
			},
			get r(){
				return (...args) => that.redirect(...args);
			},
			get t(){
				return that.token;
			},
			get status(){
				return that.status;
			},
			set status(arg){
				that.status = arg;
			},
			get info(){
				return that.info;
			},
			set info(arg){
				that.info = arg;
			},
			get data(){
				return (...args) => that.data(...args);
			},
			get pass(){
				return (...args) => that.pass(...args);
			},
			get method(){
				return (...args) => that.method(...args);
			},
			get sender(){
				return (...args) => that.sender(...args);
			},
			get box(){
				return that;
			}
		};
	}

	get checkerBox(){
		const that = this;

		return {
			get otherChecker(){
				return (...args) => that.otherChecker(...args);
			},
			get e(){
				return (...args) => that.error(...args);
			},
			get t(){
				return that.token;
			},
			get status(){
				return that.status;
			},
			set status(arg){
				that.status = arg;
			},
			get info(){
				return that.info;
			},
			set info(arg){
				that.info = arg;
			},
			get data(){
				return (...args) => that.data(...args);
			},
			get pass(){
				return (...args) => that.pass(...args);
			},
			get method(){
				return (...args) => that.method(...args);
			},
			get sender(){
				return (...args) => that.sender(...args);
			},
			get box(){
				return that;
			}
		};
	}

	get requestBox(){
		const that = this;

		return {
			get s(){
				return (...args) => that.successful(...args);
			},
			get e(){
				return (...args) => that.error(...args);
			},
			get r(){
				return (...args) => that.redirect(...args);
			},
			get t(){
				return that.token;
			},
			get status(){
				return that.status;
			},
			set status(arg){
				that.status = arg;
			},
			get info(){
				return that.info;
			},
			set info(arg){
				that.info = arg;
			},
			get data(){
				return (...args) => that.data(...args);
			},
			get pass(){
				return (...args) => that.pass(...args);
			},
			get method(){
				return (...args) => that.method(...args);
			},
			get sender(){
				return (...args) => that.sender(...args);
			},
			get box(){
				return that;
			}
		};
	}

	static #methods = {};
	static get methods(){
		return this.#methods;
	}
	static addMethod(name, fnc){
		if(typeof fnc !== "function")throw new Error("");
		this.#methods[name] = fnc;
	}

	static #senders = {};
	static get senders(){
		return this.#senders;
	}
	static addSender(name, fnc){
		if(typeof fnc !== "function")throw new Error("");
		this.#senders[name] = fnc;
	}
}
