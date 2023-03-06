import {Token} from "../../../../dist/index.js";
import {Files} from "../../../directories.js";

export default async function token(){
	const tokens = (await import("file://" + Files.token)).default;
	for(const token of tokens)Token.keys.create(token.name, token.key, token.options);
}
