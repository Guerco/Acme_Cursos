export class UtilDOM {
    static cria(nomeElemento: string): HTMLElement {
        return document.createElement(nomeElemento);
    }

    static criaComClasses(nomeElemento: string, classes: Array<string>) {
        const elemento = this.cria(nomeElemento);
        for (const c of classes) {
            elemento.classList.add(c.replace('.', ''));
        }
        return elemento;
    }

    static criaComId(nomeElemento: string, id: string) {
        const elemento = this.cria(nomeElemento);
        elemento.id = id;
        return elemento;
    }

    static criaComClassesEId(nomeElemento: string, classes: Array<string>, id: string) {
        const elemento = this.cria(nomeElemento);
        for (const c of classes) {
            elemento.classList.add(c.replace('.', ''));
        }
        elemento.id = id;
        return elemento;
    }

    static criaComTexto(nomeElemento: string, texto: string) {
        const elemento = this.cria(nomeElemento);
        elemento.textContent = texto;
        return elemento;
    }

    static criaComTextoEId(nomeElemento: string, texto: string, id: string) {
        const elemento = this.criaComId(nomeElemento, id);
        elemento.textContent = texto;
        return elemento;
    }

    static criaImg(src: string, alt: string = '') {
        const img = this.cria('img') as HTMLImageElement;
        img.src = src;
        if (alt !== '') img.alt = alt;
        return img;
    }

    static criaImgComClasses(src: string, alt: string = '', classes: Array<string>) {
        const img = this.criaComClasses('img', classes) as HTMLImageElement;
        img.src = src;
        if (alt !== '') img.alt = alt;
        return img;
    }

    static criaImgComClassesEId(src: string, alt: string = '', classes: Array<string>, id: string) {
        const img = this.criaComClassesEId('img', classes, id) as HTMLImageElement;
        img.src = src;
        if (alt !== '') img.alt = alt;
        return img;
    }

    static criaComTextoEClasses(nomeElemento: string, texto: string, classes: Array<string>) {
        const elemento = this.criaComClasses(nomeElemento, classes);
        elemento.textContent = texto;
        return elemento;
    }

    static criaFragmentoComElementos(elementos: Array<HTMLElement>): DocumentFragment {
        const fragment = document.createDocumentFragment();
        fragment.append(...elementos);
        return fragment;
    }

    static criaSelectOption(valor: string, conteudo: string) {
        const option = this.cria("option") as HTMLOptionElement;
        option.value = valor;
        option.textContent = conteudo;
        return option;
    }

    static criaAncoraComTexto(texto: string, href: string) : HTMLAnchorElement {
        const a = this.criaComTexto('a', texto) as HTMLAnchorElement;
        a.href = href;
        return a;
    }
}