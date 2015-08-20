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







//=================================================================================================================================//
//=================================================================================================================================//
//==================================================CLASE PARA EDICIOÓN DE PERFIL==================================================//
//=================================================================================================================================//
//=================================================================================================================================//



//======================//
//CONSTRUCTOR DE CLASE 2//
//======================//
function ProfileEdit(userId, txtNombre, txtApePat, txtApeMat, txtAlias, cmbDia, cmbMes, cmbAno, txtNacimiento, cmbSexo, cmbLanguage, txtPassword, txtConfirmPassword, txtTelefono, txtCelular, txtOtroTelefono, txtEmail, txtRFC, txtNumIFE, txtCurp, txtSkype, txtNomBene, txtApePatBene, txtApeMatBene, txtParentescoBene, txtTelefonoBene, txtBanco, txtClabe){
    that = this;
    //Parámetros
    that.userId = userId;
    that.txtNombre = txtNombre;
    that.txtApePat = txtApePat;
    that.txtApeMat = txtApeMat;
    that.txtAlias = txtAlias;
    that.cmbDia = cmbDia;
    that.cmbMes = cmbMes;
    that.cmbAno = cmbAno;
    that.txtNacimiento = txtNacimiento;
    that.cmbSexo = cmbSexo;
    that.cmbLanguage = cmbLanguage;
    that.txtPassword = txtPassword;
    that.txtConfirmPassword = txtConfirmPassword;
    that.txtTelefono = txtTelefono;
    that.txtCelular = txtCelular;
    that.txtOtroTelefono = txtOtroTelefono;
    that.txtEmail = txtEmail;
    that.txtRFC = txtRFC;
    that.txtNumIFE = txtNumIFE;
    that.txtCurp = txtCurp;
    that.txtSkype = txtSkype;
    that.txtNomBene = txtNomBene;
    that.txtApePatBene = txtApePatBene;
    that.txtApeMatBene = txtApeMatBene;
    that.txtParentescoBene = txtParentescoBene;
    that.txtTelefonoBene = txtTelefonoBene;
    that.txtBanco = txtBanco;
    that.txtClabe = txtClabe;
    //Se cargan combos
    that.fillDay();
    that.fillMonth();
    that.fillYear();
    //Se inicializan queries
    queryData('USP_VBC_GET_USER_PROFILE_INFO', ['integer', that.userId], that.loadProfileInfo);
}
//==============================//
//TERMINA CONSTRUCTOR DE CLASE 2//
//==============================//

ProfileEdit.prototype.loadProfileInfo = function(dataSet){
    var rec = dataSet[0];

    $('table tbody#generalInfo tr:nth-child(1) td p').append(susbsDates(rec['dateCreated']));
    $('table tbody#generalInfo tr:nth-child(2) td p').append(rec['referralId']+ " " +rec['referralName']);

    that.txtNombre.value = rec['firstName'];
    that.txtApePat.value = rec['middleName'];
    that.txtApeMat.value = rec['lastName'];
    that.txtAlias.value = rec['alias'];
    that.cmbDia.value = rec['birthDay'];
    that.cmbMes.value = rec['birthMonth'];
    that.cmbAno.value = rec['birthYear'];
    that.txtNacimiento.value = rec['birthPlace'];
    that.cmbSexo.value = rec['isMale'];
    that.cmbLanguage.value = rec['languageId'];
    that.txtPassword.value = rec['password'];
    that.txtConfirmPassword.value = rec['password'];
    that.txtTelefono.value = rec['homePhone'];
    that.txtCelular.value = rec['cellPhone'];
    that.txtOtroTelefono.value = rec['workPhone'];
    that.txtEmail.value = rec['email'];

    $('table tbody#contactInfo tr:nth-child(5) td p').append(rec['userTypeDescr']);

    //Carga de campos Ocultos
    that.txtRFC.value = rec['fiscalCode'];
    that.txtNumIFE.value = rec['ife'];
    that.txtCurp.value = rec['fm3'];
    that.txtSkype.value = rec['skype'];
    that.txtNomBene.value = rec['firstNameBeneficiary'];
    that.txtApePatBene.value = rec['middleNameBeneficiary'];
    that.txtApeMatBene.value = rec['lastNameBeneficiary'];
    that.txtParentescoBene.value = rec['relationshipBeneficiary'];
    that.txtTelefonoBene.value = rec['beneficiaryPhone'];
    that.txtBanco.value = rec['bankName'];
    that.txtClabe.value = rec['accountNumber'];

    /*$('#txtNombre').val(rec['firstName']);
    $('#txtApePat').val(rec['middleName']);
    $('#txtApeMat').val(rec['lastName']);
    $('#txtAlias').val(rec['alias']);
    $('#dia').val(rec['birthDay']);
    $('#mes').val(rec['birthMonth']);
    $('#ano').val(rec['birthYear']);
    $('#txtNacimiento').val(rec['birthPlace']);
    $('#sexo').val(rec['isMale']);
    $('#language').val(rec['languageId']);
    $('#txtPassword').val(rec['password']);
    $('#txtConfirmPassword').val(rec['password']);
    $('#txtTelefono').val(rec['homePhone']);
    $('#txtCelular').val(rec['cellPhone']);
    $('#txtOtroTelefono').val(rec['workPhone']);
    $('#txtEmail').val(rec['email']);*/

    
    /*$('#txtRFC').val(rec['fiscalCode']);
    $('#txtNumIFE').val(rec['ife']);
    $('#txtCurp').val(rec['curp']);
    $('#txtSkype').val(rec['skype']);
    $('#txtNomBene').val(rec['firstNameBeneficiary']);
    $('#txtApePatBene').val(rec['middleNameBeneficiary']);
    $('#txtApeMatBene').val(rec['lastNameBeneficiary']);
    $('#txtParentescoBene').val(rec['relationshipBeneficiary']);
    $('#txtTelefonoBene').val(rec['beneficiaryPhone']);
    $('#txtBanco').val(rec['bankName']);
    $('#txtClabe').val(rec['accountNumber']);*/
}

ProfileEdit.prototype.saveChanges = function(){
    if(that.validateEmptyField(that.txtNombre)){
        if(that.validateEmptyField(that.txtApePat)){
            if(that.validateEmptyField(that.txtApeMat)){
                if(that.validateEmptyField(that.txtAlias)){
                    if(that.validateAlias(that.txtAlias)){
                        if(that.validateEmptyField(that.cmbDia)){
                            if(that.validateEmptyField(that.cmbMes)){
                                if(that.validateEmptyField(that.cmbAno)){
                                    if(that.validateEmptyField(that.txtPassword)){
                                        if(that.validatePassword(that.txtPassword)){
                                            if(that.validatePasswords(that.txtPassword, that.txtConfirmPassword)){
                                                if(that.validateEmptyField(that.txtTelefono)){
                                                    if(that.validatePhone(that.txtTelefono)){
                                                        if(that.validatePhone(that.txtCelular)){
                                                           if(that.validatePhone(that.txtOtroTelefono)){
                                                                if(that.validateEmptyField(that.txtEmail)){
                                                                    if(that.validateEmail(that.txtEmail)){
                                                                        console.log('listo');
                                                                        
                                                                    }else{
                                                                        //app.showNotificactionVBC("* EMAIL INVÁLIDO: El correo Electrónico debe contener un @ y un punto");
                                                                        console.log('emailInvalido');
                                                                    }
                                                                }else{
                                                                    //app.showNotificactionVBC('* El campo E-mail es Obligatorio');
                                                                    console.log('email');
                                                                }
                                                            }else{
                                                                //app.showNotificactionVBC("* OTRO TELÉFONO INVÁLIDO: El Número de Teléfono debe contener solo dígitos");
                                                                console.log('otroTeléfonoIvalido');
                                                            } 
                                                        }else{
                                                            //app.showNotificactionVBC("* CELULAR INVÁLIDO: El Número de Celular debe contener solo dígitos");
                                                            console.log('celularInvalido');
                                                        }    
                                                    }else{
                                                        //app.showNotificactionVBC("* TELÉFONO INVÁLIDO: El Número de Teléfono debe contener solo dígitos");
                                                        console.log('TeléfonoInvalido');
                                                    }
                                                }else{
                                                    //app.showNotificactionVBC('* El campo Teléfono es Obligatorio');
                                                    console.log('telefono');
                                                }
                                            }else{
                                                //app.showNotificactionVBC('* CONFIRMACIÓN DE CONTRASEÑA INVÁLIDA: La contraseña no coincide con la confirmación');
                                                console.log('passworsNoCoinciden');
                                            }
                                        }else{
                                            //app.showNotificactionVBC('* CONTRASEÑA INVÁLIDA: La contraseña solo puede contener números y letras y no debe ser menor que 8 ni mayor que 12 caracteres');
                                            console.log('passwordInvalido');
                                        }
                                    }else{
                                        //app.showNotificactionVBC('* El campo Contraseña es Obligatorio');
                                        console.log('password');    
                                    }
                                }else{
                                    //app.showNotificactionVBC('* El campo Año es Obligatorio');
                                    console.log('año');
                                }
                            }else{
                                //app.showNotificactionVBC('* El campo Mes es Obligatorio');
                                console.log('mes');
                            }
                        }else{
                            //app.showNotificactionVBC('* El campo Día es Obligatorio');
                            console.log('dia'); 
                        }
                    }else{
                        //app.showNotificactionVBC('* ALIAS INVÁLIDO: El Alias es muy largo o contiene caracteres no válidos');
                        console.log('aliasInvalido');                         
                    }             
                }else{
                    //app.showNotificactionVBC('* El campo Alias es Obligatorio');
                    console.log('alias'); 
                }
            }else{
                //app.showNotificactionVBC('* El campo Apellido Materno es Obligatorio');
                console.log('apeMat');    
            }
        }else{
            //app.showNotificactionVBC('* El campo Apellido Paterno es Obligatorio');
            console.log('apePat');
        }
    }else{
        //app.showNotificactionVBC('* El campo Nombre es Obligatorio');
        console.log('nombre');
    }
}

ProfileEdit.prototype.fillDay = function(){
    var text = "";
    for(var cont = 1; cont <= 31; cont++){
        if(cont < 10){
            text += '<option value="0'+ cont +'">0'+ cont +'</option>';
        }else{
            text += '<option value="'+ cont +'">'+ cont +'</option>';
        }
    }
    $('#dia').append(text);
}

ProfileEdit.prototype.fillMonth = function(){
    var text = "";
    for(var cont = 1; cont <= 12; cont++){
        if(cont < 10){
            text += '<option value="0'+ cont +'">0'+ cont +'</option>';
        }else{
            text += '<option value="'+ cont +'">'+ cont +'</option>';
        }
    }
    $('#mes').append(text);
}

ProfileEdit.prototype.fillYear = function(){
    //Obtenemos el año en curso
    var date = new Date();
    var currentYear = date.getFullYear();
    var minYear = currentYear - 18;

    var text = "";
    for(var cont = minYear; cont >= 1930; cont--){
        text += '<option value="'+ cont +'">'+ cont +'</option>';                    
    }
    $('#ano').append(text);
}

ProfileEdit.prototype.validateEmptyField = function(field){
    var isNotEmpty = false;
    if(field.value == '' || field.value == 0)
    {
        isNotEmpty = false;
    }else{
        isNotEmpty = true;
    }
    return isNotEmpty;
}

ProfileEdit.prototype.validateEmail = function(field){
    var strCorrecta;
    strCorrecta = field.value; 
    
    var valid = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
    var validEmail=new RegExp(valid);
    var matchArray=strCorrecta.match(validEmail);
    if (matchArray==null) {
        return false;
    }
    else
    {
        return true;
    }
    
}

ProfileEdit.prototype.validateAlias = function(field){
    var strCorrecta;
    strCorrecta = field.value;

    var valid = "^[A-Za-z0-9]{0,15}$";
    var validAlias = new RegExp(valid);
    var matchArray = strCorrecta.match(validAlias);
    if(matchArray == null){
        return false;
    }else{
        return true;
    }
}

ProfileEdit.prototype.validatePassword = function(field){
    var strCorrecta;
    strCorrecta = field.value;

    var valid = "^[A-Za-z0-9]{8,12}$";
    var validPassword = new RegExp(valid);
    var matchArray = strCorrecta.match(validPassword);
    if(matchArray == null){
        return false;
    }else{
        return true;
    }
}

ProfileEdit.prototype.validatePasswords = function(field1, field2){
    if(field2.value != field1.value){
        return false;
    }else{
        return true;
    }
}

ProfileEdit.prototype.validatePhone = function(field){
    var strCorrecta;
    strCorrecta = field.value;

    var valid = /^\d*$/;

    var validTelefono = new RegExp(valid);
    var matchArray = strCorrecta.match(validTelefono);
    if(matchArray == null){
        return false;
    }else{
        return true;
    }
}