<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function zxx(){
	
}
function M($name){
	CI_Controller::get_instance()->load->model($name);
	return CI_Controller::get_instance()->{$name};
}
