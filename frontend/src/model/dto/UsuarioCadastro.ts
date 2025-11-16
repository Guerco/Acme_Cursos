export class UsuarioCadastro {
    constructor (
        public readonly email: string,
        public readonly senha: string,
        public readonly nome: string,
        public readonly tipoUsuario: string|string[]
    ){}

}