document.addEventListener('DOMContentLoaded',function() {
    //EXTRACCIÓN DE USERID QUE EJECUTA LA APLICACIÓN//
    var userId =  localStorage.getItem('userIdLocal');
    //userId = 11;

    var cmbPeriodo = document.getElementById('periodo');

    //EXTRACCIÓN DE VARIABLES QUE VIENEN POR GET
    var period_id = getByURL()['period_id'];   

	var args = [
		'integer', 5, //@PN_FLAG
		'integer', 0 //@PN_ERROR
	];

    //INSTANCIA A LA CLASE NOTIFICATIONS//
    var notifications = new Notifications(userId, cmbPeriodo, period_id);

	/*DEVUELVE LOS PERIODOS Y A TRAVÉS DEL OBJETO NOTIFICATIONS CARGAMOS EL HISTORIAL DEL PERIODO ACTUAL*/
    queryData('USP_VBC_GET_PERIODS', args, notifications.getPeriods);
    
    //===============================================================//
    //EVENTO QUE SE EJECUTA AL CAMBIAR EL VALOR DEL COMBO DE PERIODOS//
    //===============================================================//
    periodo.addEventListener('change', function(){
        
        notifications.showAjax();

        event.target.blur();

        var args = [
            'integer', userId, //@PN_USER_ID
            'integer', cmbPeriodo.value, //@PN_PERIOD_ID
            'integer',  1  //@PN_FLAG
        ];

        queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', args, notifications.getUserHist);
        
    });
    //========================================================//
    //TERMINA EJECUCIÓN DE EVENTO CHANGE DEL COMBO DE PERIODOS//
    //========================================================//

    //=======================================//
    //EVENTO OCULTAR O MOSTRAR NOTIFICACIONES//
    //=======================================//
    var btnNotChecked = document.getElementById('btnNotChecked');
    var btnChecked = document.getElementById('btnChecked');

    btnNotChecked.addEventListener('click', function(){
        notifications.btnNotChecked();           
    });

    btnChecked.addEventListener('click', function(){
        notifications.btnChecked();        
    });
    //===============================================//
    //TERMINA EVENTO OCULTAR O MOSTRAR NOTIFICACIONES//
    //===============================================//
});