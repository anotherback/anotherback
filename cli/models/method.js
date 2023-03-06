import {method} from "anotherback/cli";

export default method(
	(req, res, toolbox, ...args) => {
		console.log(args);
	}
);
