import Watcher from "watcher";
import {Directories, Models, Files} from "../directories.js";
import {spawn} from "child_process";
import initDir from "./lib/initDir.js";
import fs from "fs";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import Event, {Dir} from "./lib/plugins.js";
const config = (await import("file://" + Files.config)).default;

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

for(const DIR of DIRS){
	new Watcher(Directories[DIR], {recursive: true, ignoreInitial: true})
	.on("add", path => {
		if(
			fs.readFileSync(path, "utf-8") === "" &&
			path.endsWith(Files.extname[DIR])
		)Models.rw[DIR] = path;
	});
}

await Event.launch("initDir");

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
			)
	}
)
.on("change", () => child.restart())
.on("unlink", () => child.restart());

process.on("SIGINT", () => {
	process.exit(0);
});

process.on("exit", () => {
	child.stop();
});

child.start();
