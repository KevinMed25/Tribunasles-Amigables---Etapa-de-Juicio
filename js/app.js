import { dialogos } from "./dialogos.js";
import { mensajes } from "./mensajes.js";
import { mostrarElemento, ocultarElemento, aplicarEstilos } from "./helpers.js";
import * as titoElements from "./tito.js";
import * as juezaElements from "./jueza.js";

import * as itzelElements from "./itzel.js";
import { Character } from "./Character.js";

const audioLobby = document.querySelector('.audio_lobby');

const buttonSonido = document.querySelector('.btn-sonido');
const buttonDialogo = document.querySelector('.btn-dialogo');

const btnSonidoImagen = document.querySelector('.btn-sonido img');

const modal = document.getElementById('modal');
const modalContenedorContenidoVisual = document.querySelector('.modal__contenido-visual');

const modalContenidoVideo = document.querySelector('.video__tutorial');
const audioAcierto = document.querySelector('.audio_acierto');
const audioFlip = document.querySelector('.audio_flip');
const audioConfeti = document.querySelector('.audio_confeti');

const btnCerrarModal = document.querySelector('.modal__contenido__cerrar');

const btnGaleria = document.querySelector('.btn-galeria');

const imagenes_btn_sonido = {
    sonido_on: 'src/img/sound_on_3d.png',
    sonido_off: 'src/img/sound_off_3d.png'
}

const IMAGEN_SALA_JUICIO = 'src/img/fiscalia.png'

let dialogoIndice = 0;
let isTyping = false;
let dialogoOculto;
let btnDialogoActivated = false;
let isGaleriaModalOpen = false;
let isGameExplanationModalOpen = false; // Nuevo flag para el modal de explicación del juego
let isAciertoModalOpen = false; // Nuevo flag para el modal de acierto del memorama
let isFinJuegoModalOpen = false; // Nuevo flag para el modal de fin de juego
let aciertos = 0; // Variable para contar los aciertos del memorama

// --- Refactorización: Creación de instancias de Character ---
const tito = new Character({
    name: 'Tito',
    container: titoElements.titoContenedor,
    imageElement: titoElements.titoImagen,
    dialogContainer: titoElements.titoContenedorDialogo,
    dialogTextElement: titoElements.titoContenedorDialogo.querySelector('.tito__dialogo__parrafo'),
    dialogHeadImage: titoElements.titoContenedorDialogo.querySelector('.tito__head__imagen'),
    audio: titoElements.audioTitto,
    images: titoElements.IMAGENES_TITO
});

const jueza = new Character({
    name: 'Jueza',
    container: juezaElements.juezaContenedor,
    imageElement: juezaElements.juezaImagen,
    dialogContainer: juezaElements.juezaContenedorDialogo,
    dialogTextElement: juezaElements.juezaContenedorDialogo.querySelector('.jueza__dialogo__parrafo'),
    dialogHeadImage: juezaElements.juezaContenedorDialogo.querySelector('.jueza__head__imagen'),
    audio: juezaElements.audioJueza,
    images: juezaElements.IMAGENES_JUEZA
});

const itzel = new Character({
    name: 'Itzel',
    container: itzelElements.itzelContenedor,
    imageElement: itzelElements.itzelImagen,
    dialogContainer: itzelElements.itzelContenedorDialogo,
    dialogTextElement: itzelElements.itzelContenedorDialogo.querySelector('.itzel__dialogo__parrafo'),
    dialogHeadImage: itzelElements.itzelContenedorDialogo.querySelector('.itzel__head__imagen'),
    audio: itzelElements.audioItzel,
    images: itzelElements.IMAGENES_ITZEL
});

// -----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    reproducirVideoTutorial();
    ocultarBotonDialogo();
})

btnCerrarModal.addEventListener('click', () => {
    aplicarEstilos(modal, {display: 'none'}); // Ocultar el modal en todos los casos

    if (isGameExplanationModalOpen) {
        isGameExplanationModalOpen = false;
        iniciarJuegoMemorama();
    } else if (isGaleriaModalOpen) {
        isGaleriaModalOpen = false;
        // Restaurar la visibilidad del contenido visual si se ocultó para la galería
        document.querySelector('.modal__contenido-visual').style.display = 'block'; 
    } else if (isAciertoModalOpen) {
        isAciertoModalOpen = false;
        // Si era el último acierto, muestra el modal de fin de juego
        if (aciertos === 5) { // 5 es el número total de pares
            mostrarModalFinJuego();
        }
    } else if (isFinJuegoModalOpen) {
        isFinJuegoModalOpen = false;
        iniciarEscenaFinal();
    } else { // Este es el caso del modal de tutorial inicial
        addAnimation();
        reproducirAudioLobby();
        // Restaurar la visibilidad del contenido visual si se ocultó para el tutorial
        document.querySelector('.modal__contenido-visual').style.display = 'block'; 
    }
})


juezaElements.imagenCerrarDialogoJueza.addEventListener('click', () => {
    establecerDialogoOculto(jueza.dialogContainer)
})

itzelElements.imagenCerrarDialogoItzel.addEventListener('click', () => {
    establecerDialogoOculto(itzel.dialogContainer)
})

titoElements.imagenCerrarDialogo.addEventListener('click', () => {
    establecerDialogoOculto(tito.dialogContainer)
})

buttonDialogo.addEventListener('click', mostrarDialogoOculto)

buttonSonido.addEventListener('click', reproducirAudioLobby)
 
btnGaleria.addEventListener('click', () => {
    isGaleriaModalOpen = true; 
    const contenidoVisual = modalContenedorContenidoVisual.firstElementChild;
    if(contenidoVisual.tagName === 'VIDEO'){
        cambiarContenidoModal();
    }
    aplicarEstilos(modal, {display: 'flex'});
})

function cambiarContenidoModal(){
    const modalContenidoHeading = document.querySelector('.modal__contenido h4');
    const modalContenidoParrafo = document.querySelector('.modal__contenido p'); 

    modalContenedorContenidoVisual.removeChild(modalContenedorContenidoVisual.firstElementChild); 
    
    const nuevaImagen = document.createElement('img'); 
    nuevaImagen.src = IMAGEN_SALA_JUICIO;
    modalContenedorContenidoVisual.appendChild(nuevaImagen);
    modalContenidoHeading.textContent = 'Sala de Juicios';
    modalContenidoParrafo.textContent = 'Esta es una imagen real de cómo se ve este lugar en la vida real. De esta manera, si un día llegas a ir, ¡ya sabrás cómo es!'
    btnCerrarModal.textContent = 'Cerrar'; 
}

// Función para el clic en Tito
tito.onClick(async () => {
    await manejarDialogos();
});

// Función para el clic en la Jueza
jueza.onClick(async () => {
    await manejarDialogos();
});

// Función para el clic en Itzel
itzel.onClick(async () => {
    await manejarDialogos();
});

// La función manejarClicPersonaje ya no es necesaria, su lógica se simplifica y se mueve a manejarDialogos
// y a los listeners de los botones de continuar.

async function reproducirVideoTutorial(){
    modalContenidoVideo.loop = true;
    // modalContenidoVideo.play();

    // Intenta reproducir el video y maneja el error si la reproducción automática es bloqueada.
    try {
        await modalContenidoVideo.play();
    } catch (err) {
        console.error("La reproducción automática del video fue bloqueada por el navegador.", err);
        // Opcional: Podrías mostrar un botón de play sobre el video si la reproducción automática falla.
    }
}

function mostrarModalExplicacionJuego() {
    const modalContenidoHeading = document.querySelector('.modal__contenido h4');
    const modalContenidoParrafo = document.querySelector('.modal__contenido p');
    const modalCerrarBtn = document.querySelector('.modal__contenido__cerrar');
    const modalContenidoVisual = document.querySelector('.modal__contenido-visual');

    modalContenidoHeading.textContent = "¡Es hora de jugar!";
    modalContenidoParrafo.innerHTML = "Voltea dos cartas y busca las que sean iguales. Cada par representa a una persona que está en la sala de juicio y puede ayudarte, como la jueza, tus padres o la psicóloga. Sigue jugando hasta encontrar todas las parejas.";

    // Asegurarse de que el contenido visual (video/imagen) esté oculto para este modal
    while (modalContenidoVisual.firstChild) {
        modalContenidoVisual.removeChild(modalContenidoVisual.firstChild);
    }
    modalContenidoVisual.style.display = 'none'; // Ocultar el contenedor visual

    modalCerrarBtn.textContent = "Jugar";
    aplicarEstilos(modal, {display: 'flex'});
    isGameExplanationModalOpen = true;
}

function restaurarPosicionJueza() {
    const juezaContenedor = jueza.container;
    aplicarEstilos(juezaContenedor, {
        gridColumn: '5 / 6', // Mover a la Jueza a la columna 5
        justifyContent: 'end' // Alinear con el "piso"
    });
    aplicarEstilos(jueza.imageElement, { transform: 'translateX(-50%) scale(1.1) translateY(-12.5%)' }); // Centrar en la línea 5, escalar y mover hacia arriba
}

function iniciarEscenaFinal() {
    // 1. Ocultar el memorama
    const memoramaContenedor = document.querySelector('.memorama__contenedor');
    ocultarElemento(memoramaContenedor);
    memoramaContenedor.innerHTML = ''; // Limpiar las tarjetas del tablero

    // 2. Mostrar a Tito e Itzel y ocultar a la Jueza
    mostrarElemento(tito.container);
    mostrarElemento(itzel.container);
    itzel.imageElement.src = 'src/img/Itzel-Saludando.png'; // Cambiar a la imagen de Itzel saludando
    ocultarElemento(jueza.container);

    // 3. Preparar y mostrar el diálogo final de Tito
    dialogoIndice = 9; // El índice del último diálogo en dialogos.js
    addAnimation(); // Esto hará que Tito sea clickeable para su diálogo final
}

function mostrarModalAcierto(mensaje) {
    const modalContenidoHeading = document.querySelector('.modal__contenido h4');
    const modalContenidoParrafo = document.querySelector('.modal__contenido p');
    const modalCerrarBtn = document.querySelector('.modal__contenido__cerrar');
    const modalContenidoVisual = document.querySelector('.modal__contenido-visual');

    modalContenidoHeading.textContent = "¡Haz dado en el clavo!";
    modalContenidoParrafo.innerHTML = mensaje;

    // Asegurarse de que el contenido visual (video/imagen) esté oculto para este modal
    modalContenidoVisual.style.display = 'none';

    modalCerrarBtn.textContent = "Continuar";
    aplicarEstilos(modal, {display: 'flex'});
    isAciertoModalOpen = true;
}

function mostrarModalFinJuego() {
    const modalContenidoHeading = document.querySelector('.modal__contenido h4');
    const modalContenidoParrafo = document.querySelector('.modal__contenido p');
    const modalCerrarBtn = document.querySelector('.modal__contenido__cerrar');
    const modalContenidoVisual = document.querySelector('.modal__contenido-visual');

    modalContenidoHeading.textContent = "¡Felicidades!";
    modalContenidoParrafo.innerHTML = "¡Muchas felicidades, lograste encontrar a todos!";
    modalContenidoVisual.style.display = 'none';
    modalCerrarBtn.textContent = "Finalizar";

    aplicarEstilos(modal, {display: 'flex'});
    isFinJuegoModalOpen = true;

    if (audioConfeti) {
        audioConfeti.currentTime = 0;
        audioConfeti.play();
    }

    // Lanza el confeti
    confetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.6 }
    });
}

function iniciarJuegoMemorama() {
    // 1. Ocultar personajes y diálogos
    ocultarElemento(tito.container);
    ocultarElemento(itzel.container);
    ocultarElemento(jueza.container);
    tito.hideDialog();
    itzel.hideDialog();
    jueza.hideDialog();

    const memoramaContenedor = document.querySelector('.memorama__contenedor');
    memoramaContenedor.innerHTML = ''; // Limpiar el tablero por si se juega de nuevo
    mostrarElemento(memoramaContenedor);

    // 2. Definir las imágenes para las tarjetas
    const imagenesTarjetas = [
        { id: 'Abogada', img: 'src/img/memorama/abogada.png' },
        { id: 'Jueza', img: 'src/img/memorama/jueza.png' },
        { id: 'Padres', img: 'src/img/memorama/padres.png' },
        { id: 'Policía', img: 'src/img/memorama/policia.png' },
        { id: 'Psicóloga', img: 'src/img/memorama/psicologa.png' }
    ];

    // Duplicar para tener los pares
    let tarjetas = [...imagenesTarjetas, ...imagenesTarjetas];

    // 3. Barajar las tarjetas
    tarjetas.sort(() => 0.5 - Math.random());

    // 4. Lógica del juego
    let tarjetasVolteadas = [];
    aciertos = 0; // Reiniciar el contador de aciertos
    let esperando = false; // Para evitar que se volteen más de 2 tarjetas

    // 5. Crear y añadir las tarjetas al DOM
    tarjetas.forEach(data => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('memorama__tarjeta');
        tarjeta.dataset.id = data.id;

        tarjeta.innerHTML = `
            <div class="memorama__tarjeta-cara memorama__tarjeta-reverso"></div>
            <div class="memorama__tarjeta-cara memorama__tarjeta-frente">
                <p class="memorama__tarjeta-nombre">${data.id}</p>
                <img src="${data.img}" alt="Imagen de ${data.id}">
            </div>
        `;

        tarjeta.addEventListener('click', () => {
            if (esperando || tarjeta.classList.contains('volteada')) return;

            if(audioFlip){
                audioFlip.currentTime = 0;
                audioFlip.play();
            }

            tarjeta.classList.add('volteada');
            tarjetasVolteadas.push(tarjeta);

            if (tarjetasVolteadas.length === 2) {
                esperando = true;
                const [tarjeta1, tarjeta2] = tarjetasVolteadas;

                if (tarjeta1.dataset.id === tarjeta2.dataset.id) {
                    // ¡Es un par!
                    if(audioAcierto){
                        audioAcierto.currentTime = 0;
                        audioAcierto.play();
                    }
                    
                    // Espera un segundo para que el usuario vea el par antes de marcarlo como acierto.
                    setTimeout(() => {
                        aciertos++; // Mover el incremento de aciertos aquí
                        tarjeta1.classList.add('acertada');
                        tarjeta2.classList.add('acertada');
                        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)].mensajes;
                        mostrarModalAcierto(mensajeAleatorio);
                        tarjetasVolteadas = [];
                        esperando = false;
                    }, 1000); // 1 segundo de espera

                } else {
                    // No es un par
                    setTimeout(() => {
                        tarjeta1.classList.remove('volteada');
                        tarjeta2.classList.remove('volteada');
                        tarjetasVolteadas = [];
                        esperando = false;
                    }, 1200); // Espera un poco antes de voltearlas de nuevo
                }
            }
        });
        memoramaContenedor.appendChild(tarjeta);
    });
}

async function manejarDialogos(){
    if (dialogoIndice < dialogos.length && !isTyping) {
        if(btnDialogoActivated){
            btnDialogoActivated = false;
            ocultarBotonDialogo();
        }
        const characterObject = getCharacterObject(dialogos[dialogoIndice].persona);

        // Mostrar el modal de explicación del juego después del diálogo específico de la Jueza
        if (dialogoIndice === 8 && characterObject.name === 'Jueza') {
            await mostrarDialogo(); // Muestra el último diálogo de la jueza
            setTimeout(mostrarModalExplicacionJuego, 500); // Espera un poco y muestra el modal
            return; // Detener el flujo de diálogo hasta que se cierre el modal
        }

        // Si es el primer clic en la Jueza, la movemos a su posición final en el suelo.
        if (characterObject.name === 'Jueza' && dialogoIndice === 5) {
            restaurarPosicionJueza();
        }

        characterObject.setClickable(false);
        characterObject.startTalking();
        await mostrarDialogo();
        characterObject.stopTalking();

        dialogoIndice++;

        // Lógica de botones de continuar
        if (dialogoIndice === 5) { // Después del último diálogo de Tito, antes de que hable la Jueza
            crearBotonContinuar(tito.dialogTextElement.parentElement);
        } else {
            addAnimation();
        }
    }
}

function reproducirAudioLobby(){
    audioLobby.loop = true; 
    if(audioLobby.paused){
        btnSonidoImagen.src =imagenes_btn_sonido.sonido_on;
        audioLobby.play();
    }else{
        btnSonidoImagen.src = imagenes_btn_sonido.sonido_off;
        audioLobby.pause();
    }
}

function establecerDialogoOculto(elemento){
    if(isTyping) return;
    dialogoOculto = elemento;
    ocultarElemento(dialogoOculto); 
    btnDialogoActivated = true;
    mostarBotonDialogo();
}

function mostrarDialogoOculto(){
    ocultarBotonDialogo();
    btnDialogoActivated = false;
    mostrarElemento(dialogoOculto);
}

function crearBotonContinuar(elemento){
    const buttonContinuar = document.createElement('button'); 
    buttonContinuar.textContent = 'Continuar';
    buttonContinuar.classList.add('btn-continuar', 'animate-clickable');
    elemento.appendChild(buttonContinuar); 
    buttonContinuar.addEventListener('click', () => {
        posicionarElementos();
        elemento.removeChild(buttonContinuar)
    })
}

function ocultarBotonDialogo(){
    buttonDialogo.style.display = 'none';
}

function mostarBotonDialogo(){
    buttonDialogo.style.display = 'inline-block';
}

function getCharacterObject(characterName) {
    if (characterName === 'Tito') return tito;
    if (characterName === 'Jueza') return jueza;
    if (characterName === 'Itzel') return itzel;

    // Podrías añadir más personajes aquí
    return null;
}

function addAnimation(){
    if (dialogoIndice > dialogos.length-1) return;
    const currentCharacter = dialogos[dialogoIndice].persona;

    // Desactivar a todos
    tito.setClickable(false);
    jueza.setClickable(false);
    itzel.setClickable(false);

    // Activar solo al actual
    const characterToAnimate = getCharacterObject(currentCharacter);
    if (characterToAnimate) {
        characterToAnimate.setClickable(true);
    }

}
// Funciones de configuración de posiciones

function configurarPosicionIntermedia() {
    // Ocultar Tito
    tito.hideDialog(); // Solo ocultamos el diálogo de Tito, no el personaje
    tito.dialogContainer.classList.remove('flex');
    tito.dialogContainer.classList.add('oculto');

    const juezaContenedor = jueza.container;

    // Jueza
    aplicarEstilos(juezaContenedor, {
        gridColumn: '5 / 6', // Posicionar en la columna 5
        justifyContent: 'center' // Centrar verticalmente
    });
    jueza.imageElement.src = jueza.images.mazo; // Usar la imagen del mazo
    aplicarEstilos(jueza.imageElement, {
        transform: 'translateX(calc(-50% - 15px)) translateY(66px) scale(0.5) ' // Ajustar posición y tamaño, y translateY
    });
    aplicarEstilos(jueza.dialogContainer, {
        gridColumn: '4 / 6',
        height: '90%',
        justifyContent: 'center',
    });
    mostrarElemento(juezaContenedor);

    // Itzel
    // Itzel ya no se mueve, se queda en su posición definida en el CSS.
    aplicarEstilos(itzel.imageElement, { transform: 'scale(1.1)' });
}

// Funciones de diálogo por personaje

// Función principal de mostrar diálogo
async function mostrarDialogo() {
    if (isTyping) return;
    isTyping = true;

    const dialogo = dialogos[dialogoIndice];

    // Ocultar todos los diálogos primero
    tito.hideDialog();
    jueza.hideDialog();
    itzel.hideDialog();

    // Mostrar el diálogo según el personaje
    const characterToTalk = getCharacterObject(dialogo.persona);
    if(characterToTalk) {
        await characterToTalk.showDialog(dialogo.texto);
    } else {
        console.warn(`Personaje "${dialogo.persona}" no encontrado.`);
    }

    isTyping = false;
}

// Función de posicionamiento de elementos
async function posicionarElementos() {
    // Determinar configuración según el índice
    if (dialogoIndice === 5) { // Cuando va a hablar la Jueza
        addAnimation(); // Llama a addAnimation para que la Jueza sea clickeable
        configurarPosicionIntermedia();
    } 
}
