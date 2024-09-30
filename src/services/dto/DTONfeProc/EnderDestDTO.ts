import { AutoMap } from '@automapper/classes';

export class EnderDestDTO {
    @AutoMap()
    public xLgr: string;  // Logradouro

    @AutoMap()
    public nro: string;   // Número

    @AutoMap()
    public xCpl: string;  // Complemento

    @AutoMap()
    public xBairro: string;  // Bairro

    @AutoMap()
    public cMun: string;  // Código do município

    @AutoMap()
    public xMun: string;  // Nome do município

    @AutoMap()
    public UF: string;    // Unidade Federativa (Estado)

    @AutoMap()
    public CEP: string;   // CEP

    @AutoMap()
    public cPais: string; // Código do país

    @AutoMap()
    public xPais: string; // Nome do país

    constructor(
        xLgr: string,
        nro: string,
        xCpl: string,
        xBairro: string,
        cMun: string,
        xMun: string,
        UF: string,
        CEP: string,
        cPais: string,
        xPais: string
    ) {
        this.xLgr = xLgr;
        this.nro = nro;
        this.xCpl = xCpl;
        this.xBairro = xBairro;
        this.cMun = cMun;
        this.xMun = xMun;
        this.UF = UF;
        this.CEP = CEP;
        this.cPais = cPais;
        this.xPais = xPais;
    }
}
