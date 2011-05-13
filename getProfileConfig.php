<?php
//takes in the id and returns the config data for the page. 
	require 'jsonwrapper/jsonwrapper.php';
$id = $_GET['id'];
$id = urlencode($id);

	
	$dbhost = 'db2860.perfora.net';
	$dbuser = 'dbo360216020';
	$dbpass = '12121989';

	$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');

	$dbname = 'db360216020';
	mysql_select_db($dbname);
	
	 
	$rs = mysql_query("SELECT value FROM Hacku WHERE id='$id'");
	$row = mysql_fetch_assoc($rs);
	
	$returnData = $row["value"];
	
	$data = array('body' => $returnData); 
	echo  'parseConfig('.json_encode($data).')'; 
	
	//echo 'parseConfig('.$returnData.')'; 
	
?>

