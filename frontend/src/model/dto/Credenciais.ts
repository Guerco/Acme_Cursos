import { sha512 } from "../../util/Hash";

export class Credenciais{
    constructor(
        public readonly email: string,
        public senha: string
    ){}

    async aplicarHashSenha() {
        this.senha = await sha512(this.senha);
    }
}