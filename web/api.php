<?php
require_once('../app/config.php');

use \runner\App;

$app = \runner\App::getApp();

if(isset($_REQUEST['action']) && isset($_REQUEST['data'])){
	$app->api($_REQUEST['action'], $_REQUEST['data']);
}
