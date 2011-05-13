<?php
	require 'jsonwrapper/jsonwrapper.php';
	$url = $_GET['url'];
	$url = urlencode($url);
	
	$dbhost = 'db2860.perfora.net';
	$dbuser = 'dbo360216020';
	$dbpass = '12121989';

	$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');

	$dbname = 'db360216020';
	mysql_select_db($dbname);
	
	 
	$rs = mysql_query("SELECT id, urlVal, value, votes, submittedBy FROM Hacku WHERE urlVal='$url' ORDER BY votes DESC");

	$returnData = "<ul style=\"margin: 0px; padding-top: 30px;\">";
	
	$counter = 1; 
	while ($row = mysql_fetch_assoc($rs)) 
	{
		$newLI = $newLI = "<li id = {$row['id']} style='padding-right: 20px; display:inline; border-right: 1px gray solid; margin: 0px; color: white;'>";
		$returnData = $returnData.''.$newLI.''.$row["submittedBy"].' ('.$row["votes"].') '."</li>";
		$counter = $count + 1; 
		if($counter == 5)
		{
			break;
		}
	}
	$returnData = $returnData.'</ul>'; 
	
	 //$returnData = "displayProfileData(".$returnData.")";
	
	$data = array('body' => $returnData); 
	echo 'displayProfileData('.json_encode($data).')'; 
	
	echo $returnData; 
	
?>