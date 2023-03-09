import Anotherback from "./anotherback.js";
import pathCorrector from "./pathCorrector.js";
import Ctx from "./ctx.js";

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
		obj.regAccess = obj.regAccess || "";

		const params = {
			path: pathCorrector(Anotherback.prefix, this.#options.prefix, obj.path),
			method: obj.method,
			checkers: (() => {
				const checkers = [];
				for(const checker of obj.checkers){
					let checkerName = checker.split("<")[0];
					let ckeckerLauncher = checker.split("<")[1] || "default";

					if(Anotherback.snack.checkers[checkerName] === undefined)continue;

					checkers.push({
						launcher: Anotherback.snack.checkers[checkerName].launchers[ckeckerLauncher],
						fnc: Anotherback.snack.checkers[checkerName].fnc
					});
				}
				return checkers;
			})(),
			access: (() => {
				let accessName = obj.access.split("<")[0];
				let accessLauncher = obj.access.split("<")[1] || "default";

				return {
					launcher: Anotherback.snack.accesses[accessName].launchers[accessLauncher],
					fnc: Anotherback.snack.accesses[accessName].fnc
				};
			})(),
			regAccess: (() => {
				let accessName = this.#options.access.split("<")[0];
				let accessLauncher = this.#options.access.split("<")[1] || "default";

				if(obj.ignoreRegisterAccess === true){
					accessName = "";
					accessLauncher = "default";
				}

				return {
					launcher: Anotherback.snack.accesses[accessName].launchers[accessLauncher],
					fnc: Anotherback.snack.accesses[accessName].fnc
				};
			})(),
		};

		return fnc => {
			this.#app.route(
				{
					url: params.path,
					method: params.method,
					async handler(req, res){
						const ctx = new Ctx(req, res);

						if(await params.regAccess.fnc.call(ctx.access, ...params.regAccess.launcher(req)) !== true)return;

						if(await params.access.fnc.call(ctx.access, ...params.access.launcher(req)) !== true)return;

						for(const checker of params.checkers){
							if(await checker.fnc.call(ctx.checker, ...checker.launcher(req)) !== true)return;
						}

						await fnc.call(ctx.request, req, res);
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
