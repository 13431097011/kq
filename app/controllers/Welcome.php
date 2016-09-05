<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends MY_Controller
{
	public function index()
	{
		$data = M('book')->all();
		$this->display('index',['list'=>$data]);
	}

	public function book()
	{
		echo json_encode(M('book')->all());
	}
}
