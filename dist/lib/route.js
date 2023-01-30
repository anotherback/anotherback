import Anotherback from "./anotherback.js";
import pathCorrector from "./pathCorrector.js";
import Tool from "./tool.js";

export default class Route{
	constructor(app, options){
		this.#app = app;
		this.#options = options || this.#options;
	}

	register(obj){
		const params = {
			path: pathCorrector(Anotherback.prefix, this.#options.prefix, obj.path),
			method: obj.method,
			checkers: (() => {
				const checkers = [];
				for(const checker of [...(obj.checkers || []), ...(this.#options.checkers || [])].sort()){
					checkers.push(Anotherback.snack.checkers[checker.split("/").pop()]);
				}
				return checkers;
			})(),
			access: Anotherback.snack.accesses[obj.access || ""],
			regAccess: Anotherback.snack.accesses[(obj.ignoreRegisterAccess === true? "" : (this.#options.access || ""))],
		};

		return fnc => {
			this.#app.route({
				url: params.path,
				method: params.method,
				async handler(req, res){
					const tools = new Tool(req, res);
					switch (await (async () => {
						let regAccessResult = await params.regAccess(req, res, tools.accessBox);
						if(regAccessResult !== true)return regAccessResult;

						let accessResult = await params.access(req, res, tools.accessBox);
						if(accessResult !== true)return accessResult;

						for(const checker of params.checkers){
							let checkerResult = await checker(req, res, tools.checkerBox);
							if(checkerResult !== true)return checkerResult;
						}

						return true;
					})()) {
					case true:
						await fnc(req, res, tools.requestBox);
						break;

					case false:
						res.status(403).send("forbidden");
						break;
					}
				}
			});
		};
	}

	#options = {
		access: "",
		checkers: [],
		prefix: "",
	};

	#app = undefined;
}
