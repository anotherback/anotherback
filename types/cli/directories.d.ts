export class Models{
    static readonly main: string;

    static access: string;

    static checker: string;

    static register: string;

    static token: string;
    
    static method: string;

	static notfound: string;

	static error: string;

	static env: string;

	static sender: string;

	static schema: string;

    static readonly config: string;
}

export class Directories{
    static readonly main: string;

    static readonly workdir: string;
    static name_workdir: string;

    static readonly access: string;
    static nema_access: string;

    static readonly checker: string;
    static name_checker: string;

    static readonly register: string;
    static name_register: string;

    static readonly import: string;
    static name_import: string;

    static readonly method: string;
    static name_method: string;

	static readonly sender: string;
    static name_sender: string;

	static readonly schema: string;
    static name_schema: string;
}

export class Files{
    static readonly config: string;

    static readonly token: string;

	static readonly notfound: string;

	static readonly error: string;

	static readonly env: string;

    static readonly extname: Extname;
}

declare class Extname{
    static access: string;

    static rigister: string;

    static import: string;

    static checker: string;

    static method: string;

	static sender: string;

	static schema: string;
}