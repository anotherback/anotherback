import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import fs from "fs";

export class Models{
	static #main = resolve(dirname(fileURLToPath(import.meta.url)), "models");
	static get main(){
		return this.#main;
	}

	static access = this.main + "/access.js";

	static checker = this.main + "/checker.js";

	static register = this.main + "/register.js";

	static token = this.main + "/token.js";

	static notfound = this.main + "/notfound.js";

	static error = this.main + "/error.js";

	static method = this.main + "/method.js";

	static handler = this.main + "/handler.js";

	static sender = this.main + "/sender.js";

	static schema = this.main + "/schema.js";	

	static env = this.main + "/.env";

	static eslintrc = this.main + "/.eslintrc.json";

	static get config(){
		return this.main + "/aob.config.js";
	}

	static get rw(){
		return class {
			static get access(){
				return fs.readFileSync(Models.access, "utf-8");
			}
			static set access(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.access);
			}

			static get checker(){
				return fs.readFileSync(Models.checker, "utf-8");
			}
			static set checker(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.checker);
			}

			static get register(){
				return fs.readFileSync(Models.register, "utf-8");
			}
			static set register(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.register);
			}

			static get token(){
				return fs.readFileSync(Models.token, "utf-8");
			}
			static set token(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.token);
			}

			static get notfound(){
				return fs.readFileSync(Models.notfound, "utf-8");
			}
			static set notfound(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.notfound);
			}

			static get error(){
				return fs.readFileSync(Models.error, "utf-8");
			}
			static set error(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.error);
			}

			static get config(){
				return fs.readFileSync(Models.config, "utf-8");
			}
			static set config(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.config);
			}

			static get method(){
				return fs.readFileSync(Models.method, "utf-8");
			}
			static set method(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.method);
			}

			static get handler(){
				return fs.readFileSync(Models.handler, "utf-8");
			}
			static set handler(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.handler);
			}

			static get sender(){
				return fs.readFileSync(Models.sender, "utf-8");
			}
			static set sender(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.sender);
			}

			static get schema(){
				return fs.readFileSync(Models.schema, "utf-8");
			}
			static set schema(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.schema);
			}

			static get env(){
				return fs.readFileSync(Models.env, "utf-8");
			}
			static set env(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.env);
			}
			
			static get eslintrc(){
				return fs.readFileSync(Models.eslintrc, "utf-8");
			}
			static set eslintrc(arg){
				try {
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}
				catch {}
				fs.writeFileSync(arg, this.eslintrc);
			}
		};
	}
}

export class Directories{
	static get main(){
		return resolve("./");
	}

	static name_workdir = "src";
	static get workdir(){
		return resolve(this.main, this.name_workdir);
	}

	static name_access = "access";
	static get access(){
		return resolve(this.workdir, this.name_access);
	}

	static name_checker = "checker";
	static get checker(){
		return resolve(this.workdir, this.name_checker);
	}

	static name_register = "register";
	static get register(){
		return resolve(this.workdir, this.name_register);
	}

	static name_import = "import";
	static get import(){
		return resolve(this.workdir, this.name_import);
	}

	static name_method = "method";
	static get method(){
		return resolve(this.workdir, this.name_method);
	}

	static name_handler = "handler";
	static get handler(){
		return resolve(this.workdir, this.name_handler);
	}

	static name_sender = "sender";
	static get sender(){
		return resolve(this.workdir, this.name_sender);
	}

	static name_schema = "schema";
	static get schema(){
		return resolve(this.workdir, this.name_schema);
	}
}

export class Files{
	static get config(){
		return resolve(Directories.main, "aob.config.js");
	}

	static get token(){
		return resolve(Directories.workdir, "token.js");
	}

	static get notfound(){
		return resolve(Directories.workdir, "notfound.js");
	}

	static get error(){
		return resolve(Directories.workdir, "error.js");
	}

	static get env(){
		return resolve(Directories.main, ".env");
	}

	static get eslintrc(){
		return resolve(Directories.main, ".eslintrc.json");
	}

	static get extname(){
		return Extname;
	}
}

class Extname{
	static access = ".js";

	static register = ".js";

	static import = ".js";

	static checker = ".js";

	static method = ".js";

	static handler = ".js";

	static sender = ".js";

	static schema = ".js";
}
