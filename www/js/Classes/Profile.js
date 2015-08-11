//====================//
//CONSTRUCTOR DE CLASE//
//====================//
function Profile(){
    that = this;
}
//============================//
//TERMINA CONSTRUCTOR DE CLASE//
//============================//

//========================//
//CARGA PERFIL DEL USUARIO//
//========================//
Profile.prototype.fillProfile = function(dataSet){
    var rec = dataSet[0];
    var text = '';

    //Se cargan todos los datos del modulo de información general a su tbody correspondiente
    $('table tbody#generalInfo tr:nth-child(1) td p').append(susbsDates(rec['dateCreated']));
    $('table tbody#generalInfo tr:nth-child(2) td p').append(rec['referralId']+ " " +rec['referralName']);
    $('table tbody#generalInfo tr:nth-child(3) td p').append(rec['customerName']);
    $('table tbody#generalInfo tr:nth-child(4) td p').append(rec['alias']);
    if(rec['languageId'] == 1){
        $('table tbody#generalInfo tr:nth-child(5) td p').append("Español");
    }else{
        $('table tbody#generalInfo tr:nth-child(5) td p').append("English");
    }
    $('table tbody#generalInfo tr:nth-child(6) td p').append(rec['email']);

    //Se cargan todos los datos del modulo de información de contacto a su tbody correspondiente
    $('table tbody#contactInfo tr:nth-child(1) td p').append(rec['homePhone']);
    $('table tbody#contactInfo tr:nth-child(2) td p').append(rec['cellPhone']);
    $('table tbody#contactInfo tr:nth-child(3) td p').append(susbsDates(rec['birthDate']));
    if(rec['isMale'] == 1){
        $('table tbody#contactInfo tr:nth-child(4) td p').append("Masculino");
    }else{
        $('table tbody#contactInfo tr:nth-child(4) td p').append("Femenino");
    }
    if(rec['isActive'] == 1){
        $('table tbody#contactInfo tr:nth-child(5) td p').append("Sí");
    }else{
        $('table tbody#contactInfo tr:nth-child(5) td p').append("No");
    }
    $('table tbody#contactInfo tr:nth-child(6) td p').append(rec['userTypeDescr']);

    that.hideAjax();    
}
//===================================//
//TERMINA CARGA DE PERFIL DEL USUARIO//
//===================================//

//==================================//
//OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
Profile.prototype.hideAjax = function(){
    //oculta imagen ajax
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
}
//==========================================//
//TERMINA OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==========================================//