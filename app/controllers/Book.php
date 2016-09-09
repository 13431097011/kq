<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Book extends MY_Controller
{
	public function form()
	{
		$this->display('Book/form');
	}

	public function getISBN()
	{
		$isbn = $this->input->post('isbn');
		$url = 'https://api.douban.com/v2/book/isbn/' . $isbn;
		cget($url);
	}

}
