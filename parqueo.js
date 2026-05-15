const CARRO_SLOTS = 20;
const MOTO_SLOTS = 10;

// Estructura de datos: { id, tipo, estado: null | {placa, entrada} }
let slots = [
    ...Array.from({length: CARRO_SLOTS}, (_, i) => ({ id: i + 1, tipo: 'Carro', datos: null })),
    ...Array.from({length: MOTO_SLOTS}, (_, i) => ({ id: i + 1, tipo: 'Moto', datos: null }))
];

let historial = [];

function init() {
    renderGrids();
    renderListaOcupados();
    actualizarDashboard();
}

function renderGrids() {
    const gridCarros = document.getElementById('grid-carros');
    const gridMotos = document.getElementById('grid-motos');
    
    gridCarros.innerHTML = '';
    gridMotos.innerHTML = '';

    slots.forEach((slot, index) => {
        const div = document.createElement('div');
        div.className = `slot ${slot.datos ? 'occupied' : 'available'}`;
        div.innerHTML = `Slot ${slot.id} <span>${slot.datos ? slot.datos.placa : 'LIBRE'}</span>`;
        div.onclick = () => { if(slot.datos) registrarSalida(index); };

        if(slot.tipo === 'Carro') gridCarros.appendChild(div);
        else gridMotos.appendChild(div);
    });
}

function registrarEntrada() {
    const placa = document.getElementById('input-placa').value.toUpperCase().trim();
    const tipo = document.getElementById('input-tipo').value;

    if(!placa) return alert("Ingrese placa");

    // Buscar espacio por tipo
    const index = slots.findIndex(s => s.tipo === tipo && s.datos === null);

    if(index === -1) return alert(`No hay espacios disponibles para ${tipo}s`);

    slots[index].datos = {
        placa: placa,
        entrada: new Date()
    };

    historial.push({ placa, tipo, entrada: new Date() });
    document.getElementById('input-placa').value = '';
    init();
}

function registrarSalida(index) {
    const vehiculo = slots[index];
    if(confirm(`¿Salida de ${vehiculo.datos.placa}?`)) {
        const hIndex = historial.findIndex(h => h.placa === vehiculo.datos.placa && !h.duracion);
        if(hIndex !== -1) {
            const duracion = Math.round((new Date() - historial[hIndex].entrada) / 60000);
            historial[hIndex].duracion = duracion;
        }
        slots[index].datos = null;
        init();
    }
}

function renderListaOcupados() {
    const container = document.getElementById('lista-ocupados-body');
    const panel = document.getElementById('panel-ocupados');
    container.innerHTML = '';
    
    const ocupados = slots.filter(s => s.datos !== null);
    
    // Si no hay ocupados, ocultamos el panel
    panel.style.display = ocupados.length > 0 ? 'block' : 'none';

    ocupados.forEach(slot => {
        const row = document.createElement('tr');
        const hora = slot.datos.entrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        row.innerHTML = `
            <td><strong>${slot.datos.placa}</strong></td>
            <td>${slot.tipo}</td>
            <td>#${slot.id}</td>
            <td>${hora}</td>
            <td><button class="btn-salida" onclick="gestionarSalidaDesdeLista('${slot.datos.placa}')">Salida</button></td>
        `;
        container.appendChild(row);
    });
}

function gestionarSalidaDesdeLista(placa) {
    const index = slots.findIndex(s => s.datos?.placa === placa);
    if(index !== -1) registrarSalida(index);
}

function actualizarDashboard() {
    const totalOcupados = slots.filter(s => s.datos !== null).length;
    const totalSlots = CARRO_SLOTS + MOTO_SLOTS;
    
    document.getElementById('stat-occupancy').innerText = `${totalOcupados}/${totalSlots}`;
    document.getElementById('stat-rate').innerText = `${((totalOcupados/totalSlots)*100).toFixed(1)}%`;
    document.getElementById('stat-total').innerText = historial.length;

    const salidos = historial.filter(h => h.duracion !== undefined);
    if(salidos.length > 0) {
        const prom = salidos.reduce((a, b) => a + b.duracion, 0) / salidos.length;
        document.getElementById('stat-avg-time').innerText = `${Math.round(prom)} min`;
    }
}

init();