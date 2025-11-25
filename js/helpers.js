// Funciones auxiliares para manejar elementos DOM
function mostrarElemento(elemento) {
    elemento.classList.remove('oculto');
    elemento.classList.add('flex');
}

function ocultarElemento(elemento) {
    elemento.classList.remove('flex');
    elemento.classList.add('oculto');
}

function aplicarEstilos(elemento, estilos) {
    Object.entries(estilos).forEach(([propiedad, valor]) => {
        elemento.style[propiedad] = valor;
    });
}

export { mostrarElemento, ocultarElemento, aplicarEstilos};