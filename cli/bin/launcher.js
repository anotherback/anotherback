import Watcher from "watcher";
import {Directories, Models, Files} from "../directories.js";
import {spawn} from "child_process";
import initDir from "./lib/initDir.js";
import fs from "fs";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import Event, {Dir} from "./lib/plugins.js";
import {Linter} from "eslint";

const config = (await import("file://" + Files.config)).default[0];
const configCli = (await import("file://" + Files.config)).default[1] || {
	linter: false,
	hotReload: false
};

await Event.launch("start", Directories, Models, Dir, Files);

class child{
	static start(){
		this.process = spawn("node", [resolve(dirname(fileURLToPath(import.meta.url))) + "/lib/spawn.js"], {stdio: "inherit"});
	}

	static stop(){
		try {
			process.kill(this.process.pid);
		}
		catch {
		}

	}

	static restart(){
		console.log("anotherback restart");
		this.stop();
		this.start();
	}

	static process;
}

const DIRS =  [
	"access",
	"checker",
	"register",
	"method",
	"sender",
	"schema",
	"handler"
];

initDir(DIRS);

const linter = new Linter();
let linterConfig = JSON.parse(fs.readFileSync(Files.eslintrc));
new Watcher(
	Files.eslintrc
)
.on("change", () => {
	if(configCli.hotReload === true)linterConfig = JSON.parse(fs.readFileSync(Files.eslintrc));
});

for(const DIR of DIRS){
	new Watcher(Directories[DIR], {
		recursive: true,
		ignoreInitial: true
	})
	.on("add", path => {
		if(
			fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname[DIR])
		)Models.rw[DIR] = path;
	});
}

await Event.launch("initDir");

const fileFixed = {};
new Watcher(
	Directories.main,
	{
		recursive: true,
		ignoreInitial: true,
		ignore: path =>
			path.indexOf("node_modules") > -1 ||
            path.indexOf("package-lock.json") > -1 ||
			(
				typeof config.registerParamsStatic === "object" && 
				config.registerParamsStatic.root !== undefined &&
				path.startsWith(resolve(config.registerParamsStatic.root)) === true
			) ||
			path.endsWith("debug.txt")
	}
)
.on("change", path => {
	try {
		if(configCli.linter !== true) throw "";
		else if(fileFixed[path] !== undefined){
			delete fileFixed[path];
			throw "";
		}
		else {
			fileFixed[path] = true;
			const fixedCode = linter.verifyAndFix(
				fs.readFileSync(
					path, 
					"utf-8"
				),
				linterConfig
			);

			fs.writeFileSync(
				path, 
				fixedCode.output
			);
		}
	}
	catch {
		if(Files.config === path){
			console.log("The configuration file has just been modified which causes anotherback to stop.");
			process.exit(0);
		}

		if(configCli.hotReload === true) child.restart();
	}
})
.on("unlink", path => {
	if(configCli.hotReload !== true) return;

	if(Object.getOwnPropertyNames(Files).find(key => Files[key] === path)){
		console.log("A file necessary for the operation of anotherback has just been deleted, which causes it to stop.");
		process.exit(0);
	}

	child.restart();
});

process.on("SIGINT", () => {
	process.exit(0);
});

process.on("exit", () => {
	child.stop();
});

child.start();
