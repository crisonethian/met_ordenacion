const container = document.getElementById('visualizationContainer');
const beep = new Audio('../beep.wav'); // Cargar el archivo de sonido beep
beep.volume = 0.2; // Ajustar el volumen a un 50%

const successSound = new Audio('../success.mp3'); // Cargar el archivo de sonido success
successSound.volume = 0.2; // Ajustar el volumen a un 50%

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

// Algoritmo Merge Sort
async function mergeSort(arr) {
    await mergeSortHelper(arr, 0, arr.length - 1);
    await animarBarrasFinal(arr); // Animar las barras ya ordenadas
}

// Función auxiliar de Merge Sort
async function mergeSortHelper(arr, left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid); // Ordenar la mitad izquierda
        await mergeSortHelper(arr, mid + 1, right); // Ordenar la mitad derecha
        await merge(arr, left, mid, right); // Mezclar las dos mitades
    }
}

// Función para mezclar dos subarreglos
async function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }
        dibujarBarras(arr); // Actualizar visualización
        await reproducirSonidoBeep(); // Reproducir sonido beep
        await delay(20); // Esperar un poco para ver el movimiento
        k++;
    }

    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        dibujarBarras(arr); // Actualizar visualización
        await reproducirSonidoBeep(); // Reproducir sonido beep
        await delay(20); // Esperar un poco para ver el movimiento
        i++;
        k++;
    }

    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        dibujarBarras(arr); // Actualizar visualización
        await reproducirSonidoBeep(); // Reproducir sonido beep
        await delay(20); // Esperar un poco para ver el movimiento
        j++;
        k++;
    }
}

// Función para reproducir el sonido beep
async function reproducirSonidoBeep() {
    console.log("Reproduciendo sonido beep"); // Agregar esta línea para depuración
    beep.currentTime = 0; // Reiniciar el sonido
    await beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores
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
    await mergeSort(numeros);
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosDesordenados();
dibujarBarras(numerosIniciales);
