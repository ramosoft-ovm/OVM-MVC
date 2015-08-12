function TreeViewer(cmbPeriodo, divArbol)
{
	that = this;
	that.cmbPeriodo = cmbPeriodo;
	that.divArbol = divArbol;
}

//=============================//
//---------Mascara AJAX-------//
//===========================//
TreeViewer.prototype.showAjax = function() {
	//Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
};

TreeViewer.prototype.hideAjax = function() {
	//Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};
//=============================//
//---Termina Mascara AJAX-----//
//===========================//

//=================================//
//---Llena combobox de periodos---//
//================================//
TreeViewer.prototype.periods = function(dataSet) {
	var rec = dataSet[0];
    var text = '';
    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        var opcion = document.createElement('option');
        opcion.text = rec['description'];
        opcion.value = rec['periodId'];
        that.cmbPeriodo.options.add(opcion);
    }
    var periodoByURL = getByURL()['period'];
    if (typeof periodoByURL != "undefined") {
        that.cmbPeriodo.value = periodoByURL;
    }
};
//=================================//
//---Termina llenado de periodos---//
//================================//

//=====================================//
//---Carga usuarios en forma de arbol---//
//=====================================//
TreeViewer.prototype.tree = function(dataSet) {
	var rec = dataSet[0];
    if (typeof rec == "undefined") {
        app.showNotificactionVBC('Aún no tienes una red que mostrar');
        location.href ='welcome.html';
    }
    var text = '';
    var boole = false;
    var como = "";
    var nodos = [];
    var numNodo = 0;
    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        text += "<li class='ocultar'><span class='espacio' style='font-size:10px'></span><a onClick='link(event)' class='li" +
        rec['userIdUp']+ "' id='"+
        rec['userId']+ "' href='#'>" +
        rec['name'].toUpperCase()+ "</a> <a onClick='javascript:location.href=\"volumen_movil_detalles.html?id="+
        rec['userId']+"&period="+that.cmbPeriodo.value+"&dateCreated="+rec['dateCreated']+"&pd="+rec['pd']+"&personalVolume="+rec['personalVolume']+"&CommValue="+rec['personalCommValue']+"&name="+rec['name']+"\"' class='icon-point-right'></a><ul class='ul" +
        rec['userId']+ "'></ul></li>\n";
    }
    //Imprime respuesta
    that.divArbol.innerHTML = text;
    //Como todo esta oculto, muestra primer elemento para iniciar
    document.querySelector('li:nth-child(1)').classList.add('mostrar');
    document.querySelector('li:nth-child(1)').classList.add('estilo');
    document.querySelector('li:nth-child(1) a').classList.add('estiloA');
    document.querySelector('a:nth-child(3)').classList.add('estiloA');
    document.querySelector('li:nth-child(1) span').classList.add('estiloA');
    //Disparador de click inicial para desplegar primer nodo
    var evento = document.createEvent('MouseEvent');
    evento.initMouseEvent('click',true, true, window,0,0,0,0,0, false, false, false, false, 0, null);
    var desplegaNth1 = document.querySelector('li:nth-child(1)').childNodes[1];
    desplegaNth1.dispatchEvent(evento);
    //oculta imagen ajax
    that.hideAjax();
};
//=====================================//
//---Termina carga de visor de arbol---//
//=====================================//

//=======================================//
//---mostrar y ocultar notod del arbol---//
//=======================================//
TreeViewer.prototype.showNodes = function(event) {
    //id del enlace clickeado
    var id = event.target.id;
    //selecciona ul que almacenará los hijos del nodo clickeado
    var uladd = document.querySelector('.ul'+id);
    //selecciona todos los elementos hijos del nodo clickeado
    var liadd = document.querySelectorAll('.li'+id);
    //Selecciona el nodo para verificar si contiene hijos
    var hijos = uladd.childNodes[0];
    if (typeof hijos == "undefined") {
        //recorre todos los hijos
        for (var i = 0; i < liadd.length; i++) {
            //por cada hijo, cuanta si existen mas subhijos y los imprime
            var numNodos = document.querySelectorAll('.li'+liadd[i].id).length;
            uladd.innerHTML += '<li>('+numNodos+')' +liadd[i].parentNode.innerHTML+ '</li>';
            //en caso de haber hijos, imprime flecha a la derecha
            if (numNodos != 0) {
                uladd.querySelectorAll('span')[i].classList.add('icon-arrow-right');
            }
            else {
                //de lo contrario imprime signo menos de neutro
                uladd.querySelectorAll('span')[i].classList.add('icon-minus');
            }
        }
        //imprime flecha a la izquierda ya que hijos no esta definido
        document.getElementById(id).parentNode.querySelector('span:nth-child(1)').classList.add('icon-arrow-left');
    }
    else {
        //se imprime vacio para simular el plegado del menú
        uladd.innerHTML = "";
        document.getElementById(id).parentNode.querySelector('span:nth-child(1)').classList.add('icon-arrow-right');
        document.getElementById(id).parentNode.querySelector('span:nth-child(1)').classList.remove('icon-arrow-left');
    }
};
//======================================//
//---Termina mostrar y ocultar nodos---//
//=====================================//