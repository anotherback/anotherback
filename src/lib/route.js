import Anotherback from "./anotherback.js";
import pathCorrector from "./pathCorrector.js";
import Ctx from "./ctx.js";
import Sender from "./sender.js";
import Joi from "joi";

export default class Route{
	constructor(app, options){
		this.#app = app;
		this.#options = options || this.#options;
	}

	register(obj){
		obj.path = obj.path || "";
		obj.path = pathCorrector(Anotherback.prefix, obj.ignoreRegisterPrefix === true ? "" : this.#options.prefix, obj.path);
		obj.method = obj.method || "GET";
		obj.checkers = obj.checkers || [];
		obj.access = obj.access || "";
		obj.regAccess = obj.ignoreRegisterAccess === true ? "" : this.#options.access;

		if(obj.schema !== undefined && joi_schema.validate(obj.schema).error !== undefined){
			throw new Error(`Schema in the route "${obj.method}:${obj.path}" is incorrect.`);
		}

		if(Anotherback.snack.accesses[obj.access] === undefined){
			throw new Error(`Route "${obj.method}:${obj.path}" uses access "${obj.access}" but it does not exist.`);
		}
		
		if(Anotherback.snack.accesses[obj.regAccess] === undefined){
			throw new Error(`Register of "${obj.method}:${obj.path}" uses access "${obj.access}" but it does not exist.`);
		}

		const params = {
			path: obj.path,
			method: obj.method,
			access: Anotherback.snack.accesses[obj.access],
			regAccess: Anotherback.snack.accesses[obj.regAccess],
			checkers: getChecker(obj.checkers, (checkerName, ckeckerLauncher) => {
				if(ckeckerLauncher === undefined) throw new Error(`Route "${obj.method}:${obj.path}" uses checker "${checkerName}" but it does not exist.`);
				else throw new Error(`Route "${obj.method}:${obj.path}" uses launcher "${ckeckerLauncher}" of checker "${checkerName}" but it does not exist.`);
			}),
			schema: getSchema(obj.schema, (schemaName, key, loc) => {
				throw new Error(`Route "${obj.method}:${obj.path}" uses schema "${schemaName}" to check ${loc} "${key}" but it does not exist.`);
			},
			(checkerName, ckeckerLauncher) => {
				if(ckeckerLauncher === undefined) throw new Error(`Route "${obj.method}:${obj.path}" uses checker "${checkerName}" but it does not exist.`);
				else throw new Error(`Route "${obj.method}:${obj.path}" uses launcher "${ckeckerLauncher}" of checker "${checkerName}" but it does not exist.`);
			})
		};

		return fnc => {
			Route.routes.push([params, fnc]);
			this.#app.route(
				{
					url: params.path,
					method: params.method,
					async handler(req, res){
						const ctx = new Ctx(req, res);

						try {
							await params.regAccess.call(ctx.access, req);

							await params.access.call(ctx.access, req);

							for(const loc of params.schema.keys){
								for(const obj of params.schema[loc]){
									let result = obj.schema.validate(req[loc]?.[obj.key]);
									if(result.error !== undefined)obj.error();
									else if(result.value !== undefined){
										ctx.pass.handler(obj.pass, result.value);
										for(const checker of obj.checkers){
											await checker.fnc.call(ctx.checker, checker.launcher(req, (key, value) => ctx.pass.handler(key, value)));
										}
									}
								}
							}

							for(const checker of params.checkers){
								await checker.fnc.call(ctx.checker, checker.launcher(req, (key, value) => ctx.pass.handler(key, value)));
							}

							await fnc.call(ctx.request, req, res);

							throw new Sender();
						}
						catch (error){
							if(error instanceof Sender) await error.exec(res);
							else this.errorHandler(error, req, res);
						}
					}
				}
			);
		};
	}

	#options = {
		access: "",
		prefix: "",
	};

	#app = undefined;

	static routes = [];
}

function getChecker(checkersString, cb){
	const checkers = [];
	for(const checker of checkersString){
		let checkerName = checker.split("<")[0];
		let ckeckerLauncher = checker.split("<")[1] || "default";

		if(Anotherback.snack.checkers[checkerName] === undefined)cb(checkerName);
		if(Anotherback.snack.checkers[checkerName].launchers[ckeckerLauncher] === undefined)cb(checkerName, ckeckerLauncher);

		checkers.push({
			launcher: Anotherback.snack.checkers[checkerName].launchers[ckeckerLauncher],
			fnc: Anotherback.snack.checkers[checkerName].fnc
		});
	}
	return checkers;
}

function getSchema(schemaString, cb, ccb){
	const schema = {};

	for(const loc of Object.keys(schemaString || {})){
		schema[loc] = [];

		for(const [key, value] of Object.entries(schemaString[loc])){
			let s = value;
			s = s.schema || s;
	
			if(Anotherback.snack.schemas[s] === undefined)cb(s, key, loc);
	
			schema[loc].push({
				pass: key.split("?")[0],
				schema: key.endsWith("?") ? Anotherback.snack.schemas[s].schema : Anotherback.snack.schemas[s].schema.required(),
				error: Anotherback.snack.schemas[s].error,
				key: value.key || key.split("?")[0],
				checkers: getChecker(value.checkers || [], ccb),
			});
		}
	}

	schema.keys = Object.keys(schema);

	return schema;
}

const joi_orObj = Joi
.object({
	schema: Joi.string().required(),
	key: Joi.string(),
	checkers: Joi.array().items(Joi.string())
});

const joi_items = Joi
.object()
.pattern(
	/./,
	Joi.alternatives().try(Joi.string(), joi_orObj),
	{fallthrough: true}
);

const joi_schema = Joi
.object({
	params: joi_items,
	body: joi_items,
	query: joi_items,
});
