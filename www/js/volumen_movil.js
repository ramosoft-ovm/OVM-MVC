document.addEventListener('DOMContentLoaded', function() {
    //-------------------------------
    var cmbPeriodo = document.getElementById('cmb_periodo');
    var divArbol = document.getElementById('div_arbol');
    //-Instancia a la clase
    treeViewer = new TreeViewer(cmbPeriodo, divArbol);
    
    //Carga imagen ajax
    treeViewer.showAjax();

    
    // Llena combobox de periodos
    queryData('USP_VBC_GET_PERIODS', ['integer','5','integer','0'], treeViewer.periods);

    ////////////////////////////////////////////////
    /********  Imprime todos los nombres **********/
    var userId =  localStorage.getItem('userIdLocal');
    userId = 11;
    cmbPeriodo.addEventListener('change', function(event) {
        queryData('USP_VBC_GET_MATRIX_VIEWER', ['integer',userId,'integer','0','integer','0','integer',cmbPeriodo.value,'integer','1'], treeViewer.tree);
        event.target.blur();
        //Carga imagen ajax
        treeViewer.showAjax();
    });
    queryData('USP_VBC_GET_MATRIX_VIEWER', ['integer',userId,'integer','0','integer','0','integer',cmbPeriodo.value,'integer','1'], treeViewer.tree);
});

//////////////////////////////////////////////////
/********  Muestra visor dinamicamente **********/

//Función que se ejecuta por cada enlace pulsado ejecutado por onClick
function link(event) {
    //previene acción default para evitar refresh
    event.preventDefault();
    //Llama a función para plegar y desplegar el arbol
    treeViewer = new TreeViewer();
    treeViewer.showNodes(event);
}