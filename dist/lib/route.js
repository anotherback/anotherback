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
			this.#app.route(
				{
					url: params.path,
					method: params.method,
					async handler(req, res){
						const tools = new Tool(req, res);

						if(await params.regAccess(req, res, tools.accessBox) !== true)return;

						if(await params.access(req, res, tools.accessBox) !== true)return;

						for(const checker of params.checkers){
							if(await checker(req, res, tools.checkerBox) !== true)return;
						}

						await fnc(req, res, tools.requestBox);
					}
				}
			);
		};
	}

	#options = {
		access: "",
		checkers: [],
		prefix: "",
	};

	#app = undefined;
}
