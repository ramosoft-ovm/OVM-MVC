function Menu()
{
	that = this;
}

Menu.prototype.loadMenu = function(){
	$('#menu').load("includeMenu.html");
};

Menu.prototype.loadUser = function(){
    var usuario = localStorage.getItem('usernameLocal');
    $('span#loadUsernameLocal').append(" " + usuario);
}

Menu.prototype.welcome = function(){      
    $('#showMenu').trigger('click');
    window.location = "welcome.html";
}
Menu.prototype.profile = function(){      
    $('#showMenu').trigger('click');
    window.location = "profile.html";
}

Menu.prototype.transferences = function(){      
    $('#showMenu').trigger('click');
    window.location = "monedero_transferencias.html";
}

Menu.prototype.cart = function(){      
    window.location = "carrito_compras.html";
}

Menu.prototype.notifications = function(){      
    window.location = "notificaciones.html";
}

Menu.prototype.treeViewer = function(){      
    $('#showMenu').trigger('click');
    window.location = "volumen_movil.html";
}

Menu.prototype.checkRelativeRoot = function(){
    var rutaAbsoluta = self.location.href;
    var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
    var rutaRelativa = rutaAbsoluta.substring( posicionUltimaBarra + "/".length , rutaAbsoluta.length );

    if(rutaRelativa.indexOf("?") > 1){
        var posicionInterrogacion = rutaRelativa.lastIndexOf("?");
        rutaRelativa = rutaRelativa.substring(0, posicionInterrogacion);
    }       
    return rutaRelativa;       
}

Menu.prototype.checkRoot = function(){
        switch(that.checkRelativeRoot()){
            case "welcome.html":
                $('#active-welcome a').addClass('active');
                break;
            case "profile.html":
                $('#active-profile a').addClass('active');
                break;
            case "carrito_compras_catalogo.html":
                $('#active-carrito a').addClass('active');
                break;
            case "carrito_compras_detalles.html":
                $('#active-carrito a').addClass('active');
                break;
            case "monedero_transferencias.html":
                $('#active-transferencias a').addClass('active');
                break;
            case "monedero_movimientos_detalles.html":
                $('#active-transferencias a').addClass('active');
                break;
            case "carrito_compras.html":
                $('#active-carrito a').addClass('active');
                break;
            case "suscriptores.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "suscriptores2.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "suscriptores3.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "suscriptores4.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "suscriptores5.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "suscriptores6.html":
                $('#active-suscriptores a').addClass('active');
                break;
            case "notificaciones.html":
                $('#active-notificaciones a').addClass('active');
            break;
            case "volumen_movil.html":
                $('#active-visorDeArbol a').addClass('active');
            break;
        }
    }