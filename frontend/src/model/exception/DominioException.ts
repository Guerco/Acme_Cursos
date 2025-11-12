const SEPARADOR_MENSAGENS = '|';

export class DominioException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DominioException';
        Object.setPrototypeOf(this, DominioException.prototype);
    }

    static comProblemas(problemas: string[]): DominioException {
        return new DominioException(problemas.join(SEPARADOR_MENSAGENS));
    }

    getProblemas(): string[] {
        return this.message.split(SEPARADOR_MENSAGENS);
    }
}
