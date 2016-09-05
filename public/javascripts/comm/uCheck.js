define(function(require){
	var uCheck = {list:[]};
	$.fn.uCheck = function(name, val, opt){
		uCheck.list.push([$(this), name, val, opt]);
		var url = 'http://tool.oa.com/api/?id=userCheck';
		//url = 'http://vm.boyaa.com/cms/api/loadjs.php?id=tool&file=userCheck.js';
		var exec = function(){
			var fn = function(I, name, val, opt){
				opt = opt && typeof opt == 'object' ? opt : {};
				if(!opt.placeholder) opt.placeholder = opt.mode == 'group' ? '搜索部门' : '搜索用户';
				var s = [];
				if(!opt.noinput) s.push('<input class="txt" uc_type="input" autocomplete="off" type="text" placeholder="'+ opt.placeholder +'" size="'+ (opt.size || 8) +'" style="margin-right:3px; border:none; border-bottom:1px solid #e0e5f3;" placeholder="填写代理人" />');
				if(!opt.nocheck){
					if(!opt.batchcheck){
						if(opt.limit == 1){
							opt.batchcheck = '点击选择';
						}else{
							opt.batchcheck = '批量选择';
						}
					}
					s.push('<button uc_type="button" type="button">'+ opt.batchcheck +'</button>');
				}
				delete opt.noinput;
				delete opt.nocheck;
				delete opt.size;
				s.push('<span uc_type="list"></span>');
				if(opt.value_en){
					opt.value_en = '[uc_type=value_en]';
					s.push('<input uc_type="value_en" type="hidden" value="'+ val +'" name="'+ name +'" />');
				}else if(opt.value_zh){
					opt.value_zh = '[uc_type=value_zh]';
					s.push('<input uc_type="value_zh" type="hidden" value="'+ val +'" name="'+ name +'" />');
				}else{
					opt.value_id = '[uc_type=value_id]';
					s.push('<input uc_type="value_id" type="hidden" value="'+ val +'" name="'+ name +'" />');
				}
				I.html(s.join(''));
				var set = {
					mode: 'all',
					button: '[uc_type=button]',
					input: '[uc_type=input]',
					list: '[uc_type=list]'
				};
				if(opt) $.extend(set, opt);
				I.userCheck(set);
				if(typeof set.callback == 'function') set.callback(I, name, val, opt);
			};
			while(1){
				var v = uCheck.list.shift();
				if(!v) break;
				fn(v[0], v[1], v[2], v[3]);
			}
		};
		if(uCheck.ready){//JS已加载成功
			exec();
		}else{
			if(uCheck.loading) return;//JS加载中
			uCheck.loading = 1;//标记加载
			$.getScript(url, function(){//JS加载完成
				uCheck.ready = 1;
				exec();
			});
		}
	};
});