<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Book extends MY_Controller
{
	public function form()
	{
		$this->display('Book/form');
	}
	public function getISBN(){
		$url = 'https://api.douban.com/v2/book/isbn/';
	}
	
}
