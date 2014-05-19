<?php
namespace runner;

class App {
	
	private static $_instance = null;
	private $data = [];
	private $cardsData = [];
	private $db;
	private $fb;
	
	private function __construct(){
		$this->db = new \PDO(DB_DSN, DB_USER, DB_PASS);
		$this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_WARNING);
		$this->db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_OBJ);
		$this->db->exec('SET CHARACTER SET utf8'); // display accents of the database texts
	}
	
	public static function getApp() {
 
		if(self::$_instance === null) {
			self::$_instance = new self();  
		}
		return self::$_instance;
	}

	public function run(){
		$_SESSION['locale'] = 'fr_FR';
		if(defined('FB_APP_ID')){
			$this->runFacebook();
		}else{
			$this->runStandAlone();
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
	
	public function loadCardData(){
	
		$cardsData["cards"] = [];
		$cardsData["playerDeck"] = [];
	
		// Cards
		$query = $this->db->prepare('	SELECT c.*, ct.type cType, cpp.position positionJoueur
										FROM jw_cards c
										LEFT JOIN jw_cardtype ct ON ct.id=c.cardType_id
										LEFT JOIN jw_cardplayerpos cpp ON cpp.id=c.playerPos_id
									');
		$query->execute();
		
		while($cardRow = $query->fetch()){
				$cardRow->number = (int) $cardRow->number;
				$cardRow->finish = (((int) $cardRow->finish) == 1)? "oui" : "non";
				$cardRow->level1 = (((int) $cardRow->level1) == 1)? "oui" : "non";
				$cardRow->level2 = (((int) $cardRow->level2) == 1)? "oui" : "non";
				$cardRow->level3 = (((int) $cardRow->level3) == 1)? "oui" : "non";
				$cardRow->coeffPui = (float) $cardRow->coeffPui;
				$cardRow->nbUtil = (int) $cardRow->nbUtil;
				$cardRow->gainPui = (int) $cardRow->gainPui;
				$cardRow->puissance = (int) $cardRow->puissance;
				$cardRow->dureeAction = (float) $cardRow->dureeAction;
				$cardRow->delaiEffet = (float) $cardRow->delaiEffet;
				
				$cardsData["cards"][$cardRow->code] = $cardRow;
		}
		
		
		// Player Deck
		$query = $this->db->prepare('	SELECT dc.id deck_cards_id, c.*, ct.type cType, cpp.position positionJoueur
										FROM jw_cards c
										LEFT JOIN jw_cardtype ct ON ct.id=c.cardType_id
										LEFT JOIN jw_cardplayerpos cpp ON cpp.id=c.playerPos_id
										RIGHT JOIN jw_deck_cards dc ON dc.card_id = c.id
										INNER JOIN jw_decks d ON d.id = dc.deck_id
										INNER JOIN jw_users u ON d.user_id = u.id
										WHERE u.id = ?
										ORDER BY c.id;
									');
		$query->execute([$_SESSION['user']->getId()]);
		
		while($cardRow = $query->fetch()){
				$cardRow->number = (int) $cardRow->number;
				$cardRow->finish = (((int) $cardRow->finish) == 1)? "oui" : "non";
				$cardRow->level1 = (((int) $cardRow->level1) == 1)? "oui" : "non";
				$cardRow->level2 = (((int) $cardRow->level2) == 1)? "oui" : "non";
				$cardRow->level3 = (((int) $cardRow->level3) == 1)? "oui" : "non";
				$cardRow->coeffPui = (float) $cardRow->coeffPui;
				$cardRow->nbUtil = (int) $cardRow->nbUtil;
				$cardRow->gainPui = (int) $cardRow->gainPui;
				$cardRow->puissance = (int) $cardRow->puissance;
				$cardRow->dureeAction = (float) $cardRow->dureeAction;
				$cardRow->delaiEffet = (float) $cardRow->delaiEffet;
				
				$cardsData["playerDeck"][$cardRow->deck_cards_id] = $cardRow;
		}
		
		
		return $cardsData;
	}
	
	public function saveDeck($data){
	
		// Delete all...
		$query = $this->db->prepare('	DELETE FROM jw_deck_cards
										WHERE deck_id = ?;
									');
		$query->execute([$_SESSION['user']->getDeckId()]);
		
		// ... then save
		foreach ($data as &$value) {
			$query = $this->db->prepare('	INSERT INTO jw_deck_cards (deck_id, card_id)
											VALUES (?,?);
									');
			$query->execute([$_SESSION['user']->getDeckId(), $value]);
		}
		return $data;
	}
	
	public function api($action, $data){
		$result = false;
		if(!isset($_SESSION['user'])){
			$result = ['error' => 'Session expired', 'reload' => true];
		}else{		
			switch($action){
				case 'loadCardData':
					$result = $this->loadCardData();
					break;
				case 'saveDeck':
					$result = $this->saveDeck($data);
					break;
				default:
					$result = ['error' => 'Action unknown'];
					break;
			}
		}
		echo json_encode($result,JSON_PRETTY_PRINT);
	}
	
}