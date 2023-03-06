import Watcher from "watcher";
import { Directories, Models, Files } from "../directories.js";
import { spawn } from "child_process";
import initDir from "./lib/initDir.js";
import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import Event, { Dir } from "./lib/plugins.js";

await Event.launch("start", Directories, Models, Dir, Files);

class child{
	static start(){
		this.process = spawn("node", [resolve(dirname(fileURLToPath(import.meta.url))) + "/lib/spawn.js"], {stdio: "inherit"});
	}

	static stop(){
		try{
			process.kill(this.process.pid);
		}catch{
		}

	}

	static restart(){
		console.log("anotherback restart");
		this.stop();
		this.start();
	}

	static process;
}

initDir();

new Watcher(Directories.access, {recursive: true, ignoreInitial: true})
.on("add", path => {
	if(
		fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname.access)
	)Models.rw.access = path;
});

new Watcher(Directories.checker, {recursive: true, ignoreInitial: true})
.on("add", path => {
	if(
		fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname.checker)
	)Models.rw.checker = path;
});

new Watcher(Directories.register, {recursive: true, ignoreInitial: true})
.on("add", path => {
	if(
		fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname.register)
	)Models.rw.register = path;
});

new Watcher(Directories.method, {recursive: true, ignoreInitial: true})
.on("add", path => {
	if(
		fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname.method)
	)Models.rw.method = path;
});

new Watcher(Directories.sender, {recursive: true, ignoreInitial: true})
.on("add", path => {
	if(
		fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname.sender)
	)Models.rw.sender = path;
});

await Event.launch("initDir");

new Watcher(
	Directories.main,
	{
		recursive: true,
		ignoreInitial: true,
		ignore: path =>
			path.indexOf("node_modules") > -1 ||
            path.indexOf("package-lock.json") > -1
	}
)
.on("change", ()=>child.restart())
.on("unlink", ()=>child.restart());

process.on("SIGINT", () => {
	process.exit(0);
});

process.on("exit", () => {
	child.stop();
});

child.start();
