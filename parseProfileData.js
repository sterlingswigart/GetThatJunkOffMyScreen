window.onload = pageLoad;

function pageLoad()
{
	//need to str
	getProfileData("www.facebook.com"); 
}

function getProfileData(urlValue)
{
	new Ajax.Request("getProfileData.php"),
					{
						parameters:{
							url: urlValue
						}
						method:"post", 
						onSuccess: parseData,
						onFailure: ajaxError,
						onException: ajaxError
					});
}

function parseData(ajax)
{	
	alert("This needs to be parsed! "+ajax.responseText); 
}

function ajaxError(ajax)
{
	alert("An Error Occurred!"); 
}