import {Anotherback} from "../../../src/index.js";
import access from "./launch/access.js";
import checker from "./launch/checker.js";
import register from "./launch/register.js";
import token from "./launch/token.js";
import notfound from "./launch/notfound.js";
import imp from "./launch/import.js";
import method from "./launch/method.js";
import sender from "./launch/sender.js";
import {Directories, Models, Files} from "../../directories.js";
import Event, {Dir} from "./plugins.js";
import error from "./launch/error.js";
import schema from "./launch/schema.js";

const config = (await import("file://" + Files.config)).default;

await Event.launch("start", Directories, Models, Dir, Files);
await Event.launch("beforeRegister", Anotherback.app);

await Anotherback.fastifyRegister(config.fastifyRegister);

Anotherback.prefix = config.prefix;
Anotherback.debug = config.debug;
Anotherback.registerParamsCookie = config.registerParamsCookie;
Anotherback.registerParamsCors = config.registerParamsCors;
Anotherback.listenParams = config.listenParams;
Anotherback.listenCallback(config.listenCallback);

await imp();
await Promise.all([
	access(),
	checker(),
	token(),
	notfound(),
	method(),
	sender(),
	error(),
	register(),
	schema(),
]);

await Event.launch("loadDir");

Anotherback.init();

await Event.launch("ready");
