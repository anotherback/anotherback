import {schema} from "anotherback/cli";
import {schema as s} from "anotherback";

export default schema(
	s.string(),
	(sender) => sender("bad_request", "error", "invalid field")
);

// export const other = schema(
// 	s.string(),
// 	(sender) => sender("bad_request", "error", "invalid field")
// );
