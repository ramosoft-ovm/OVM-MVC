//====================//
//CONSTRUCTOR DE CLASE//
//====================//
function ControlPanel(){
	that = this;
	//Propiedades Locales
	that.IsClassFull = 0;
}
//============================//
//TERMINA CONSTRUCTOR DE CLASE//
//============================//

//========================//
//CONTEO DE NOTIFICACIONES//
//========================//
ControlPanel.prototype.getNotificationsCount = function(dataSet){
	var rec = dataSet[0];
    var counter = 0;

    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];//console.log(rec);
        counter = counter +1;
    }

    $('table tbody tr:nth-child(1) td a').prepend('<span>'+counter+'</span>');
    $('table tbody tr:nth-child(1) td a span').addClass('count');

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//================================//
//TERMINA CONTEO DE NOTIFICACIONES//
//================================//

//==========================//
//BALANCE PARA CADA COMERCIO//
//==========================//
ControlPanel.prototype.getWalletBalances = function(dataSet){
	var rec = dataSet[0];
    var auxArray = [];

    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        var completeBalance = (rec['userBalance']).toFixed(2);
        var splitBalance = completeBalance.split('.');

        auxArray.push(splitBalance);
    }

    $('table tbody tr:nth-child(2) td a').append('<span>'+auxArray[0][0]+'</span>.'+auxArray[0][1]);
    $('table tbody tr:nth-child(2) td a span').addClass('count');

    $('table tbody tr:nth-child(3) td a').append('<span>'+auxArray[1][0]+'</span>.'+auxArray[1][1]);
    $('table tbody tr:nth-child(3) td a span').addClass('count');

    $('table tbody tr:nth-child(4) td a').append('<span>'+auxArray[2][0]+'</span>.'+auxArray[2][1]);
    $('table tbody tr:nth-child(4) td a span').addClass('count');

    $('table tbody tr:nth-child(5) td a').append('<span>'+auxArray[3][0]+'</span>.'+auxArray[3][1]);
    $('table tbody tr:nth-child(5) td a span').addClass('count');

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//==================================//
//TERMINA BALANCE PARA CADA COMERCIO//
//==================================//

//=================//
// VOLUMEN PERSONAL//
//=================//
ControlPanel.prototype.getPersonalVolume = function(dataSet){
	var rec = dataSet[0];
    
    $('table tbody tr:nth-child(6) td a').prepend('<span>'+rec['personalVolume']+'</span>');
    $('table tbody tr:nth-child(6) td a span').addClass('count');

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//========================//
//TERMINA VOLUMEN PERSONAL//
//========================//

//===============//
//TIPO DE USUARIO//
//===============//
ControlPanel.prototype.getUserType = function(dataSet){
	var rec = dataSet[0];
    
    $('table tbody tr:nth-child(9) td a').prepend('<span>'+rec['descriptionType']+'</span>');

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//=======================//
//TERMINA TIPO DE USUARIO//
//=======================//

//========================//
//CONTEO DE SALE DE ESPERA//
//========================//
ControlPanel.prototype.getWaitingRoom = function(dataSet){
	var rec = dataSet[0];
    var cont = 0; //console.log(rec);         
    
    //==========VALIDAMOS EL OBJETO QUE NOS DEVUELVE EL QUERYDATA=================//

    if(typeof(rec) == 'undefined'){//Si el objeto viene como undefined, significa que no tiene sala de espera
        //console.log('1');
        cont = 0;
    	$('table tbody tr:nth-child(8) td a').attr('href', '#');
    }else if(rec['dataField0'] == 0){//Si el objeto viene con el item dataField0, significa que éste usuario aún no es agregado a la red del patrocinador
        //console.log('2');
        cont = 0;
        $('table tbody tr:nth-child(8) td a').attr('href', '#');
    }else{//Si el objeto viene cargado con los datos de nuevos RIR'S , significa que el usuario tiene una sala de espera de 'x' miembros
        //console.log('3');
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];                
            cont = cont+1;                
        }
    }

    //console.log(cont);//Imprimimos contador para pruebas
    $('table tbody tr:nth-child(8) td a').prepend('<span>'+cont+'</span>');
    $('table tbody tr:nth-child(8) td a span').addClass('count'); 

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//================================//
//TERMINA CONTEO DE SALA DE ESPERA//
//================================//

//========================//
//CONTEO DE VISOR DE ÁRBOL//
//========================//
ControlPanel.prototype.getMembersCount = function(dataSet){
	var rec = dataSet[0];
	var cont = 0; 

    //================VALIDAMOS EL OBJETO QUE DEVUELVE EL QUERYDATA===============// 

    if(typeof(rec) == 'undefined'){
        $('table tbody tr:nth-child(7) td a').attr('href', '#');
    }else{
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            cont = cont+1;
        }
        cont = cont - 1;
        if(cont == 0){//Si el contador es = a 1, significa que el único registro que devuelve el objeto es del mismo usuario, por lo tanto el contador se iguala a 0
            cont = 0;
            $('table tbody tr:nth-child(7) td a').attr('href', '#');
        }
    }

    $('table tbody tr:nth-child(7) td a').prepend('<span>'+cont+'</span>');
    $('table tbody tr:nth-child(7) td a span').addClass('count');

    /*COMRPOBAMOS SI YA SE CARGARON TODOS LOS VALORES DEL PANEL PARA EJECUTAR EL MÉTODO QUE CARGA EL PANEL Y SUS ANIMACIONES*/
    that.IsClassFull += 1;
    that.getIsClassFullCount();
    /*TERMINA COMPROBACIÓN DE CARGA DE VALORES DEL PANEL DE CONTROL*/
}
//================================//
//TERMINA CONTEO DE VISOR DE ÁRBOL//
//================================//

//==================================//
//CONTEO DE LA PROPIEDAD ISCLASSFULL//
//==================================//
ControlPanel.prototype.getIsClassFullCount = function(){
	if(that.IsClassFull == 5){
		that.showControlPanel();
	}else{
		console.log('Propiedad IsClassFull aún no llega a 5: '+ that.IsClassFull);
	}
}
//=======================================//
//TERMINA CONTEO LA PROPIEDAD ISCLASSFULL//
//=======================================//

//========================//
//MUESTRA PANEL DE CONTROL//
//========================//
ControlPanel.prototype.showControlPanel = function(){
	console.log('IS FULL: '+ that.IsClassFull);	

	$('#contenedor').fadeIn(300);
    counter();
    
    //oculta imagen ajax
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
}
//================================//
//TERMINA MUESTRA PANEL DE CONTROL//
//================================//