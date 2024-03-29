import {sender} from "anotherback/cli";

export default sender(
	(res, info, data) => (
		{
			info: info,
			data: `Route '${data.method}:${data.url}' not found.`
		}
	)
);
