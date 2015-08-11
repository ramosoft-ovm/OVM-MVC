$(function(){
    
    //====================================================//
    //Instancia clase Keyboard para los eventos de teclado//
    //====================================================//
    $('#username').keypress(function(event) {
        var keyboard = new Keyboard('#username','#password', event);
        keyboard.showKeyboard();
    });
    $('#password').keypress(function(event) {
        var keyboard = new Keyboard('#password','#saveSettings', event);
        keyboard.triggerButton();
    });
    $('#txtUserId').keypress(function(event) {
        var keyboard = new Keyboard('#txtUserId', '',event);
        keyboard.hideKeyboard();
    });
    //===================================//
    //Termina instancia a clase Keyboard//
    //==================================//

    //=========================================//
    //COMPRUEBA QUE LA SESIÓN NO HAYA EXPIRADO//
    //=========================================//
    var session = new Session();
    var regIdLocal = localStorage.getItem("regIdLocal");
    var userIdLocal = localStorage.getItem("userIdLocal");
    queryData("USP_VBC_SET_UPDATE_EXPIRATION_DATE_OF_MOBILE_SESSION", ['integer',userIdLocal,'string',regIdLocal], session.updateExpirationDate);
    //=======================================//
    //TERMINA COMPROBACIÓN DE SESIÓN EXPIRADA//
    //=======================================//

    //========================================================//
    //Instancia clase Session para inicializar su método login//
    //========================================================//
    var userName = document.getElementById('username');
    var password = document.getElementById('password');
    var regId = document.getElementById('regId');
    regId.value = 'lad64a6s4df654as53d1f53a15dsf';
    var save = document.getElementById('save');
    $("#saveSettings").click(function(){
        var sessionLogin = new Session(userName.value, password.value, regId.value, save);
        sessionLogin.login();
    });
    //=====================================//
    //Termina instancia Session para login //
    //====================================//

    //============================================//
    //EJECUTA ACCIÓN DE RECUPERACIÓN DE CONTRASEÑA//
    //============================================//
    $('#sendMail').click(function(event) {
        var session = new Session();
        session.recoverPassword(event);
    });

});