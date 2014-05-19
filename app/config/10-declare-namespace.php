<?php

include VENDOR_PATH.'Zend/Loader/StandardAutoloader.php';

$zenLoader = new \Zend\Loader\StandardAutoloader();
$zenLoader->register();

$zenLoader->registernamespace('aes', VENDOR_PATH.'aes');
$zenLoader->registernamespace('passwordHashUtils', VENDOR_PATH.'passwordHashUtils');
$zenLoader->registernamespace('runner', SRC_PATH.'runner');

include VENDOR_PATH.'facebook/facebook.php';