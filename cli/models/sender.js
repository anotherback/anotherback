import {sender} from "anotherback/cli";

export default sender(
	(res, toolbox, ...args) => {
		console.log(args);
	}
);
