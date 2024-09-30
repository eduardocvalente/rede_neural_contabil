import { Ide } from "./Ide";

export class IdeFactory {
    static create(json: any): Ide {
        return new Ide(
            json?.cUF?.[0] || '',
            json?.cNF?.[0] || '',
            json?.natOp?.[0] || '',
            json?.mod?.[0] || '',
            json?.serie?.[0] || '',
            json?.nNF?.[0] || '',
            json?.dhEmi?.[0] || '',
            json?.tpNF?.[0] || '',
            json?.idDest?.[0] || '',
            json?.cMunFG?.[0] || '',
            json?.tpImp?.[0] || '',
            json?.tpEmis?.[0] || '',
            json?.cDV?.[0] || '',
            json?.tpAmb?.[0] || '',
            json?.finNFe?.[0] || '',
            json?.indFinal?.[0] || '',
            json?.indPres?.[0] || '',
            json?.procEmi?.[0] || '',
            json?.verProc?.[0] || ''
        );
    }
}
