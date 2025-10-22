export enum Dificuldade {
    FACIL = 'Fácil',
    MEDIO = 'Médio',
    DIFICIL = 'Difícil'
}

export function dificuldadeParaTextoValor(dificuldade: Dificuldade): string {
    switch (dificuldade) {
        case Dificuldade.FACIL:
            return "Fácil (1.0)";
        case Dificuldade.MEDIO:
            return "Médio (1.5)";
        case Dificuldade.DIFICIL:
            return "Difícil (2.0)";
    }
}

export function dificuldadeValor(dificuldade: Dificuldade): number {
    switch (dificuldade) {
        case Dificuldade.FACIL:
            return 1.0;
        case Dificuldade.MEDIO:
            return 1.5;
        case Dificuldade.DIFICIL:
            return 2.0;
    }   
}

export function dificuldadeParaString(dificuldade: Dificuldade): string {
    switch (dificuldade) {
        case Dificuldade.FACIL:
            return "facil";
        case Dificuldade.MEDIO:
            return "medio";
        case Dificuldade.DIFICIL:
            return "dificil";
    }
}

export function dificuldadeDeString(difString: string) : Dificuldade | null {
    switch (difString) {
        case 'Fácil':
            return Dificuldade.FACIL;
        case 'Médio':
            return Dificuldade.MEDIO;
        case 'Difícil':
            return Dificuldade.DIFICIL;
        default:
            return null;
    }
}


