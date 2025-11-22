import { Page } from "playwright/test";

export async function entrar(page: Page, email: string, senha: string) {
    const response = await page.request.post('http://localhost:8080/login', {
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