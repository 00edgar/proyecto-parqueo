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
    }ç
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
    const placa = document.getElementById('input-placa',).value.toUpperCase().trim();
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
            <td><button class="btn-salida" onclick="gestionarSalidaDesdeLista('${slot.datos.placa}')">Salida</button></td> `;
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
        window.location.href = "index.html";
    }
}
function actualizarUsuario(nuevoNombre) {
    if (localStorage.getItem('usuariosRegistrados')) {
        const usuario = JSON.parse(localStorage.getItem('usuariosRegistrados'));        
        usuarios.name = nuevoNombre; // Editamos el dato en memoria        
        localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarios)); // Reemplazamos en almacenamiento
        alert('¡Usuario actualizado con éxito!');
    }
}
function buscarHistorialPorFechas() {
    const txtInicio = document.getElementById('fecha-inicio').value;
    const txtFin = document.getElementById('fecha-fin').value;
    const contenedor = document.getElementById('resultados-historial');
    // Validar que se hayan seleccionado ambas fechas
    if (!txtInicio || !txtFin) {
        return alert("Por favor, seleccione ambas fechas para realizar la búsqueda.");
    }
    // Configurar las fechas para comparar solo días (sin que afecten las horas exactas)
    const fechaInicio = new Date(txtInicio + "T00:00:00");
    const fechaFin = new Date(txtFin + "T23:59:59");
    if (fechaInicio > fechaFin) {
        return alert("La fecha de inicio no puede ser mayor que la fecha final.");
    }
    // Filtrar el historial usando la variable que ya cargaste de LocalStorage
    const registrosFiltrados = historial.filter(registro => {
        if (!registro.entrada) return false;
        // Comprobar si la fecha de entrada está dentro del rango
        return registro.entrada >= fechaInicio && registro.entrada <= fechaFin;
    });
    // Limpiar el contenedor antes de mostrar los nuevos resultados
    contenedor.innerHTML = '';
    if (registrosFiltrados.length === 0) {
        contenedor.innerHTML = '<p style="color: red; font-weight: bold;">No se encontraron registros en este rango de fechas.</p>';
        return;
    }
    // Crear una tabla o bloques para mostrar los datos de forma ordenada
    let htmlResultado = `
        <table border="1" style="width:100%; border-collapse: collapse; margin-top: 10px; text-align: left;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th style="padding: 8px;">Fecha Entrada</th>
                    <th style="padding: 8px;">Placa</th>
                    <th style="padding: 8px;">Tipo</th>
                    <th style="padding: 8px;">Duración</th>
                </tr>
            </thead>
            <tbody> `;
    registrosFiltrados.forEach(registro => {
        // Formatear la fecha para que sea legible (ejemplo: 22/05/2026, 14:30)
        const fechaFormateada = registro.entrada.toLocaleDateString() + ' ' + 
                               registro.entrada.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const duracion = registro.duracion ? `${registro.duracion} min` : 'En parqueo';
        htmlResultado += `
            <tr>
                <td style="padding: 8px;">${fechaFormateada}</td>
                <td style="padding: 8px;"><strong>${registro.placa}</strong></td>
                <td style="padding: 8px;">${registro.tipo}</td>
                <td style="padding: 8px;">${duracion}</td>
            </tr>
        `;
    });
    htmlResultado += `
            </tbody>
        </table>
        <p style="margin-top:10px;"><strong>Total de registros encontrados:</strong> ${registrosFiltrados.length}</p>
    `;
    // Insertar el contenido en el HTML
    contenedor.innerHTML = htmlResultado;
}