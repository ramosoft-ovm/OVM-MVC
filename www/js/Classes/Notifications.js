//====================//
//CONSTRUCTOR DE CLASE//
//====================//
function Notifications(userId, cmbPeriodo, period_id_get){
	that = this;
	//Parámetros
	that.userId = userId;
	that.cmbPeriodo = cmbPeriodo;
	that.period_id_get = period_id_get; 
	//Variables Locales
	that.status = ['notChecked', 'checked'];
    that.auxStatus = '';
    that.sender_alias = '';
    that.date_full = '';
    that.day = '';
    that.month = '';
    that.year = '';
    that.date = '';
    that.hour = '';
    that.notification_id = 0;
    that.sender_user_id = 0;
    that.description = '';
    that.params = '';
}
//============================//
//TERMINA CONSTRUCTOR DE CLASE//
//============================//

//====================//
//CARGA COMBO PERIODOS//
//====================//
Notifications.prototype.getPeriods = function(dataSet){
	var rec = dataSet[0];
    var text = '';

    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        if(rec['periodId'] == that.period_id_get){
            text += '<option value="'+ rec["periodId"] +'" selected>'+ rec["description"] +'</option>';
        }
        else{
            text += '<option value="'+ rec["periodId"] +'">'+ rec["description"] +'</option>';
        }
    }

    that.cmbPeriodo.innerHTML += text;

    var args = [
        'integer', that.userId, //@PN_USER_ID
        'integer', that.cmbPeriodo.value, //@PN_PERIOD_ID
        'integer',  1  //@PN_FLAG
    ];
    queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', args, that.getUserHist);
}
//============================//
//TERMINA CARGA COMBO PERIODOS//
//============================//

//=================================//
//CARGA HISTORIAL DE NOTIFICACIONES//
//=================================//
Notifications.prototype.getUserHist = function(dataSet){
	var rec = dataSet[0];
    var text = '';

    if(typeof(rec) == 'undefined'){
        text += '<tr>';
        text += '<th class="notFound">';
        text += '<span>NO SE ENCONTRARON NOTIFICACIONES EN ESTE PERIODO</span>';
        text += '</th>';
        text += '</tr>';
    }else{       
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            that.auxStatus = that.status[rec['notificationStatus']];
            that.sender_alias = rec['senderAlias'];
            that.date_full = rec['dateCreated'];
            that.year = that.date_full.substr(0, 4);
            that.month = that.date_full.substr(5, 2);
            that.day = that.date_full.substr(8, 2);
            that.date = that.day +' - '+ that.month +' - '+ that.year;
            that.hour = that.date_full.substr(11, 5);
            that.notification_id = rec['notificationId'];
            that.sender_user_id = rec['senderUserId'];
            that.description = rec['description'];

            that.params = 'notificaciones_detalles.html?notification_id='+that.notification_id+'&sender_user_id='+that.sender_user_id+'&sender_alias='+that.sender_alias+'&description='+that.description+'&date='+that.date+'&hour='+that.hour+'&period_id='+that.cmbPeriodo.value;

            text += '<tr>';
            text += '<th class="'+ that.auxStatus +'">';
            text += '<span>Notificación de '+ that.sender_alias +'</span><span>Hora: '+ that.hour +'</span><br><br><span>Fecha: '+ that.date +'</span><a class="btnDetails" href="'+that.params+'"><span class="icon-eye iconDetails"></span> Ver detalles</a>';
            text += '</th>';
            text += '</tr>'; 
        } 
    }    
    document.querySelector('table#notificaciones tbody').innerHTML = text;

    that.hideAjax();
}
//=========================================//
//TERMINA CARGA HISTORIAL DE NOTIFICACIONES//
//=========================================//

//======================================//
//MUESTRA U OCULTA NOTIFICACIONES LEÍDAS//
//======================================//
Notifications.prototype.btnChecked = function(argument){
	if($('th.checked').is(':hidden')){
        $('#btnChecked').html('<span class="icon-eye-minus icon"></span> Ocultar');
        $('th.checked').show(500); 
    }else{
        $('#btnChecked').html('<span class="icon-eye-plus icon"></span> Mostrar');
        $('th.checked').hide(500);
    }   
}
//==============================================//
//TERMINA MUESTRA U OCULTA NOTIFICACIONES LEÍDAS//
//==============================================//

//=========================================//
//MUESTRA U OCULTA NOTIFICACIONES NO LEÍDAS//
//=========================================//
Notifications.prototype.btnNotChecked = function(argument){
	if($('th.notChecked').is(':hidden')){
        $('#btnNotChecked').html('<span class="icon-eye-minus icon"></span> Ocultar');
        $('th.notChecked').show(500); 
    }else{
        $('#btnNotChecked').html('<span class="icon-eye-plus icon"></span> Mostrar');
        $('th.notChecked').hide(500);
    } 
}
//=================================================//
//TERMINA MUESTRA U OCULTA NOTIFICACIONES NO LEÍDAS//
//=================================================//

//==================================//
//MUESTRA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
Notifications.prototype.showAjax = function(){
    //Carga imagen ajax
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
}
//==========================================//
//TERMINA MUESTRA ELEMENTOS DE ANIMACIÓN AJAX//
//==========================================//

//==================================//
//OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
Notifications.prototype.hideAjax = function(){
    //oculta imagen ajax
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
}
//==========================================//
//TERMINA OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==========================================//





//=====================================================================================================================================//
//=====================================================================================================================================//
//===================================================INICIA CLASE NOTIFICATIONDETAIL===================================================//
//=====================================================================================================================================//
//=====================================================================================================================================//


//====================//
//CONSTRUCTOR DE CLASE 2//
//====================//
function NotificationsDetails(){
	that = this;
	//Parámetros
    that.notification_id = getByURL()['notification_id'];
    that.sender_user_id = getByURL()['sender_user_id'];
    that.sender_alias = getByURL()['sender_alias'];
    that.description = getByURL()['description'];
    that.date = getByURL()['date'];
    that.hour = getByURL()['hour'];
    that.period_id = getByURL()['period_id'];
    //VARIABLE LOCAL
    that.text = '';
}
//============================//
//TERMINA CONSTRUCTOR DE CLASE 2//
//============================//

NotificationsDetails.prototype.buildDetail = function(){
	that.text += '<tr>';
    that.text += '<th># de Usuario que envió la Notificación: </th>';            
    that.text += '<td>'+that.sender_user_id+'</td>';            
    that.text += '</tr>';
    that.text += '<tr>';
    that.text += '<th>Alias de Usuario que envió la Notificación: </th>';            
    that.text += '<td>'+that.sender_alias+'</td>';            
    that.text += '</tr>';
    that.text += '<tr>';
    that.text += '<th>Fecha de envío: </th>';            
    that.text += '<td>'+that.date+'</td>';            
    that.text += '</tr>';
    that.text += '<tr>';
    that.text += '<th>Hora de Envío: </th>';            
    that.text += '<td>'+that.hour+'</td>';            
    that.text += '</tr>';
    that.text += '<tr>';
    that.text += '<th>Mensaje de la Notificación: </th>';            
    that.text += '<td>'+that.description+'</td>';            
    that.text += '</tr>';

    $('table#detalles thead tr th').append(that.notification_id);
    $('table#detalles tbody').append(that.text);

    that.hideAjax();    
}

NotificationsDetails.prototype.updateNotificationStatus = function(){
	//Se actualiza el status de la Notificación para que aparezca como leída
    var args = [
        'integer',  that.notification_id  //@PN_NOTIFICATION_ID
    ];
    queryData('USP_VBC_SET_UPDATE_NOTIFICATION_STATUS', args, that.getStatusError);    
}

NotificationsDetails.prototype.getStatusError = function(dataSet){	
    var rec = dataSet[0];
    if(rec['error'] == 0){
        console.log('Se actulizó el status');
    }else{
        console.log('No se actualizó el status');
    }    
}

NotificationsDetails.prototype.goBack = function(){
	location.href = "notificaciones.html?period_id="+that.period_id;
}

NotificationsDetails.prototype.hideAjax = function(){
	//oculta imagen ajax
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html(''); 		
}




//=====================================================================================================================================//
//=====================================================================================================================================//
//===================================================INICIA CLASE CREATENOTIFICATION===================================================//
//=====================================================================================================================================//
//=====================================================================================================================================//


//====================//
//CONSTRUCTOR DE CLASE 3//
//====================//
function CreateNotification(ruta, mensaje, session_code, platform, user_alias, current_period, receiver_user_id, sender_user_id, cantidad, cantidadDecimal, destinationCommerce){
    that = this;
    //Parámetros
    that.ruta = ruta;
    that.mensaje = mensaje;
    that.session_code = session_code;
    that.platform = platform;
    that.user_alias = user_alias;
    that.current_period = current_period;
    that.counter = 0;
    that.cantidad = cantidad;
    that.cantidadDecimal = cantidadDecimal;
    that.destinationCommerce = destinationCommerce;

    that.parametros = {
        "regId" : session_code,
        "mensaje" : mensaje,
        "plataforma" : platform,
        "receiver_user_id" : receiver_user_id,
        "sender_user_id" : sender_user_id,
        "period_id" : current_period,
        "counter" : counter
    }
}
//============================//
//TERMINA CONSTRUCTOR DE CLASE 3//
//============================//

CreateNotification.prototype.sendNotificationFailed = function(){
    $.ajax({
        url: that.ruta,
        type: 'GET',
        data: that.parametros,
        success: function(response){
            console.log('Exito '+response);
            if(response == 2){
                alert("El Usuario # "+ that.receiver_user_id +" no ha sido notificado debido a que no cuenta con una Sesión Móvil iniciada. Una vez que inicie Sesión, el Usuario # "+ that.receiver_user_id +", podrá visualizar éste mensaje en su Historial de Notificaciones");
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
}

CreateNotification.prototype.sendNotificationSuccess = function(){
    $.ajax({
        url: that.ruta,
        type: 'GET',
        data: that.parametros,
        success: function(response){
            console.log('Exito '+response);
            if(response == 1){
                alert('El Usuario '+ that.user_alias +' ha sido notificado de la Transferencia por $ '+ parseFloat((that.cantidad+'.'+that.cantidadDecimal)).toFixed(2) +' a su Monedero Electronico de '+ that.destinationCommerce);                                                      

            }else{
                alert('Ha fallado el envío de la Notificación al Usuario '+ that.user_alias);
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


var notification = new CreateNotification(ruta, mensaje, session_code, platform, user_alias, current_period, that.txtUsuarioDestino.value, that.userId, that.txtCantidad.value, that.txtCantidadDecimal.value, that.txtComercioDestino.value);

            notification.sendNotificationSuccess();