<?php
require_once('../app/config.php');

use \runner\App;

$app = \runner\App::getApp();

if(isset($_POST['action']) && isset($_POST['data'])){
	$app->api($_POST['action'], $_POST['data']);
}
