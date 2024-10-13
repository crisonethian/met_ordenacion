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
        bar.style.height = `${num * 5}px`; // Ajustar la altura
        bar.style.width = `${barWidth}px`; // Ajustar el ancho
        container.appendChild(bar);
    });
}

// Algoritmo Heap Sort
async function heapSort(arr) {
    const n = arr.length;

    // Construir el heap (reordenar el array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }

    // Extraer elementos del heap uno por uno
    for (let i = n - 1; i > 0; i--) {
        // Mover la raíz actual al final
        [arr[0], arr[i]] = [arr[i], arr[0]];
        dibujarBarras(arr); // Actualizar visualización
        await delay(50); // Esperar para la visualización
        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido
        await heapify(arr, i, 0);
    }
}

// Función para crear el heap
async function heapify(arr, n, i) {
    let largest = i; // Inicializar el nodo más grande como raíz
    const left = 2 * i + 1; // Izquierda = 2*i + 1
    const right = 2 * i + 2; // Derecha = 2*i + 2

    // Si el hijo izquierdo es más grande que la raíz
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    // Si el hijo derecho es más grande que el más grande hasta ahora
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // Si el más grande no es la raíz
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Intercambiar
        dibujarBarras(arr); // Actualizar visualización
        await delay(50); // Esperar para la visualización
        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido

        // Recursivamente heapificar el subárbol afectado
        await heapify(arr, n, largest);
    }
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
    await heapSort(numeros); // Llamar a Heap Sort
    await animarBarrasFinal(numeros); // Animar barras ya ordenadas
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosDesordenados();
dibujarBarras(numerosIniciales);
