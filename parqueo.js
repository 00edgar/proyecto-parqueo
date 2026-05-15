const TOTAL_SLOTS = 20;
// Array para guardar el estado: null es libre, un objeto es ocupado
let slots = Array(TOTAL_SLOTS).fill(null); 
let historialHoy = [];

// Inicializar el mapa al cargar
function initMap() {
    const grid = document.getElementById('parking-map');
    grid.innerHTML = '';
    
    slots.forEach((slot, index) => {
        const div = document.createElement('div');
        div.className = `slot ${slot ? 'occupied' : 'available'}`;
        
        // Si hay un vehículo, mostramos su placa, si no, el número de slot
        div.innerHTML = `
            ${index + 1}
            <span>${slot ? slot.placa : 'LIBRE'}</span>
        `;
        
        // Si está ocupado, al hacer clic liberamos el espacio
        div.onclick = () => { 
            if(slot) registrarSalida(index); 
        };
        
        grid.appendChild(div);
    });
    
    actualizarEstadisticas();
}

function registrarEntrada() {
    const placaInput = document.getElementById('input-placa');
    const placa = placaInput.value.toUpperCase().trim();
    const tipo = document.getElementById('input-tipo').value;

    if (!placa) {
        alert('Por favor, ingrese una placa.');
        return;
    }

    // Buscar primer espacio libre
    const indiceLibre = slots.indexOf(null);
    if (indiceLibre === -1) {
        alert('Lo sentimos, el parqueo está lleno.');
        return;
    }

    // Guardar datos en el slot
    slots[indiceLibre] = {
        placa: placa,
        tipo: tipo,
        horaEntrada: new Date()
    };

    // Añadir al historial general del día
    historialHoy.push({ placa, tipo, entrada: new Date() });
    
    // Limpiar input y refrescar vista
    placaInput.value = '';
    initMap();
}

function registrarSalida(index) {
    const vehiculo = slots[index];
    
    if (confirm(`¿Desea registrar la salida del vehículo ${vehiculo.placa}?`)) {
        const horaSalida = new Date();
        const diferenciaMs = horaSalida - vehiculo.horaEntrada;
        const minutosTranscurridos = Math.round(diferenciaMs / 60000);

        // Actualizar el historial con la duración para el promedio
        const registro = historialHoy.find(h => h.placa === vehiculo.placa && !h.duracion);
        if (registro) {
            registro.duracion = minutosTranscurridos;
        }

        // Liberar el slot
        slots[index] = null;
        initMap();
    }
}

function actualizarEstadisticas() {
    const ocupados = slots.filter(s => s !== null).length;
    const tasa = (ocupados / TOTAL_SLOTS) * 100;
    
    // Actualizar textos en el Dashboard
    document.getElementById('stat-occupancy').innerText = `${ocupados}/${TOTAL_SLOTS}`;
    document.getElementById('stat-rate').innerText = `${tasa.toFixed(1)}%`;
    document.getElementById('stat-total').innerText = historialHoy.length;
    document.getElementById('msg-disponibles').innerText = `Espacios disponibles: ${TOTAL_SLOTS - ocupados}`;

    // Calcular tiempo promedio de los que ya salieron
    const vehiculosConSalida = historialHoy.filter(h => h.duracion !== undefined);
    if (vehiculosConSalida.length > 0) {
        const sumaTiempos = vehiculosConSalida.reduce((acc, v) => acc + v.duracion, 0);
        const promedio = sumaTiempos / vehiculosConSalida.length;
        document.getElementById('stat-avg-time').innerText = `${Math.round(promedio)} min`;
    }
}

// Ejecutar al iniciar
initMap();