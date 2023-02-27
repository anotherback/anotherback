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

	static method = this.main + "/method.js";

	static sender = this.main + "/sender.js";

	static get config(){
		return this.main + "/aob.config.js";
	}

	static get rw(){
		return class {
			static get access(){
				return fs.readFileSync(Models.access, "utf-8");
			}
			static set access(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.access);
			}

			static get checker(){
				return fs.readFileSync(Models.checker, "utf-8");
			}
			static set checker(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.checker);
			}

			static get register(){
				return fs.readFileSync(Models.register, "utf-8");
			}
			static set register(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.register);
			}

			static get token(){
				return fs.readFileSync(Models.token, "utf-8");
			}
			static set token(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.token);
			}

			static get config(){
				return fs.readFileSync(Models.config, "utf-8");
			}
			static set config(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.config);
			}

			static get method(){
				return fs.readFileSync(Models.method, "utf-8");
			}
			static set method(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.method);
			}

			static get sender(){
				return fs.readFileSync(Models.sender, "utf-8");
			}
			static set sender(arg){
				try{
					fs.mkdirSync(arg.split("/").slice(0, -1).join("/"), {recursive: true});
				}catch{}
				fs.writeFileSync(arg, this.sender);
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

	static name_sender = "sender";
	static get sender(){
		return resolve(this.workdir, this.name_sender);
	}
}

export class Files{
	static get config(){
		return resolve(Directories.main, "aob.config.js");
	}

	static get token(){
		return resolve(Directories.workdir, "token.js");
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

	static sender = ".js";
}
