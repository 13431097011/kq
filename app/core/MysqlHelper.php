<?php
/**
 * Created by PhpStorm.
 * User: StarZhan
 * Date: 2016/6/21
 * Time: 12:04
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class MysqlHelper extends CI_Model{


	public function __construct()
	{
		$this->load->database();
	}

	/**
	 * 撸where条件
	 * @param  array $codition [description]
	 * @return [type]           [description]
	 */
	private function where($codition = [])
	{
		$where = '';
		if ($codition) {
			$tmp = [];
			foreach ($codition as $k => $v) {
				$tmp[] = "`{$k}` = '{$v}'";
			}
			if ($tmp) {
				$where = implode(' and ', $tmp);
			}
		}
		return $where;
	}

	public function all($table,$where = [], $option = [], $count = false)
	{
		$field = "*";
		$sql = "select ";
		if (isset($option['field'])) {
			$field = $option['field'];
		}
		$sql .= $field . " from " . $this->db->dbprefix . $table;
		if ($where) {
			if ($this->where($where)) {
				$sql .= " where " . $this->where($where);
			}
		}
		if ($option) {
			if (isset($option['order'])) {
				$aOrder = is_array($option['order']) ? $option['order'] : explode(',', $option['order']);
				$aTemOrder = [];
				foreach ($aOrder as $order) {
					$aTemOrder[] = $order;
				}
				if ($aTemOrder) {
					$sql .= " order by " . implode(',', $aTemOrder);
				}
			}
			if ($count) {
				$sqlcount = str_replace($field, "count(*) as num", $sql);
				$countQuery = $this->db->query($sqlcount);
				$count = $countQuery->row_array()['num'];
			}
			if (isset($option['limit'])) {
				$alimit = explode(',', $option['limit']);
				if (count($alimit) == 2) {
					$sql .= " limit {$alimit[1]},{$alimit[0]} ";
				} else if (count($alimit) == 1) {
					$sql .= " limit {$alimit[0]} ";
				}
			}
		}
		$query = $this->db->query($sql);
		$result = $query->result_array();
		if ($count) {
			return ['count' => $count, 'data' => $result];;
		}

		return $result;
	}

	public function one($table,$where)
	{
		$query = $this->db->where($where)->get($table);
		return $query->row_array();
	}

	public function update($table,$where = [], $data = [])
	{
		$data['updated_at'] = date('Y-m-d H:i:s');
		$this->db->where($where)->update($table, $data);
		return $this->db->affected_rows();
	}
	/**
	 * 数据库表必须有id作为主键
	 */
	public function insert($table,$data)
	{
		$data['created_at'] = date('Y-m-d H:i:s');
		$this->db->insert($table, $data);
		if(!isset($data['id'])){
			$data['id'] = $this->db->insert_id();
		}
		if ($data['id']) {
			return $data;
		}
		return 0;
	}
	
}