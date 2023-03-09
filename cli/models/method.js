import {method} from "anotherback/cli";

export default method(
	function(...args){
		console.log(args);
		return false;
	}
);
