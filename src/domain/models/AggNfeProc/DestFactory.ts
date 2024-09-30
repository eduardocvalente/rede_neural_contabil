import { Dest } from './Dest';
import { EnderDestFactory } from './EnderDestFactory';


export class DestFactory {
    static create(json: any): Dest {
        const enderDest = EnderDestFactory.create(json?.enderDest?.[0] || {});
        
        return new Dest(
            json?.CNPJ?.[0] || '',
            json?.xNome?.[0] || '',
            enderDest,
            json?.indIEDest?.[0] || '',
            json?.email?.[0] || ''
        );
    }
}
