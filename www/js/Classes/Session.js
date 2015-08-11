//========================//
//-------Contructor-------//
//========================//
function Session(userName, password, regId, save)
{
	that = this;
	//Parametros.
	that.userName = userName;
	that.password = password;
	that.regId = regId;
	that.save = save;
	//Número aleatorio para establecer el SESSION_ID
	that.min = 100000000;
    that.max = 999999999;
    that.sessionId = aleatorio(that.min,that.max);
    //variables extraidas del servidor
    that.userIdRemoto;
    that.usernameRemoto;
    that.sessionStatusRemoto;
    that.nameRemoto;
	//Variable para bloquear login
	that.acceso = false;
	that.intentos = 0;
	//Instancia a clase APP
	that.app = new App();
}
//=================================//
//-------Termina Constructor-------//
//=================================//

//=================================//
//-- Expiración de Sesión --//
//=================================//
Session.prototype.updateExpirationDate = function(dataSet) {
	var rec = dataSet[0];
    if(rec['error'] == 0){
        //Comprueba si hay variables locales definidas
        if (localStorage.getItem("isCBCheckedLocal")) {
            //Si existen los datos de usuario almacenados localmente redirecciona a la página de inicio 
            window.setTimeout(function(){ location.href ="welcome.html";},1750);
        }else{
            localStorage.clear();
        }
    }
    else if(rec['error'] == 1)
    {            
        if (localStorage.getItem("isCBCheckedLocal")) {
            alert('Su sesión ha expirado');
            localStorage.clear();    
        }
    }
};
//=================================//
//-- Termina Expiración de Sesión --//
//=================================//


//=======================//
//-------- Login -------//
//=====================//
Session.prototype.login = function(){
	if (that.validation(that.regId)) {
		if (that.validation(that.userName, that.password)) {
			/*Si coincide con los datos enviados,  permite el inicio de sesión */
            queryData('USP_VBC_VALIDATE_PASSWORD', ['string', that.userName, 'string', that.password, 'string', that.sessionId], that.validateUser);
		}
		else {
			alert('Los campos Usuario y Contraseña no pueden estar vacíos');
		}
	}
	else {
		alert('Esperando SESSION_CODE de su dispositivo para que pueda recibir Notificaciones a su Oficina Virtual Móvil')
	}
};

Session.prototype.validation = function(field1, field2) {
	if (typeof field2 == 'undefined') {
		if (field1 == '') {
			return false;
		}
		else {
			return true;
		}
	}
	else {
		if (field1 == '' && field2 == '') {
			return false;
		}
		else {
			return true;
		}
	}
};

Session.prototype.isCBChecked = function(){
	if (save.checked) {
		return true;
	}
	else {
		return false;
	}
};

Session.prototype.validateUser = function(dataSet) {
	var rec = dataSet[0];
	//Si el status es igual a 0 significa que el usuario y el passsword son correctos y continúa con la validación
    if(rec['status'] == 0){
        that.userIdRemoto = rec['custid'];
        that.usernameRemoto = rec['nickname'];
        //sessionStatusRemoto = rec['status'];
        that.nameRemoto = rec['customerName'];

        that.acceso = true;

        //Una vez que el acceso es verdadero se procede a guardar el SESSION_CODE del usuario para Notificaciones
        if(that.acceso){
            //Elimina las variables locales por posibles intentos fallidos
            localStorage.clear();
            //Extrae información acerca del Sistema Operativo
            var so = '';
            if(getOS() === 1) {
                so = 'Android';
            }
            else if (getOS() === 2) {
                so = 'IOS'
            }
            else if (getOS() === 3) {
                so = 'Windows';
            }
            //Almacena el SESSION_CODE al usuario correspondiente
            queryData('USP_VBC_SET_MOBILE_SESSION', ['string', that.regId, 'string', so, 'integer', that.userIdRemoto], that.validateRegister);
        }
    }else if(rec['status'] == 1){
        alert('Usuario Inexistente');
    }else if(rec['status'] == 2){

        //Cuenta Los intentos erroneos de cada usuario
        //Si los intentos son mayor a 3, bloquea la cuenta
        if (window.localStorage.getItem('intentos'+that.userName)) {
            that.intentos = parseInt(localStorage.getItem('intentos'+that.userName));
            //Si tiene mas de 3 intentos, lo bloquea
            if (that.intentos > 1) {
                var argumentos = [
                    'integer', that.userName, //Nombre de usuario
                    'integer', 4, //Status => 4 Suspendido
                    'integer', '', //Operador
                    'string', 'Bloqueado por ' + (that.intentos+1) + ' intentos fallidos' //Descripción
                ];
                //Verifica si lo que capturó es un userID o un nickName
                if (isNaN(that.userName)) {
                	var argumentos = [
                    'integer', that.userName, //Nombre de usuario
                    'integer', 4, //Status => 4 Suspendido
                    'integer', '', //Operador
                    'string', 'Bloqueado por ' + (that.intentos+1) + ' intentos fallidos' //Descripción
                ];
                    //Si capturó un nickName, extrae primero su UserID para poder bloquearlo.
                    queryData('USP_VBC_GET_USER_ID', ['string',that.userName], that.getUserId);
                }
                else {
                    //Si capturó un UserID, ejecuta el bloqueo directamente
                    queryData('USP_VBC_UPDATE_STATUS', argumentos, that.updateStatus);
                }
            }
        }
        //Si el usuario se equivoca en la contraseña, contabiliza los intentos
        if (window.localStorage.getItem('intentos'+that.userName)) {
            that.intentos = that.intentos + 1;
            localStorage.setItem('intentos'+that.userName,that.intentos);
        }
        else {
            localStorage.setItem('intentos'+that.userName,1);
        }
        alert('El password es Incorrecto ('+localStorage.getItem('intentos'+that.userName)+')');
        document.getElementById('password').value = '';
    }else if(rec['status'] == 3){
        alert('El Usuario aún no es activado');
    }else if(rec['status'] == 4){
        alert('Ésta cuenta ya está en uso');
    }else if(rec['status'] == 5){
        alert('Su Oficina Virtual está bloqueda');
    }
};

Session.prototype.validateRegister = function(dataSet) {
	var rec = dataSet[0];
    //Sí el status es igual a 0 la inserción fue exitosa y si es igual a 1 el SESSION_CODE ya existía
    if(rec['status'] == 0 || rec['status'] == 1){
        //Sí el checkbox esta seleccionado se almacena su estado para redirección automática
        if(that.isCBChecked()){
            localStorage.setItem("isCBCheckedLocal", true);
        }
        localStorage.setItem("nameLocal", that.nameRemoto);
        localStorage.setItem("usernameLocal", that.usernameRemoto);
        localStorage.setItem("regIdLocal", that.regId);
        localStorage.setItem("userIdLocal", that.userIdRemoto);
        localStorage.setItem("sessionIdLocal", that.sessionId);
        //localStorage.setItem("sessionStatusLocal", sessionStatusRemoto);

        location.href = "welcome.html";
    }else{
        alert('Error en el inicio de sesión, intente de nuevo');
    }
};

Session.prototype.getUserId = function(dataSet){
	var rec = dataSet[0];
    console.log(rec);
    var argumentos = [
	    'integer', rec['userId'], //Nombre de usuario
	    'integer', 4, //Status => 4 Suspendido
	    'integer', '', //Operador
	    'string', 'Bloqueado por ' + (that.intentos+1) + ' intentos fallidos' //Descripción
	];
    queryData('USP_VBC_UPDATE_STATUS', argumentos, that.updateStatus);
};

Session.prototype.updateStatus = function(dataSet) {
	var rec = dataSet[0];
    var status = parseInt(rec['error']);
    if (status === 0) {
        alert('Tu cuenta ha sido bloqueada por exceder el límite de intentos fallidos, comunícate con el Administrador para desbloquearla.');
        localStorage.removeItem('intentos'+that.userName);
    };
};
//=======================//
//---Termina Login -------//
//=====================//

//===========//
//-- Logout //
//==========//
Session.prototype.deleteCredentials = function(){
    var userIdLocal = localStorage.getItem("userIdLocal");
    var regIdLocal = localStorage.getItem("regIdLocal");
    /*Elimina SESSION_CODE de usuario cuando cierrar sesión para evitar que siga recibiendo notificaciones*/
    queryData('USP_VBC_SET_DELETE_MOBILE_SESSION', ['string', regIdLocal, 'integer', userIdLocal], that.deleteMobileSession);
}

Session.prototype.deleteMobileSession = function(dataSet){
	  var rec = dataSet[0];
	  if(rec['status'] == 0){
	    //SE ELIMINAN VARIABLES LOCALES DE SESIÓN
	    localStorage.clear();
	    location.href = "login.html";
	  }else{
	    alert("Error en la BD");
	  }
};
//====================//
//-- Termina Logout --//
//====================//

//===============================//
//-- Recuperación de contraseña //
//==============================//
Session.prototype.recoverPassword = function(event) {
	event.preventDefault();
	/*Obtenemos el Número de Usuario para recuperar contraseña*/
    var userId = $('#txtUserId').val();
    //Validamos que el campo con el UserId no esté vacío
    if(!userId == ''){
        /*Se obtiene la contraseña y el correo electrónico del usuario para ser enviados vía EMAIL*/
        queryData('USP_VBC_GET_PASSWORD', ['integer', userId, 'integer', 0], that.getPassword);        
    }else{
        alert('El campo del Número de Usuario no puede estar vacío');
    }
};

Session.prototype.getPassword = function(dataSet) {
	var rec = dataSet[0]; console.log(rec);
    var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_MAIL_PASSWORD';
    //Validamos que el Número de usuario exista
    if(typeof(rec) == 'undefined'){
        $('#txtUserId').val("");
        alert('El Número de Usuario que usted digitó no existe');
        //alert('userid no existe');
    }else if(!rec['email'] == ''){                    
        var parametros = {
            "EMAIL" : rec['email'],
            "PASSWORD" : rec['password']
          };
        $.ajax({
            url: ruta,
            type: 'POST',
            data: parametros,
            success: function(response){
                console.log('Exito '+response);
                if(response == "1"){                        
                    $('#txtUserId').val("");
                    $('.linkform').trigger('click');
                    alert('El envío de la contraseña al correo '+ rec['email'] +' ha sido exitoso');
                }else{
                    alert('El envío de la contraseña ha fallado, intente nuevamente');
                }
            },
            error: function(response){
                console.log('Error '+ response);
                alert('Ha ocurrido un error en el envío de la contraseña');
            }
        });
    }
};
//====================================//
// Termina Recuperación de contraseña //
//====================================//