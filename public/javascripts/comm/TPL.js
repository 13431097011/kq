/**
 * Copyright (c) boyaa.com
 * Developer - 安凌志
 * Last modify - 2012.05.20
 * Info - 通用JS模板修饰函数
 */
define(function(){
	var TPL = {
		_oi: 0,
		_o: {},
		o: function(v, set){//模板输出的时候要附带的一些JS事件，参照TPL.select
			if(v === 'clear'){//$.fn.loadData会调用
				TPL._oi = 0;
				TPL._o = {};
				return;
			}
			if(set){
				var k = ++TPL._oi;
				TPL._o[k] = v;
				if(typeof v == 'function' && set === 'script'){
					return '<script>TPL.o('+ k +')</script>';
				}else{
					return k;
				}
			}else{
				var r = TPL._o[v];
				if(typeof r == 'function'){
					return r(v);
				}else{
					return r;
				}
			}
		},
		UC: function(v, rs, par, tag, aPar){
			aPar = aPar || {};
			var tmp = {};
			$.each(aPar, function(i, j){//转化为object
				if(j && j.indexOf(':')){
					j = j.split(':');
					tmp[j[0]] = j[1];
				}
			});
			if(!$.isEmptyObject(tmp)){//检测是否为空对象
				aPar = tmp;
			}
			if(aPar.callback){//回调函数
				var f = eval(aPar.callback);
				if(typeof f == 'function'){
					aPar.callback = f;
				}else{
					delete aPar.callback;
				}
			}
			tag = tag.toString().replace(/\[|\]/g, '_');
			var i = TPL.o(function(){
				$('#uc_'+tag).uCheck(tag, v, aPar);
			}, true);
			return '<span id="uc_'+ tag +'"></span><script>TPL.o('+ i +')</script>';
		},
		JS: function(v){//执行自定的JS字符，如: [JS]S.cmsapi+'viewlog.php?p=boyaalogs&by_uid='+ MY.id +'&t=0&log=mudb.txt.php'
			if(!v || typeof v !== 'string') return v;
			var k = '[JS]';
			if(v.indexOf(k) < 0) return v;
			v = v.replace(k, '');
			try{
				return eval(v);
			}catch(e){
				return '['+ e +']'+ v;
			}
		},
		editor: function(v, rs, par, tag, pars){
			var id = 'editor_'+ tag, opt = {};
			if(par) opt.height = par;
			if(pars && pars[1]) opt.toolbar = pars[1];
			var key = COMM.fmtId(tag);
			TPL['editor_value_'+ key] = COMM.replace(v);
			TPL['editor_opt_'+ key] = opt;
			return '<div id="'+ id +'" style="padding:5px 0"></div><script>loadEditor("'+ id +'","'+ tag +'",TPL.editor_value_'+ key +',TPL.editor_opt_'+ key +');</script>';
		},
		umeditor: function(v, rs, par, tag){
			var id = WIN[0].id + tag + '_um', h = par || 300;
			return '<div><script type="text/plain" id="'+ id +'" style="width:99.8%;height:'+ h +'px">'+ v +'</script><script type="text/javascript">UM.getEditor("'+ id +'").destroy();UM.getEditor("'+ id +'");</script></div>';
		},
		del: function(s, rs, par){//js模板标签处理
			return s == 1 ? C.del : ' ';
		},
		ip: function(ip){//IP链接
			return '<a href="http://www.ip138.com/ips.asp?ip='+ip+'&action=2" target="_blank">'+ip+'</a>';
		},
		uid: function(s, rs, par){
			if(s && s.indexOf(',') > 0){
				s = s.split(',');
				var r = [];
				$.each(s, function(i,o){
					r.push(TPL.uid2name(o, par));
				});
				return r.join(',');
			}else{
				return TPL.uid2name(s, par);
			}
		},
		uid2name: function(uid, par){
			return VAR.adminuser[uid] || (par === 'uid' ? uid : par) || '-';
		},
		cut: function(v,rs,len){
			v =  v ? v.replace(/</g,'&lt;').replace(/>/g,'&gt;') : '', len = len || 50;
			if($.inArray(S.langfix, ['th','zh','kr','jp']) >= 0) len /= 2;
			return (v && v.length > len) ? '<span title="'+ v +'">'+ v.replace(/{/g,'DKHL').replace(/}/g,'DKHR').substr(0, len) +'…</span>' : v;
		},
		pic: function(s,rs,par){
			if(!s) return '-';
			var p = F.cfg(par) || {};
			F.setPar(p);
			var d = p.delPath || '', n = p.v || 30, path = p.cms ? PATH.upload : C.cdn+'images/', src = path+d+s;
			if(par == 'prop'){
				src = path + d +'big80'+ s;
				return '<a href="'+src+'" target="_blank"><img view="'+src+'" src="'+src+'" height="'+n+'" onerror="F.err(this)" /></a>';
			}
			if(p.model == 'more'){//多文件
				var temp = s.split(F.andstr), temp2 = '';
				$.each(temp, function(i,o){
					if(!o) return;
					temp2 += out(path+d+o);
				});
				return temp2;
			}else{
				return out(src);
			}
			function out(src){
				if(src.indexOf('.swf') > 0){
					return '<a href="'+src+'" target="_blank"><embed wmode="transparent" width="'+n+'" height="'+n+'" type="application/x-shockwave-flash" src="'+src+'" /></a>';
				}else{
					return '<a href="'+src+'" target="_blank"><img view="'+src+'" src="'+src+'" height="1" onload="F.autoHeight(this,'+n+')" onerror="F.err(this)" /></a>';
				}
			}
		},
		upload: function(val,rs,set,tag,parArr,attr){//图片上传、选取
			var opt = F.cfg(set);
			if(!opt) opt = F.cfg('img');
			var id = 0, _upload = opt._upload, _check = opt._check;
			if(opt._attach){//附件
				id = rs && rs[opt._attach] ? rs[opt._attach] : 0;
				opt.$dbid = id;
				_check = 'hide';
			}

			//限定工号的情况
			opt.$dbuid = rs && rs[opt._uid] ? rs[opt._uid] : 0;
			if(opt.$dbuid && opt.$dbuid != MY.id){
				_upload = 'hide';
				_check = 'hide';
			}

			var readonly = opt._input === 'input' ? '' : ' disabled="true" ';//部分应用需要可输入状态
			if(opt._input === 'hide') readonly = ' style="display:none" ';

			tag = parArr && parArr[1] ? parArr[1] : tag;
			var up = _upload === 'hide' ? '' : '<a onclick="F.upload(\''+ set +'\',\''+ tag +'\')">['+ L.upload +']</a>&nbsp;';
			var ck = _check === 'hide' ? '' : '<a onclick="F.get(\''+ set +'\',\''+ tag +'\')">['+ L.filecheck +']</a>';
			var view = opt._view === 'hide' ? '' : '<span id="'+ tag +'View" class="viewObj">'+ F.getView(val,tag,opt) +'</span>';
			if(!attr) attr = 'size="'+ (opt.inputsize||30) +'"';
			var ret = opt._attach ? '<input name="upload_temp_val" value="'+ F.setPar(clone(opt)).path +'" type="hidden" />' : '';
			ret += '<input name="'+ tag +'" value="'+ val +'" '+ readonly + attr +' />'+ up + ck + view;
			return ret;
		},
		_tag: function(tag){
			if(tag && tag.indexOf('.') > 0){
				var s = '';
				tag = tag.split('.');
				$.each(tag, function(i,o){
					if(i == 0) return s += o;
					s += '['+ o +']';
				});
				tag = s;
			}
			return tag;
		},
		radio: function(val,rs,par,tag,pars,config){
			var set = COMM.checkRadioPar(par,tag,config), s = '', ck, name = '';
			if(typeof set == 'string') return set;
			$.each(set, function(i,o){
				i = TPL.$s(i);
				var ck = val == i || ( typeof pars=='object' && i == pars['default'] ) ? ' checked="true"' : '';
				s += '<label class="checkbox" style="margin-right:5px"><input type="radio" value="'+ i +'" name="'+ (pars && pars[1] && rs[pars[1]] ? 'data['+ rs[pars[1]] +']['+ tag +']' : (pars && pars[1] ? pars[1] :TPL._tag(tag))) +'"'+ ck +' />'+ o +'</label>';
			});
			return s;
		},
		checkbox: function(val,rs,par,tag,pars,config){
			var set = COMM.checkRadioPar(par,tag,config), s = '', ck;
			if(typeof set == 'string') return set;
			$.each(set, function(i,o){
				i = TPL.$s(i);
				ck = (','+val+',').indexOf(','+i+',') >= 0 ? ' checked="true"' : '';
				s += '<label class="checkbox" style="margin-right:5px"><input type="checkbox" value="'+ i +'" name="'+ (pars && pars[1] ? 'data['+ rs[pars[1]] +']['+ tag +']' : TPL._tag(tag)) +'"'+ ck +' />'+ o +'</label>';
			});
			return s;
		},
		$s: function(i){
			return i && typeof i == 'string' && i.indexOf('$s') === 0 ? i.replace('$s','') : i;
		},
		select: function(val,rs,par,tag,pars,config){
			var set = COMM.checkRadioPar(par,tag,config), name = pars && pars[1] && pars[1] !== 'search' ? 'data['+ rs[pars[1]] +']['+ tag +']' : TPL._tag(tag);
			var s = COMM.getSelect({
				'name': name,
				'def': val,
				'data': set
			});
			if(pars && pars[1] === 'search'){
				var i = TPL.o({set:set,name:name}, true);
				s = '<input onkeyup="TPL.selectSearch(this,TPL.o('+i+'))" size="5" placeholder="'+ L.btn.search +'" />'+ s;
			}
			return s;
		},
		newselect: function(val,rs,par,tag,pars,config){
			var set = COMM.checkRadioPar(par,tag,config), name = pars && pars[1] && pars[1] !== 'search' ? 'data['+ rs[pars[1]] +']['+ tag +']' : TPL._tag(tag);
			var s = '<span class="ipt-groups ipt_select" style="width:'+par+'px">';
			s += OA.select(set, tag, val);
			s += '</span>';
			return s;
		},
		selectSearch: function(my, d){
			var obj = $(my).parent().find('[name="'+ d.name +'"]'), v = my.value, sel, k, html;
			obj.find('option').remove();
			if(v) v = v.toUpperCase();
			$.each(d.set, function(i, o){
				k = i.toString();
				html = o.toString().toUpperCase();
				if(v == '' || k == v || html == v || k.indexOf(v) >= 0 || html.indexOf(v) >= 0){
					var r = COMM.optionTitle(o);
					if(k && k.indexOf('$s') === 0) i = k.replace('$s','');
					obj.append('<option value="'+ i +'"'+ (sel?'':' selected="true"') + r.tit +'>'+ r.v +'</option>');
					sel = 1;
				}
			});
			if(!sel) obj.append('<option value="">-nothing-</option>');
			if(v == '') obj.find('option[value="'+ obj.attr('defval') +'"]').attr('selected', true);
			obj.change();
		},
		timestr: function(fix, t1, t2){
			var n1 = fix ? fix+'[starttime]' : 'starttime', n2 = fix ? fix+'[endtime]' : 'endtime';
			return '<input onclick="D.init(this)" name="'+ n1 +'" value="'+ (t1 || '') +'" readonly="true" placeholder="请选取时间" />-&nbsp;<input onclick="D.init(this)" name="'+ n2 +'" value="'+ (t2 || '') +'" readonly="true" placeholder="请选取时间" />';
		},
		times: function(val,rs,par){//时间段(表单)
			if(par){
				rs.starttime = rs.starttime ? $D.date(par,rs.starttime) : rs.starttime;
				rs.endtime = rs.endtime ? $D.date(par,rs.endtime) : rs.endtime;
			}
			return TPL.timestr('', rs.starttime, rs.endtime);
		},
		dateCheck: function(v,rs,par,tag,aPar){
			var t = aPar && aPar.tip ? 'placeholder="'+ aPar.tip +'"' : '';
			return '<span class="input-group"><input readonly="readonly" onclick="D.init(this,\''+ par +'\')" value="'+ v +'" '+ t +' /></span>';
		},
		time: function(v,rs,par){//时间段(列表)
			if(par){
				rs.starttime = rs.starttime ? $D.date(par,rs.starttime) : rs.starttime;
				rs.endtime = rs.endtime ? $D.date(par,rs.endtime) : rs.endtime;
			}
			return '<i title="'+ L.time1 +'">'+ (rs.starttime || '') +'</i><br /><i title="'+ L.time2 +'">'+ (rs.endtime || '')+'</i>';
		},
		cases: function(s,rs,par,tag,parArr,config){//按radio设置显示内容
			var set = COMM.checkRadioPar(par,tag,config);
			if(typeof set == 'string') return set;
			if(s){
				if(s.indexOf(',') > 0){
					var r = [];
					$.each(s.split(','), function(i,o){
						if(typeof set[o] != 'undefined') r.push(set[o]);
					});
					return r.join('、');
				}else{
					if(typeof set[s] == 'undefined') return parArr && parArr[1] ? parArr[1] : '';
					return '<span class="case'+ s +'">'+ set[s] +'</span>';
				}
			}
			return '';
		},
		date: function(t, rs, par){//时期格式化
			if(t <= 0) return '';
			return $D.date(par, t);
		},
		dateLocal: function(t, rs, par){//客户端时区
			if(t <= 0) return '';
			return $D.date(par, t, 1);
		},
		chips: function(n, s){
			return '<span title="'+ (typeof(s)=='string' ? s : '') + COMM.numbers(n) +'">'+ COMM.number(n) +'</span>';
		},
		def: function(v, rs, p){
			return v != '' ? v : p;
		},
		color: function(v,rs,par,tag){//颜色选取框默认值
			if(v && v != '0'){
				if(v.indexOf('#') == -1) v = '#'+ v;
				if(par) return ' style="color:'+ v +'"';
				v = ' value="'+ v +'" style="border:1px solid #999;padding:1px;background:'+ v +'"';
			}else{
				v = '';
				if(par) return '';
			}
			var n = TPL.o('[name="'+ tag +'"]', true);//对于a[0][1]这样的标签浏览器支持不好
			return '<input type="button" value="'+ L.checkcolor +'" onclick="Color.init(this,TPL.o('+ n +'))" /><input name="'+ tag +'" size="6" title="'+ L.checkcolor +'" onclick="Color.init(this)"'+ v +' />';
		},
		dateGroup: function(d, rs){//按时间节点差异颜色
			d = $D.date('Y-m-d', d);
			if(rs.index == 0){
				VAR.dateGroup = d;
				return '';
			}
			if(VAR.dateGroup && VAR.dateGroup != d){
				VAR.dateGroup = d;
				return ' style="background:#efefef"';
			}else if(!VAR.dateGroup){
				VAR.dateGroup = d;
			}
			return '';
		},
		headpic: function(v, rs, par){
			var fix = 'http://by.oa.com/data/headpic/', src = fix + v +'.jpg';
			return '<img src="'+ src +'" width="'+ (par||30) +'" onerror="this.src='+ fix + '404.gif" />';
		},
		monthselect: function(val,rs,par,tag,pars,config){
			var set = COMM.checkRadioPar(par,tag,config), name = pars && pars[1] && pars[1] !== 'search' ? 'data['+ rs[pars[1]] +']['+ tag +']' : TPL._tag(tag);
			var s = '<span class="ipt-groups ipt_select" style="width:'+par+'px">';
			s += OA.month(set, tag, val);
			s += '</span>';
			return s;
		}
		
	};
	return TPL;
});