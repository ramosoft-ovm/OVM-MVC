//====================//
//CONSTRUCTOR DE CLASE//
//====================//
function Notifications(userId, cmbPeriodo){
	that = this;
	//Parámetros
	that.userId = userId;
	that.cmbPeriodo = cmbPeriodo;
	//Variables Locales
	that.status = ['checked', 'notChecked'];
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
        if(rec['periodId'] == period_id){
            text += '<option value="'+ rec["periodId"] +'" selected>'+ rec["description"] +'</option>';
        }
        else{
            text += '<option value="'+ rec["periodId"] +'">'+ rec["description"] +'</option>';
        }
    }

    that.cmbPeriodo.innerHTML += text;

    //===================================//
    //CARGA DE HISTORIAL DE NOTIFIACIONES//
    //===================================//
    var args = [
        'integer', that.userId, //@PN_USER_ID
        'integer', that.periodo.value, //@PN_PERIOD_ID
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

//==================================//
//MUESTRA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
Notifications.prototype.hideAjax = function(){
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