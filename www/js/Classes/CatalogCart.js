function CatalogCart()
{
	that = this;
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