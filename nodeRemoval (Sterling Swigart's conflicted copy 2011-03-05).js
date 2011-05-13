function get_XPath(elt){
       var path = '';
       for (; elt && elt.nodeType==1; elt=elt.parentNode){
               var idx=$(elt.parentNode).children(elt.tagName).index(elt)+1;
          idx>1 ? (idx='['+idx+']') : (idx='');
          path='/'+elt.tagName.toLowerCase()+idx+path;
         }
       return path;
}

function cleanURL(URL) {
	return URL.split("?")[0];
}

function doAllInStorage() {
	
var storageString = localStorage[cleanURL(document.URL)];
	if (storageString.toString() == 'null'){
		return;
	}
	
	var storageParts = storageString.split("\n");
	for (var i = 0; i < storageParts.length; i++) {
		var parts = storageParts[i].split("&&");
		var xPath = parts[0];
		var action = parts[1];
		var node = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
		
		if (action == "remove") {
			node.parentNode.removeChild(node);
		} 
		else {
			alert('Unrecognized action!');
		}
	}
}

function saveForRemove(node) {
	if(localStorage[cleanURL(document.URL)].toString() == 'null'){
		localStorage[cleanURL(document.URL)] = get_XPath(node) + "&&remove\n";
	}
	else{
		localStorage[cleanURL(document.URL)] += get_XPath(node) + "&&remove\n";
	}
}

function saveAndRemove(node) {
	saveForRemove(node);
	node.parentNode.removeChild(node);
}

function clearModsForThisPage() {
	localStorage[cleanURL(document.URL)] = null;
}

//Function to add highlights to all divs. 
function addHighlightsRemoves(){
	var divs  = document.getElementsByTagName('div'); 
	
	for(var i = 0; i < divs.length; i++){
		var previous;
		divs[i].onmouseover = function(e){
			e.stopPropagation();
			e.preventDefault(); 
			previous = this.style.border;
			this.style.border = "2px red solid";
			/*this.onclick = function(e) {
				e.stopPropagation();
				e.preventDefault(); 
				saveAndRemove(this); 
			}*/
		}; 
		
		divs[i].onmouseout = function(){
			this.style.border = previous;
		};
	}
}

function allowDivDragging() {
	var dragSrcEl = null;
	
	function handleDragStart(e) {
		this.style.opacity = '0.4';
		this.style.border = "2px red solid";
		
		dragSrcEl = this;
		e.stopPropagation();
		
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', this.innerHTML);
	}
	
	function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault(); // Allows us to drop.
		}
		e.stopPropagation();
		
		e.dataTransfer.dropEffect = 'move';
		this.style.border = "2px dashed #000";

		return false;
	}

	function handleDragEnter(e) {
		this.style.border = "2px dashed #000";
		e.stopPropagation();
	}

	function handleDragLeave(e) {
		this.style.border = "none";
		e.stopPropagation();
	}
	
	function handleDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		e.stopPropagation();
		
		if (dragSrcEl != this) {
			// Set the source column's HTML to the HTML of the columnwe dropped on.
			dragSrcEl.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData('text/html');
			localStorage[clearURL(document.URL)] += get_XPath(this) + "&&swap&&" + get_XPath(dragSrcEl) + "\n";
		}

		return false;
	}

	function handleDragEnd(e) {
		[].forEach.call(cols, function (col) {
			col.removeClassName('over');
		});
		e.stopPropagation();
	}
	
	var divs  = document.getElementsByTagName('div'); 
	for(var i = 0; i < divs.length; i++) {
		divs[i].setAttribute('draggable', 'true');
		divs[i].addEventListener('dragstart', handleDragStart, false);
		divs[i].addEventListener('dragenter', handleDragEnter, false);
		divs[i].addEventListener('dragover', handleDragOver, false);
		divs[i].addEventListener('dragleave', handleDragLeave, false);
		divs[i].addEventListener('drop', handleDrop, false);
		divs[i].addEventListener('dragend', handleDragEnd, false);
	}
}

window.onload = function(){
	allowDivDragging();
	addHighlightsRemoves();
	doAllInStorage();
	
	clearModsForThisPage();
};

Element.prototype.hasClassName = function(name) {
	return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function(name) {
	if (!this.hasClassName(name)) {
		this.className = this.className ? [this.className, name].join(' ') : name;
	}
};

Element.prototype.removeClassName = function(name) {
	if (this.hasClassName(name)) {
		var c = this.className;
		this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
	}
};