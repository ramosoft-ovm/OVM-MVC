document.addEventListener('DOMContentLoaded', function() {
    
    //Instancia    
    var cart = new Cart();
    //Carga imagen ajax para carrito compras catalogo
    cart.showAjax();
    
    //Dentro del carrito de compras, se verifica si existen pedidos almacenados
    //listo => controla en que momento sale del bucle
    //cont => contador, sirbe para identificar el número de productos agregados al carrito,
    //        cada ciclo se concatena a una variable local distinta
    var listo = 0, cont = 0;
    //variables de llenado de tabla
    var total_precio = 0, total_puntos = 0, total_vconsumible = 0, total_peso = 0;
    ////Variable que guardara un arreglo de los datos
    var llenarTabla  = "";
    while(listo == 0) {
        //Se recorren las variables almacenadas desde el indice 0 hasta ya no encontrar
        //si no encuentra variables almacenadas, sale del ciclo
        if (window.localStorage.getItem('datosCarrito' + cont)) {
            //se extraen los datos locales
            var extraer = localStorage.getItem('datosCarrito' + cont);
            //se convierte la cadena en array y se asignan valores
            desglosandoArreglo: {
                var resArray = extraer.split('","');
                var codigo      = resArray[0];
                var articulo    = resArray[1];
                var precio      = resArray[2];
                var puntos      = resArray[3];
                var vconsumible = resArray[4];
                var peso        = resArray[5];
                var cantidad    = resArray[6];
                var origen    = resArray[7];
            }
            calculandoTotales: {
                var total       = (precio.substring(1, precio.length))*cantidad;
                var tpuntos     = (puntos*cantidad);
                var tvconsumible= (vconsumible*cantidad);
                var tpeso       = (peso*cantidad);
            }
            asignandoTotales: {
                total_precio      += total;
                total_puntos      += tpuntos;
                total_vconsumible += tvconsumible;
                total_peso        += tpeso;
            }
            //Inicia carga de articulos agregados al carrito
            llenarTabla += '<table><tbody>';
            llenarTabla += '<tr>';
            //Articulo
            llenarTabla += '<th width="34%">Artículo</th>';
            llenarTabla += '<td width="66%">'+articulo+'</td>';
            llenarTabla += '</tr>';
            //Código del prodocto
            llenarTabla += '<tr>';
            llenarTabla += '<th>Código</th>';
            llenarTabla += '<td>'+codigo+'</td>';
            llenarTabla += '</tr>';
            //Cantidad a comprar
            llenarTabla += '<tr>';
            llenarTabla += '<th>Cantidad</th>';
            llenarTabla += '<td>'+cantidad+'</td>';
            llenarTabla += '</tr>';
            //Total Precio
            llenarTabla += '<tr>';
            llenarTabla += '<th>Total Precio</th>';
            llenarTabla += '<td>$'+Math.round(total*100)/100+'</td>';
            llenarTabla += '</tr>';
            //Total puntos
            llenarTabla += '<tr>';
            llenarTabla += '<th>Total Puntos</th>';
            llenarTabla += '<td>'+tpuntos+'</td>';
            llenarTabla += '</tr>';
            //Total Valor Consumible
            llenarTabla += '<tr>';
            llenarTabla += '<th>Peso</th>';
            llenarTabla += '<td>'+tvconsumible+'</td>';
            llenarTabla += '</tr>';
            //Total peso
            llenarTabla += '<tr>';
            llenarTabla += '<th>Peso</th>';
            llenarTabla += '<td>'+Math.round(tpeso*100)/100+'</td>';
            llenarTabla += '</tr>';
            llenarTabla += '</tbody></table>';
        } else {
            listo = 1;
        }
        cont += 1;
    }
    //Imprime tabla de totales
    llenarTabla += '<table class="marginTable">';
    llenarTabla += '<thead>';
    llenarTabla += '<th>Total</th>';
    llenarTabla += '<th>Puntos</th>';
    llenarTabla += '<th>Valor Consumible</th>';
    llenarTabla += '<th>Peso</th>';
    llenarTabla += '</thead><tbody>';
    llenarTabla += "<tr id='sumatoria'>";
    llenarTabla +=      "<td id='total_precio'>$" + Math.round(total_precio*100) / 100 + "</td>";
    llenarTabla +=      "<td id='total_puntos'>" + total_puntos + "</td>";
    llenarTabla +=      "<td id='total_vconsumible'>" + total_vconsumible + "</td>";
    llenarTabla +=      "<td id='total_peso'>" + Math.round(total_peso*100) / 100 + "kg. </td>";
    llenarTabla += "</tr>";
    llenarTabla += '</tbody></table>';
    //Muestra tablas en pantalla.
    document.getElementById('catalogo').innerHTML = llenarTabla;

    //Oculta imágen AJAX
    cart.hideAjax();

    var cancel = document.querySelectorAll('.cancelar');
    for (var i = 0; i < cancel.length; i++)
        cancel[i].addEventListener('click', cart.cancel, false);
    /******** Llama a función cancelar *********/
    var cerrar_pedido = document.querySelectorAll('.cerrar_pedido');
    for (var i = 0; i < cerrar_pedido.length; i++)
        cerrar_pedido[i].addEventListener('click', cart.closeOrder, false);
});
