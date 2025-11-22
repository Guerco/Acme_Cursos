const SEPARADOR_MENSAGENS = '|';

export class NaoAutorizadoException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NaoAutorizadoException';
        Object.setPrototypeOf(this, NaoAutorizadoException.prototype);
    }
}
