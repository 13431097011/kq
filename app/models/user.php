<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class user extends MY_Model{
	protected $table = 'user';
	
	
	public function __construct()
	{
		parent::__construct();
	}

	function zxx(){
		return $this->test();
	}
}

