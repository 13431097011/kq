<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class C extends CI_Controller{
	public $layout = 'layouts/default';
	public function __construct() {
		parent::__construct();
		$this->load->helper('common');
	}
	public  function M($name){
		$this->load->model($name);
		return $this->$name;
			
	}
	public function display($view,$data=null){
		
		$data['content'] = $this->load->view($view, $data, true);
		$this->load->view($this->layout,$data, false);
	}
	
	
}