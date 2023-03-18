import {Anotherback} from "../../../../dist/index.js";
import {Files} from "../../../directories.js";

export default async function notfound(){
	const notfound = (await import("file://" + Files.notfound)).default;
	Anotherback.setNotFoundSender(notfound);
}
