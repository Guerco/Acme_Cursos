export class Base64 {
    /**
     * Converte um BLOB para uma URL de dados.
     *
     * @author Thiago Delgado Pinto
     *
     * @param {Blob} blob
     * @returns {Promise<string>}
     */
    static async blobToDataURL(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = event => resolve(event.target?.result as string);
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Retira o conteúdo em base 64 de uma URL de dados.
     *
     * Exemplo: "data:image/png;base64,b9ZyAdv..." -> "b9ZyAdv..."
     *
     * @author Thiago Delgado Pinto
     *
     * @param {string} dataURL
     * @returns {string}
     */
    static extractBase64FromDataURL(dataURL: string): string {
        const base64 = 'base64,';
        const index = (dataURL || '').indexOf(base64);
        if (index < 0) {
            return dataURL;
        }
        return dataURL.substring(index + base64.length);
    }
}
