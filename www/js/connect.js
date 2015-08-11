//=====================================================================================//
// EL SIGUIENTE CÓDIGO ES UNA IMPLEMENTACIÓN BÁSICA PARA LLAMAR EL WEBSERVICE VIA SOAP //
//=====================================================================================//
    //Clase auxiliar para generar clases basadas en un modelo OOP
    var Class = function(model){
        // Invoca al método de inicialización
        var instance = function(){this.setup.apply(this, arguments);};  
        // Hereda las propiedades del modelo al prototipo
        for(var method in model){instance.prototype[method] = model[method];};
        // Valída el inicializador
        if (!instance.prototype.setup) instance.prototype.setup = function(){};
        // Regresa la nueva clase creada
        return instance;
    };
    // Generación de Clase cliente SOAP WSCall
    var WSCall = Class({
        // Método de inicialización (constructor) de la nueva clase
        setup:function(soapURL, callBack){
            this.soapEndPoint = soapURL; // Recibe el SOAP endpoint 
            this.callBack = callBack||function(){}; // Recibe la funcion CallBack para ejecutarse al regreso de la llamada
            // Agregamos los nameSapces necesarios
            this.addNameSpace('http://www.w3.org/2001/XMLSchema-instance', 'xsi');
            this.addNameSpace('http://www.w3.org/2001/XMLSchema', 'xsd');
            this.addNameSpace('http://www.w3.org/2003/05/soap-envelope', 'soap');
        },
        // Agrega un elemento al XML de la petición (no aplica para XML complejos)
        addArgument:function(name, value, dataType){this._arguments[name] = {name:name, value:value, type:(dataType||'string')};},
        //Elimina argumentos de solicitudes ya realizadas
        removeArgument: function() {var i = 0;for(var argName in this._arguments){delete this._arguments['arg'+i];i++;}},
        // Agrega un nameSpace a la petición
        addNameSpace:function(uri, prefix){this._nameSpaces[prefix] = uri;},
        // Agrega un valor de encabezado
        addHeader:function(name, value){this._headers[name] = value;},
        // Construye el XML de la petición SOAP basado en los valores provistos
        buildXML:function(methodName, URI, prefix){
            // Agrega el nameSpace al encabezado
            if(URI && prefix) this.addNameSpace(URI, prefix);
            // Añade los nameSpaces al stream XML
            var xml = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope';
            for(var nspace in this._nameSpaces){xml += ' xmlns:'+nspace+'="'+this._nameSpaces[nspace]+'"';};
            xml += '>';
            // Añade los datos del encabezado
            xml += '<soap:Header>';
            for(var header in this._headers){xml += '<'+header+'>'+this._headers[header]+'</'+header+'>';};
            xml += '</soap:Header>';
            // Añade el cuerpo de la petición
            xml += '<soap:Body>';
            var mtd = '';
            if(URI && prefix) {mtd = ' xmlns:'+prefix+'="'+URI+'"'};
            if(prefix) prefix = prefix+':';
            mtd = '<'+prefix+methodName+mtd+'>';
            for(var argName in this._arguments){
                var arg = this._arguments[argName];
                mtd += '<'+prefix+arg.name+' xsi:type="xsd:'+arg.type.toLowerCase()+'">'+arg.value+'</'+prefix+arg.name+'>';
            };
            mtd += '</'+prefix+methodName+'>';
            // Cierra el envolvente de la petición SOAP
            xml += mtd+'</soap:Body></soap:Envelope>';
            return xml;
        },
        // Colecciones privadas para los elementos de encabezado argumentos y namespaces
        _arguments:{},_nameSpaces:{},_headers:{},
        // Metodo de invocación del metodo SOAP
        invoke:function(methodName, URI, prefix){
            var This = this;
            // Obtiene el cuerpo de la peticion XML
            var xml = this.buildXML(methodName, URI, prefix);
            // Obtiene una instancia del objeto HTTP
            var http = (function(){if(window.XMLHttpRequest) return new XMLHttpRequest();return new ActiveXObject('Microsoft.XmlHttp');})();
            // Eliminamos los reusltados de alguna petición previa
            delete this.responseXML;
            // Establecemos la peticion HTTP
            http.open('POST', this.soapEndPoint, true);
            // Agregamos un manejador de eventos para monitorear la respuesta del servidor
            http.onreadystatechange = function(){
                //TODO:Agregar manejador de errores
                //TODO: Obtener el fault info respectivo
                if(http.readyState == 4){ // Respueta del server HTTP completada
                    if(http.status = 200){ // El server respondio positivamente (Sin error)
                        var SOAP_REQUEST = 'Request', SOAP_RESPONSE = 'Response', SOAP_REPLY = 'Reply';
                        if(http.responseXML){ // La respuesta viene en formato XML (SOAP válido)
                            var xml = http.responseXML;
                            var methodResp = methodName;
                            // Las siguientes lineas aislan la respuesta SOAP y la asignan a la propiedad responseXML
                            This.responseXML = xml.getElementsByTagName(methodName + SOAP_RESPONSE)[0]; // Primer intento de filtrado
                            if(!This.responseXML){ // El primer intento no fue exitoso, Segundo intento
                    		    var delta = (methodName.length - SOAP_REQUEST.length);
                                if(methodName.lastIndexOf(SOAP_REQUEST) == delta){
                                    var alias = methodName.substr(0, (methodName.length - SOAP_REQUEST.length));
                                    This.responseXML = xml.getElementsByTagName(alias+SOAP_RESPONSE)[0];
                                };
                            };
                            // Tercer intento de resultado
                            if(!This.responseXML) This.responseXML = xml.getElementsByTagName(methodName+SOAP_REPLY)[0];
                            if(!This.responseXML){ // Ultimo intento asumiendo un nodo de respuesta unico
                                This.responseXML = xml.getElementsByTagName('Body')[0];
                                This.responseXML = This.responseXML.childNodes[0];
                            };
                        };
                        // Llamamos a la función de callBack con el texto de la respuesta
                        This.callBack(http.responseText);
                    }else{};
                };
            };
            // Agregamos el encabezado para indicar el tipo de data stream enviado
            http.setRequestHeader('Content-type', 'text/xml');
            // Ejecutamos la peticion HTTP
            http.send(xml);
        }
    });
//=====================================================================================//
//                  FIN DEL CÓDIGO PARA LA CREACIÓN DEL CLIENTE SOAP                   //
//=====================================================================================//

//=====================================================================================//
// Las siguientes lineas hacen uso de la clase WSCall() para obtener el dataSet        //
//=====================================================================================//
    //function queryData(){
    //var domain = "http://mexrednatura.vbc-for-mlm.com";
    var domain = "http://stramovil.vbc-for-mlm.com";
    function queryData(storedProcedure, parameters, method, tableSet){
        // Se crea la instancia del componente WSCAll, se proporciona el SOAP EndPoint 
        // y una funcion de CallBack que será ejecutada al regresar la respuesta del servidor
        //var soap = new WSCall('http://movil.vbc-for-mlm.com/rs_app_endpoint.asp', function(text){
        var soap = new WSCall(domain+'/rs_app_endpoint.asp', function(text){
            // En este punto, el servidor ha regresado su respuesta y si esta fue exitosa
            // existirá una proppiedad llamada responseXML que contendra la respuesta SOAP
            // Obtenemos el dataSet JSON de la respuesta
            if(soap.responseXML){
                // Evaluamos el valor de /response/@code
                var resp = soap.responseXML.getElementsByTagName('response')[0];
                if(resp.getAttribute('code') == '0'){// Si /response/@code es 0 (cero) la operación fue exitosa
                    // Convertimos el stream json a una variable javascript 
                    var json = eval('('+soap.responseXML.getElementsByTagName('dataSet')[0].childNodes[0].nodeValue+')');
                    //TODO:Implementar el codigo propio de la aplicación
                    
                    switch(tableSet){
                        case 1:
                            method(json.dataSet1);
                            break;
                        case 2:
                            method(json.dataSet2);

                            break;
                        case 3:
                            method(json.dataSet3);

                            break;
                        default:
                            method(json.dataSet);
                            break;
                    }
                } else {
                    //TODO:Implementar el codigo propio de la aplicación
                    alert(resp.getAttribute('message'));
                }
                //TODO:Implementar el codigo propio de la aplicación
            } else /*alert('Fallo en la ejecución del método');*/  console.log("Fallo en la ejecución del método");
        });
        // Agregamos el namespace base
        // Agregamos las credenciales de acceso
        soap.addHeader('appId', 'VBCVO');
        soap.addHeader('apiKey', 'uZyA9ICJVVEYtOCI');
        
        //Elimina argumentos de solicitudes ya realizadas
        soap.removeArgument();
        // Llamada SQL con sus argumentos (argName, argValue, dataType)
        soap.addArgument('sql', storedProcedure);
        var cont = 0;
        if (parameters != '') {
            for (var i = 0; i < parameters.length; i++) {
                soap.addArgument('arg'+cont,  parameters[i+1], parameters[i]);
                i+=1;cont+=1;
            }
        }
        //soap.addArgument('arg0',  0, 'integer');
        // Invokamos el metodo con su namespace respectivo
        //showWaitLoader(); //Mostramos la animacion de espera....
        soap.invoke('dataRequest', 'http://api.ramosoft.com/namespace/', 'rs');
    }