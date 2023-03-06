import {Anotherback} from "../../../dist/index.js";
import access from "./launch/access.js";
import checker from "./launch/checker.js";
import register from "./launch/register.js";
import token from "./launch/token.js";
import imp from "./launch/import.js";
import method from "./launch/method.js";
import sender from "./launch/sender.js";
import {Directories, Models, Files} from "../../directories.js";
const config = (await import("file://" + Files.config)).default;
import Event, {Dir} from "./plugins.js";

await Event.launch("start", Directories, Models, Dir, Files);
await Event.launch("beforeRegister", Anotherback.app);

await Anotherback.fastifyRegister(config.fastifyRegister);

await imp();
await Promise.all([
	access(),
	checker(),
	token(),
	method(),
	sender(),
]);
await register();

await Event.launch("loadDir");

Anotherback.prefix = config.prefix;

Anotherback.listenParams = config.listenParams;
Anotherback.registerParamsCookie = config.registerParamsCookie;
Anotherback.registerParamsCors = config.registerParamsCors;

Anotherback.listenCallback(config.listenCallback);
Anotherback.init();

await Event.launch("ready");
