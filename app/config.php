<?php

/******* C:\workspace\runner/app/config/01-define.php ********/

define('NL',"\n");
define('TAB',"\t");
define('CR',"\r");

define('ENCRYPT_ENABLED', false);

define('PROJECT_PATH', realpath(__DIR__.'/..').'/');
define('WEB_STATIC_PATH', PROJECT_PATH.'web-static/');
define('WEB_PATH', PROJECT_PATH.'web/');
define('APP_PATH', PROJECT_PATH.'app/');
define('SRC_PATH', PROJECT_PATH.'app/src/');
define('CONFIG_PATH', PROJECT_PATH.'app/config/');
define('TOOLS_PATH', PROJECT_PATH.'app/tools/');
define('VENDOR_PATH', PROJECT_PATH.'vendor/');
define('TEMPLATES_PATH', PROJECT_PATH.'app/templates/');

/******* C:\workspace\runner/app/config/10-declare-namespace.php ********/


include VENDOR_PATH.'Zend/Loader/StandardAutoloader.php';

$zenLoader = new \Zend\Loader\StandardAutoloader();
$zenLoader->register();

$zenLoader->registernamespace('aes', VENDOR_PATH.'aes');
$zenLoader->registernamespace('passwordHashUtils', VENDOR_PATH.'passwordHashUtils');
$zenLoader->registernamespace('runner', SRC_PATH.'runner');

include VENDOR_PATH.'facebook/facebook.php';

/******* C:\workspace\runner/app/config/20-session.php ********/

session_name('RUNNER');
session_start();

/******* C:\workspace\runner/app/config/dev//10-database.php ********/

define('DB_DRIVER','mysql');
define('DB_HOST','localhost');
define('DB_NAME','jellykiddb');
define('DB_USER','root');
define('DB_PASS','');

define('DB_DSN', DB_DRIVER.':host='.DB_HOST.';dbname='.DB_NAME);

/******* C:\workspace\runner/app/config/dev//10-uri.php ********/

	// DEFINE URI (DEV)
	define('WEB_STATIC_URI', '/web-static/');

/******* C:\workspace\runner/app/config/dev//20-facebook.php ********/

define ('FB_APP_ID', '211147692415795');
define ('FB_APP_SECRET', 'd03c1207001ba0e7b0af3fc78be515e3');
define ('FB_APP_NAMESPACE', 'jellykidruns');
