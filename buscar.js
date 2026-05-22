function buscarHistorialPorFechas() {
    const txtInicio = document.getElementById('fecha1').value;
    const txtFin = document.getElementById('fecha2').value;
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
        contenedor.innerHTML = '';
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
            <tbody>
    `;

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