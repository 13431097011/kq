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
		//$url = " http://www.baidu.com";
		$webinfo = cget($url);
		if (!$webinfo) {
			return callback('网络异常请手动输入');
		}
		return json(['err' => '', 'data' => $webinfo]);
	}

}
