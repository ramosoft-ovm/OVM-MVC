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
function ProfileEdit(userId, txtNombre, txtApePat, txtApeMat, txtAlias, cmbDia, cmbMes, cmbAno, txtNacimiento, cmbSexo, cmbLanguage, txtPassword, txtConfirmPassword, txtTelefono, txtCelular, txtOtroTelefono, txtEmail, txtRFC, txtNumIFE, txtCurp, txtSkype, txtNomBene, txtApePatBene, txtApeMatBene, txtParentescoBene, txtTelefonoBene, txtBanco, txtClabe, txtCompany, txtFax, txtPager, txtPaisFiscal, txtCalleFiscal, txtColoniaFiscal, txtCiudadFiscal, txtEstadoFiscal, txtCpFiscal, txtPaisPedidos, txtCallePedidos, txtColoniaPedidos, txtCiudadPedidos, txtEstadoPedidos, txtCpPedidos, txtNombrePedidos, txtIsOfficeComplete, txtUserTypeId, txtNumContrato, txtSapCode, txtNumExtFiscal, txtNumIntFiscal, txtModalType, txtNumExtPedidos, txtNumIntPedidos, txtFiscalActivity, txtWarehouseId){
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
    //Parámetros de campos ocultos
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
    that.txtCompany = txtCompany;
    that.txtFax = txtFax;
    that.txtPager = txtPager;
    that.txtPaisFiscal = txtPaisFiscal;
    that.txtCalleFiscal = txtCalleFiscal;
    that.txtColoniaFiscal = txtColoniaFiscal;
    that.txtCiudadFiscal = txtCiudadFiscal;
    that.txtEstadoFiscal = txtEstadoFiscal;
    that.txtCpFiscal = txtCpFiscal;
    that.txtPaisPedidos = txtPaisPedidos;
    that.txtCallePedidos = txtCallePedidos;
    that.txtColoniaPedidos = txtColoniaPedidos;
    that.txtCiudadPedidos = txtCiudadPedidos;
    that.txtEstadoPedidos = txtEstadoPedidos;
    that.txtCpPedidos = txtCpPedidos;
    that.txtNombrePedidos = txtNombrePedidos;
    that.txtIsOfficeComplete = txtIsOfficeComplete;
    that.txtUserTypeId = txtUserTypeId;
    that.txtNumContrato = txtNumContrato;
    that.txtSapCode = txtSapCode;
    that.txtNumExtFiscal = txtNumExtFiscal;
    that.txtNumIntFiscal = txtNumIntFiscal;
    that.txtModalType = txtModalType;
    that.txtNumExtPedidos = txtNumExtPedidos;
    that.txtNumIntPedidos = txtNumIntPedidos;
    that.txtFiscalActivity = txtFiscalActivity;
    that.txtWarehouseId = txtWarehouseId;
    //Se cargan combos
    that.fillDay();
    that.fillMonth();
    that.fillYear();
    //Bandera para disparar método hideAjax()
    that.isProfileLoaded = 0;
    //Se inicializan queries
    queryData('USP_VBC_GET_USER_PROFILE_INFO', ['integer', that.userId], that.loadProfileInfo);
    queryData('USP_VBC_GET_USER_PROFILE_DATA', ['integer', that.userId], that.loadProfileData);
}
//==============================//
//TERMINA CONSTRUCTOR DE CLASE 2//
//==============================//

ProfileEdit.prototype.loadProfileInfo = function(dataSet){
    var rec = dataSet[0];
    //console.log(rec);

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
    that.txtCompany.value = rec['company'];
    that.txtFax.value = rec['fax'];
    that.txtPager.value = rec['pager'];
    that.txtIsOfficeComplete.value = rec['isOfficeComplete']; 
    that.txtUserTypeId.value = rec['userTypeId'];
    that.txtNumContrato.value = rec['numContrato'];
    that.txtSapCode.value = rec['sapCode'];
    that.txtModalType.value = rec['modalType'];
    that.txtFiscalActivity.value = rec['fiscalActivity'];

    that.isProfileLoaded += 1;
    if(that.isProfileLoaded == 2){
        that.hideAjax();
    }    
}

ProfileEdit.prototype.loadProfileData = function(dataSet){
    var rec = dataSet[0];
    //console.log(rec);

    that.txtPaisFiscal.value = rec['mailingCountry'];
    that.txtCalleFiscal.value = rec['mailingAddressLine1'];
    that.txtColoniaFiscal.value = rec['mailingAddressLine2'];
    that.txtCiudadFiscal.value = rec['mailingCity'];
    that.txtEstadoFiscal.value = rec['mailingState'];
    that.txtCpFiscal.value = rec['mailingPostalCode'];
    that.txtNumExtFiscal.value = rec['addressNumExt'];
    that.txtNumIntFiscal.value = rec['addressNumInt'];
    that.txtPaisPedidos.value = rec['shippingCountryId'];
    that.txtCallePedidos.value = rec['shippingAddressLine1'];
    that.txtColoniaPedidos.value = rec['shippingAddressLine2'];
    that.txtCiudadPedidos.value = rec['shippingCity'];
    that.txtEstadoPedidos.value = rec['shippingState'];
    that.txtCpPedidos.value = rec['shippingPostalCode'];
    that.txtNumExtPedidos.value = rec['shippingAddressNumExt'];
    that.txtNumIntPedidos.value = rec['shippingAddressNumInt'];
    that.txtNombrePedidos.value = rec['shippingName'];
    that.txtWarehouseId.value = rec['warehouseId'];

    that.isProfileLoaded += 1;
    if(that.isProfileLoaded == 2){
        that.hideAjax();
    } 
}

ProfileEdit.prototype.saveChanges = function(){
    that.showAjax();

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
                                                                        
                                                                        //============================================================//
                                                                        //Se crea arreglo con los datos necesarios para la inscripción//
                                                                        //============================================================//
                                                                        var argsUpdate = [
                                                                        'integer', that.userId,//Número de usuario
                                                                        'string', that.txtNombre.value+', '+that.txtApePat.value+' '+that.txtApeMat.value,//Nombre completo 
                                                                        'string', that.txtNomBene.value+' '+that.txtApePatBene.value+' '+that.txtApeMatBene.value,//Coapplicant Name Local
                                                                        'string', that.txtCompany.value,//Compañía
                                                                        'string', that.txtTelefono.value,//Teléfono principal
                                                                        'string', that.txtOtroTelefono.value,//Otro Teléfono
                                                                        'string', that.txtFax.value,//Fax
                                                                        'string', that.txtCelular.value,//Teléfono Celular
                                                                        'string', that.txtPager.value,//Pager
                                                                        'string', that.txtEmail.value,//Email
                                                                        'string', that.txtPassword.value,//Contraseña
                                                                        'string', that.txtPaisFiscal.value,//País Fiscal
                                                                        'string', that.txtCalleFiscal.value,//Calle Fiscal
                                                                        'string', that.txtColoniaFiscal.value,//Colonia Fiscal
                                                                        'string', that.txtCiudadFiscal.value,//Ciudad Fiscal
                                                                        'string', that.txtEstadoFiscal.value,//Estado Fiscal
                                                                        'string', that.txtCpFiscal.value,//Código Postal Fiscal
                                                                        'integer', 0,//Misma dirección para Pedidos
                                                                        'string', that.txtPaisPedidos.value,//País Pedidos
                                                                        'string', that.txtCallePedidos.value,//Calle Pedidos
                                                                        'string', that.txtColoniaPedidos.value,//Colonia Pedidos
                                                                        'string', that.txtCiudadPedidos.value,//Ciudad Pedidos
                                                                        'string', that.txtEstadoPedidos.value,//Estado Pedidos
                                                                        'string', that.txtCpPedidos.value,//Código Postal Pedidos
                                                                        'integer', that.txtWarehouseId.value,//Id del Almacén
                                                                        'string', that.txtRFC.value,//RFC 
                                                                        'string', that.userId,//Operador
                                                                        'integer', that.cmbLanguage.value,//Lenguaje
                                                                        'string', that.txtAlias.value,//Alias
                                                                        'string', that.txtNombrePedidos.value,//Nombre completo para envíos
                                                                        'integer', that.txtIsOfficeComplete.value,//Oficina Completa
                                                                        'integer', that.txtUserTypeId,//Id de Tipo de Usuario(Afiliado)
                                                                        'string', that.txtNombre.value,//Nombre Afiliado
                                                                        'string', that.txtApePat.value,//Apellido Paterno Afiliado
                                                                        'string', that.txtApeMat.value,//Apellido Materno Afiliado
                                                                        'string', that.txtNumContrato.value,//Número de Contrato
                                                                        'string', that.txtBanco.value,//Banco
                                                                        'string', that.txtClabe.value,//Clabe Interbancaria
                                                                        'string', that.txtNumIFE.value,//Número de IFE
                                                                        'string', that.txtCurp.value,//CURP
                                                                        'string', that.txtNomBene.value,//Nombre Beneficiario
                                                                        'string', that.txtApePatBene.value,//Apellido Paterno Beneficiario
                                                                        'string', that.txtApeMatBene.value,//Apellido Materno Beneficiario
                                                                        'integer',that.txtParentescoBene.value,//Relación con el Beneficiario
                                                                        'integer', 0,//Is invoice
                                                                        'string', that.txtTelefonoBene.value,//Teléfono de Beneficiario
                                                                        'integer', that.cmbSexo.value,//Sexo
                                                                        'string', that.txtNacimiento.value,//Lugar de Nacimiento
                                                                        'string', that.txtSapCode.value,//SAP CODE
                                                                        'string', that.txtNumExtFiscal.value,//Número exterior Fiscal
                                                                        'string', that.txtNumIntFiscal.value,//Número Interior Fiscal
                                                                        'integer', that.txtModalType.value,//Modal Type
                                                                        'string', that.txtSkype.value,//Skype
                                                                        'string', that.txtNumExtPedidos.value,//Número exterior Pedidos
                                                                        'string', that.txtNumIntPedidos.value,//Número interior Pedidos
                                                                        'date', that.cmbAno.value+'-'+that.cmbMes.value+'-'+that.cmbDia.value,//Fecha de Nacimiento
                                                                        'string', that.txtFiscalActivity.value //Actividad Fiscal
                                                                        ];
                                                                        //===============================================//
                                                                        //Termina creación de arreglo para la inscripción//
                                                                        //===============================================//

                                                                        queryData('USP_VBC_SET_USER_PROFILE', argsUpdate, that.confirmUpdate);
                                                                        //app.showNotificactionVBC('Su información ha sido actualizada');
                                                                        //alert('Información actualizada');
                                                                        //location.href = 'profile.html';
                                                                        
                                                                    }else{
                                                                        //app.showNotificactionVBC("* EMAIL INVÁLIDO: El correo Electrónico debe contener un @ y un punto");
                                                                        console.log('emailInvalido');
                                                                        that.hideAjax();
                                                                        that.txtEmail.focus();
                                                                    }
                                                                }else{
                                                                    //app.showNotificactionVBC('* El campo E-mail es Obligatorio');
                                                                    console.log('email');
                                                                    that.hideAjax();
                                                                    that.txtEmail.focus();
                                                                }
                                                            }else{
                                                                //app.showNotificactionVBC("* OTRO TELÉFONO INVÁLIDO: El Número de Teléfono debe contener solo dígitos");
                                                                console.log('otroTeléfonoIvalido');
                                                                that.hideAjax();
                                                                that.txtOtroTelefono.focus();
                                                            } 
                                                        }else{
                                                            //app.showNotificactionVBC("* CELULAR INVÁLIDO: El Número de Celular debe contener solo dígitos");
                                                            console.log('celularInvalido');
                                                            that.hideAjax();
                                                            that.txtCelular.focus();
                                                        }    
                                                    }else{
                                                        //app.showNotificactionVBC("* TELÉFONO INVÁLIDO: El Número de Teléfono debe contener solo dígitos");
                                                        console.log('TeléfonoInvalido');
                                                        that.hideAjax();
                                                        that.txtTelefono.focus();
                                                    }
                                                }else{
                                                    //app.showNotificactionVBC('* El campo Teléfono es Obligatorio');
                                                    console.log('telefono');
                                                    that.hideAjax();
                                                    that.txtTelefono.focus();
                                                }
                                            }else{
                                                //app.showNotificactionVBC('* CONFIRMACIÓN DE CONTRASEÑA INVÁLIDA: La contraseña no coincide con la confirmación');
                                                console.log('passworsNoCoinciden');
                                                that.hideAjax();
                                                that.txtConfirmPassword.focus();
                                            }
                                        }else{
                                            //app.showNotificactionVBC('* CONTRASEÑA INVÁLIDA: La contraseña solo puede contener números y letras y no debe ser menor que 8 ni mayor que 12 caracteres');
                                            console.log('passwordInvalido');
                                            that.hideAjax();
                                            that.txtPassword.focus();
                                        }
                                    }else{
                                        //app.showNotificactionVBC('* El campo Contraseña es Obligatorio');
                                        console.log('password');
                                        that.hideAjax();
                                        that.txtPassword.focus();  
                                    }
                                }else{
                                    //app.showNotificactionVBC('* El campo Año es Obligatorio');
                                    console.log('año');
                                    that.hideAjax();
                                    that.cmbAno.focus();
                                }
                            }else{
                                //app.showNotificactionVBC('* El campo Mes es Obligatorio');
                                console.log('mes');
                                that.hideAjax();
                                that.cmbMes.focus();
                            }
                        }else{
                            //app.showNotificactionVBC('* El campo Día es Obligatorio');
                            console.log('dia'); 
                            that.hideAjax();
                            that.cmbDia.focus();
                        }
                    }else{
                        //app.showNotificactionVBC('* ALIAS INVÁLIDO: El Alias es muy largo o contiene caracteres no válidos');
                        console.log('aliasInvalido');
                        that.hideAjax();
                        that.txtAlias.focus();                         
                    }             
                }else{
                    //app.showNotificactionVBC('* El campo Alias es Obligatorio');
                    console.log('alias'); 
                    that.hideAjax();
                    that.txtAlias.focus();
                }
            }else{
                //app.showNotificactionVBC('* El campo Apellido Materno es Obligatorio');
                console.log('apeMat');
                that.hideAjax();
                that.txtApeMat.focus();    
            }
        }else{
            //app.showNotificactionVBC('* El campo Apellido Paterno es Obligatorio');
            console.log('apePat');
            that.hideAjax();
            that.txtApePat.focus();   
        }
    }else{
        //app.showNotificactionVBC('* El campo Nombre es Obligatorio');
        console.log('nombre');
        that.hideAjax();
        that.txtNombre.focus();   
    }
}

ProfileEdit.prototype.confirmUpdate = function(dataSet){
    var rec = dataSet[0];
    console.log(rec);

    //app.showNotificactionVBC('Su información ha sido actualizada');
    console.log('Información actualizada');
    that.hideAjax();
    location.href = 'profile.html';
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

//==================================//
//MUESTRA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
ProfileEdit.prototype.showAjax = function(){
    //Carga imagen ajax
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);
}
//==========================================//
//TERMINA MUESTRA ELEMENTOS DE ANIMACIÓN AJAX//
//==========================================//

//==================================//
//OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==================================//
ProfileEdit.prototype.hideAjax = function(){
    //oculta imagen ajax
    $('#mascaraAJAX').fadeOut(300);
    $('#mascaraAJAX').html('');
}
//==========================================//
//TERMINA OCULTA ELEMENTOS DE ANIMACIÓN AJAX//
//==========================================//