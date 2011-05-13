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
	
	//$arr = array();
	 
	$rs = mysql_query("SELECT COUNT(id) as themeCount FROM Hacku WHERE urlVal='$url'");

	$row = mysql_fetch_assoc($rs);
	
	$data = array('body' => $row["themeCount"]); 
	echo 'checkProfileCount('.json_encode($data).')'; 
	//echo 'checkProfileCount('.\"{body: {$row["themeCount"]} }\".')';
	

?>