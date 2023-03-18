import Anotherback from "./anotherback.js";
import pathCorrector from "./pathCorrector.js";
import Ctx from "./ctx.js";
import Sender from "./sender.js";

export default class Route{
	constructor(app, options){
		this.#app = app;
		this.#options = options || this.#options;
	}

	register(obj){
		obj.path = obj.path || "";
		obj.method = obj.method || "GET";
		obj.checkers = obj.checkers || [];
		obj.access = obj.access || "";
		obj.regAccess = obj.ignoreRegisterAccess === true ? "" : this.#options.access;
		
		const params = {
			path: pathCorrector(Anotherback.prefix, this.#options.prefix, obj.path),
			method: obj.method,
			access: Anotherback.snack.accesses[obj.access],
			regAccess: Anotherback.snack.accesses[obj.regAccess],
			checkers: (() => {
				const checkers = [];
				for(const checker of obj.checkers){
					let checkerName = checker.split("<")[0];
					let ckeckerLauncher = checker.split("<")[1] || "default";

					if(Anotherback.snack.checkers[checkerName] === undefined) continue;

					checkers.push({
						launcher: Anotherback.snack.checkers[checkerName].launchers[ckeckerLauncher],
						fnc: Anotherback.snack.checkers[checkerName].fnc
					});
				}
				return checkers;
			})(),
		};

		return fnc => {
			this.#app.route(
				{
					url: params.path,
					method: params.method,
					async handler(req, res){
						const ctx = new Ctx(req, res);

						try {
							await params.regAccess.call(ctx.access, req);

							await params.access.call(ctx.access, req);

							for(const checker of params.checkers){
								await checker.fnc.call(ctx.checker, checker.launcher(req));
							}

							await fnc.call(ctx.request, req, res);

							throw new Sender();
						}
						catch (error){
							if(error instanceof Sender) await error.exec(res);
							
							else {
								res.status(500).send({
									i: "ERROR", 
									d: error.stack
								});
							}
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
}