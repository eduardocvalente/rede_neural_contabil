import { AutXMLFactory } from './AutXMLFactory';
import { DetFactory } from './DetFactory';
import { EmitFactory } from './EmitFactory';
import { IdeFactory } from './IdeFactory';
import { InfAdicFactory } from './InfAdicFactory';
import { InfNFe } from './InfNFe';
import { InfRespTecFactory } from './InfRespTecFactory';
import { PagFactory } from './PagFactory';
import { TotalFactory } from './TotalFactory';
import { TranspFactory } from './TranspFactory';
import { DestFactory } from './DestFactory'; 

export class InfNFeFactory {
    static create(json: any): InfNFe {
        return new InfNFe(
            json?.$?.Id || '',  
            json?.$?.versao || '',
            IdeFactory.create(json?.ide?.[0] || {}),
            EmitFactory.create(json?.emit?.[0] || {}),
            DestFactory.create(json?.dest?.[0] || {}),  
            json?.autXML?.map((aut: any) => AutXMLFactory.create(aut)) || [],
            json?.det?.map((det: any) => DetFactory.create(det)) || [],
            TotalFactory.create(json?.total?.[0] || {}),
            TranspFactory.create(json?.transp?.[0] || {}),
            PagFactory.create(json?.pag?.[0] || {}),
            InfAdicFactory.create(json?.infAdic?.[0] || {}),
            InfRespTecFactory.create(json?.infRespTec?.[0] || {})
        );
    }
}
