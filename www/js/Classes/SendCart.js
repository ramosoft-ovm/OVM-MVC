function SendCart(userId, IVA, cadenaSubtotales, cadenaLevantar, tblPagoMonedero, tblPerfil, cmbComercio, cart)
{
	that = this;
    subtotales = cadenaSubtotales.split('","');
    combos = cadenaLevantar.split('","');
    this.cart = cart;
    this.IVA = IVA;
    this.tblPagoMonedero = tblPagoMonedero;
    this.tblPerfil = tblPerfil;
    this.cmbComercio = cmbComercio;
    this.btnGenerarOrden = document.getElementById('btn_generar_orden');
    this.userId = userId;
    //-------------
    that.tablaPerfil = '';
    that.wallet = '';

    //Subtotales
    this.total_precio = subtotales[0];
    this.total_puntos = subtotales[1];
    this.total_vconsumible = subtotales[2];
    this.total_peso = subtotales[3];

    //Combobox Levantar pedido
    this.metodo_envio = parseInt(combos[0]);
    this.enviar_destino = combos[1];
    this.forma_pago = parseInt(combos[2]);
}

//=================================//
//-----Calcula costo de envío-----//
//================================//
SendCart.prototype.shippingCost = function(dataSet) {
	var rec = dataSet[0];
    var costoXenvio = 0;
    var cargo_manejo = document.getElementById('cargo_manejo');
    if (rec['shippingCharge'] == null) {
        cargo_manejo.innerHTML = 0.00;
    } else {
        cargo_manejo.innerHTML = '$' +parseFloat(rec['shippingCharge']).toFixed(2);
        costoXenvio = rec['shippingCharge'];
    }

    //Despues de obtenido el costo por envío, carga los subtotales
    if (window.localStorage.getItem('carrito_subtotales')) {
        
        var cadenaSubtotal = '<div style="padding:3px; border: 1px solid silver; float: left">T. Puntos: ' + that.total_puntos + '</div>';
        cadenaSubtotal += '<div style="padding:3px; border: 1px solid silver; float: left">T. V. Consumible: ' + that.total_vconsumible + '</div>';
        cadenaSubtotal += '<div style="padding:3px; float: right">Total: $' + parseFloat(that.total_precio).toFixed(2) + '</div>';
        document.getElementById('subtotales').innerHTML = (cadenaSubtotal);
        var cadenaInpuesto = that.total_precio * that.IVA;
        var inpuesto = Math.round(cadenaInpuesto*100)/100;
        cadenaInpuesto = '<div style="text-align: right">$' + inpuesto.toFixed(2) + '</div>';
        document.getElementById('impuesto').innerHTML = (cadenaInpuesto);
        var granTotal = parseFloat(that.total_precio) + parseFloat(costoXenvio) + parseFloat(inpuesto);
        document.getElementById('gran_total').innerHTML = '$' +(Math.round(granTotal*100)/100).toFixed(2);
    }
    else {
        alert('Algo salio mal al cargar los datos');
    }
};
//======================================//
//---Termina calculo de costo de envío--//
//=====================================//

//========================================//
//---Llena tabla con dirección de envío---//
//=======================================//
SendCart.prototype.profileData = function(dataSet) {
    var rec = dataSet[0];
    //rec = dataSet[i];
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th colspan="2" style="text-align:center; background: #B24846">Dirección</th>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Nombre:</th><td id="shipName">' + rec['shipName'] + '</td>';
    that.tablaPerfil += '</tr>';
    if (that.metodo_envio == 1) {
        queryData('USP_VBC_GET_WAREHOUSE_DETAIL', ['integer', that.enviar_destino], that.warehouseDetail);
    } else {
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">País:</th><td><address>' + rec['mailingCountry'] + '</address></td>';
        that.tablaPerfil += '</tr>';
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">Calle/ Número:</th><td><address>' + rec['mailingAddressLine1'] + '</address></td>';
        that.tablaPerfil += '</tr>';
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">Ciudad/ Municipio:</th><td><address>' + rec['mailingAddressLine2'] + '</address></td>';
        that.tablaPerfil += '</tr>';
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">Ciudad:</th><td><address>' + rec['mailingCity'] + '</address></td>';
        that.tablaPerfil += '</tr>';
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">Estado / C.P.:</th><td><address>' +   rec['mailingState'] + '/' + 
                                                                            rec['mailingPostalCode'] + '</address></td>';
        that.tablaPerfil += '</tr>';
        that.tablaPerfil += '<tr>';
        that.tablaPerfil += '<th class="titulos">Instrucciones Especiales</th><td><input type="text" id="instrucciones" data-mini="true" /></td>';
        that.tablaPerfil += '</tr>';
        //Campos ocultos
        that.tablaPerfil += '<div style="top:-100px; position: absolute"><span id="phoneHome">';
        that.tablaPerfil += rec['shippingPhone']+ '</span><span id="numInt">'+
                 rec['shippingAddressNumInt']+'</span><span id="numExt">'+
                 rec['shippingAddressNumExt']+'</span></div>';
        that.tblPerfil.innerHTML = that.tablaPerfil;
    }
//=====================================================//
//---Termina´llenado de tabla con dirección de envío---//
//====================================================//

//==========================================================//
//---Si es cargo por monedero, llena combobox de comercio---//
//=========================================================//
    if (that.forma_pago === 50) {
        queryData("USP_VBC_GET_WALLET_TYPE_BALANCE", ['integer',that.userId], that.commerce);
    }
    else {
        //Oculta tabla de pago con monedero
        that.tblPagoMonedero.style.display = 'none';
    }
    that.cmbComercio.addEventListener('change', function(event) {
        that.cmbComercio.blur();
    }, false);
//=========================================//
//-------Termina combobox comercios--------//
//=========================================//

//=============================================================//
//-------Inicia inserción de la orden por XML a la base--------//
//=============================================================//
    //Responde al botón generar orden para iniciar el proceso de guardado.
    that.btnGenerarOrden.addEventListener('click', function() {
        //Carga imagen ajax
        that.cart.showAjax();
        //Vetifica si será enviado por paqueteria o a centro autorizado.
        if (that.metodo_envio === 1) {
            var warehouse = that.enviar_destino;
            var carrier = 0;
        } else {
            var warehouse = 0;
            var carrier = that.enviar_destino;
        }
        //Subtotales de carrito compras
        var cargoXmanejo = document.getElementById('cargo_manejo').innerHTML;
        var granTotal = document.getElementById('gran_total').innerHTML;

        //Datos de tabla dirección:
        var address = document.getElementsByTagName('address');
        var shipName = document.getElementById('shipName').innerHTML;
        var address1 = address[1].innerHTML;
        var address2 = address[2].innerHTML;
        var city = address[3].innerHTML;
        var instructions = document.getElementById('instrucciones').value;
        var stateAndPC = address[4].innerHTML;
            stateAndPC = stateAndPC.split('/');
        var state = stateAndPC[0];
        var PostalCode = stateAndPC[1];
        var phoneHome = document.getElementById('phoneHome').innerHTML;
        var numInt = document.getElementById('numInt').innerHTML;
        var numExt = document.getElementById('numExt').innerHTML;
        var period = 0;
        var shippingMethod = that.metodo_envio;
        var paymentMethod = that.forma_pago;
        
        //Obtenemos los items seleccionados
        var listo = 0, cont = 0;
        var items = '';
        while(listo == 0) {
            //Se recorren las variables almacenadas desde el indice 0 hasta ya no encontrar
            //si no encuentra variables almacenadas, sale del ciclo
            if (window.localStorage.getItem('datosCarrito' + cont)) {
                //se extraen los datos locales
                var extraer = localStorage.getItem('datosCarrito' + cont);
                //se convierte la cadena en array y se asignan valores
                var resArr = extraer.split('","');
                var codigo      = resArr[0];
                var articulo    = resArr[1];
                var precio      = resArr[2];
                var puntos      = resArr[3];
                var vconsumible = resArr[4];
                var peso        = resArr[5];
                var cantidad    = resArr[6];
                var total       = (precio.substring(1, precio.length))*cantidad;
                var tpuntos     = (puntos*cantidad);
                var tvconsumible= (vconsumible*cantidad);
                var tpeso       = (peso*cantidad);
                that.total_precio      += total;
                that.total_puntos      += tpuntos;
                that.total_vconsumible += tvconsumible;
                that.total_peso        += tpeso;
                //se llena la tabla del carrito con los pedidos extraidos
                items += '<ITEM ITEM_CODE="'+codigo+'" QUANTITY="'+cantidad+'" RETAIL="'+precio+'" ITEM_PRICE="'+precio+'" TOTAL_ITEM_PRICE="'+total+'" TOTAL_ITEM_PV="'+tpuntos+'" TOTAL_ITEM_CV="'+tvconsumible+'" TAX_AMOUNT="'+precio*that.IVA+'" VOLUME_TYPE_ID="1" IS_KIT="" PRICE_LEVEL_ID="7" ITEM_SUBGROUP_ID="1" />'+"\n";
            } else {
                listo = 1;
            }
            cont += 1;
        }

        //En caso de pago con monedero electrónico, carga el tipo de comercio para agregarlo al XML
        if (paymentMethod === 50) {
            that.wallet = '<WALLET WALLET_TYPE="'+that.cmbComercio.value+'" />';
        }

        ///////////////////////////////////////////////////////
        /************* Obtiene el ID de la Orden *************/
        queryData('USP_VBC_GET_ORDER_ID', [], getOrderID);
        function getOrderID(dataSet) {
            var rec = dataSet[0];
            var numOrden = rec['orderId'];

            //Prepara XML
            var  setXML = '<PAGE USER_ID="'+that.userId+'" PRICE_LEVEL_ID="7" NEW_ORDER_ID="'+numOrden+'">'+"\n"+
                            '<ORDER_INFO PAYMENT_METHOD="'+paymentMethod+'" SPECIAL_INSTRUCTIONS="'+instructions+'" />'+"\n"+
                            '<PAYMENTS><PAYMENT AMOUNT="" TYPE="'+paymentMethod+'"/></PAYMENTS>  '+"\n"+
                            '<MULTI_TAXS_INFO>'+"\n"+
                              '<MULTI_TAX_INFO TAX_TYPE="1" TAX_PERCENTAGE="16" BASE_TAXABLE="'+that.total_precio+'" AMMOUNT="'+that.total_precio*that.IVA+'" />'+"\n"+
                            '</MULTI_TAXS_INFO>'+"\n"+
                            '<CART GRAN_TOTAL_ITEM_PV="'+that.total_puntos+'" GRAN_TOTAL_ITEM_CV="'+that.total_vconsumible+'" GRAN_TOTAL_NETO="'+granTotal.substring(1,granTotal.length)+'" HANDLING_AMOUNT="0" SHIPPING_AMOUNT="'+cargoXmanejo.substring(1,cargoXmanejo.length)+'" TAXES="'+that.total_precio*that.IVA+'" OPERATOR="'+that.userId+'" SOURCE_ID="1" REGISTER_PAYMENT="0" REFERENCE="" PAYMENT_AMOUNT="'+granTotal.substring(1,granTotal.length)+'" AMOUNT_TPV="0">'+"\n"+
                              items+
                            '</CART>'+"\n"+
                            '<PERSONAL_INFO WAREHOUSE_ID="'+warehouse+'" />'+"\n"+
                            '<SHIPPING_ADDRES SHIPPING_NAME="'+shipName+'" SHIPPING_COUNTRY_ID="4" HOME_PHONE="'+phoneHome+'" SHIPPING_ADDRESS_LINE_1="'+address1+'" SHIPPING_ADDRESS_NUM_EXT="'+numExt+'" SHIPPING_ADDRESS_NUM_INT="'+numInt+'" SHIPPING_ADDRESS_LINE_2="'+address2+'" SHIPPING_CITY="'+city+'" SHIPPING_STATE="'+state+'" SHIPPING_POSTAL_CODE="'+PostalCode+'" PERIOD_ID="'+period+'" SHIPPING_METHOD="'+shippingMethod+'" CARRIER="'+carrier+'" PAYMENT_METHOD="'+paymentMethod+'" />'+"\n"+
                              that.wallet+
                          '</PAGE>';
            setXML = depurarXML(setXML);

            //Si es pago con modenero, calcula si alcanzan sus puntos
            if (paymentMethod === 50) {
                //Verifica si hay un comercio seleccionado
                if (parseInt(that.cmbComercio.value) !== 0) {
                    //Obtiene saldo del comercio
                    var costoMonedero = that.cmbComercio.options[that.cmbComercio.selectedIndex].title;
                    costoMonedero = parseFloat(costoMonedero);
                    //Obtiene costo de compra
                    var costoCompra = document.getElementById('gran_total').innerHTML;
                    costoCompra = costoCompra.substring(1, costoCompra.length);
                    costoCompra = parseFloat(costoCompra);
                    //Calcula si alcanzan los puntos
                    if (costoMonedero >= costoCompra) {
                        /////////////////////////////////////////////////
                        /******** Guarda la orden por monedero *********/
                        queryData('USP_VBC_SET_ORDER_BY_WALLET', ['string',setXML], orderByWallet);
                        function orderByWallet(dataSet) {
                            var rec = dataSet[0];
                            var result = parseInt(rec['error']);
                            Debug(result);
                            if (result === 0) {
                                alert('Compra realizada correctamente con referencia: ' + rec['reference']);

                                //======================================================//
                                //ENVÍO DE NOTIFICACIÓN UNA VEZ QUE LA COMPRA TUVO ÉXITO//
                                //======================================================//
                                var argumentos = [
                                    'integer', that.userId //Usuario origen
                                ];
                                queryData("USP_VBC_GET_USER_SESSION_CODES", argumentos, getSessionCodes);
                                function getSessionCodes(dataSet) {
                                    var rec = dataSet[0];
                                    var comercioString = that.cmbComercio.options[that.cmbComercio.selectedIndex].text;
                                        comercioString = comercioString.substring(0, comercioString.indexOf('(')-1);
                                    var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_NOTIFICATION';
                                    var mensaje = 'Usted ha hecho una compra por $ '+ parseFloat(granTotal.substring(1,granTotal.length)).toFixed(2) +' desde su Monedero Electronico de '+ comercioString;
                                    var session_code = '';
                                    var platformString = '';
                                    var platform = 0;
                                    var user_alias = '';
                                    var current_period = 0;
                                    var counter = 0;
                                    for(var idx = 0; idx < dataSet.length; idx++){
                                        rec = dataSet[idx];
                                        session_code = rec['sessionCode'];
                                        platformString = rec['mobilePlatform'];
                                        current_period = rec['currentPeriod'];
                                        user_alias = rec['alias'];
                                        counter = counter +1;

                                        if(platformString == 'Android'){
                                            platform = 1;
                                        }else if(platformString == 'IOS'){
                                            platform = 2;
                                        }else if(platformString == 'Windows'){
                                            platform = 3;
                                        }

                                        var parametros = {
                                            "regId" : session_code,
                                            "mensaje" : mensaje,
                                            "plataforma" : platform,
                                            "receiver_user_id" : userId,
                                            "sender_user_id" : userId,
                                            "period_id" : current_period,
                                            "counter" : counter
                                        };console.log(parametros);
                                        $.ajax({
                                            url: ruta,
                                            type: 'GET',
                                            data: parametros,
                                            success: function(response){
                                                console.log('Exito '+response);
                                                //Vacía su carrito de compras
                                                terminado();
                                                //Redirecciona a balance para ver sus movimientos
                                                location.href = 'monedero_movimientos.html?comercio='+cmbComercio.value;
                                            }
                                        });

                                    }
                                }

                            }
                            else if (result === 1) {
                                alert('Ocurrio un error durante tu compra');
                                location.href = 'carrito_compras.html';
                            };
                        }//Termina USP_VBC_SET_ORDER_XML
                        //Oculta imágen AJAX
                        that.cart.hideAjax();
                    }
                    else {
                        alert('No tienes suficiente saldo en este Comercio');
                        //Oculta imágen AJAX
                        that.cart.hideAjax();
                    }
                }
                else {
                    alert('Debes seleccionar un comercio');
                    //Oculta imágen AJAX
                    that.cart.hideAjax();
                }
            }
            //Si el pago es por depósito, se procede al cobro normal
            else if (paymentMethod === 7) {
                /////////////////////////////////////////////////
                /******** Guarda la orden por depósito *********/
                queryData('USP_VBC_SET_ORDER_XML', ['string',setXML], guardarPedido);
                function guardarPedido(dataSet) {
                    var rec = dataSet[0];
                    location.href="carrito_compras_ficha.html?granTotal="+granTotal+"&refBancomer="+rec['refBancomer']+"&reference="+rec['reference']+"&numOrden="+numOrden+"&nombre="+shipName;
                }//Termina USP_VBC_SET_ORDER_XML
                
            }
        }// Termina USP_VBC_GET_ORDER_ID
    }, false);
    /*************** Termina Inserción XML ***************/
    ///////////////////////////////////////////////////////

    //Oculta imágen AJAX
    that.cart.hideAjax();
};
//=============================================================//
//-------Termina inserción de la orden por XML a la base--------//
//=============================================================//

//====================================================//
//---Llena tabla con dirección de centro autorizado---//
//====================================================//
SendCart.prototype.warehouseDetail = function(dataSet2){
    var rec2 = dataSet2[0];
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">País:</th><td><address>' + rec2['countryCode'] + '</address></td>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Calle/ Número:</th><td><address>' + rec2['address1'] + '</address></td>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Ciudad/ Municipio:</th><td><address>' + rec2['address2'] + '</address></td>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Ciudad:</th><td><address>' + rec2['description'] + '</address></td>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Estado / C.P.:</th><td><address>' +   rec2['stateCode'] + '/ ' + 
                                                                        rec2['postalCode'] + '</address></td>';
    that.tablaPerfil += '</tr>';
    that.tablaPerfil += '<tr>';
    that.tablaPerfil += '<th class="titulos">Instrucciones Especiales</th><td><input type="text" id="instrucciones" data-mini="true" /></td>';
    that.tablaPerfil += '</tr>';
    //Campos ocultos
    that.tablaPerfil += '<div style="top:-100px; position: absolute"><span id="phoneHome">';
    that.tablaPerfil += '</span><span id="numInt">'+
             '</span><span id="numExt">'+
             '</span></div>';

    that.tblPerfil.innerHTML = that.tablaPerfil;
};
//=================================================//
//---Termina llenado de tabla Centro autorizado---//
//================================================//

//==========================================================//
//---Carga combobox de comercios del monedero electrónico---//
//==========================================================//
SendCart.prototype.commerce = function(dataSet) {
    var rec = dataSet[0];
    var recT = dataSet.length;
    for (var idx = 0; idx < recT; idx++) {
        rec = dataSet[idx];
        var options = document.createElement('option');
        options.value = rec['walletTypeId'];
        options.text = rec['description'] + ' ('+(rec['userBalance']).toFixed(2)+')';
        options.title = rec['userBalance'];
        that.cmbComercio.options.add(options);
    }
}
//===========================================//
//---Termina combobox monedero electrónico---//
//===========================================//