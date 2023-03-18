import {Anotherback} from "../../../../src/index.js";
import {Files} from "../../../directories.js";

export default async function notfound(){
	const notfound = (await import("file://" + Files.notfound)).default;
	Anotherback.setNotFoundSender(notfound);
}
