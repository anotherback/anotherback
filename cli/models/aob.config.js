import {config, Directories, Models, Files} from "anotherback/cli";

export default config(
	{
		listenParams: {
			port: 80,
			host: "localhost"
		},
		registerParamsCookie: {

		},
		registerParamsCors: {

		},
		prefix: "",
		debug: false,
		plugins: [],
		fastifyRegister(fastReg){

		},
		listenCallback(err, address){
			if(err) throw err;
			console.log("Ready !");
		}
	}
);
