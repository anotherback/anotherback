import {sender} from "anotherback/cli";

export default sender(
	(res, info, error) => (
		{
			info: info,
			data: error.toString()
		}
	)
);
