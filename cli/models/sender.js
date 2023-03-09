import {sender} from "anotherback/cli";

export default sender(
	function(res, ...args){
		this.code(200);
		this.info(args[0]);
		this.data(args[1]);
		this.successful();
	}
);
