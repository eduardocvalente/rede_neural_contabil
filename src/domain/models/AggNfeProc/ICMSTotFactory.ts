import { ICMSTot } from "./ICMSTot";

export class ICMSTotFactory {
    static create(json: any): ICMSTot {
        return new ICMSTot(
            json?.vBC?.[0] || '0.00',
            json?.vICMS?.[0] || '0.00',
            json?.vICMSDeson?.[0] || '0.00',
            json?.vFCPUFDest?.[0] || '0.00',
            json?.vICMSUFDest?.[0] || '0.00',
            json?.vICMSUFRemet?.[0] || '0.00',
            json?.vFCP?.[0] || '0.00',
            json?.vBCST?.[0] || '0.00',
            json?.vST?.[0] || '0.00',
            json?.vFCPST?.[0] || '0.00',
            json?.vFCPSTRet?.[0] || '0.00',
            json?.vProd?.[0] || '0.00',
            json?.vFrete?.[0] || '0.00',
            json?.vSeg?.[0] || '0.00',
            json?.vDesc?.[0] || '0.00',
            json?.vII?.[0] || '0.00',
            json?.vIPI?.[0] || '0.00',
            json?.vIPIDevol?.[0] || '0.00',
            json?.vPIS?.[0] || '0.00',
            json?.vCOFINS?.[0] || '0.00',
            json?.vOutro?.[0] || '0.00',
            json?.vNF?.[0] || '0.00',
            json?.vTotTrib?.[0] || '0.00'
        );
    }
}
