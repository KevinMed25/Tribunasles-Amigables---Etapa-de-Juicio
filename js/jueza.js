const juezaContenedorDialogo = document.querySelector('.jueza__contenedor__dialogo');
const juezaImagen = document.querySelector('.jueza__imagen');
const juezaContenedor = document.querySelector('.jueza__contenedor');
const contenedorParrafoJueza = juezaContenedorDialogo.querySelector('.jueza__contenedor__parrafo');
const audioJueza = document.querySelector('.audio_jueza');
const imagenCerrarDialogoJueza = document.querySelector('.imagen_cerrar_dialogo_jueza');
const IMAGENES_JUEZA = {
    hablando: 'src/img/Jueza-hablando.png',
    mazo: 'src/img/Jueza-mazo.png',
    normal: 'src/img/Jueza.png'
};


export {
    juezaContenedorDialogo, 
    juezaImagen, 
    juezaContenedor, 
    contenedorParrafoJueza, 
    audioJueza, 
    imagenCerrarDialogoJueza, 
    IMAGENES_JUEZA
}
