import { Page } from "playwright/test";
import { rotasApi } from "../../../src/rotas";

export async function entrar(page: Page, email: string, senha: string) {
    const response = await page.request.post(rotasApi.login, {
        form: {
            email: email,
            senha: senha
        }
    });

    const usuario = await response.json();
    await page.addInitScript((dados) => {
        sessionStorage.setItem('nome-usuario', dados.nome);
        sessionStorage.setItem('tipo-usuario', dados.tipoUsuario);
    }, usuario);
}