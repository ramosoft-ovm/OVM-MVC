function CatalogCart(cmbCategoria, divCatalogos, getCategoria, ajax)
{
	that = this;
	this.cmbCategoria = cmbCategoria;
	this.divCatalogos = divCatalogos;
    this.getCategoria = getCategoria;
    this.ajax = ajax;
}

//==================================//
//----Carga combobox de catalogo----//
//==================================//
CatalogCart.prototype.category = function(dataSet){
    var rec = dataSet[0];
    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        var options = document.createElement('option');
        options.text = rec['groupName'];
        options.value = rec['itemGroupId'];
        that.cmbCategoria.options.add(options);
    }
    if (typeof that.getCategoria !== 'undefined') {
        that.cmbCategoria.value = that.getCategoria;
    };
};
//=================================//
//----Termina Carga de ombobox ----//
//=================================//

//======================================================//
//Carga la lista de productos segun la categoría elegida//
//======================================================//
CatalogCart.prototype.wishlist = function(dataSet) {
    var rec = dataSet[0];
    //text => Almacena temporalmente las tablas de productos
    //code => Contiene el código del producto, se utilizará
    //        como identificador de cada celda
    var text = "", code = '';
    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        code = rec['itemCode'];
        
        text += '<table class="marginTable"><tbody>';
        text += '<tr>';
        //Código
        text += '<th width="34%">Código</th>';
        text += '<td width="66%" id="'+code+'"><a class="btn-tbl" href="carrito_compras_detalles.html?categoria=' +that.cmbCategoria.value+ '&code=' +code+ '&price=' +
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
    //Imprime las tablas de productos en pantalla
    that.divCatalogos.innerHTML = text;
    //Se crea un evento por cada botón de compra existente.
    var comprar = document.querySelectorAll('input[type=submit]');
    for (var i = 0; i < comprar.length; i++) {
        comprar[i].addEventListener('click', compra, false);
    }
    //Oculta imágen AJAX
    that.ajax.hideAjax();
};
//=========================================//
//------ Termina Carga de productos--------//
//=========================================//

//============================================//
//---Proceso de guardado temporal de pedido---//
//============================================//
CatalogCart.prototype.obtainData = function(event) {
    //Busca tbody de la tabla
    var idTd = event.target.parentNode.parentNode.parentNode;
    //Obtiene todas las filas
    var celdasTmp = idTd.childNodes;
    //Cuenta las filas
    var celdasT = celdasTmp.length;
    //Variable que guardara un arreglo de los datos
    var cadenaAGuardar = '';
    //Recorre cada fila
    for (var i = 0; i < celdasT; i++) {
        //Selecciona todas las celdas de la fila
        celdas = celdasTmp[i].cells[1];
        //Extrae el ID de cada celda
        var idCell = celdas.id;
        //Almacena datos temporalmente
        var text = '';
        //Extrae contenido de cada celda
        text = document.getElementById(idCell).innerHTML;
        //Si en el contenido hay algun tag, puede ser un enlace o un input.
        if (text[0] == '<' && text[text.length-1] == '>') {
            if (text[1] === 'a') {
                //si es un enlace, extrae su contendio
                text = document.getElementById(idCell).childNodes[0].innerHTML;
            }
            else {
                //si es input, extrae su valor.
                text = document.getElementById(idCell).childNodes[0].value;
                //Guarda el valor en vacioInput, para posteriormente comparar si esta vacío.
                var vacioInput = text;
            }
        }
        //Concatena todos los valores
        cadenaAGuardar += "\"" +text+ "\",";
        //Si el input text esta vacío, iguala la cadena a nada para evitar ser guardada.
        if (vacioInput == '' || vacioInput == 0) {
            cadenaAGuardar = '';
        }
    }
    //Procede a almacenar los datos
    that.saveData(cadenaAGuardar);
};
CatalogCart.prototype.saveData = function(datos) {
    //Elimina el primer y último caracter
    cadenaAGuardar = datos.substring(1, datos.length-2);
    //Listo => Controla en que momento saldrá del ciclo
    //cont => Contador que se utilizará para la creación de variable dinámicas
    //        según el número de productos que compre.
    //        Cada producto se almacena en una variable local.
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
};
//=========================================//
//---Termina guardado temporal de pedido---//
//=========================================//

//=============================//
//------Buscador Interno------//
//============================//
CatalogCart.prototype.search = function(event, txtBuscador){
    var buscarTr = that.divCatalogos.childNodes;
    for (var i = 0; i < buscarTr.length; i++) {
        //var encontrado = articulos.childNodes[i].childNodes[1].innerHTML.toLowerCase().indexOf(search.value.toLowerCase());
        var encontrado = buscarTr[i].childNodes;
        var encontradoT = encontrado.length;
        for (var j = 0; j < encontradoT; j++) {
            encontrado = encontrado[j].childNodes;
            encontrado = encontrado[1].childNodes;
            encontrado = encontrado[1].innerHTML.toLowerCase().indexOf(txtBuscador.value.toLowerCase());
            if(encontrado == -1) {
                buscarTr[i].style.display = 'none';
                Debug('Si');
            }
            else {
                buscarTr[i].style.display = '';
                Debug('No');
            }
        }
    }
};
//====================================//
//------Termina Buscador Interno------//
//====================================//

//=========================================//
//------Muestra detalles de producto------//
//=======================================//
CatalogCart.prototype.details = function(dataSet) {
    var rec = dataSet[0];
    var img = '';
    img = rec['itemPicture']?'<img src="' +domain+ '/image/' +rec['itemPicture']+ '" />':'<p>Imagen no disponible</p>';
    set('codigo',rec['itemCode']);
    set('puntos',rec['bv']);
    set('vconsumible',rec['cv']);
    set('precio','$'+getByURL()['price']);
    set('descripcion',rec['itemName']);
    set('imagen', img);

    function set(id, html) {
        document.getElementById(id).innerHTML = html;
    }
    //oculta imagen ajax
    that.ajax.hideAjax();
};
//======================================//
//------Termina detalles de producto---//
//====================================//