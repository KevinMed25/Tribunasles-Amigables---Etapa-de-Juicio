import { mostrarElemento, ocultarElemento } from "./helpers.js";

export class Character {
    constructor(config) {
        this.name = config.name;
        this.container = config.container;
        this.imageElement = config.imageElement;
        this.dialogContainer = config.dialogContainer;
        this.dialogTextElement = config.dialogTextElement;
        this.dialogHeadImage = config.dialogHeadImage;
        this.audio = config.audio;
        this.images = config.images;

        this.isClickable = false;

        this.container.addEventListener('click', () => this.handleClick());
        this.onClickCallback = null;
    }

    // Asigna una función que se ejecutará al hacer clic
    onClick(callback) {
        this.onClickCallback = callback;
    }

    // Maneja el clic solo si el personaje es "clicable"
    handleClick() {
        if (this.isClickable && this.onClickCallback) {
            this.onClickCallback();
        }
    }

    // Activa o desactiva la animación de "clic"
    setClickable(canClick) {
        this.isClickable = canClick;
        if (canClick) {
            this.container.classList.add('animate-clickable');
        } else {
            this.container.classList.remove('animate-clickable');
        }
    }

    // Muestra el diálogo con efecto de escritura
    async showDialog(text) {
        this.imageElement.src = this.images.hablando;
        // Si es la Jueza, la movemos un poco a la izquierda al hablar
        if (this.name === 'Jueza' && this.imageElement.style.transform.includes('translateX(-50%)')) {
            this.imageElement.style.transform = 'translateX(calc(-50% - 20px)) scale(1.1) translateY(-12.5%)';
        }
        mostrarElemento(this.dialogContainer);
        this.dialogHeadImage.classList.add('animate-talking-minihead');
        await this.typeText(text); // Ya no es necesario pasar la URL
        this.dialogHeadImage.classList.remove('animate-talking-minihead');
    }

    hideDialog() {
        ocultarElemento(this.dialogContainer);
    }

    // Inicia la animación de hablar
    startTalking() {
        this.container.classList.add('animate-talking');
    }

    // Detiene la animación de hablar
    stopTalking() {
        this.container.classList.remove('animate-talking');
        this.imageElement.src = this.images.normal;
        // Si es la Jueza, la devolvemos a su posición original al dejar de hablar
        if (this.name === 'Jueza' && this.imageElement.style.transform.includes('translateX(calc(-50% - 20px))')) {
            this.imageElement.style.transform = 'translateX(-50%) scale(1.1) translateY(-12.5%)';
        }
    }

    // Efecto de escritura
    async typeText(text, speed = 65) {
        this.dialogTextElement.textContent = "";
        for (let i = 0; i < text.length; i++) {
            this.dialogTextElement.textContent += text[i];
            // Llama a la función de sonido fluido al inicio de cada palabra
            if (i === 0 || text[i-1] === ' ') {
                this.playFluidSpeechSound();
            }
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    playFluidSpeechSound(volume = 0.7) {
        // Reutilizamos el audio del personaje en lugar de crear uno nuevo
        const audio = this.audio;
        audio.pause();
        audio.currentTime = 0;
        const randomPitch = 0.8 + Math.random() * 0.4;
        audio.playbackRate = randomPitch;
        audio.preservesPitch = false; // Es importante para que el cambio de pitch funcione bien
        audio.volume = volume;
        audio.play().catch(e => { /* Silenciamos errores de interrupción, que son normales aquí */ });
    }
}