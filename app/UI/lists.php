<?php 
defined('BASEPATH') OR exit('No direct script access allowed');
class lists{
	private $str = false;
	public function __construct($obj){
		$this->str = $obj;
	}
	 public function index($data){

		foreach($data as &$v){
			$v['price'] = explode('.', $v['price']);
			$v['url'] = "/list/".(string)$v['_id'];
		}
		return $this->str->load->view('UI/lists',['list'=>$data],true);
	}
}




?>