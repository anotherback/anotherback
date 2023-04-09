import {Anotherback} from "../../../../src/index.js";
import {Files} from "../../../directories.js";

export default async function error(){
	const error = (await import("file://" + Files.error)).default;
	Anotherback.setErrorSender(error);
}
