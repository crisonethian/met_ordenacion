const container = document.getElementById('visualizationContainer');
const beep = new Audio('../beep.wav'); // Cargar el archivo de sonido beep
beep.volume = 0.1; // Aumentar el volumen a un 50%

const successSound = new Audio('../success.mp3'); // Cargar el archivo de sonido success
successSound.volume = 0.2; // Aumentar el volumen a un 50%

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

// Algoritmo Radix Sort
async function radixSort(arr) {
    const max = Math.max(...arr); // Encontrar el valor máximo
    let exp = 1; // Exponente para el lugar actual

    while (Math.floor(max / exp) > 0) {
        await countingSort(arr, exp); // Realizar el Counting Sort
        exp *= 10; // Mover al siguiente lugar
    }
}

// Función de Counting Sort para el Radix Sort
async function countingSort(arr, exp) {
    const n = arr.length;
    const output = new Array(n); // Array de salida
    const count = new Array(10).fill(0); // Array para contar ocurrencias

    // Contar ocurrencias
    for (let i = 0; i < n; i++) {
        count[Math.floor((arr[i] / exp) % 10)]++;
    }

    // Calcular posiciones en el output
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Construir el array de salida
    for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor((arr[i] / exp) % 10)] - 1] = arr[i];
        count[Math.floor((arr[i] / exp) % 10)]--;
    }

    // Copiar el array de salida a arr
    for (let i = 0; i < n; i++) {
        // Actualizar visualización
        const bar = container.children[i];
        bar.style.height = `${output[i] * 5}px`; // Ajustar la altura de las barras
        
        // Reproducir sonido "beep.wav" cada vez que se mueve una barra
        beep.currentTime = 0; // Reiniciar el sonido
        beep.play().catch(error => console.error("Error al reproducir sonido:", error)); // Intentar reproducir sonido y capturar errores

        await delay(50); // Cambiar delay a 50 ms para mostrar el movimiento
    }

    // Copiar de output a arr
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
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
    await radixSort(numeros); // Llamar a Radix Sort
    await animarBarrasFinal(numeros); // Animar barras ya ordenadas
});

// Generar y mostrar los números desordenados al cargar
const numerosIniciales = generarNumerosDesordenados();
dibujarBarras(numerosIniciales);
