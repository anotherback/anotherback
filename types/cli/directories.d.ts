export class Models{
    static readonly main: string;

    static access: string;

    static checker: string;

    static register: string;

    static token: string;
    
    static method: string;

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
}

export class Files{
    static readonly config: string;

    static readonly token: string;

    static readonly extname: Extname;
}

class Extname{
    static access = ".js";

    static rigister = ".js";

    static import = ".js";

    static checker = ".js";

    static method = ".js";
}