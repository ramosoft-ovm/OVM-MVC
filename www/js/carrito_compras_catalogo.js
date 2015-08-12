document.addEventListener('DOMContentLoaded', function() {
    var userId =  localStorage.getItem('userIdLocal');
    userId = 12;

    //Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
    /////////////////////////////////////////////////
    /******** Llena combobox de categorías *********/
    var cat = document.getElementById('categoria');
    //var egoria = getByURL()['categoria']==null ? getByURL()['categoria'] : 1;
    var egoria = 1;
    var get = getByURL()['categoria'];
    if (typeof get != "undefined" && get != '') {
        egoria = get;
    }else {
        egoria = 1
    }
    var argumentos = [
    'integer', '1', //Operator
    'integer', egoria,//categoria
    'integer', userId,//Usuario
    'integer', '0', //Price lvl
    'string' , '', //ITEM_CODE
    'integer', '0', //IS_SIGNUP
    'integer', '0', //IS_ADMIN
    'integer', '4 ',//País
    'integer', '',
    //'integer',  '',
    //'integer',  ''
    ];

    //Carga la tabla cuando se actualiza el combobox
    cat.addEventListener('change', function(event){
        event.target.blur();
    //Carga imagen ajax
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
        var opcion = cat.value;
        argumentos[3] = opcion;
        queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, listaArticulos, 2);
        egoria = opcion;
    });

    queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, categorias);
    function categorias(dataSet) {
        var select_categoria = document.getElementById('categoria');
        var rec = dataSet[0];
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            var options = document.createElement('option');
            options.text = rec['groupName'];
            options.value = rec['itemGroupId'];
            select_categoria.options.add(options);
        }
        document.getElementById('categoria').value = egoria;
    }
    ///////////////////////////////////////////////
    /******** Carga articulos a la tabla *********/
    queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, listaArticulos, 2);
    function listaArticulos(dataSet) {
        var catalogo = document.getElementById('catalogo');
        var rec = dataSet[0];
        Debug(rec);
        var text = "", code = '';
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            code = rec['itemCode'];
            
            text += '<table class="marginTable"><tbody>';
            text += '<tr>';
            //Código
            text += '<th width="34%">Código</th>';
            text += '<td width="66%" id="'+code+'"><a class="btn-tbl" href="carrito_compras_detalles.html?categoria=' +egoria+ '&code=' +code+ '&price=' +
                rec['price']+ '&origen=catalogo">' +
                rec['itemCode'] + '</a></td>';
            text += '</tr>';
            //Descripción
            text += '<tr>';
            text += '<th>Descripción</th>';
            text += '<td id="DES-' +code+ '">'+rec['description']+'</td>';
            text += '</tr>';
            //Precio
            text += '<tr>';
            text += '<th>Precio</th>';
            text += '<td id="PRE-'  +code+ '">$'+rec['price']+'</td>';
            text += '</tr>';
            //Puntos
            text += '<tr>';
            text += '<th>Puntos</th>';
            text += '<td id="PUN='  +code+ '">'+rec['itemPvDistributor']+'</td>';
            text += '</tr>';
            //Valor consumible
            text += '<tr>';
            text += '<th>Valor Consumible</th>';
            text += '<td id="VCO='  +code+ '">'+rec['itemCvDistributor']+'</td>';
            text += '</tr>';
            //Peso
            text += '<tr>';
            text += '<th>Peso</th>';
            text += '<td id="PSO='  +code+ '">'+rec['weight']+'</td>';
            text += '</tr>';
            //Comprar
            text += '<tr>';
            text += '<th>Comprar</th>';
            text += '<td id="CAN='  +code+ '">';
            text += '<input type="number" class="cantidad" id="TXT-'+code+ '" placeholder="cantidad" size="7" />';
            text += '<input type="submit" class="comprar" value="Agregar" />';
            text += '</td></tr>';
            text += '</tbody></table>';
        }
        catalogo.innerHTML = text;
        var comprar = document.querySelectorAll('input[type=submit]');
        for (var i = 0; i < comprar.length; i++) {
            comprar[i].addEventListener('click', compra, false);
        }
        //Oculta imágen AJAX
        $('#mascaraAJAX').fadeOut(300);
        $('#mascaraAJAX').html('');
    }
    //Llama a la función buscador pulsación de tecla
    var search = document.getElementById('search');
    search.addEventListener('keyup', function(){
        buscador();
    },false);
});

//Evento de botón comprar
function compra(event) {
    //Busca tbody de la tabla
    var idTd = event.target.parentNode.parentNode.parentNode;
    //Obtiene todas las filas
    var celdasTmp = idTd.childNodes;
    var celdasT = celdasTmp.length;
    var cadenaAGuardar = '';
    //Recorre cada fila
    for (var i = 0; i < celdasT; i++) {
        //Selecciona todas las celdas de la fila
        celdas = celdasTmp[i].cells[1];
        Debug(celdas.id);
        //Extrae el ID de cada celda
        var idCell = celdas.id;
        var text = '', cadena = '';
        //Extrae contenido de cada celda
        text = document.getElementById(idCell).innerHTML;
        //Si en el contenido hay algun tag, puede ser un enlace o un input.
        if (text[0] == '<' && text[text.length-1] == '>') {
            if (text[1] == 'a') {
                //si es un enlace, extrae su contendio
                text = document.getElementById(idCell).childNodes[0].innerHTML;
            }
            else {
                //si es input, extrae su valor.
                text = document.getElementById(idCell).childNodes[0].value;
                //Guarda el valor en botón, para posteriormente comparar si esta vacío.
                var boton = text;
            }
        }
        //Concatena todos los valores
        cadenaAGuardar += "\"" +text+ "\",";
        //Si el input text esta vacío, iguala la cadena a nada para evitar ser guardada.
        if (boton == '' || boton == 0) {
            cadenaAGuardar = '';
        }
        //De lo contrario verifica que si esta dentro de promociones, no compre mas de lo  permitido
        else {
            if (menu.checkRelativeRoot() == "carrito_compras_promocion.html") {
                if (boton > parseInt(getByURL()['maxPromo'])) {
                    cadenaAGuardar = '';
                }
            }
        }
    }

    //Agrega un identificador para saber la prodecencia de los productos
    if (cadenaAGuardar != '') {
        if (menu.checkRelativeRoot() == "carrito_compras_catalogo.html") {
                cadenaAGuardar += "\"catalogo\",";
        }
        else if (menu.checkRelativeRoot() == "carrito_compras_promocion.html") {
            cadenaAGuardar += "\"promocion\",";
        }
        else if (menu.checkRelativeRoot() == "carrito_compras_regalos.html") {
            cadenaAGuardar += "\"regalos\",\""+document.getElementById('grupos').value+"\",";
        }
    }
    //Elimina el primer y último caracter
    cadenaAGuardar = cadenaAGuardar.substring(1, cadenaAGuardar.length-2);
    var listo = 0, cont = 0;
    while(listo == 0) {
        //Si no existe una compra previa, se procede a guardar en local con el índice 0
        //de lo contrario, el ciclo sigue y se guarda con el índice 1, 2, 3, ...
        if (!window.localStorage.getItem('datosCarrito' + cont)) {
            localStorage.setItem('datosCarrito' + cont ,cadenaAGuardar);
            //Ya que se guardaron los datos en el índice correspondiente
            //se procede a salir del ciclo.
            listo = 1;
            if (cadenaAGuardar == "") {
                listo = 2;
            }
        }
        cont += 1;
    }
    caddenaAGuardar = '';
    //Si todo salio bien se prodece a redireccionar al carrito
    if (listo == 1) {
        location.href = 'carrito_compras.html';
    }
    else if (listo==2) {
        //De lo contrario el campo estaba vacío y se solicita llenarlo.
        app.showNotificactionVBC("Captura la cantidad correcta y vuelve a intentalo.");
    }
}