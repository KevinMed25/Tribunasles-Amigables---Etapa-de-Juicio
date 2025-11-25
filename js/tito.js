const titoContenedorDialogo = document.querySelector('.tito__contenedor__dialogo')
const titoImagen = document.querySelector('.tito__imagen');
const titoContenedor = document.querySelector('.tito__contenedor');
const contenedorParrafoTito = titoContenedorDialogo.querySelector('.tito__contenedor__parrafo');
const audioTitto = document.querySelector('.audio_tito');
const imagenCerrarDialogo = document.querySelector('.imagen_cerrar_dialogo_tito');
const IMAGENES_TITO = {
    hablando: 'src/img/Tito-hablando.png',
    normal: 'src/img/Tito.png'
};

export {
    titoContenedorDialogo, 
    titoImagen,
    titoContenedor, 
    contenedorParrafoTito, 
    audioTitto, 
    imagenCerrarDialogo, 
    IMAGENES_TITO
}
