function Keyboard(origen, destino, event) {
	this.origen = origen;
	this.destino = destino;
	this.event = event;
}

Keyboard.prototype.showKeyboard = function(){
	if (this.event.which === 13) {
		if (getOS() === 1) {
			cordova.plugins.Keyboard.show();
		}
		else if (getOS() === 2) {
			$(this.destino).focus();
		}
    }
}

Keyboard.prototype.hideKeyboard = function(){
    if (this.event.which === 13) {
        $(this.origen).blur();
    }
    console.log(this.origen + ' ' + this.destino);
}

Keyboard.prototype.triggerButton = function(){
    if (this.event.which === 13) {
        $(this.destino).focus();
        $(this.destino).trigger('click');
    }
    console.log(this.origen + ' ' + this.destino);
};