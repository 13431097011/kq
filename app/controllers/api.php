<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class api extends MY_Controller{

	public function books(){
		$data = M('book')->all();
		//$data = array_slice($data,0,4);
		//$data = [];
		$this->output->set_content_type('application/json')
			->set_output(json_encode(['book'=>$data]));
	}
}
