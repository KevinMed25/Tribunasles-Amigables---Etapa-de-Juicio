const itzelContenedorDialogo = document.querySelector('.itzel__contenedor__dialogo');
const itzelImagen = document.querySelector('.itzel__imagen');
const itzelContenedor = document.querySelector('.itzel__contenedor');
const contenedorParrafoItzel = itzelContenedorDialogo.querySelector('.itzel__contenedor__parrafo');
const audioItzel = document.querySelector('.audio_itzel');
const imagenCerrarDialogoItzel = document.querySelector('.imagen_cerrar_dialogo_itzel');
const IMAGENES_ITZEL = {
    hablando: 'src/img/Itzel.png', // No hay imagen de "hablando", usamos la normal
    normal: 'src/img/Itzel.png'
};

export {
    itzelContenedorDialogo,
    itzelImagen,
    itzelContenedor,
    contenedorParrafoItzel,
    audioItzel,
    imagenCerrarDialogoItzel,
    IMAGENES_ITZEL
};