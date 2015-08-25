document.addEventListener('DOMContentLoaded', function() {
    var cmbCategoria = document.getElementById('cmb_categoria');
    var divCatalogos = document.getElementById('div_catalogos');
    var txtBuscador = document.getElementById('txt_buscador');
    //--------------------
    var userId =  localStorage.getItem('userIdLocal');
    userId = 12;
    var get = getByURL()['categoria'];
    //---------------------
    var ajax =  new Cart();
    catalog = new CatalogCart(cmbCategoria, divCatalogos, get, ajax);

    //Carga imagen ajax para carrito compras catalogo
    ajax.showAjax();

    /////////////////////////////////////////////////
    /******** Llena combobox de categorías *********/
    var egoria = 1;
    if (typeof get != "undefined" && get != '') {
        egoria = get;
    }else {
        egoria = 1
    }
    var argumentos = [
    
    'integer', '1', //Operator
    'integer', egoria,//categoria
    'integer', userId,//Usuario
    'integer', '0', //Price lvl
    'string' , '', //ITEM_CODE
    'integer', '0', //IS_SIGNUP
    'integer', '0', //IS_ADMIN
    'integer', '4 ',//País
    'integer', '',
    //'integer',  '',
    //'integer',  ''
    ];

    //Carga lista de categorías
    queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, catalog.category);

    //Carga la tabla cuando se actualiza el combobox
    cmbCategoria.addEventListener('change', function(event){
        event.target.blur();
        //Carga imagen ajax
        ajax.showAjax();

        argumentos[3] = cmbCategoria.value;
        queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, catalog.wishlist, 2);
        egoria = cmbCategoria.value;
    });

    //carga artículos a la tabla
    queryData('USP_VBC_GET_ITEM_CATALOG', argumentos, catalog.wishlist, 2);

    //Llama a la función buscador pulsación de tecla
    txtBuscador.addEventListener('keyup', function(event){
        catalog.search(event, txtBuscador);
    },false);
}, false);

//Evento de botón comprar
function compra(event) {
    catalogCart = new CatalogCart();
    catalogCart.obtainData(event);
}