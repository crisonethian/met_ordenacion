const container = document.getElementById('visualizationContainer');
const beep = new Audio('../beep.wav'); // Cargar el archivo de sonido beep
beep.volume = 0.1; // Ajustar el volumen a un 10%

const successSound = new Audio('../success.mp3'); // Cargar el archivo de sonido success
successSound.volume = 0.2; // Ajustar el volumen a un 10%

// Generar números consecutivos del 1 al 80
function generarNumerosConsecutivos() {
    return Array.from({ length: 80 }, (_, i) => i + 1); // Crear números del 1 al 80
}

// Mezclar los números
function mezclarNumeros(numeros) {
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

// Algoritmo de Ordenación por Inserción
async function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        // Mover los elementos que son mayores que 'key' a una posición adelante
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            dibujarBarras(arr); // Actualizar visualización
            await delay(5); // Esperar un poco para ver el movimiento
            j--;
        }
        arr[j + 1] = key; // Colocar 'key' en su posición correcta
        dibujarBarras(arr); // Actualizar visualización
        
        // Reproducir el sonido cuando la barra queda ordenada
        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores

        await delay(5); // Esperar un poco para ver el movimiento
    }
    await animarBarrasFinal(arr); // Animar las barras ya ordenadas
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
    const numeros = generarNumerosConsecutivos(); // Generar números consecutivos
    const numerosDesordenados = mezclarNumeros(numeros); // Mezclar los números
    dibujarBarras(numerosDesordenados);
    await insertionSort(numerosDesordenados); // Ordenar
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosConsecutivos();
const numerosDesordenadosIniciales = mezclarNumeros(numerosIniciales); // Mezclar los números
dibujarBarras(numerosDesordenadosIniciales); // Dibujar barras desordenadas
