function Wallet(cmbComercio,txtComercioDestino,txtUsuarioDestino,txtCantidad,txtCantidadDecimal,txtPassword,txtConfirmarPassword,txtComentario, userId, userAlias)
{
	that = this;
	//Atributos
	that.cmbComercio = document.getElementById('cmb_comercio');
	that.txtComercioDestino = txtComercioDestino;
	that.txtUsuarioDestino = txtUsuarioDestino;
	that.txtCantidad = txtCantidad;
	that.txtCantidadDecimal = txtCantidadDecimal;
	that.txtPassword = txtPassword;
	that.txtConfirmarPassword = txtConfirmarPassword;
	that.txtComentario = txtComentario;
	//--
	that.userId = userId;
	that.userAlias = userAlias;
}

//=============================//
//---------Mascara AJAX--------//
//=============================//
Wallet.prototype.showAjax = function(){
	//Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
};

Wallet.prototype.hideAjax = function(){
	//Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};
//=============================//
//---Termina Mascara AJAX------//
//=============================//

//=================================//
//---Carga Combobox comercios------//
//=================================//
Wallet.prototype.businesses = function(dataSet){
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
    that.hideAjax();
};
//===================================//
//---Termina carga de comercios------//
//===================================//

//=================================================//
//Carga comercio destino segun el estado del origen//
//=================================================//
Wallet.prototype.tradeDestinationCharge = function(argument){
	var value = that.cmbComercio.options[that.cmbComercio.selectedIndex].text;
    value = value.substring(0, value.indexOf('(')-1);
    that.txtComercioDestino.value = value;
    event.target.blur();
    that.txtUsuarioDestino.focus();
    cordova.plugins.Keyboard.show();
};
//=========================================//
//---Termina carga de usuario destino------//
//=========================================//

//=========================================//
//--- Inicia proceso de Transferencia -----//
//=========================================//
Wallet.prototype.validatePassword = function(dataSet){
	var rec = dataSet[0];
    var status = rec['status'];
    if (status === 0) {
        //////////////////////////////////////////////
        /******** Valida el usuario destino *********/
        var argumentos = [
            'integer',that.txtUsuarioDestino.value //Usuario destino
        ];
        queryData("USP_VBC_VALIDATE_USER", argumentos, that.validateUser);
    }
    else if (status === 1) {
        alert('Usuario inexistente');
        //Oculta imágen AJAX
        wallet.hideAjax();
    }
    else if (status === 2) {
        alert('El password es incorrecto');
        //Oculta imágen AJAX
        wallet.hideAjax();
    }
    else if (status === 3) {
        alert('No activo');
        //Oculta imágen AJAX
        wallet.hideAjax();
    }
    else if (status === 5) {
        alert('Oficina bloqueada');
        //Oculta imágen AJAX
        wallet.hideAjax();
    };
};

Wallet.prototype.validateUser = function(dataSet){
	var rec = dataSet[0];
    var error = parseInt(rec['error']);
    if (error === 1) {
        ///////////////////////////////////////////////////////
        /******** Realiza la transferencia de puntos *********/
        var argumentos = [
            'float',  parseFloat(that.txtCantidad.value+'.'+that.txtCantidadDecimal.value), //Monto
            'integer',that.cmbComercio.value, //Tipo de comercio
            'integer',that.userId, //Usuario origen
            'integer',that.txtUsuarioDestino.value, // Usuario Destino
            'string', that.txtComentario.value //Comentarios
        ];
        console.log(argumentos);
        queryData("USP_VBC_SET_WALLET_BALANCE_TRANSFERENCES", argumentos, that.transference);
    }
    else if (error === 0) {
        alert('El ID de usuario que ingresaste no existe, digita uno correcto');
        that.txtUsuarioDestino.value = '';
        that.txtUsuarioDestino.focus();
        //Oculta imágen AJAX
        wallet.hideAjax();
    }
};

Wallet.prototype.transference = function(dataSet){
	var rec = dataSet[0];
	console.log(rec);
    var error = parseInt(rec['error']);
    if (error === 1) {
        alert('Transferencia exitosa');
        //=============================================================//
        //ENVÍO DE NOTIFICACIÓN UNA VEZ QUE LA TRANSFERENCIA TUVO ÉXITO//
        //=============================================================//
        var argumentos = [
            'integer', that.txtUsuarioDestino.value //Usuario origen
        ];
        queryData("USP_VBC_GET_USER_SESSION_CODES", argumentos, that.getSessionCodes);
    }
    else if (error === 2) {
        alert('Ocurrio un error, intenta nuevamente');
        location.reload();
        //Oculta imágen AJAX
        wallet.hideAjax();
    }
    else if (error === 0) {
        alert('Saldo Insuficiente');
        that.txtCantidad.value = '';
        that.txtCantidad.focus();
        //Oculta imágen AJAX
        wallet.hideAjax();
    };
};

Wallet.prototype.getSessionCodes = function(dataSet){
	//variables generales del método
    var rec = dataSet[0];
    var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_NOTIFICATION';
    var mensaje = 'Usted ha recibido una transferencia de parte del Usuario '+ that.userAlias +' por $ '+ parseFloat((that.txtCantidad.value+'.'+that.txtCantidadDecimal.value)).toFixed(2) +' para su Monedero Electronico de '+ that.txtComercioDestino.value;
    var session_code = '';
    var platformString = '';
    var platform = 0;
    var user_alias = '';
    var current_period = 0;
    var counter = 0;
    //VALIDAMOS SI EL USUARIO TIENE DISPOSITIVOS REGISTRADOS EN DONDE RECIBA LA NOTIFICACIÓN
    if(typeof(rec) == 'undefined'){
        var parametros = {
            "regId" : session_code,
            "mensaje" : mensaje,
            "plataforma" : platform,
            "receiver_user_id" : that.txtUsuarioDestino.value,
            "sender_user_id" : that.userId,
            "period_id" : current_period,
            "counter" : counter
        };console.log(parametros);
        $.ajax({
            url: ruta,
            type: 'GET',
            data: parametros,
            success: function(response){
                console.log('Exito '+response);
                if(response == 2){
                    alert("El Usuario # "+ that.txtUsuarioDestino.value +" no ha sido notificado debido a que no cuenta con una Sesión Móvil iniciada. Una vez que inicie Sesión, el Usuario # "+ txtUsuarioDestino.value +", podrá visualizar éste mensaje en su Historial de Notificaciones");                                                                                                            
                }
                //Redirecciona a welcome para ver su nuevo saldo
                location.href = 'welcome.html';
            },
            error: function(response){
                console.log('Error '+ response);
                alert('Ha ocurrido un error en el almacenamiento de los datos al Historial de Notificaciones');
                //Redirecciona a welcome para ver su nuevo saldo
                location.href = 'welcome.html';
            }
        });


        /*alert("El Usuario # "+ txtUsuarioDestino.value +" no ha sido notificado debido a que no cuenta con una Sesión Móvil iniciada. Una vez que inicie Sesión, el Usuario # "+ txtUsuarioDestino.value +", podrá visualizar éste mensaje en su Historial de Notificaciones");
        //Redirecciona a welcome para ver su nuevo saldo
         location.href = 'welcome.html';*/
    }else{                                            
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
                "receiver_user_id" : that.txtUsuarioDestino.value,
                "sender_user_id" : that.userId,
                "period_id" : current_period,
                "counter" : counter
            };console.log(parametros);
            $.ajax({
                url: ruta,
                type: 'GET',
                data: parametros,
                success: function(response){
                    console.log('Exito '+response);
                    if(response == 1){
                        alert('El Usuario '+ user_alias +' ha sido notificado de la Transferencia por $ '+ parseFloat((that.txtCantidad.value+'.'+that.txtCantidadDecimal.value)).toFixed(2) +' a su Monedero Electronico de '+ that.txtComercioDestino.value);                                                      

                    }else{
                        alert('Ha fallado el envío de la Notificación al Usuario '+ user_alias);
                    }
                    //Redirecciona a welcome para ver su nuevo saldo
                    location.href = 'welcome.html';
                },
                error: function(response){
                    console.log('Error '+ response);
                    alert('Ha ocurrido un error en el envío de la Notificación');

                    //Redirecciona a welcome para ver su nuevo saldo
                    location.href = 'welcome.html';
                }
            });
        }
    }
};
//=========================================//
//--- Termina procedo de transferencia ----//
//=========================================//

//================================//
//---Validaciones de campos------//
//==============================//
Wallet.prototype.emptyField = function(field){
	if (field.value === 0 || field.value === '') {
		if (getOS() === 1) {
			field.focus();
			cordova.plugins.Keyboard.show();
		}
		else if (getOS() === 2) {
			field.focus();
		}
		else if (getOS() === 3) {
			field.focus();
		};
		return false;
	}
	else {
		return true;
	}
};
Wallet.prototype.equalField = function(field1, field2){
	var campo2 = field2
	//Verifica si el campo 2 es un objeto de formulario
	if (field2.value) {
		campo2 = field2.value;
	};
	if (field1.value === campo2) {
		return true;
	}
	else {
		if (getOS() === 1) {
			field1.focus();
			cordova.plugins.Keyboard.show();
		}
		else if (getOS() === 2) {
			field1.focus();
		}
		else if (getOS() === 3) {
			field1.focus();
		};
		field1.value  = '';
		//Al ser falso, si el campo 2 es objeto de formulario lo limpia
		if (field2.value) {
			field2.value = '';
		};
		return false;
	}
};
//==============================//
//---Termina Validaciones------//
//============================//