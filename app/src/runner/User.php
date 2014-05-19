<?php
namespace runner;

class User
{

	const LOGIN_MIN_LENGTH = 3;
	const PASSWORD_MIN_LENGTH = 3;

	private $id;
	private $facebookID;
	private $lives;
	private $firstName;
	private $lastName;
	private $friendList;
	
	private $db;
	
	private function __construct($data, $friendList = [])
	{
		$this->id = (int)$data->id;
		$this->facebookID = $data->facebookID;
		$this->firstName = $data->fb_first_name;
		$this->lastName = $data->fb_last_name;
		$this->lives = $data->lives;
		$this->friendList = [];
		foreach($friendList['data'] as $friend){
			if(isset($friend['installed'])){
				$this->friendList[] = $friend;
			}
		}
	}
	
	public static function loginFacebook($db, $fb){
	
		$fbUserId = $fb->getUser();
		if(!$fbUserId)		//Si on n'a pas d'id on renvoie au login
		{
			$loginUrl = $fb->getLoginUrl([
				
				'redirect_uri' => 'https://apps.facebook.com/'.FB_APP_NAMESPACE
			]);
			die('<!doctype html><html><body><script>top.location.href = "'.$loginUrl.'"; </script></body></html>');
			exit;
		}
		else
		{
			$query = $db->prepare('SELECT * FROM users WHERE facebookID = ?');
			$query->execute([$fbUserId]);
			$userData = $query->fetch();
			
			if(!$userData)
			{
				$fbData = $fb->api('/me');
				$fbUserFirstName = $fbData['first_name'];
				$fbUserLastName = $fbData['last_name'];
				echo("prenom : ".$fbUserFirstName);
				echo("  nom : ".$fbUserLastName);
				
				$query = $db->prepare('INSERT INTO users (fb_first_name,fb_last_name, facebookID) VALUES (?,?,?)');
				$query->execute([$fbUserFirstName,$fbUserLastName, $fbUserId]);
				
				$query = $db->prepare('SELECT * FROM users WHERE facebookID = ?');
				$query->execute([$fbUserId]);
				$data = $query->fetch();
				
				if($userData)
				{
					$_SESSION['user'] = new User($data, $fb->api('/me/friends?fields=installed,first_name'));
				}
			}
			else
			{ 
				$_SESSION['user'] = new User($userData, $fb->api('/me/friends?fields=installed,first_name'));
			}
			
		}
	
	}
	
	public function getLogin(){
		return $this->firstName; //$this->login;
	}
	public function getId(){
		return $this->id;
	}
	public function getDeckId(){
		return $this->deckId;
	}
	
	public function toJSON(){
		return json_encode([
			'first_name' => $this->firstName,
			'last_name' => $this->lastName,
			'friendList' => $this->friendList
		]);
	}
	
}