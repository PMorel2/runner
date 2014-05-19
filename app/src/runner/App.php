<?php
namespace runner;

class App {
	
	private static $_instance = null;
	private $data = [];
	private $db;
	private $fb;
	
	private function __construct(){
		$this->db = new \PDO(DB_DSN, DB_USER, DB_PASS);
		$this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
		$this->db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
		$this->db->exec('SET CHARACTER SET utf8');
	}
	
	public static function getApp() {
 
		if(self::$_instance === null) {
			self::$_instance = new self();  
		}
		return self::$_instance;
	}
	
	public function getDB(){
		return $this->db;
	}

	public function run(){
		$_SESSION['locale'] = 'fr_FR';
		if(defined('FB_APP_ID')){
			$this->runFacebook();
		}
	}

	public function runFacebook(){
		$this->fb = new \Facebook([
			'appId' => FB_APP_ID,
			'secret' => FB_APP_SECRET
		]);
		
		if(isset($_REQUEST['request_ids'])){
			$requestList = explode(',', $_REQUEST['request_ids']);
			foreach($requestList as $r)
			var_dump($this->fb->api('/'.$r));
			exit;
		}
		
		$signedRequest = $this->fb->getSignedRequest();
		if(isset($signedRequest['user']['locale'])){
			$_SESSION['locale'] = $signedRequest['user']['locale'];
		}
		
		User::loginFacebook($this->db,$this->fb);
		
		if(isset($_SESSION['user'])){
			include(TEMPLATES_PATH.'main.tpl');
		}
		

	}
	
	public function api($action, $value){
		echo("api called");
		
		if(isset($_SESSION['user'])){
			print_r($action, $value);
			if($action == 'updateLives'){
				$result = $_SESSION['user']->updateLives($value);
			}
			else if ($action == 'updateBestScore'){
				$result = $_SESSION['user']->updateBestScore($value);
			}
			
			echo json_Encode($result);
		}
	}
	
}