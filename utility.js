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
		alert('hi');
		var parts = storageParts[i].split("&&");
		var xPath = parts[0];
		var action = parts[1];
		var nodes = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null);
		if (nodes.toString() == 'null' || nodes.toString() == 'undefined')
			return;
		var node = nodes.iterateNext();
		alert('xPath: ' + xPath + ', action: ' + action);
		if (action == "remove") {
			if (node.toString() != 'null' && node.toString() != 'undefined')
				node.parentNode.removeChild(node);
		} else if (action == "swap") {
			var xPath2 = parts[2]; 
			var node2 = document.evaluate(xPath2, document, null, XPathResult.ANY_TYPE, null).iterateNext();

			//Might need check.
			var nextSibling = node.nextSibling;
			var prevSibling = node.previousSibling; 
			var parentNode = node.parentNode;
			node2.parentNode.replaceChild(node, node2);

			if(nextSibling.toString() != 'null'){
				   parentNode.insertBefore(node2, nextSibling);
			} else if(prevSibling.toString != 'null'){
				   node2.parentNode.insertAfter(node2, prevSibling);                                 
			}else{
				   node2.parentNode.appendChild(node); 
			}
		}else {
			alert('Unrecognized action!');
		}
	}
}

function saveForRemove(node) {
	if (localStorage[cleanURL(document.URL)].toString() == 'null') {
		localStorage[cleanURL(document.URL)] = get_XPath(node) + "&&remove\n";
	} else {
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
		}; 
		
		divs[i].onmouseout = function(){
			this.style.border = previous;
		};
	}
}

function allowDivDragging() {
	var dragSrcEl = null;
	// TODO: Fix dotted lines persistence...
	
	function handleDragStart(e) {
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
	}
	
	function handleDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		
		if (dragSrcEl != this) {
			// Set the source column's HTML to the HTML of the columnwe dropped on.
			dragSrcEl.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData('text/html');
			localStorage[clearURL(document.URL)] += get_XPath(this) + "&&swap&&" + get_XPath(dragSrcEl) + "\n";
		}

		return false;
	}

	function handleDragEnd(e) {
		[].forEach.call(divs, function (node) {
			node.style.border = "none";
		});
	}
	
	// TODO: Add exclusions to this list so you can't drag them (trash can, toolbar).
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
	
	function trashHandleDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		
		// Set the source column's HTML to the HTML of the columnwe dropped on.
		saveAndRemove(dragSrcEl);
		return false;
	}
	
	function trashHandleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault(); // Allows us to drop.
		}
		e.stopPropagation();
		return false;
	}
	
	var trash = document.createElement('img');
	trash.setAttribute("src", "dragtodelete2.png");
	trash.style.position = "absolute";
	trash.style.right = "0px";
	trash.style.bottom = "0px";
	document.body.appendChild(trash);
	trash.addEventListener('dragover', trashHandleDragOver, false);
	trash.addEventListener('drop', trashHandleDrop, false);
}