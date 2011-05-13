/* Contains main logic for the extension */

// add edit bar if not there
if (!document.getElementById("editBar")) {
    var imageUrl = "http://www.bloominate.com/alpha/bg.png";
    var barhtml = '<div style=\"height: 40px; repeat: repeat-x; background-image: url(' + imageUrl + '); margin: 0px;\"><h3 style=\"padding-left: 20px; margin: 0; padding-top: 10px; font-family: Droid Sans; font-size: 12pt; float: left;\">EDIT MODE<h3><div style=\"float: right; width: 400px; padding-top: 6px; padding-right: 30px;\"><button id=\"themes\" type=\"button\" disabled=\"disabled\">Themes</button><span id=\"themeNumber\">0</span><button id=\"reset\" type=\"button\">Reset Page</button><button id=\"edit\" type=\"button\">Edit</button><button id=\"save\" type=\"button\" border=\"0\" width=\"56\" height=\"24\" style=\"float: right; padding-right: 20px;\">Save</button><button id=\"close\" type=\"button\" border=\"0\" width=\"74\" height=\"24\" style=\"float: right; padding-right: 10px;\">Close</button></div>';
    
    var barWrapper = document.createElement('div');
    barWrapper.id = "editBar352011HackU";
    barWrapper.innerHTML = barhtml;

    var body = document.getElementsByTagName('body')[0];
    body.insertBefore(barWrapper, body.firstChild);
}


//Gets the profile config for the selected them
function getProfileConfig(themeId) {
    /*$.ajax({
        url: "http://www.bloominate.com/alpha/getProfileConfig.php",
        data: ({ id: themeId }),
        method: "POST",
        success: parseConfig,
        error: function() {
            alert("Error");
        }
    });*/
}


//Applies config for theme selected to page
function parseConfig(ajax) {
    //localStorage[cleanURL(document.URL)].toString()] = ajax.responseText;

}


//Gets themes for current url
function getProfileData(urlValue)
{
    /*$.ajax({
    
        url: "http://www.bloominate.com/alpha/getProfileData.php",
        data: ({ url: urlValue }),
        method:"POST", 
        success: parseData,
        error: function() {
            alert("Error");
        }
    });*/
}

//Displays themes    
/*function displayProfileData(ajax)
{        
    var themesData = ajax;
    $("#themesData").html = themesData; 
    $("#themesData").show();
    $("#helpbar").show();
    // for each theme, attach click event handler
}


//Displays number of themes
function checkProfileCount(json) {
    var count = json.body;
    if (count > 0) {
        $("#themes").disabled = "none";
        $("#themeNumber").html = count;
        $("#themes").click(function() {
            getProfileData(cleanURL(document.URL).toString());
        });
    }
}


*/
//Gets number of themes
function getProfileCount(urlValue)
{/*
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://www.bloominate.com/alpha/getProfileCount.php?url=" + urlValue;
    document.getElementsByTagName("head")[0].appendChild(script);
    /*
    $.ajax({        
        url: "http://www.bloominate.com/alpha/getProfileCount.php",   
        data: ({ url: urlValue }),
        dataType:'script', 
        success: checkProfileCount,
        error: function() {
            alert("Error");
        }
    });*/
    
}



$("#reset").click(function() {
    clearModsForThisPage();
    //refresh page
    window.location.reload(true);
});

$("#edit").click(function() {
    //turn on hover
    addHighlightsRemoves();
    allowDivDragging();
});

$("#close").click(function() {
   //turn off hover
   $("#editBar352011HackU").hide();
});

$("#save").click(function() {
    permanentSave(); 
    //refresh with changes
    window.location.reload(true);
});

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
	//alert(storageString);
	var storageParts = storageString.split("\n");
	for (var i = 0; i < storageParts.length; i++) {
		var parts = storageParts[i].split("&&");
		var xPath = parts[0];
		var action = parts[1];
		var node = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

		if (action == "remove") {
			node.parentNode.removeChild(node);
		} else if (action == "swap") {
			//alert('swap');
			var xPath2 = parts[2]; 
			var node2 = document.evaluate(xPath2, document, null, XPathResult.ANY_TYPE, null).iterateNext();
			//alert('switch ' + xPath + ' with ' + xPath2);
			//Might need check.
			var nextSibling = node.nextSibling;
			var prevSibling = node.previousSibling; 

			var parentNode = node.parentNode;

			node2.parentNode.replaceChild(node, node2);

			if (nextSibling.toString() != 'null' && nextSibling.toString() != 'undefined') {
				   parentNode.insertBefore(node2, nextSibling);
			} else if(prevSibling.toString != 'null' &&  prevSibling.toString() != 'undefined') {
				   node2.parentNode.insertAfter(node2, prevSibling);                                 
			} else {
				   node2.parentNode.appendChild(node); 
			}
		} else {
			alert('Unrecognized action!');
		}
	}
}

var tempRemove = "";

function saveForRemove(node) {
    tempRemove += get_XPath(node) + "&&remove\n";
}

function saveForSwap(oldNode, newNode) {
	tempRemove += get_XPath(oldNode) + "&&swap&&" + get_XPath(newNode) + "\n";
}

function saveAndRemove(node) {
	saveForRemove(node);
	node.parentNode.removeChild(node);
}

function permanentSave() {
    //if (localStorage[cleanURL(document.URL)].toString() == 'null' || !localStorage[cleanURL(document.URL)]) {
	if (localStorage[cleanURL(document.URL)]) {
		//alert("overwriting with " + tempRemove);
        localStorage[cleanURL(document.URL)] = tempRemove;
    } else {
		//alert("adding " + tempRemove);
        localStorage[cleanURL(document.URL)] += tempRemove;
    }
}

function clearModsForThisPage() {
	localStorage[cleanURL(document.URL)] = null;
}

//Function to add highlights to all divs. 
function addHighlightsRemoves() {
	var divs  = document.getElementsByTagName('div'); 
	// i used to be 0
	for(var i = 3; i < divs.length; i++){
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
			saveForSwap(dragSrcEl, this);
		}

		return false;
	}

	function handleDragEnd(e) {
		[].forEach.call(divs, function (node) {
			node.style.border = "none";
		});
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
	
	function trashHandleDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		
		// Set the source column's HTML to the HTML of the columnwe dropped on.
		saveAndRemove(dragSrcEl);
		trash.setAttribute("src", "http://bloominate.com/alpha/dragtodelete.png");
		return false;
	}
	

	function trashHandleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault(); // Allows us to drop.
		}
		e.stopPropagation();
		
		trash.setAttribute("src", "http://bloominate.com/alpha/dragtodelete2.png");
		return false;
	}
	
	var trash = document.createElement('img');
	trash.setAttribute("src", "http://bloominate.com/alpha/dragtodelete.png");
	trash.style.position = "absolute";
	trash.style.right = "0px";
	trash.style.bottom = "0px";
	document.body.appendChild(trash);
	trash.addEventListener('dragover', trashHandleDragOver, false);
	trash.addEventListener('drop', trashHandleDrop, false);
}

// TODO: Change trash can animation on drag over.

// Functions to call when page is loaded.

function init() {
	//alert('1');
	//alert("null? " + localStorage[cleanURL(document.URL)].toString() != 'null');
	//alert("defined? " + localStorage[cleanURL(document.URL)]);
	getProfileCount(localStorage[cleanURL(document.URL)].toString());
	//if (localStorage[cleanURL(document.URL)].toString() != 'null' && localStorage[cleanURL(document.URL)]) {
	if (localStorage[cleanURL(document.URL)]) {
	   doAllInStorage();
	}
};

window.onload = init; 

