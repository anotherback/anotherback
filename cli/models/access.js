import {access} from "anotherback/cli";

export default access(
	{
		default: req => [req]
	},
	function(req){
		return true;
	}
);
