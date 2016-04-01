//解析代码标签 安凌志 2012.03.28 {$可执行的JS代码或字符串变量$}，如：{$l(lang.test,['a','b'])$} {$lang.test$}
define(function(require, exports, module){
	function evals(d,k){
		if(!d || !k) return;
		if(k.indexOf('.') >= 0){
			var s = k.split('.')[0];
			return evals(d[s], k.replace(s+'.',''));
		}else{
			return d[k];
		}
	}

	return function(s, o){
		var v = o ? $.extend(clone(o), vars) : vars, n;
		if(s && (typeof s == 'string') && v){
			var re = s.match(/\{\$.*?\$\}/g);
			if(re){
				$.each(re,function(i,o){
					i = o.replace('{$','').replace('$}','');
					n = evals(v, i);//指定标签
					if(typeof n == 'string' || typeof n == 'number') s = s.replace(o,n);
					try{
						n = eval(i);//其它情况:可以是任何可执行的JS代码，返回结果为字符串类型
						if(typeof n == 'string' || typeof n == 'number') s = s.replace(o,n);
					}catch(e){}
				});
				s = s.replace(new RegExp('(<!---|--->)','g'), '');//重要：是三个小横杆
			}
		}
		return s;
	};
});