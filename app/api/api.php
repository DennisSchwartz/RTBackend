<?php
	//header("Access-Control-Allow-Origin: *");
	require_once("Rest.inc.php");
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	class API extends REST {



		public $data = "";

		const DB_SERVER = "localhost";
		const DB_USER = "43804m33994_1";
		const DB_PASSWORD = "2012rock2009";
		const DB = "43804m33994_1";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}

		/*
		 *  Connect to Database
		 */
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
			$this->db = new PDO('mysql:host=localhost;dbname=43804m33994_1;charset=utf8', '43804m33994_1', '2012rock2009');
		}
		

		/*
		 *  Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method does not exist within this class return "Page not found".
		}


		private function login() {
			if($this->get_request_method() != "POST") {
				$this->response('',406);
			}
			$data = json_decode(file_get_contents("php://input"),true);
			$username = $data['name'];
			$password = $data['pass'];
			if(!empty($username) and !empty($password)) {
				$query="SELECT passwort FROM rt_login WHERE username='$username' LIMIT 1";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

				//Did it return any rows?
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();
					if($result['passwort'] == $password) {
						//If it worked, send "OK" in header and user detail
						$m = array('status' => "Success", "msg" => "Credentials accepted!");//, "success" => TRUE);
						$this->response($this->json($m), 200);
					}
				}
				//If there are no entries with that name, return "No Content"
				$m2 = array('status' => "Failed", "msg" => "Credentials rejected!");
				$this->response($this->json($m2),204);
			}

			$error = array('status' => "Failed", "msg" => "No name/password!");
			$this->response($this->json($error), 400);
		}


		private function gigs() {
			if($this->get_request_method() != "GET") {
				$this->response('',406);
			}

			$query = "SELECT * FROM rt_booking WHERE terminpos > 20140000";
			$stmt = $this->db->query($query);
			if ($stmt->rowCount()) {
				$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$this->response($this->json($result), 200); //Send gigs
			}
			//$stmt = $this->mysqli->prepare($query);
			//$stmt->execute();
			//$result = array();
			//$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
//
			//if($r->num_rows > 0) {
			//	$result = array();
			//	while ($row = $r->fetch_assoc()) {
			//		$result[] = $row;
			//	}
			//	//throw new Exception('TEST');
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//	//$result[] = $r->fetch_assoc();
			//}
			//No records found:
			$error = array('status' => "Failed", "msg" => "No gigs found!");
			$this->response($this->json($error), 400);
		}

		private function gig() {
			if($this->get_request_method() != "GET") {
				$this->response('',406);
			}

			$id = (int)$this->_request['id'];
			if ($id > 0) {
				$query = "SELECT * FROM rt_booking WHERE id = $id";
				$stmt = $this->db->query($query);
				if ($stmt->rowCount()) {
					$result = $stmt->fetch(PDO::FETCH_ASSOC);
					$this->response($this->json($result), 200); //Send gigs
				}
				$error = array('status' => "Failed", "msg" => "No gig with id $id!");
				$this->response($this->json($error), 400);
			}
		}

		/*
		 *	Encode array into JSON
		 */
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();




?>































