import { ICMSType } from "./ICMSType";

export class ICMSTypeFactory {
    static create(json: any): ICMSType {
        return new ICMSType(
            json?.orig?.[0] || '',            // Verifica se json.orig existe, caso contrário, retorna uma string vazia
            json?.CSOSN?.[0] || '',           // Verifica se json.CSOSN existe, caso contrário, retorna uma string vazia
            json?.vBCSTRet?.[0] || '0.00',    // Verifica se json.vBCSTRet existe, caso contrário, retorna '0.00'
            json?.pST?.[0] || '0.00',         // Verifica se json.pST existe, caso contrário, retorna '0.00'
            json?.vICMSSubstituto?.[0] || '0.00', // Verifica se json.vICMSSubstituto existe, caso contrário, retorna '0.00'
            json?.vICMSSTRet?.[0] || '0.00'   // Verifica se json.vICMSSTRet existe, caso contrário, retorna '0.00'
        );
    }
}
