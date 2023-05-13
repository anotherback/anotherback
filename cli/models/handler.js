import {handler} from "anotherback/cli";

export default handler(
	function(req, res){
		this.sender("ok");
	}
);

// export const other = handler(
// 	function(req, res){
// 		this.sender("ok");
// 	}
// );
