export default class Sender{
	constructor(fnc){
		this.fnc = fnc || this.fnc;
	}

	async exec(res){
		let result = await this.fnc(res, this.info, this.data);
		if(result !== undefined)res.status(result.code || 200).send({i: result.info, d: result.data});
	}

	init(info, data){
		this.info = info;
		this.data = data;
		return this;
	}

	code = 200;
	info = undefined;
	data = undefined;

	fnc = () => ({code: 200});
}
