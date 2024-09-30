import { AutoMap } from '@automapper/classes';

export class TrainingInputDTO {
    @AutoMap()
    public cnaePrincipal: string;

    @AutoMap()
    public cnaeEntrada: string;

    @AutoMap()
    public ncm: string;

    constructor(cnaePrincipal: string, cnaeEntrada: string, ncm: string) {
        this.cnaePrincipal = cnaePrincipal;
        this.cnaeEntrada = cnaeEntrada;
        this.ncm = ncm;
    }
}
