const container = document.getElementById('visualizationContainer');
const beep = new Audio('../beep.wav'); // Cargar el archivo de sonido beep
beep.volume = 0.1; // Ajustar el volumen a un 10%

const successSound = new Audio('../success.mp3'); // Cargar el archivo de sonido success
successSound.volume = 0.2; // Ajustar el volumen a un 10%

// Generar números consecutivos del 1 al 80 y desordenarlos
function generarNumerosDesordenados() {
    const numeros = Array.from({ length: 80 }, (_, i) => i + 1); // Crear números del 1 al 80
    // Algoritmo de Fisher-Yates para desordenar
    for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]]; // Intercambio
    }
    return numeros;
}

// Dibujar las barras en el contenedor
function dibujarBarras(numeros) {
    container.innerHTML = ''; // Limpiar el contenedor
    const barWidth = container.clientWidth / numeros.length; // Ancho de cada barra
    numeros.forEach(num => {
        const bar = document.createElement('div');
        bar.classList.add('barra');
        bar.style.height = `${num * 5}px`; // Ajustar la altura a 5
        bar.style.width = `${barWidth}px`; // Ajustar el ancho
        container.appendChild(bar);
    });
}

// Algoritmo Cocktail Sort
async function cocktailSort(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;

    while (swapped) {
        swapped = false;

        // De izquierda a derecha
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // Intercambiar
                dibujarBarras(arr); // Actualizar visualización
                await delay(5); // Esperar un poco para ver el movimiento
                swapped = true; // Hubo intercambio
            }
        }

        // Si no hubo intercambio, salir
        if (!swapped) break;

        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores

        swapped = false;
        end--; // Disminuir el rango superior

        // De derecha a izquierda
        for (let i = end; i > start; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]]; // Intercambiar
                dibujarBarras(arr); // Actualizar visualización
                await delay(5); // Esperar un poco para ver el movimiento
                swapped = true; // Hubo intercambio
            }
        }

        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores

        start++; // Aumentar el rango inferior
    }
    await animarBarrasFinal(arr); // Animar barras ya ordenadas
}

// Función para pausar la ejecución
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para animar las barras ordenadas
async function animarBarrasFinal(arr) {
    successSound.currentTime = 0; // Reiniciar el sonido de éxito
    await successSound.play().catch(error => console.error("Error al reproducir sonido de éxito:", error)); // Reproducir sonido de éxito

    const durationPerBar = 5; // Tiempo en ms para pintar cada barra
    for (let i = 0; i < arr.length; i++) {
        const bar = container.children[i];
        bar.classList.add('barra-roja'); // Cambiar a color rojo
        await delay(durationPerBar); // Esperar un poco para ver la animación
    }
}

// Manejo del evento del botón "Ordenar"
document.getElementById('ordenar').addEventListener('click', async () => {
    const numeros = generarNumerosDesordenados(); // Generar números consecutivos desordenados
    dibujarBarras(numeros);
    await cocktailSort(numeros); // Llamar a Cocktail Sort
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosDesordenados();
dibujarBarras(numerosIniciales);
