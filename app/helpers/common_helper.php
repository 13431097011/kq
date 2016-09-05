<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function dd($data = [])
{
	echo "<pre>";
	print_r($data);
	echo "</pre>";
	exit;
}

function M($name)
{
	CI_Controller::get_instance()->load->model($name);
	return CI_Controller::get_instance()->{$name};
}


function callback($msg)
{
	return json(['err' => $msg]);
}

function json($data)
{
	return CI_Controller::get_instance()->output
		->set_content_type('application/json')
		->set_output(json_encode($data, JSON_UNESCAPED_UNICODE));
}

function langerr($key)
{
	CI_Controller::get_instance()->lang->load('error');
	$ret = [];
	return CI_Controller::get_instance()->lang->line($key);
}

/**
 * 生成唯一字符串
 * @return string
 */
function uuid()
{
	if (function_exists('com_create_guid')) {
		return com_create_guid();
	} else {
		mt_srand(( double )microtime() * 10000); //optional for php 4.2.0 and up.随便数播种，4.2.0以后不需要了。
		$charid = strtoupper(md5(uniqid(rand(), true))); //根据当前时间（微秒计）生成唯一id.
		$hyphen = chr(45); // "-"
		$uuid = '' . //chr(123)// "{"
			substr($charid, 0, 8) . $hyphen . substr($charid, 8, 4) . $hyphen . substr($charid, 12, 4) . $hyphen . substr($charid, 16, 4) . $hyphen . substr($charid, 20, 12);
		//.chr(125);// "}"
		return $uuid;
	}
}

function UI($name,$data){
	$filename = dirname(dirname(__FILE__))."/UI/".$name.".php";
	include $filename;
	$obj = new lists(CI_Controller::get_instance());
	return $obj->index($data);
}

