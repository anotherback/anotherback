import {method} from "anotherback/cli";

export default method(
	function(arg){
		console.log(arg);
		return false;
	}
);
