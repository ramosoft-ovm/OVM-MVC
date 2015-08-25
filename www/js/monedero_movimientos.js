//-------------------------------------------------------
document.addEventListener('DOMContentLoaded', function(){
    //Variables globales
    var userId = localStorage.getItem('userIdLocal');
    userId = 12;
    //---------------------------------------------
    var cmbPeriodos = document.getElementById('cmb_periodos');
    var lblTitulo = document.getElementById('lbl_titulo');
    var tblBalance = document.getElementById('tbl_balance');
    //----------------------------------------------
    var comercio = parseInt(getByURL()['comercio']);
    //----------------------------------------------
    balanceWallet = new BalanceWallet(cmbPeriodos, tblBalance, comercio, userId);

    //Carga tipo de comercio
    lblTitulo.innerHTML += balanceWallet.tradingType();;

    
    //Carga imagen ajax para carrito compras catalogo
    balanceWallet.showAjax();

    ///////////////////////////////////////////////
    /******** Carga combobox de periodos *********/
    //-----------------------
    var argumentos = [
        'integer','5', //Flag
        'integer','0' //PN_ERROR
    ];
    //Carga combobox periodos
    queryData("USP_VBC_GET_PERIODS", argumentos, balanceWallet.periods);
});

//Functión que responde al link para detalles
function details(event) {
    balanceWallet = new WalletBalance();
    balanceWallet.details(event);
}