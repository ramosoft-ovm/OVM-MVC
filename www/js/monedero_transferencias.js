document.addEventListener('DOMContentLoaded', function() {
    //Variables glogales
    var userId = localStorage.getItem("userIdLocal");    
    userId = '11';
    var userAlias = localStorage.getItem("usernameLocal");
    //---------------------------
    var cmbComercio = document.getElementById('cmb_comercio');
    var txtComercioDestino = document.getElementById('txt_comercio_destino');
    var txtUsuarioDestino = document.getElementById('txt_usuario_destino');
    var txtCantidad = document.getElementById('txt_cantidad');
    var txtCantidadDecimal = document.getElementById('txt_cantidad_decimal');
    var txtPassword = document.getElementById('txt_password');
    var txtConfirmarPassword = document.getElementById('txt_confirmar_password');
    var txtComentario = document.getElementById('txt_comentarios');
    var btnTransferir = document.getElementById('btn_transferir');
    //-Instancia a la clase Wallet para procesar las transferencias
    var wallet = new Wallet(cmbComercio,txtComercioDestino,txtUsuarioDestino,txtCantidad,txtCantidadDecimal,txtPassword,txtConfirmarPassword,txtComentario, userId, userAlias);
    //-Carga imagen ajax para carrito compras catalogo
    wallet.showAjax();

    //-Define cantidad decimales por default.
    txtCantidadDecimal.value = '00';
    
    //- Carga combobox Comercio
    queryData("USP_VBC_GET_WALLET_TYPE_BALANCE", ['integer',userId], wallet.businesses);

    //-Segun la eleción del comercio a retirar, se llena el textbox de comercio destino
    cmbComercio.addEventListener('change', function(event){
        wallet.tradeDestinationCharge();
    }, false);

    //Valida campos
    btnTransferir.addEventListener('click', function(event) {
        //-Prevent Default del botón
        event.preventDefault();
        //-Carga imagen ajax para carrito compras catalogo
        wallet.showAjax();

        var puntos = parseFloat(cmbComercio.options[cmbComercio.selectedIndex].title);
        if (!wallet.emptyField(cmbComercio)) {
            alert('Debe seleccionar un comercio del cual desee retirar');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.emptyField(txtComercioDestino)) {
            alert('No se ha cargado un comercio destino');
            cmbComercio.focus();
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.emptyField(txtUsuarioDestino)) {
            alert('Falta un usuario destino');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.equalField(txtUsuarioDestino, userId)) {
            alert('No se pueden realizar transferencias a si mismo');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.emptyField(txtCantidad) || !wallet.emptyField(txtCantidadDecimal)) {
            alert('Falta la cantidad a transferir');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if ((txtCantidad.value+'.'+txtCantidadDecimal.value) > puntos) {
            alert('No puede transferir más puntos de los que tiene');
            txtCantidad.value = "";
            txtCantidad.focus();
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.emptyField(txtPassword)) {
            alert('Falta el campo contraseña');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.emptyField(txtConfirmarPassword)) {
            alert('Falta confirmar contraseña');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else if (!wallet.equalField(txtPassword, txtConfirmarPassword)) {
            alert('La contraseña no concuerda, vuelva a escribirla');
            //Oculta imágen AJAX
            wallet.hideAjax();
        }
        else {
            ///////////////////////////////////////
            /******** Valida el password *********/
            var argumentos = [
                'integer',userId, //Usuario actual
                'st7ring', txtPassword.value, //Password
                'integer',0 //SESSION_ID
            ];
            queryData("USP_VBC_VALIDATE_PASSWORD", argumentos, wallet.validatePassword);
        }
    }, false);
    
    //Eventos para responder a tecla enter del teclado
    txtUsuarioDestino.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtCantidad.focus();
            cordova.plugins.Keyboard.show();
        }
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else {
            event.preventDefault();
        }
    }, false);
    txtCantidad.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtPassword.focus();
            cordova.plugins.Keyboard.show();
        };
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else
        {
            event.preventDefault();
        };
    }, false);
    txtCantidadDecimal.addEventListener('keypress', function(event) {
        if (txtCantidadDecimal.value.length > 1) {
            event.preventDefault();
            console.log('dentro');
        }
        if (event.which === 13) {
            txtPassword.focus();
            cordova.plugins.Keyboard.show();
        };
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else
        {
            event.preventDefault();
        };
    },false);
    txtPassword.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtConfirmarPassword.focus();
            cordova.plugins.Keyboard.show();
        };
    }, false);
    txtConfirmarPassword.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtComentario.focus();
            cordova.plugins.Keyboard.show();
        };
    },false);
    txtComentario.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtComentario.blur();
        };
    }, false);
});