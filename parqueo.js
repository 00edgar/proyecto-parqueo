const CARRO_SLOTS = 20;
const MOTO_SLOTS = 10;

// 1. CARGAR DATOS INICIALES DESDE LOCALSTORAGE O CREARLOS POR PRIMERA VEZ
let slots = JSON.parse(localStorage.getItem('parking_slots'));

if (!slots) {
    // Si no existen datos guardados, creamos la estructura inicial libre
    slots = [
        ...Array.from({length: CARRO_SLOTS}, (_, i) => ({ id: i + 1, tipo: 'Carro', datos: null })),
        ...Array.from({length: MOTO_SLOTS}, (_, i) => ({ id: i + 1, tipo: 'Moto', datos: null }))
    ];
    guardarEnLocalStorage();
} else {
    // Si existían datos, convertimos los textos de las fechas de entrada de vuelta a objetos Date
    slots.forEach(slot => {
        if (slot.datos && slot.datos.entrada) {
            slot.datos.entrada = new Date(slot.datos.entrada);
        }
    });
}

// Cargar historial o iniciar vacío si no existe
let historial = JSON.parse(localStorage.getItem('parking_historial')) || [];
historial.forEach(h => {
    if (h.entrada) h.entrada = new Date(h.entrada);
});

// 2. FUNCIÓN AUXILIAR PARA GUARDAR EL ESTADO ACTUAL
function guardarEnLocalStorage() {
    localStorage.setItem('parking_slots', JSON.stringify(slots));
    localStorage.setItem('parking_historial', JSON.stringify(historial));
}

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

    const fechaEntrada = new Date();

    slots[index].datos = {
        placa: placa,
        entrada: fechaEntrada
    };

    historial.push({ placa, tipo, entrada: fechaEntrada });
    
    document.getElementById('input-placa').value = '';
    
    // GUARDAR CAMBIOS EN LOCALSTORAGE
    guardarEnLocalStorage();
    init();
}

function registrarSalida(index) {
    const vehiculo = slots[index];
    const ahora = new Date();
    
    if(confirm(`¿Confirmar salida de ${vehiculo.datos.placa}?`)) {
        const hIndex = historial.findIndex(h => h.placa === vehiculo.datos.placa && !h.duracion);
        let duracionMinutos = 0;

        if(hIndex !== -1) {
            duracionMinutos = Math.round((ahora - historial[hIndex].entrada) / 60000);
            // Si sale en menos de 1 minuto, lo dejamos como 1 minuto mínimo para el cobro
            if(duracionMinutos <= 0) duracionMinutos = 1; 
            historial[hIndex].duracion = duracionMinutos;
        }

        // --- CÁLCULO DE LA TARIFA SEGÚN EL TIEMPO Y TIPO ---
        // Ejemplo: Q0.50 por minuto para carros y Q0.25 para motos
        const tarifaPorMinuto = vehiculo.tipo === 'Carro' ? 0.50 : 0.25;
        const totalAPagar = duracionMinutos * tarifaPorMinuto;

        // --- IMPRESIÓN DEL RECIBO EN CONSOLA / ALERTA VISUAL ---
        generarReciboVisual({
            parqueo: "Campus Parking",
            slot: vehiculo.id,
            tipo: vehiculo.tipo,
            placa: vehiculo.datos.placa,
            entrada: vehiculo.datos.entrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            salida: ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            tiempo: `${duracionMinutos} min`,
            total: totalAPagar.toFixed(2)
        });

        // Liberar el espacio físicamente en el sistema
        slots[index].datos = null;
        
        // ACTUALIZAR CAMBIOS EN LOCALSTORAGE (Elimina el auto del slot y actualiza historial)
        guardarEnLocalStorage();
        init();
    }
}

// Nueva función para pintar o estructurar el recibo solicitado
function generarReciboVisual(datos) {
    // Alerta nativa que emula el recibo solicitado
    alert(
        `SMART-PARKING\n` +
        `\n` +
        `Gracias por usar nuestros servicios!\n` +
        `Slot: #${datos.slot} (${datos.tipo})\n` +
        `Placa: ${datos.placa}\n` +
        `\n` +
        `Datos de su estadia\n` +
        `Entrada: ${datos.entrada}\n` +
        `Salida:  ${datos.salida}\n` +
        `Tiempo:  ${datos.tiempo}\n` +
        `\n` +
        `TOTAL A PAGAR: Q ${datos.total}\n` +
        `\n` +
        `¡FELIZ VIZJE LO ESPERAMOS!`
    );
}

function renderListaOcupados() {
    const container = document.getElementById('lista-ocupados-body');
    const panel = document.getElementById('panel-ocupados');
    
    if(!container || !panel) return; // Evitar errores si no existen en el HTML
    
    container.innerHTML = '';
    const ocupados = slots.filter(s => s.datos !== null);
    
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
    
    const statOccupancy = document.getElementById('stat-occupancy');
    const statRate = document.getElementById('stat-rate');
    const statTotal = document.getElementById('stat-total');
    const statAvgTime = document.getElementById('stat-avg-time');

    if(statOccupancy) statOccupancy.innerText = `${totalOcupados}/${totalSlots}`;
    if(statRate) statRate.innerText = `${((totalOcupados/totalSlots)*100).toFixed(1)}%`;
    if(statTotal) statTotal.innerText = historial.length;

    const salidos = historial.filter(h => h.duracion !== undefined);
    if(salidos.length > 0 && statAvgTime) {
        const prom = salidos.reduce((a, b) => a + b.duracion, 0) / salidos.length;
        statAvgTime.innerText = `${Math.round(prom)} min`;
    }
}
function cerrarSesion() {
    // 1. Preguntar al usuario para evitar cierres accidentales
    if (confirm("¿Está seguro de que desea cerrar sesión y salir?")) {
        
        // OPCIÓN A: Si solo quieres salir al login sin borrar el parqueo:
        // (Los carros se quedan guardados para cuando vuelvas a entrar)
        // No hacemos nada con el localStorage.

        // OPCIÓN B: Si cerrar sesión significa reiniciar el parqueo desde cero:
        // Descomenta las siguientes dos líneas si tu profesor te pide limpiar todo al salir:
        // localStorage.removeItem('parking_slots');
        // localStorage.removeItem('parking_historial');

        // 2. Redireccionar al HTML principal (cambia 'index.html' por el nombre de tu archivo de login o inicio)
        window.location.href = 'index.html';
    }
}

// Arrancar la aplicación
init();