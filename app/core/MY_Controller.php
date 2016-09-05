<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 控制器类文件
 */
class MY_Controller extends CI_Controller
{
	public $layout = 'layouts/book';

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('common');
	}

	public function display($view, $data = null)
	{

		$data['content'] = $this->load->view($view, $data, true);
		$this->load->view($this->layout, $data, false);
	}

}