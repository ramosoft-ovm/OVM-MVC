document.addEventListener('DOMContentLoaded', function(){

    //EXTRACCIÓN DE USERID QUE EJECUTA LA APLICACIÓN//
	var userId = localStorage.getItem("userIdLocal");
	//userId = 11;

    //INSTANCIA A LA CLASE CONTROL PANEL//
    var controlPanel = new ControlPanel();

    /*Devuelve el Número de Notificaciones no leídas*/
    queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', ['integer', userId, 'integer', 0, 'integer', 2], controlPanel.getNotificationsCount);    

    /*Devuelve los saldos por cada comercio en el Monedero Electrónico*/
    queryData('USP_VBC_GET_WALLET_TYPE_BALANCE', ['integer', userId], controlPanel.getWalletBalances);    

    /*Devuelve el tipo de Usuario*/
    queryData('USP_VBC_GET_DASHBOARD', ['integer', userId], controlPanel.getPersonalVolume);

    /*Devuelve el tipo de Usuario*/
    queryData('USP_VBC_GET_USER_TYPE', ['integer', userId], controlPanel.getUserType);

	/*Devuelve los últimos inscritos del usuario que esperan por ser agregados a la RED*/
    //queryData('USP_VBC_GET_WAITING_ROOM', ['integer', userId], controlPanel.getWaitingRoom);

    /*Devuelve la cantidad de miembros que pertencen a la red del usuario */
    queryData('USP_VBC_GET_MATRIX_VIEWER', ['integer',userId,'integer','0','integer','0','integer','18','integer','1'], controlPanel.getMembersCount);

});