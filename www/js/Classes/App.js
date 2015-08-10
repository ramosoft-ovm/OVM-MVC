function App() {
    this.initialize(); 
}

App.prototype.initialize = function(){
    // Application Constructor 
    this.bindEvents();  
};

App.prototype.bindEvents = function(){
    // Bind Event Listeners 
    // 
    // Bind any events that are required on startup. Common events are: 
    // 'load', 'deviceready', 'offline', and 'online'. 
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("menubutton", this.onMenuKeyDown, false); 
    document.addEventListener("backbutton", this.onBackKeyDown, false);
};

App.prototype.onDeviceReady = function(){
    // deviceready Event Handler 
    // 
    // The scope of 'this' is the event. In order to call the 'receivedEvent' 
    // function, we must explicity call 'app.receivedEvent(...);' 
    app.checkConnection(); 
    app.receivedEvent('deviceready'); 
};

App.prototype.receivedEvent = function(id){
    // Update DOM on a Received Event 
    var parentElement = document.getElementById(id); 
    var listeningElement = parentElement.querySelector('.listening'); 
    var receivedElement = parentElement.querySelector('.received'); 

    listeningElement.setAttribute('style', 'display:none;'); 
    receivedElement.setAttribute('style', 'display:block;'); 

    console.log('Received Event: ' + id); 
    var pushNotification = window.plugins.pushNotification; 

    //Extrae información sobre que Sistema Operativo usa
    var navInfo = window.navigator.appVersion.toLowerCase();
    var so = '';
    if(navInfo.indexOf('android') !== -1) {
        so = 'Android';
    }
    else if (navInfo.indexOf('mac') !== -1) {
        so = 'Macintosh'
    }
    else if (navInfo.indexOf('win') !== -1) {
        so = 'Windows';
    };

    
    if (so === 'Android') { 
        //alert("Register called");
        //tu Project ID aca!!
        pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"449139096818","ecb":"app.onNotificationGCM"}); 
    } 
    else if (so === 'Macintosh') { 
        pushNotification.register(this.successHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"}); 
    } 
};

App.prototype.successHandler = function(result){
     // result contains any message sent from the plugin call 
    //alert('Callback Success! Result = '+result)
    var resultado = result.toLowerCase();
    if (resultado !== 'ok') {
        document.getElementById('regId').value = result;
    };
};

App.prototype.onNotificationGCM = function(e){
    switch( e.event ) 
    { 
        case 'registered': 
            if ( e.regid.length > 0 ) 
            { 
                console.log("Regid " + e.regid); 
                //alert('registration id = '+e.regid); 
                //Cuando se registre le pasamos el regid al input 
                document.getElementById('regId').value = e.regid; 
            } 
        break;

        case 'message': 
            // NOTIFICACION!!! 
            if (typeof e.message == "undefined") {
                //
            } else {
                var mitexto = e.message;
                /*var mitextoLocal = '';
                if(window.localStorage.getItem('message')) {
                    mitextoLocal = localStorage.getItem('message');
                    mitextoLocal = mitextoLocal + mitexto + '-:-';
                    localStorage.setItem('message',mitextoLocal);
                }
                else {
                    localStorage.setItem('message',mitexto+'-:-');
                }*/
                //app.showNotificactionVBC(e.message);                    
                if (mitexto.indexOf("comisión") >= 0) {
                    app.showConfirmRedirection("comisiones.html", "Nueva Notificación de Comisiones");                        
                }
                else if (mitexto.indexOf("venta") >= 0) {
                    app.showConfirmRedirection("ventas.html", "Nueva Notificación de Ventas");
                }
                else if (mitexto.indexOf("nuevo suscrito") >= 0) {
                    app.showConfirmRedirection("suscriptores.html", "Nueva Notificación de Suscripciones");
                }
                else {
                    app.showNotificactionVBC(e.message);
                }
            }
        break; 

        case 'error': 
          alert('GCM error = '+e.msg); 
        break; 

        default: 
          alert('An unknown GCM event has occurred'); 
          break; 
    }
};

App.prototype.onNotificationAPN = function(event){
    var pushNotification = window.plugins.pushNotification;
    //alert("Running in JS - onNotificationAPN - Received a notification! " + event.alert); 
     
    if (event.alert) { 
        //navigator.notification.alert(event.alert);
        app.showNotificactionVBC(event.alert);
    } 
    if (event.badge) { 
        pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge); 
    } 
    if (event.sound) { 
        var snd = new Media(event.sound); 
        snd.play(); 
    } 
};

App.prototype.onMenuKeyDown = function(){
    //Lanza menú al pulsar el botón menu del dispositivo
    $('#showMenu').trigger('click');
};

App.prototype.onBackKeyDown = function(event){
    if(localStorage.getItem("menuStatus") == 1){
        $('#showMenu').trigger('click');
    }else{
        if(app.checkRelativeRoot() == 1){
            app.showConfirm(); return false;
        }else if(app.checkRelativeRoot() == 2){
            app.showConfirmRootWelcome(); return false;
        }else if(app.checkRelativeRoot() == 3){
            history.back();
        }else if(app.checkRelativeRoot() == 10){
            event.preventDefault();
        }else if(app.checkRelativeRoot() == 11){
            window.location.href = "welcome.html";
        }
    }
};

App.prototype.checkRelativeRoot = function(){
    //Check if the realtive root is index.html, login.html or inicio.html to show the exit confirmation dialog
    var numero = 0;

    var rutaAbsoluta = self.location.href;
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring( posicionUltimaBarra + "/".length , rutaAbsoluta.length);       // index.html, login.html or welcome.html

    if(rutaRelativa.indexOf("?") > 1){
        var posicionInterrogacion = rutaRelativa.lastIndexOf("?");
        rutaRelativa = rutaRelativa.substring(0, posicionInterrogacion);
    }    

    if((rutaRelativa == "index.html") || (rutaRelativa == "login.html")){
        numero = 1;
    }else if(rutaRelativa == "welcome.html"){
        numero = 2;
    }else if(rutaRelativa == "suscriptores2.html" || rutaRelativa == "suscriptores3.html" || rutaRelativa == "suscriptores4.html" || rutaRelativa == "suscriptores5.html" || rutaRelativa == "cuadroDialogoDireccion.html" || rutaRelativa == "cuadroDialogoContrato.html" || rutaRelativa == 'carrito_compras_generar.html' || rutaRelativa == 'carrito_compras_ficha.html'){
        numero = 10; 
    }else if(rutaRelativa == "suscriptores.html"){
        numero = 11;
    }else{
        numero = 3;
    } return numero;
};

App.prototype.showConfirm = function(){
    // Show a custom confirmation dialog
    navigator.notification.vibrate(500);
    navigator.notification.confirm(
        '¿Realmente desea cerrar la aplicación?', // message
         app.onConfirm,            // callback to invoke with index of button pressed
        'Cerrar Aplicación',           // title
        ['Salir','Cancelar']         // buttonLabels
    );
};

App.prototype.onConfirm = function(buttonIndex){
    //Exit the app if the botton pressed was Quit
    if(buttonIndex == 1){
        //if(!localStorage.getItem("isCBCheckedLocal")){
            localStorage.removeItem('susc1Local');
            localStorage.removeItem('susc2Local');
            localStorage.removeItem('susc3Local');
            localStorage.removeItem('susc4Local');
            localStorage.removeItem('susc5Local');
        //}            
        navigator.app.exitApp();
    }
};

App.prototype.showConfirmRootWelcome = function(){
    // Show a custom confirmation dialog
    navigator.notification.vibrate(500);
    navigator.notification.confirm(
        'Elija la acción a realizar', // message
         app.onConfirmRootWelcome,            // callback to invoke with index of button pressed
        'Opciones',           // title
        ['Salir','Cerrar Sesión','Cancelar']         // buttonLabels
    );
};

App.prototype.onConfirmRootWelcome = function(buttonIndex){
    //Exit the app if the botton pressed was Quit
    if(buttonIndex == 1){
        /*if(!localStorage.getItem("isCBCheckedLocal")){*/
            localStorage.removeItem('susc1Local');
            localStorage.removeItem('susc2Local');
            localStorage.removeItem('susc3Local');
            localStorage.removeItem('susc4Local');
            localStorage.removeItem('susc5Local');
        //} 
        navigator.app.exitApp();
    }else if(buttonIndex == 2){
        //if(!localStorage.getItem("isCBCheckedLocal")){
            localStorage.removeItem('susc1Local');
            localStorage.removeItem('susc2Local');
            localStorage.removeItem('susc3Local');
            localStorage.removeItem('susc4Local');
            localStorage.removeItem('susc5Local');
        //}
        app.showConfirmLogout();
    }
};

App.prototype.showConfirmLogout = function(){
    //muestra un diálogo de confirmación para cerrar sesión
    $('#showMenu').trigger('click');
        navigator.notification.vibrate(300);

        navigator.notification.confirm(
            '¿Realmente desea cerrar la sesión?',
            app.onConfirmLogout,
            'Cerrar Sesión',
            ['Sí, deseo cerrar sesión','Cancelar']
        );
};

App.prototype.onConfirmLogout = function(buttonIndex){
    if(buttonIndex == 1){
        eliminarCredenciales();
    }
};

App.prototype.showConfirmRedirection = function(ruta, notificación){
    //muestra un diálogo de confirmación para redireccionar a la ruta indicada
    navigator.notification.vibrate(300);
    navigator.notification.confirm(
        notificación + "\n" + '¿Desea ir en este momento?',
        function(buttonIndex){
            app.onConfirmRedirection(buttonIndex, ruta);
        },
        'Notificaciones VBC',
        ['Sí, deseo ir ahora','Cancelar']
    );
};

App.prototype.onConfirmRedirection = function(buttonIndex, ruta){
    if(buttonIndex == 1){
        location.href = ""+ ruta;
    }   
};

App.prototype.showNotificactionVBC = function(mensaje){
    navigator.notification.alert(
        mensaje,  // message
        app.alertDismissed,         // callback
        'Notificación OVM',            // title
        'Hecho'                  // buttonName
    );
};

App.prototype.checkConnection = function(){
    //Check if the connection is available, if not quit the app
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    //Si no hay conexion, cierra la app
    //
    if (states[networkState] == states[Connection.NONE]) {
        app.showConfirmAlert('¡Lo sentimos, necesita conexión a internet!');
        //navigator.app.exitApp();
    }
};

App.prototype.cerrarApp = function(){
    // do something
    navigator.app.exitApp();
};

App.prototype.showConfirmAlert = function(mensaje){
    navigator.notification.alert(
        mensaje,  // message
        app.cerrarApp,         // callback
        'Notificación VBC',            // title
        'Hecho'                  // buttonName
    );
};