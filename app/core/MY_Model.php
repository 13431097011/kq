<?php
/**
 * Created by PhpStorm.
 * User: StarZhan
 * Date: 2016/4/6
 * Time: 18:17
 */

defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Model extends CI_Model
{
	private $helper = 'Mongo';
	public function __construct()
	{
		parent::__construct();
		require_once (__DIR__."/".$this->helper."Helper.php");
		$class = $this->helper."Helper";
		$this->Helper = new $class ();
	}

	public function all($where = [], $option = [], $count = false){
		return $this->Helper->all($this->table,$where,$option,$count);
	}
	public function one($where){
		return $this->Helper->one($this->table,$where);
	}
	public function update($where = [], $data = [])
	{
		return $this->Helper->update($this->table,$where,$data);
	}
	public function insert($data)
	{
		return $this->Helper->insert($this->table,$data);
	}



}