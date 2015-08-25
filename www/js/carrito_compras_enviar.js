document.addEventListener('DOMContentLoaded', function() {
    //Variables globales
    var userId =  localStorage.getItem('userIdLocal');
    userId = 12;
    var tblPagoMonedero = document.getElementById('tbl_pago_monedero');
    var tblPerfil = document.getElementById('btl_perfil');
    var cmbComercio = document.getElementById('cmb_comercios');
    //----------------------------------------------
    var wallet = ''; //Para monedero electrónico
    //----------------------------------------------
    //Constantes
    const IVA = 0.16;
    //----------------------------------------------    
    var cadenaSubtotales = localStorage.getItem('carrito_subtotales');
    var cadenaLevantar = localStorage.getItem('carrito_levantar');
    var cart = new Cart();
    var sendCart = new SendCart(userId, IVA, cadenaSubtotales, cadenaLevantar, tblPagoMonedero, tblPerfil, cmbComercio, cart);
    //Datos de carrito_compras.html
    extraeSubtotales: {
        var resArray = cadenaSubtotales.split('","');
        //var total_precio = resArray[0];
        //var total_puntos = resArray[1];
        //var total_vconsumible = resArray[2];
        var total_peso = resArray[3];
    }
    //Datos de carrito_compras_levantar.html
    extraeDatosCombobox: {
        cadenaLevantar = cadenaLevantar.split('","');
        var metodo_envio = cadenaLevantar[0];
        //var enviar_a = cadenaLevantar[1];
        //var forma_pago = parseInt(cadenaLevantar[2]);
        var carrier = 3;
        if (metodo_envio == 2) {
            carrier = enviar_a;
        }
    }
    //----------------------------------------------
    //Carga imagen ajax
    cart.showAjax();

    /////////////////////////////////////////////////////
    /************* Calcula Costo de envío **************/
    var xml = '<PAGE><CART GRAN_TOTAL_ITEM_WEIGHT="'+total_peso+'" COUNTRY_ID="4"/><SHIPPING_ADDRES SHIPPING_METHOD="'+metodo_envio+'" CARRIER="'+carrier+'"/></PAGE>';
    queryData('USP_VBC_GET_SHIPPING_COST', ['string',depurarXML(xml)], sendCart.shippingCost);
    var costoXenvio = 0;

    ////////////////////////////////////////////////////
    /******* Llena tabla de Dirección de envío ********/
    queryData('USP_VBC_GET_USER_PROFILE_DATA', ['integer',userId], sendCart.profileData);
});