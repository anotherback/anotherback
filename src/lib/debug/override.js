import {resolve} from "path";
import Anotherback from "../anotherback.js";
import Ctx, {CheckerCtx, RequestCtx, AccessCtx, Pass} from "../ctx.js";
import Route from "../route.js";
import Sender from "../sender.js";
import fs from "fs";

function createStep(type, name){
	return {
		type,
		name,
		steps: []
	};
}

function defaultConfig(context){
	context.addProperty(
		"sender",
		function(index, info, data){
			this.trackRequest[0].steps.push({type: "sender", name: index, info});
			if(Anotherback.snack.senders[index] === undefined) throw new Error(`Sender ${index} don't exist.`);
			throw Anotherback.snack.senders[index].init(info, data);
		}
	);

	context.addProperty(
		"method",
		function(index, ...args){
			try {
				this.trackRequest.unshift(createStep("method", index));
				this.trackRequest[1].steps.push(this.trackRequest[0]);
				if(Anotherback.snack.methods[index] === undefined) throw new Error(`Method ${index} don't exist.`);
				return Anotherback.snack.methods[index].call({method: this.method, trackRequest: this.trackRequest}, ...args);
			}
			finally {
				this.trackRequest.shift();
			}
			
		}
	);

	context.addProperty(
		"schema",
		function(index, value){
			this.trackRequest[0].steps.push({type: "ctxSchema", name: index, value});
			if(Anotherback.snack.schemas[index] === undefined) throw new Error(`Schema ${index} don't exist.`);
			return Anotherback.snack.schemas[index].schema.validate(value);
		}
	);
}

export function override(app){
	Anotherback.registerParamsCors = {
		...Anotherback.registerParamsCors,
		exposedHeaders: [...(Anotherback.registerParamsCors.exposedHeaders, []), "aob-track-request"]
	};
	
	if(fs.existsSync(resolve("debug.txt")))fs.unlinkSync(resolve("debug.txt"));
	const debugFile = fs.createWriteStream(resolve("debug.txt"));

	defaultConfig(AccessCtx);
	defaultConfig(CheckerCtx);
	defaultConfig(RequestCtx);

	Pass.prototype._handler = Pass.prototype.handler;
	Pass.prototype.handler = function(key, value){
		let result = this._handler(key, value);
		if(result !== undefined) this.addStep(key, result, "get");
		else this.addStep(key, value, "post");
		return result;
	};

	AccessCtx.prototype._otherAccess = AccessCtx.prototype.otherAccess;
	AccessCtx.prototype.otherAccess = function(name, exec){
		try {
			this.trackRequest.unshift(createStep("otherAccess", name));
			this.trackRequest[1].steps.push(this.trackRequest[0]);
			if(Anotherback.snack.accesses[name] === undefined) throw new Error(`Access ${name} don't exist.`);
			return this._otherAccess(name, exec);
		}
		finally {
			this.trackRequest.shift();
		}
	};
	

	Route.prototype.handler = function handler(fnc, params, paramsName){
		this.app.route(
			{
				url: params.path,
				method: params.method,
				async handler(req, res){
					const ctx = new Ctx(req, res);
					ctx.stepRequest = createStep("request");
					ctx.trackRequest = [ctx.stepRequest];
					ctx.pass.addStep = (key, value, action) => ctx.trackRequest[0].steps.push({
						type: "pass", 
						key, 
						value, 
						action
					});
					ctx.access.trackRequest = ctx.trackRequest;
					ctx.checker.trackRequest = ctx.trackRequest;
					ctx.request.trackRequest = ctx.trackRequest;

					try {
						ctx.trackRequest.unshift(createStep("regAccess", paramsName.RegAccess));
						ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
						await params.regAccess.call(ctx.access, req);
						ctx.trackRequest.shift();

						ctx.trackRequest.unshift(createStep("access", paramsName.access));
						ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
						await params.access.call(ctx.access, req);
						ctx.trackRequest.shift();
						
						for(const [key, checker] of Object.entries(params.beforeCheckers)){
							ctx.trackRequest.unshift(createStep("beforeCheckers", paramsName.beforeCheckers[key]));
							ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
							await checker.fnc.call(ctx.checker, checker.launcher(req, (key, value) => ctx.pass.handler(key, value)));
							ctx.trackRequest.shift();
						}

						
						for(const loc of params.schema.keys){
							for(const [keySchema, obj] of Object.entries(params.schema[loc])){
								ctx.trackRequest.unshift(createStep("schema", obj.pass));
								ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
								let result = obj.schema.validate(req[loc]?.[obj.key]);
								if(result.error !== undefined){
									ctx.trackRequest[0].steps.push({type: "sender", invalided: result.value});
									obj.error();
								}
								else if(result.value !== undefined){
									ctx.pass.handler(obj.pass, result.value);
									for(const [key, checker] of Object.entries(obj.checkers)){
										ctx.trackRequest.unshift(createStep("schemaChecker", Object.entries(paramsName.schema[loc])[keySchema][1].checkers[key]));
										ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
										await checker.fnc.call(ctx.checker, checker.launcher(req, (key, value) => ctx.pass.handler(key, value)));
										ctx.trackRequest.shift();
									}
								}
								ctx.trackRequest.shift();
							}
						}
						

						for(const [key, checker] of Object.entries(params.checkers)){
							ctx.trackRequest.unshift(createStep("checkers", paramsName.checkers[key]));
							ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
							await checker.fnc.call(ctx.checker, checker.launcher(req, (key, value) => ctx.pass.handler(key, value)));
							ctx.trackRequest.shift();
						}

						ctx.trackRequest.unshift(createStep("handler"));
						ctx.trackRequest[1].steps.push(ctx.trackRequest[0]);
						await fnc.call(ctx.request, req, res);
						ctx.trackRequest.shift();

						throw new Sender();
					}
					catch (error){
						let debugId = Date.now() + "-" + Math.random();
						res.header("aob-track-request", debugId);
						(async() => {
							debugFile.write(debugId + "\n" + JSON.stringify(ctx.stepRequest, null, 4) + "\n");
						})();
						if(error instanceof Sender) await error.exec(res);
						else this.errorHandler(error, req, res);
					}
				}
			}
		);
	};
		
}
