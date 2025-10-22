/**
 * Converte um texto para SHA-512
 *
 * @param {string} text
 * @returns {Promise<string>}
 *
 * @author Thiago Delgado Pinto
 */
export async function sha512( text : string ) {
    // Web Crypto API
    const hashBuffer = await crypto.subtle.digest(
        'SHA-512',
        ( new TextEncoder() ).encode( text )
    );

    // ArrayBuffer to hex string
    return Array.from( new Uint8Array( hashBuffer ) )
        .map( b => ( '00' + b.toString( 16 ) ).slice( -2 ) )
        .join( '' );
}