//------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    //variables globales
    var tblDetalles = document.getElementById('tbl_detalles');
    var btnRegresar = document.getElementById('btn_regresar');
    //------------------------------
    var datos = getByURL()['datos'];
    var comercio = getByURL()['comercio'];
    var periodID = getByURL()['periodID'];

    //Guarda datos en un arreglo
    datos = datos.split('-:-');
    datosT = datos.length;

    //Carga tabla con detalles de la transacción
    var text = '';
    //Tipo de transacciones
    text += '<tr>';
    text += '<th width="40%">Tipo de transacción</th>';
    text += '<td>'+datos[0]+'</td>';
    text += '</tr>';
    //Número de referencia
    text += '<tr>';
    text += '<th>Referencia</th>';
    text += '<td>'+datos[1]+'</td>';
    text += '</tr>';
    //Monto del movimiento
    text += '<tr>';
    text += '<th>Monto</th>';
    text += '<td>$'+datos[2]+'</td>';
    text += '</tr>';
    //Depósito por comisiones proviene de plataforma mlm
    if (datos[0] === 'Deposito De Comisiones') {
        text += '<tr>';
        text += '<th>Proveniente de</th>';
        text += '<td>Plataforma MLM</td>';
        text += '</tr>';
    }
    //Si viene como NO ALIAS no muestra nada
    else if (datos[7] !== 'NO ALIAS') {
        text += '<tr>';
        text += '<th>Usuario que envía</th>';
        text += '<td>'+datos[7]+'</td>';
        text += '</tr>';
    }
    if (datos[8] !== 'NO ALIAS') {
        text += '<tr>';
        text += '<th>Usuario que recibe</th>';
        text += '<td>'+datos[8]+'</td>';
        text += '</tr>';
    }
    //else if (typeof) {};
    //Periodo
    text += '<tr>';
    text += '<th>Periodo</th>';
    text += '<td>'+datos[3]+'</td>';
    text += '</tr>';
    //Comercio
    text += '<tr>';
    text += '<th>Comercio</th>';
    text += '<td>'+datos[4]+'</td>';
    text += '</tr>';
    //Comentarios
    text += '<tr>';
    text += '<th>Comentarios</th>';
    text += '<td>'+datos[5]+'</td>';
    text += '</tr>';
    //Fecha de transacción
    text += '<tr>';
    text += '<th>Fecha de transacción</th>';
    text += '<td>'+datos[6]+'</td>';
    text += '</tr>';
    //Imprime datos
    tblDetalles.childNodes[3].innerHTML = text;

    //Evento click del botón regresar
    btnRegresar.addEventListener('click', function() {
        location.href = 'monedero_movimientos.html?comercio='+comercio+'&periodID='+periodID;
    }, false);
});