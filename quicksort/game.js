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

// Algoritmo Quick Sort
async function quickSort(arr, low, high) {
    if (low < high) {
        const pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1); // Recursión en la parte izquierda
        await quickSort(arr, pi + 1, high); // Recursión en la parte derecha
    }
}

// Función de partición
async function partition(arr, low, high) {
    const pivot = arr[high]; // Tomar el último elemento como pivote
    let i = low - 1; // Índice del elemento más pequeño
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Intercambiar
            dibujarBarras(arr); // Actualizar visualización
            await delay(30); // Esperar un poco para ver el movimiento
            // Reproducir sonido al intercambiar
            beep.currentTime = 0; // Reiniciar el sonido
            beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Intercambiar el pivote
    dibujarBarras(arr); // Actualizar visualización
    await delay(30); // Esperar para mostrar el intercambio del pivote
    return i + 1; // Devolver el índice del pivote
}

// Función para pausar la ejecución
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para animar las barras ordenadas
async function animarBarrasFinal(arr) {
    successSound.currentTime = 0; // Reiniciar el sonido de éxito
    await successSound.play().catch(error => console.error("Error al reproducir sonido de éxito:", error)); // Reproducir sonido de éxito

    const durationPerBar = 10; // Tiempo en ms para pintar cada barra más rápido
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
    await quickSort(numeros, 0, numeros.length - 1); // Llamar a Quick Sort
    await animarBarrasFinal(numeros); // Animar barras ya ordenadas
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosDesordenados();
dibujarBarras(numerosIniciales);
