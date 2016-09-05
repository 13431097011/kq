<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends MY_Controller
{
	public function index()
	{


		$this->display('index');
	}

	public function book()
	{
		echo json_encode(M('book')->all());
	}
}
