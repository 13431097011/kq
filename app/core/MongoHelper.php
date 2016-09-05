<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MongoHelper extends CI_Model{

	public function __construct()
	{
		include dirname(dirname(__FILE__))."/libraries/Mongo_db.php";
		$this->Mongo_db = new Mongo_db();
		//$this->load->database();
	}


	public function insert($table,$data)
	{
		$_id= $this->Mongo_db->insert($table,$data);
		if($_id){
			$data['_id'] = $_id;
			return $data;
		}
		return 0;
	}
	public function update($table,$where = [], $data = []){
		if(isset($where['_id'])){
			$where['_id'] = new MongoId($where['_id']);
		}
		return	$this->Mongo_db->where($where)->update($table,$data);
	}
	public function all($table,$where = [], $option = [], $count = false){
		if (isset($option['field'])&&$option['field']!='*') {
			$this->Mongo_db->select(explode(',',$option['field']));
		}
		if ($where) {
			$this->Mongo_db->where($where);
		}
		if ($option) {
			if (isset($option['order'])) {
				$this->Mongo_db->order_by($option['order']);
			}
			if ($count) {
				$copymongo = $this->Mongo_db;
				$count = $copymongo->count();
			}
			if (isset($option['limit'])) {
				$alimit = explode(',', $option['limit']);
				if (count($alimit) == 2) {
					$this->Mongo_db->limit($alimit[0])->skip($alimit[1]);
				} else if (count($alimit) == 1) {
					$this->Mongo_db->limit($alimit[0]);
				}
			}
		}

		$result = $this->Mongo_db->get($table);
		
		if ($count) {
			return ['count' => $count, 'data' => $result];
		}

		return $result;
	}

}