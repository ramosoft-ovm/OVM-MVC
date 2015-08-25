function Cart(cmbMetodoEnvio, cmbSucursal, cmbFormaPago)
{
    that = this
    this.cmbMetodoEnvio = cmbMetodoEnvio;
    this.cmbSucursal = cmbSucursal;
    this.cmbFormaPago = cmbFormaPago;
}
//=============================//
//---------Mascara AJAX-------//
//===========================//
Cart.prototype.showAjax = function() {
	//Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
};

Cart.prototype.hideAjax = function() {
	//Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};
//=============================//
//---Termina Mascara AJAX-----//
//===========================//

//======================//
//---Cerrar Pedido-----//
//=====================//
Cart.prototype.closeOrder = function() {
	if (!window.localStorage.getItem('datosCarrito0')) {
        app.showNotificactionVBC('No tienes pedidos que procesar');
    }
    else {
        var subtotal = $('#total_precio').text();
            subtotal = subtotal.substring(1, subtotal.length);
        var puntos = $('#total_puntos').text();
        var vconsumible = $('#total_vconsumible').text();
        var total_peso = document.getElementById('total_peso').innerHTML;
            total_peso = total_peso.substring(0, total_peso.length-4);
        var cadena = subtotal + "\",\"" + puntos + "\",\"" + vconsumible + "\",\"" + total_peso;
        //Guarda los totales
        localStorage.setItem('carrito_subtotales', cadena);
        location.href='carrito_compras_levantar.html';
    }
};
//==============================//
//---Termina Cerrar Pedido-----//
//=============================//

//=========================//
//----Cancelar Pedido-----//
//=========================//
Cart.prototype.cancel = function() {
	event.preventDefault();
    var listo = 0, cont = 0;
    while(listo == 0) {
        if (window.localStorage.getItem('datosCarrito' + cont)) {
            localStorage.removeItem('datosCarrito' + cont);
        }
        else {
            //Ya que se eliminaron todos los pedidos
            //se procede a salir del ciclo.
            listo = 1;
        }
        cont += 1;
    }
    localStorage.removeItem('carrito_levantar');
    localStorage.removeItem('carrito_subtotales');

    if(menu.checkRelativeRoot() == "carrito_compras_ficha.html") {
        location.href="welcome.html";
    }
    else {
        location.href="carrito_compras.html";
    }
};
//==============================//
//---Termina Cancelar Pedido-----//
//==============================//

//==================================//
//-Oculta o muestra método de envío-//
//==================================//
Cart.prototype.hideShippingMethod = function() {
    if (that.cmbMetodoEnvio.value == 2) {
        $('#trSucursal').hide(0);
        $('#trPaqueteria').show(300);
    }
    else if (that.cmbMetodoEnvio.value == 1){
        $('#trPaqueteria').hide(0);
        $('#trSucursal').show(300);
    }
};
//==================================//
//-Termina Ocultar método de envío-//
//=================================//

//=======================================//
//--Llena combobox de centro Autorizado--//
//=======================================//
Cart.prototype.warehouse = function(dataSet){
    var rec = dataSet[0];
    for(var idx = 0; idx < dataSet.length; idx++) {
        var options = document.createElement('option');
        rec = dataSet[idx];
        options.text = rec['description'];
        options.value = rec['warehouseId'];
        that.cmbSucursal.options.add(options);
    }
    that.hideShippingMethod();
};
//========================================//
//--Termina combobox de centro Autorizado--//
//=======================================//

//=======================================//
//---Llena combobox de Metodo de pago---//
//======================================//
Cart.prototype.payMethod = function(dataSet){
    var rec = dataSet[0];
    for(var idx = 0; idx < dataSet.length; idx++) {
        rec = dataSet[idx];
        var options = document.createElement('option');
        options.text = rec['description'];
        options.value = rec['payMethodId'];
        that.cmbFormaPago.options.add(options);
    }
    that.cmbFormaPago.value = 7;
};
//=======================================//
//---Termina combobox Metodo de pago---//
//======================================//

//====================================//
//--Lena combobox de metodo de envío--//
//===================================//
Cart.prototype.shipmentMethod = function(dataSet) {
    var rec = dataSet[0];
    for(var idx = 0; idx < dataSet.length; idx++){
        var options = document.createElement('option');
        rec = dataSet[idx];
        options.text = rec['name'];
        options.value = rec['shipMethodId'];
        that.cmbMetodoEnvio.options.add(options);
    }
    //Muestra si hay datos guardados
    if (window.localStorage.getItem('carrito_levantar')) {
        //extrae datos almacenados y los convierte en array
        var extraer = localStorage.getItem('carrito_levantar');
        var resArray = extraer.split('","');
        that.cmbMetodoEnvio = resArray[0];
        if (resArray[0] == 2) {
            //cmbPaqueteria.value = resArray[1];
        }
        else {
            that.cmbSucursal.value = resArray[1];
        }
        that.cmbFormaPago.value = resArray[2];
    }
    that.hideShippingMethod();
    //Oculta imágen AJAX
    that.hideAjax();
};
//====================================//
//--Termina combobox metodo de envío--//
//===================================//