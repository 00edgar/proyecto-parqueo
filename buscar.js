document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let historial = JSON.parse(localStorage.getItem('parking_historial')) || [];


    const fecha1 = document.getElementById('entrada').value;
    const fecha2 = document.getElementById('entrada').value;

function buscarFecha() {
    const fecha1 = document.getElementById('fecha1',).value.toUpperCase().trim();
    const fecha2 = document.getElementById('fecha2').value;

    if(!fecha1 && !fecha2) return alert("ingrese fecha");

    // Buscar espacio por tipo
    const index = entrada.findIndex(s => s.entrada === entrada && s.datos === null);

    if(index === -1) return alert(`No hay registro ${entrada}s`)
    
    document.getElementById('fecha1').value = '';
    document.getElementById('fecha2').value = '';
    
}

});
