import { Directories, Files } from "../../directories.js";
import { resolve } from "path";
import fs from "fs";
import Watcher from "watcher";
const config = (await import("file://" + Files.config)).default;

export class Dir{
	constructor(path="./"){
		this.#path = resolve(Directories.workdir, path);
		Dir.dirs[this.path] = this;
	}

	#path;
	get path(){
		return this.#path;
	}

	#model = "";
	get model(){
		return this.#model;
	}
	set model(arg){
		this.#model = fs.existsSync(arg)? fs.readFileSync(Models.checker, "utf-8") : arg;
	}

	extName = ".js";

	findFnc = () => {};
	find(fnc){
		if(typeof fnc !== "function")throw new Error("");
		this.findFnc = fnc;
	}

	static dirs = {};

	static initDir(){
		for(const index in this.dirs){
			fs.mkdirSync(this.dirs[index].path, {recursive: true});

			new Watcher(this.dirs[index].path, {recursive: true, ignoreInitial: true})
				.on("add", path=>{
					if(fs.readFileSync(path, "utf-8") === "" && path.endsWith(this.dirs[index].extName)){
						fs.writeFileSync(path, this.dirs[index].model);
					}
				});
		}
	}

	static async loadDir(){
		for(const index in this.dirs){
			let arr = [];
			(function find(path, fnc){
				for(const file of fs.readdirSync(path)){
					if(fs.lstatSync(resolve(path, file)).isDirectory())find(resolve(path, file), fnc);
					if(file.endsWith(this.dirs[index].extName))arr.push(fnc(resolve(path, file)));
				}
			}).call(this, this.dirs[index].path, this.dirs[index].findFnc);
			await Promise.all(arr);
		}
	}
}

export default class EventAOB{
	static async launch(name, ...args){
		for(const event of this.events[name]){
			await event(...args);
		}
	}

	static on(name, fnc){
		if(typeof fnc !== "function")throw new Error("");
		if(this.events[name] === undefined)throw new Error("");
		this.events[name].push(fnc);
	}

	static events = {
		ready: [],
		initDir: [() => Dir.initDir()],
		loadDir: [() => Dir.loadDir()],
		beforeRegister: [],
		start: [],
	};
}

for(const plugin of config.plugins || []){
	await plugin((...args) => EventAOB.on(...args));
}
