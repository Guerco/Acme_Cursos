import { test } from 'playwright/test';
import { TelaListagemCursos } from './telas/TelaListagemCursos';

test.describe( 'Listagem de Cursos', () => {
    let tela: TelaListagemCursos;

    test.beforeEach(async ({ page }) => {
        tela = new TelaListagemCursos(page);
        // Dado que acesso a tela de listagem de cursos
        await tela.acessar();
    });

    // Cenário: Listagem apresenta pelo menos um curso ao abrir
    test( 'Lista pelo menos um curso', async () => {
        // Quando visualizo a tela
        // Então há pelo menos um curso sendo listado.
        await tela.deveExibirCurso();
    });

    // Cenário: Listagem apresenta os assuntos de um curso ao clicar em seu card
    test( 'Apresenta os assuntos do curso ao clicar no card', async () => {
        // Quando clico no card de um curso
        const primeiroCurso = await tela.clicarPrimeiroCard();
        // Então o card se expande e lista os assuntos do curso em questão.
        await tela.deveExibirAssuntosCurso(primeiroCurso);
    });

    // Cenário: Listagem apresenta um curso ao buscar por parte de seu nome
    test( 'Apresenta um curso ao buscar seu nome', async () => {
        // Quando digito parte do nome de um curso na caixa de pesquisa 
        await tela.preencheTextoBusca('Geografia');
        //      e aperto o botão enter
        await tela.apertaEnter();
        // Então apenas cursos que satisfaçam aquele filtro são listados. 
        await tela.deveExibirCursosFiltrados('Geografia');
    });

    // Cenário: Listagem apresenta um curso ao buscar pelo nome de seu professor
    test( 'Apresenta um curso ao buscar o nome de seu professor', async () => {
        // Quando digito parte do nome de um professor na caixa de pesquisa 
        await tela.preencheTextoBusca('Amauricio');
        //      e aperto o botão enter
        await tela.apertaEnter();
        // Então apenas cursos que satisfaçam aquele filtro são listados. 
        await tela.deveExibirCursosFiltrados('Amauricio');
    });
    
    // Cenário: Listagem não apresenta cursos ao buscar por um texto inexistente no nome de nenhum curso ou professor
    test( 'Não apresenta cursos ao buscar um texto inexistente', async () => {
        // Quando digito um texto inexistente na caixa de pesquisa 
        await tela.preencheTextoBusca('INEXISTENTE');
        //      e aperto o botão enter
        await tela.apertaEnter();
        // Então uma mensagem de que não há cursos para se listar será exibida. 
        await tela.deveExibirMensagem('Não há cursos');
    });
});