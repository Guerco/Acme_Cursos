export class UtilDOM {
    static cria(nomeElemento: string) : HTMLElement{
        return document.createElement(nomeElemento);
    }

    static criaComClasses(nomeElemento: string, classes: Array<string>){
        const elemento = this.cria(nomeElemento);
        for (const c of classes) {
            elemento.classList.add(c.replace('.', ''));
        }
        return elemento;
    }

    static criaComTexto(nomeElemento: string, texto: string) {
        const elemento = this.cria(nomeElemento);
        elemento.textContent = texto;
        return elemento;
    }

    static criaImg(src: string){
        const img = this.cria('img') as HTMLImageElement;
        img.src = src;
        return img;
    }

    static criaComTextoEClasses(nomeElemento: string, texto: string, classes:Array<string>) {
        const elemento = this.criaComClasses(nomeElemento, classes);
        elemento.textContent = texto;
        return elemento;
    }

    static criaFragmentoComElementos(elementos: Array<HTMLElement>):DocumentFragment{
        const fragment = document.createDocumentFragment();
        fragment.append(...elementos);
        return fragment;
    }
}