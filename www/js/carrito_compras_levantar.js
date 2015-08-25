document.addEventListener('DOMContentLoaded', function() {
	var cmbMetodoEnvio = document.getElementById('cmb_metodo_envio');
    var cmbSucursal = document.getElementById('cmb_sucursal');
    var cmbFormaPago = document.getElementById('cmb_forma_pago');
    var btnLevantarSiguiente = document.querySelector('.btn_levantar_siguiente');
    //var cmbPaqueteria = document.getElementById('cmb_paqueteria');

    cart = new Cart(cmbMetodoEnvio, cmbSucursal, cmbFormaPago);

	//Muestra imagen AJAX
    cart.showAjax();
    /////////////////////////////////////////////////////
    /****** Llena combobox de Centro Autorizado ********/
    queryData('USP_VBC_GET_WAREHOUSE_BY_COUNTRY', ['integer','4'], cart.warehouse);

    ///////////////////////////////////////////////
    /****** Llena combobox de Mensajería ********/
    /*queryData('USP_VBC_GET_CARRIERS', ['integer','4'], mensajeria);
    function mensajeria(dataSet) {
        var rec = dataSet[0];
        var paqueteria = document.getElementById('paqueteria');
        for(var idx = 0; idx < dataSet.length; idx++){
            var options = document.createElement('option');
            rec = dataSet[idx];
            options.text = rec['description'];
            options.value = rec['carrierId'];
            paqueteria.options.add(options);
        }
    }*/

    //////////////////////////////////////////////////
    /****** Llena combobox de formas de pago ********/
    queryData('USP_VBC_GET_PAY_METHOD', ['integer','20','integer','4'], cart.payMethod);

    ///////////////////////////////////////////////////
    /******* Llena combobox de metodo de envío *******/
    queryData('USP_VBC_GET_SHIPMENT_METHODS', ['integer','','integer','4'], cart.shipmentMethod);

    //Responde al evento metodo de envío
    cmbMetodoEnvio.addEventListener('change', function(event) {
        var option = document.getElementById(event.target.id).value;
        event.target.blur();
        if (option == 2) {
            $('#trSucursal').hide(0);
            $('#trPaqueteria').show(300);
        }
        else if (option == 1){
            $('#trPaqueteria').hide(0);
            $('#trSucursal').show(300);
        }
    });
    //Quita foco al metodo de envío
    /*document.getElementById('paqueteria').addEventListener('change', function(event) {
        event.target.blur();
    });*/
    //Quita foco al evento paqueteria
    cmbSucursal.addEventListener('change', function(event) {
        event.target.blur();
    });
    //Quita foco al evento metodo de envío
    cmbFormaPago.addEventListener('change', function(event) {
        event.target.blur();
    });

    btnLevantarSiguiente.addEventListener('click', function() {
        if (cmbFormaPago.value == "0") {
            app.showNotificactionVBC("Seleccione una forma de pago y oprima siguiente.");
        }
        //En caso de elegir envío ocurre, valida que elija un centro autorizado
        else if (cmbMetodoEnvio.value == 1 && cmbSucursal.value == 0) {
            app.showNotificactionVBC("Seleccione un centro autorizado");
        }
        else {
            //Guardar datos
            var datos = "";
            //var paqueteria = document.getElementById('paqueteria').value;
            datos = cmbMetodoEnvio.value + "\",\"";
            if (cmbMetodoEnvio.value == 2) {
                datos += paqueteria + "\",\"";
            }
            else {
                datos += cmbSucursal.value + "\",\"";
            }
            datos += cmbFormaPago.value;
        
            localStorage.setItem('carrito_levantar', datos);
            location.href='carrito_compras_generar.html';
        }
    });
});