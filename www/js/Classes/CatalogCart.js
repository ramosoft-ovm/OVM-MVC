function CatalogCart(cmbCategoria, divCatalogos)
{
	that = this;
	that.cmbCategoria = cmbCategoria;
	that.divCatalogos = divCatalogos;
}

//=============================//
//---------Mascara AJAX-------//
//===========================//
CatalogCart.prototype.showAjax = function() {
	//Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
};

CatalogCart.prototype.hideAjax = function() {
	//Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};
//=============================//
//---Termina Mascara AJAX-----//
//===========================//

CatalogCart.prototype.wishlist = function(dataSet) {
    var rec = dataSet[0];
    var text = "", code = '';
    for(var idx = 0; idx < dataSet.length; idx++){
        rec = dataSet[idx];
        code = rec['itemCode'];
        
        text += '<table class="marginTable"><tbody>';
        text += '<tr>';
        //Código
        text += '<th width="34%">Código</th>';
        text += '<td width="66%" id="'+code+'"><a class="btn-tbl" href="carrito_compras_detalles.html?categoria=' +cmbCategoria.value+ '&code=' +code+ '&price=' +
            rec['price']+ '&origen=catalogo">' +
            rec['itemCode'] + '</a></td>';
        text += '</tr>';
        //Descripción
        text += '<tr>';
        text += '<th>Descripción</th>';
        text += '<td id="DES-' +code+ '">'+rec['description']+'</td>';
        text += '</tr>';
        //Precio
        text += '<tr>';
        text += '<th>Precio</th>';
        text += '<td id="PRE-'  +code+ '">$'+rec['price']+'</td>';
        text += '</tr>';
        //Puntos
        text += '<tr>';
        text += '<th>Puntos</th>';
        text += '<td id="PUN='  +code+ '">'+rec['itemPvDistributor']+'</td>';
        text += '</tr>';
        //Valor consumible
        text += '<tr>';
        text += '<th>Valor Consumible</th>';
        text += '<td id="VCO='  +code+ '">'+rec['itemCvDistributor']+'</td>';
        text += '</tr>';
        //Peso
        text += '<tr>';
        text += '<th>Peso</th>';
        text += '<td id="PSO='  +code+ '">'+rec['weight']+'</td>';
        text += '</tr>';
        //Comprar
        text += '<tr>';
        text += '<th>Comprar</th>';
        text += '<td id="CAN='  +code+ '">';
        text += '<input type="number" class="cantidad" id="TXT-'+code+ '" placeholder="cantidad" size="7" />';
        text += '<input type="submit" class="comprar" value="Agregar" />';
        text += '</td></tr>';
        text += '</tbody></table>';
    }
    divCatalogos.innerHTML = text;
    var comprar = document.querySelectorAll('input[type=submit]');
    for (var i = 0; i < comprar.length; i++) {
        comprar[i].addEventListener('click', compra, false);
    }
    //Oculta imágen AJAX
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
};