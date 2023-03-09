import {checker} from "anotherback/cli";

export default checker(
	{
		default: req => [req]
	},
	function(req){
		return true;
	}
);
