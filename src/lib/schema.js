import joi from "joi";

const schema = joi.defaults(
	s => {
		switch (s.type){
			case "number":
				return s.options({convert: true});
			
			case "object":
				return s.options({stripUnknown: true});
		
			default:
				return s;
		}
	}
);

export default schema;
