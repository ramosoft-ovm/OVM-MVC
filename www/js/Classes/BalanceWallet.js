function BalanceWallet(cmbPeriodos, tblBalance, comercio, userId)
{
	that = this;
	that.cmbPeriodos = cmbPeriodos;
	that.tblBalance = tblBalance;
	//------------------------
	that.userId = userId;
	that.comercio = comercio;
}

//=============================//
//---------Mascara AJAX-------//
//===========================//
BalanceWallet.prototype.showAjax = function() {
	//Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
};

BalanceWallet.prototype.hideAjax = function() {
	//Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};
//=============================//
//---Termina Mascara AJAX-----//
//===========================//

//=========================================//
//---Retorna cadena con tipo de comercio--//
//=======================================//
BalanceWallet.prototype.tradingType = function() {
    switch(that.comercio){
        case 1:
            return 'Comercio Tipo 1';
            break;
        case 2:
            return 'Supermercado';
            break;
        case 3:
            return 'Gasolineras';
            break;
        case 4:
            return 'Otros Comercios';
            break;
        default:
        	return '(No he seleccionado un comercio)';
        	break;
    }
};
//======================================\\
//--Termina retorno de tipo de comercio--\\
//========================================\\


//========================//
//---Combobox Periodos---//
//======================//
BalanceWallet.prototype.periods = function(dataSet) {
    var rec = dataSet[0];
    var recT = dataSet.length;
    for (var idx = 0; idx < recT; idx++) {
        rec = dataSet[idx];
        var options = document.createElement('option');
        options.text = rec['description'];
        options.value = rec['periodId'];
        that.cmbPeriodos.options.add(options);
    }
//============================\\
//--Termina combobox periodos--\\
//==============================\\


//=============================//
//---Llena tabla de balance---//
//===========================//
    //Evento change de combobox periodo
    that.cmbPeriodos.addEventListener('change', function(event) {
        //Carga imagen ajax para carrito compras catalogo
        that.showAjax();
        //------------------------
        event.target.blur();
        var argumentos = [
            'integer',that.userId,//Usuario
            'integer',that.cmbPeriodos.value,//Periodo
            'integer',that.comercio,//Comercio
            'integer','0'//PN_ERROR
        ]
        queryData("USP_VBC_GET_WALLET_BALANCE_HIST", argumentos, that.balance);
    }, false);

    //argumentos para el procedimiento
    var argumentos = [
        'integer',that.userId,//Usuario
        'integer',that.cmbPeriodos.value,//Periodo
        'integer',that.comercio,//Comercio
        'integer','0'//PN_ERROR
    ]
    //Si hay un periodID por get, entonces lo carga.
    if (typeof getByURL()['periodID'] != 'undefined') {
        argumentos[3] = getByURL()['periodID'];
        that.cmbPeriodos.value = getByURL()['periodID'];
        console.log(getByURL()['periodID']);
    };
    queryData("USP_VBC_GET_WALLET_BALANCE_HIST", argumentos, that.balance);
};
//Inicia llenado de tabla
BalanceWallet.prototype.balance = function(dataSet) {
	var rec = dataSet[0];
    var text = '';
    var iniBalance = 0;
    if (typeof rec == 'undefined') {
        text = '<tr>';
        text = '<td colspan="3">No hay Movimientos que mostrar</td>';
        text += '</tr>';
        //Imprime tabla
        that.tblBalance.childNodes[3].innerHTML = text;
    }
    else {
        var recT = dataSet.length;
        //-Muestra balance inicial
        text = '<tr class="tbl_balance">';
        text += '<td colspan="2">Balance Inicial en fecha <span class="iniDate"></span></td>';
        text += '<td id="initBalance">$</td>';
        text += '</tr>';
        //-Muestra transacciones
        for (var idx = 0; idx < recT; idx++) {
            rec = dataSet[idx];
            text += '<tr>';
            text += '<td>'+rec['walletTransactionType']+'</td>';
            text += '<td><a class="btn-tbl" href="monedero_movimientos_detalles.html?datos='+
                rec['walletTransactionType']+'-:-'+
                rec['walletBalanceId']+'-:-'+
                (rec['amount']).toFixed(2)+'-:-'+
                rec['period']+'-:-'+
                rec['walletType']+'-:-'+
                rec['comments']+'-:-'+
                rec['dateCreated'].substring(0, 10)+'-:-'+
                rec['senderUserAlias']+'-:-'+rec['getterUserAlias']+'&periodID='+that.cmbPeriodos.value+'&comercio='+that.comercio+'" >'+rec['walletBalanceId']+'</a></td>';
            text += '<td>$'+(rec['amount']).toFixed(2)+'</td>';
            text += '</tr>';
            iniBalance = rec['iniBalance'];
        }
        //-Muestra Balance final
        text += '<tr class="tbl_balance">';
        text += '<td colspan="2">Balance Final en fecha '+rec['endDate']+'</td>';
        text += '<td>$'+(rec['endBalance']).toFixed(2)+'</td>';
        text += '</tr>';
        //Almacena todos los datos en un span para luego enviarlos.
        text += '<span id="lbl_arreglo">'+
                rec['walletTransactionType']+'-:-'+
                rec['walletBalanceId']+'-:-'+
                (rec['amount']).toFixed(2)+'-:-'+
                rec['period']+'-:-'+
                rec['walletType']+'-:-'+
                rec['comments']+'-:-'+
                rec['dateCreated'].substring(0, 10)+'-:-'+
                rec['senderUserAlias']+'</span>';
    
        //Imprime tabla
        that.tblBalance.childNodes[3].innerHTML = text;
        document.querySelector('.iniDate').innerHTML=rec['iniDate'];
        //Imprime el balance inicial
        var inibalance = document.querySelector('#initBalance');
        inibalance.innerHTML = (iniBalance).toFixed(2);
        console.log(rec);
    }
    //Oculta imágen AJAX
    that.hideAjax();
};
//===================================\\
//--Termina llenado de tabla Balance--\\
//=====================================\\

//===============================//
//--Responde al botón detalles--//
//=============================//
BalanceWallet.prototype.details = function(event){
	var cmbPeriodos = document.getElementById('cmb_periodos')
    var divDetalles = document.getElementById('div_detalles');

    event.preventDefault();
    var referencia = event.target.text;
    var comercio = parseInt(getByURL()['comercio']);
    var lblArreglo = document.getElementById('lbl_arreglo');
    location.href = 'monedero_movimientos_detalles.html?comercio='+comercio+'&datos='+lblArreglo.innerHTML+'&periodID='+that.cmbPeriodos.value;
};
//=========================\\
//--Termina botón detalles--\\
//===========================\\