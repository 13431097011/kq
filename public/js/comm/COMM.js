/**
 * Copyright (c) boyaa.com
 * Developer - 安凌志
 * Last modify - 2012.04.18
 * Info - 全局功能函数
 */

var COMM = {
	editLock: function(un){//编辑解锁 在需要锁定的表单JS处加上：COMM.editLock();
		setTimeout(function(){//要等当前窗口的show方法执行完全
			if(un){//窗口类的show方法里执行
				if(VAR.editLock) $.JSON(CGI.ajax+'?cmd=editLock');//接口解锁
				VAR.editLock = 0;//标记解锁
			}else{
				VAR.editLock = 1;//锁
			}
		}, 500);
	},
	json: function(o){//同PHP的json_encode
		return $.toJSON(o);
	},
	unserialize: function(s){
		if(!s) return {};
		var r = {}, arr = s.split(',');
		$.each(arr, function(i,o){
			if(!o) return;
			o = o.split(':');
			r[$.trim(o[0])] = $.trim(o[1]);
		});
		return r;
	},
	init: function(){//各系统通用的启动函数
		M.cssInit();//CMS系统也有用到
		Tpl.prototype.pars = function(p){
			var ret = {}, arr = p && p.indexOf(',') ? p.split(',') : [p];
			$.each(arr, function(k,v){
				if(v && v.indexOf(':') > 0){
					v = v.split(':');
					ret[v[0]] = v[1];
				}else{
					ret[k] = v;
				}
			});
			return [arr[0], ret];
		};
		if(typeof sys_init == 'function') sys_init();
	},
	authApply: function(){
		var url = 'http://cms.oa.com/doc/170.html';
		if(!vars.auth_apply) return url;
		url = 'http://auth.oa.com/?sid='+ vars.newsso +'#apply';
		if(C.dev) url = 'http://vm.oa.com/auth/?sid='+ vars.newsso +'#apply';
		return url;
	},
	bug: function(user){
		var url = user ? location.href : SYS.refUrl('get');
		var str = user || vars.sysname != 'cms' ? '' : '<div style="margin-top:10px"><b style="color:blue">其它操作：</b><a href="'+ COMM.authApply() +'" target="_blank">【操作权限申请】</a><a onclick="M.close();SYS.helpLoad(\'help\', \'90%\', \'90%\')">【CMS基本操作图文演示】</a></div>';
		var h = user ? 280 : 300;
		str = '<table class="myTable left"><tr><td class="myTableLeft">当前地址：</td><td><input name="bugurl" value="'+ url +'" style="width:98%" disabled="true" /></td></tr><tr><td>List标题：</td><td><input name="bugtitle" value="" style="width:98%" /></td></tr><tr><td>反馈内容：<br><i>此内容将被作为list内容。</i></td><td><textarea name="bugcontent" style="width:98%;height:120px" placeholder="请输入反馈内容，同时会与技术人员发起RTX对话..."></textarea></td></tr></table><div class="myBtns"><input type="button" value="'+ L.btn.submit +'" onclick="COMM.bugsubmit()" /></div>'+ str;
		M.text(str, 600, 0, {title:'BUG反馈/技术咨询'});
	},
	bugsubmit: function(){
		M.confirm('确定操作？', function(){
			Msg.doing();
			$.getScript(vars.commurl+'data/langSid.js?'+ COMM.version('langSid'), function(){
				var t = $('[name=bugtitle]').val();
				var v = $('[name=bugcontent]').val();
				var langfix = L.config && vars.langfix && L.config[vars.langfix] ? L.config[vars.langfix] +'('+ vars.langfix +')' : '简体(th)';
				if(!t) return M.err('请输入反馈标题！');
				if(!v) return M.err('请输入反馈内容！');
				var data = {
					url: $('[name=bugurl]').val(),
					langfix: langfix,
					href: location.href,
					title: t,
					content: v,
					userAgent: navigator.userAgent,
					screen: screen.width+" X "+screen.height
				};
				$.POST(CGI.ajax+'?cmd=bug', data, function(ret){
					Msg.close();
					M.close();
					if(ret && ret.ok){
						M.alert(ret.msg, {width:400,height:160});
					}
				});
			});
		});
	},
	UC: function(name, val, opt){//全户选取插件封装用法
		return TPL.UC(val, '', '', name, opt);
	},
	uCheck: function(name, val, opt){//公司用户选取插件
		var id = COMM.fmtId(name);
		$o('#uc_'+id).uCheck(name, val, opt);
	},
	fmtId: function(s){
		return s.toString().replace(/\[|\]/g, '_');
	},
	unidArr: function(){
		if(!S.sameSite) S.sameSite = [S.id];
		if(S.sameSite && S.sameSite.length){
			var ret = {};
			$.each(S.sameSite, function(i,o){
				ret[o] = o+')'+L.S[o];
			});
			return ret;
		}
		return ['数据异常'];
	},
	notLogin: function(ret){//离线跳转
		S.id = S.id || getPar('sid');
		cookie('location_href', location.href);
		if(ret && ret.ssoUrl){
			location.href = ret.ssoUrl;
		}else{
			$.JSON(CGI.login+'?cmd=ssoUrl', function(ret){
				location.href = ret.ssoUrl;
			});
		}
	},
	page: function(opt){//CMS分页实例
		opt = obj(opt);
		var p = WIN[0].pageObj;
		if(!p){
			p = P.init('', WIN[0].appId);
			p.$appname = WIN[0].title;//方便调试时查看
			WIN[0].pageObj = p;//与应用属性关联
		}
		if(!opt.size){
			opt.size = int(cookie('pagesize'));
			if(!opt.size) opt.size = p.$size;
		}
		p.set(opt);
		return p;
	},
	version: function(name, t){//版本号处理
		if(!name) return vars.versions;
		if(t) cookie(name, M.microtime());
		t = cookie(name);
		if(!t){
			t = M.microtime();
			cookie(name, t);
		}
		return vars.versions + t;
	},
	apiSelect: function(name, evt, type){
		var data = {};
		$.each(S.apiArr, function(i,o){
			if(!S.apicked) S.apicked = i;
			if(type && o[1] != type) return;
			data[i] = i +' - '+ L.S[o[0]] +'('+ o[0] +')';
		});
		evt = 'COMM.apiSelectCb(this);'+ (evt||'');
		return COMM.getSelect(name, data, '<optgroup label="=请选择站点ID="></optgroup>', ' onchange="'+ evt +'"', S.apicked);
	},
	apiSelectCb: function(i){
		cookie('cmsApicked', i.value, {expires:365});
		S.apicked = i.value;
	},
	delApicked: function(){//切换站点时要重置这个缓存
		cookie('cmsApicked', 0, {expires:-1});
	},
	show: function(i){//显示区块切换
		var obj = $o('.myTable');
		if(i == 'all'){
			obj.show();
		}else{
			obj.hide();
			obj.eq(i).show();
		}
		COMM.setTitleAndOn();
	},
	setTitleAndOn: function(){
		$('a', WIN[0].left).removeClass('on');
		VAR.self.addClass('on');
		WIN[0].setGuid();
	},
	setAttr: function(table,set){//设置属性操作
		var obj = $o('.setAttr'),I,id,v,pic;
		if(!set) obj.hide();//无属性
		set = set.split(',');
		obj.each(function(i,o){
			I = $(this);
			if(i == 0){
				v = I.html('');
				$.each(set,function(ii,s){
					I.append('<i>'+s+'</i>');
				});
			}else{
				id = I.attr('id');
				v = I.html();
				I.html('');
				$.each(set,function(ii,s){
					pic = v && v.indexOf(s) >= 0 ? 'on.gif' : 'off.gif';
					I.append('<img src="'+SKIN.img+pic+'" class="app" fun="COMM.setAttrExec_'+table+','+id+','+s+'" />');
				});
			}
		});
	},
	setAttrExec: function(table,id,attr){
		Msg.doing();
		$.get(CGI.ajax+'?cmd=setAttr&table='+table+'&id='+id+'&attr='+encodeURI(attr),function(s){
			Msg.close();
			if(s == 'on' || s == 'off') VAR.self.attr('src',SKIN.img+s+'.gif');else Msg.err('操作失败！');
		});
	},
	openUrl: function(){//打开当前对象的地址，eq:<input class='dbl' fun='COMM.openUrl' .... />
		var url = VAR.self.val();
		if(url) window.open(url);
	},
	del: function(re,table,sign,callback){//删除或还原,表名,权限标签,回调函数
		SYS.del(CGI.ajax +'?cmd=del&table='+ table +'&key=id&sign='+ (sign || table), re, callback);
	},
	dels: function(re,table,sign,callback){
		SYS.del(S.cmsapi + table +'.php?cmd=del&table='+ table +'&sign='+ (sign || table), re, callback);
	},
	lock: function(re,table,cgi,callback){
		var ids = getCheckBox('ids');
		if(ids == ''){
			Error(L.nodata);
			return;
		}
		Msg.doing();//数据提交效果，同时锁屏
		cgi = cgi ? cgi : CGI.ajax;
		re = re ? 0 : 1;
		$.get(cgi +'?cmd=lock&table='+ table +'&lock='+ re +'&ids='+ ids,function(ret){
			Msg.close();
			$o('input[fun="checkAll_ids"]').attr('checked',false);
			COMM.suc(ret,function(){
				P.ref();
				if(typeof callback == 'function') callback();
			});
		});
	},
	sorts: function(v, rs, par){//模板函数
		return Sort.tplfun(v, rs, par);
	},
	sort: function(table, db){//排序
		Sort.exec(table, db);
	},
	suc: function(ret, fn){//操作结果显示
		if(!ret){
			if(!COMM._err) M.err('<b>[COMM.suc]</b><br>'+L.error);//去重
			COMM._err = 0;
		}else{
			try{ret.msg = eval(ret.msg)}catch(e){}
			if(ret.ok || (typeof ret == 'string') && (ret.indexOf('{ok}') >= 0 || ret.indexOf('"ok":1') > 0)){
				Msg.ok(ret.msg);
				if(typeof fn == 'function') fn(ret);
			}else if(ret.msg){
				Msg.err(ret.msg);
			}else if(typeof ret == 'string'){
				Msg.err(ret);
			}else{
				pp(ret);
			}
		}
	},
	jsonCb: function(ret, fn){
		if(!ret){
			Msg.close();
			M.err('<b>[COMM.jsonCb]</b><br>'+L.error);
			COMM._err = 1;
		}
		if(ret && ret._editLock) setTimeout(function(){
			var win = WIN[0];
			var from = WIN[0].from;
			var cf = function(){
				setTimeout(function(){
					if(win.model == 'window') win.close();
					SYS.appStr(from);
				}, 100);
			};
			Alert(ret._editLock, {width:400,closeFun:cf});
		}, 500);
		COMM.sucErr(ret && ret.msg ? ret.msg : '', function(){
			if(typeof fn == 'function') fn(ret);
		});
	},
	sucErr: function(s, f){
		s = s.toString();
		if(s.indexOf('notLogin') >= 0){
			Msg.close();
			M.err(L.notLogin, {callback:COMM.notLogin});
		}else if(s.indexOf('notAllow') >= 0){
			Msg.close();
			M.err(COMM.notAllowTip(s), {callback: function(){goTo(-1)}});
		}else{
			f();
		}
	},
	notAllowTip: function(s){
		var tag = s ? s.toString().split('notAllow')[1] : '';
		tag = tag ? '【'+ tag +'】' : '';
		var s = L.notAllow + tag;
		/*cms.only*/
		if(typeof U == 'undefined') s += '<br><i>点击右上方入口 <a href="'+ COMM.authApply() +'" target="_blank" style="color:green">权限申请</a> 可以自主申请权限！</i>';
		/*cms.only*/
		return s;
	},
	toHref: function(){//地址跳转
		var href = cookie('location_href');
		if(href){
			cookie('location_href','');
			location.href = href;
		}
	},
	clearInput: function(s){
		$o('[name='+s+']').val('');
	},
	appPar: function(o, t){//取应用默认参数：-1表示自增ID，非空表示自定义参数
		var r;
		if(o.par == '-1'){
			r = o.id;
		}else{
			r = typeof o.par != 'undefined' ? o.par : '';
		}
		if(t){//组装菜单的时候用到
			return r ? '_'+ r : '';
		}else{
			return r;
		}
	},
	applistLeft: function(set){//按VAR.applistArr来加载左侧菜单
		var opt = {
			'fun': '',//全部的时候使用
			'all': L.all,
			'fid': WIN[0].topid,
			'my': '',//当前应用，子菜单依附
			'child': '',//附加子菜单
			'del': 0,//回收站
			'del2': 0//子菜单回收站
		};
		if(set) $.extend(opt, set);
		var s = '<ul>', f, p, c, fun;
		if(opt.all && opt.fun) s += '<li><a class="app" fun="'+ opt.fun +'">'+ opt.all +'</a></li>';
		var arr = VAR.applistArr[opt.fid];
		if(arr){
			var fsign = VAR.applist[opt.fid] ? VAR.applist[opt.fid].sign : '';
			$.each(arr,function(i,o){
				if(o.notList == 1) return;//notList
				f = o.sign || opt.fun || fsign;
				if(!f) return;
				p = COMM.appPar(o, 1);
				if(APP[f] && APP[f].childmenu){
					c = '<ul></ul>';//写入空的子菜单，才有子菜单样式
					(f == opt.my) && (c = opt.child);//当前子菜单
				}else{
					VAR.applist[o.id]._fun = f;//提供给子菜单
					c = COMM.applistLeftChild(f, o.id, opt.del2);
				}
				if(o.blank){
					fun = 'target="_blank" href="'+ location.href.split('#')[0] +'#'+ f + p +'"';
				}else{
					fun = 'fun="'+ f + p +'"';
				}

				s += '<li><a class="app" '+ fun +'>'+ o.title +'</a>'+ c +'</li>';
			});
		}
		if(opt.del) s += '<li><a class="app" fun="'+ opt.fun +'_deled">'+ opt.del +'</a></li>';
		if(s == '<ul>' && opt.fid != 0){
			opt.fid = 0;
			COMM.applistLeft(opt);
			return;
		}
		WIN[0].loadLeft(s +'</ul>');
	},
	applistLeftChild: function(func,fid,del,useFun){//applist子栏目
		var s = '<ul>', y = false, f, p;
		var arr = VAR.applistArr[fid];
		if(arr){
			var fsign = VAR.applist[fid]._fun;//由上面提供
			$.each(arr, function(i,o){
				if(o.notList == 1) return;//notList
				y = true;
				f = o.sign || func || fsign;
				f = useFun ? func : f;
				p = COMM.appPar(o, 1);
				if(o.blank){
					fun = 'target="_blank" href="'+ location.href.split('#')[0] +'#'+ f + p +'"';
				}else{
					fun = 'fun="'+ f + p +'"';
				}
				s += '<li><a class="app" '+ fun +'>'+ o.title +'</a>'+ COMM.applistLeftChild(f,o.id,'',useFun) +'</li>';
			});
		}
		if(y && del) s += '<li><a class="app" fun="'+ fun +'_deled">'+ del +'</a></li>';
		return y ? s+'</ul>' : '';
	},
	cmsSelect: function(fid,name,model,def,attr){//cms栏目select
		if(fid && typeof fid == 'object'){//推荐使用对象传参
			var o = fid;
			fid = o.fid;
			name = o.name;
			model = o.model;
			def = o.def;
			attr = o.attr;
		}
		var temp = '<select '+ (attr||'') +' name="'+ name +'" onchange="COMM.ckCmsSelect()" must="'+L.selectCid+'"><option value="">'+L.selectCid+'</option>',o,i,c,ck,val;
		for(i in VAR.applistArr[fid]){
			o = VAR.applistArr[fid][i];
			if(model && o.sign && o.sign != model) continue;
			if(o.notList == 2) continue;//过滤特殊菜单(如：全部，回收站)
			val = COMM.appPar(o);//-1表示自增ID，非空表示自定义参数
			c = COMM.cmsSelectChild(o.id,C.str1,name,def,model,val);
			ck = typeof def != 'undefined' && def == val ? ' selected="true"' : '';
			temp += '<option fid="'+ fid +'" id="'+ o.id +'" child="'+ (c ? 1 : 0) +'" value="'+ val +'"'+ ck +'>|- '+ o['title'] +'</option>';
			temp += c;
		}
		temp += '</select>';
		return temp;
	},
	cmsSelectChild: function(fid,str,name,def,model,vals){
		var o = VAR.applistArr[fid],i,temp='',c,ck,val;
		for(i in o){
			if(o[i].notList == 2) continue;//过滤特殊菜单(如：全部，回收站)
			val = COMM.appPar(o[i]);//-1表示自增ID，非空表示自定义参数
			c = COMM.cmsSelectChild(o[i].id, str + C.str1, name, def, model, vals +','+ val);
			ck = typeof def != 'undefined' && def == val ? ' selected="true"' : '';
			temp += '<option fid="'+ fid +'" id="'+ o[i].id +'" child="'+ (c ? 1 : 0) +'" values="'+ vals +','+ val +'" value="'+ val +'"'+ ck +'>'+ str +'|- '+ o[i].title +'</option>';
			temp += c;
		}
		return temp;
	},
	ckCmsSelect: function(){//有子栏目的不让选中
		$o('select option[child=1]').attr('selected', false);
	},
	setCmsSelect: function(sel,fid,name,def,model){//加载cms的select
		$o(sel).html(COMM.cmsSelect(fid,name,model,def));
		COMM.ckCmsSelect();
	},
	count: function(){//输入字符统计
		$o('.count').remove();
		VAR.self.after('<i class="count">'+ l(L.inputcount,[VAR.self.val().length]) +'</i>');
	},
	repeat: function(s,t){//限制执行频率，默认为60秒 允许执行时返回false
		t = t ? t * 1000 : 60000;//毫秒
		var time = microtime();
		if(!VAR.repeatTemp[s]){
			VAR.repeatTemp[s] = time;
			return false;//允许
		}else{
			var ts = t - (time - VAR.repeatTemp[s]);
			ts = parseInt(ts/1000);
			if(ts > 0){
				Msg.err(l(L.toofast,[ts]));
				return true;//禁止执行
			}else{
				VAR.repeatTemp[s] = time;//更新时间
				Msg.clear();
				return false;//允许
			}
		}
	},
	setRadio: function(arr,rs,t){//设置radio的选中状态
		var n, v;
		$.each(arr,function(i,o){
			n = !rs || t ? i : o;
			v = rs ? rs[n] : o;
			$o('[name='+n+'][value='+v+']').attr('checked', true);
		});
	},
	setCheckbok: function(arr,rs){//设置checkbok的选中状态
		$.each(arr,function(i,o){
			if(rs && rs[o]){
				t = rs[o].split(',');
				$.each(t,function(ii,oo){
					$o('[name='+o+'][value='+oo+']').attr('checked', true);
				});
			}
		});
	},
	fastText: function(obj, data, add){
		var s = cookie('CMS_notice');
		s = s ? '<option value="0">'+ s +'</option>' : '';
		return COMM.getSelect('', data, add ? '<option value="">'+ add +'</option>'+ s : '', ' id="'+ obj +'" onchange="COMM.fastTextExec(this)" style="width:300px"');
	},
	fastTextExec: function(i){
		var o = $(i.id);
		if(!o[0]) return;
		var v = i.value ? $('option:selected', i).html() : '';
		$('option:selected', i).attr('selected', false);
		o.val(v).focus();
	},
	getSelect: function(name, data, add, attr, def, showId){//生成select
		var o;
		if(name && typeof name == 'object'){//推荐对象传参
			o = name;
		}else{//兼容原来的参数写法
			o = {'name': name, 'data': data, 'add': add, 'attr': attr, 'def': def, 'showId': showId};
		}
		var s = '<select defval="'+ (o.def||'') +'" name="'+ o.name +'"'+ (o.attr || '') +'>'+ (o.add || ''), ck;
		o.data = obj(o.data);
		$.each(o.data, function(i, v){
			i = TPL.$s(i);
			ck = typeof o.def != 'undefined' && o.def == i ? 'selected="true"' : '';
			if(o.showId) v = i +'-'+ v;
			var r = COMM.optionTitle(v);
			s += '<option value="'+ i +'"'+ ck +''+ r.tit +'>'+ r.v +'</option>';
		});
		return s +'</select>';
	},
	optionTitle: function(v){
		var tit;
		if(v && v.indexOf('|tit:') > 0){//支持显示title，以供搜索和提示
			v = v.split('|tit:');
			tit = ' title="'+ v[1] +'"';
			v = v[0];
		}else{
			tit = '';
		}
		return {'tit':tit, 'v':v};
	},
	loadSelect: function(name, data, def, add, attr){//加载select:名称,k-value对象,默认值
		var obj = $('#'+name+'Obj');
		obj.html(COMM.getSelect(name, data, add, attr));
		if(def) $('select option[value='+ def +']', obj).attr('selected', true);
	},
	mapSearch: function(n, i, tag){
		if(VAR.dl) VAR.dl.clear();
		if(!tag) tag = $(i).prev().attr('name');
		VAR.dl = new Delay(function(){
			COMM.mapSel(n, $(i).val(), '', 1, '', tag);
		}, 200);
	},
	mapSel: function(n, key, ret, ck, def, tag){
		var s = '', y = 0, err = '';
		if(!key && $.inArray(n, ['act']) >= 0) s += '<option value="">-请选择-</option>';
		$.each(VAR[n +'Map'], function(i,o){
			if(key && i.indexOf(key) < 0 && o.indexOf(key) < 0) return;//搜索不到
			if(VAR[n+'Arr'] && VAR[n+'Arr'][i]){//已经存在
				if(!y) y = i;
				return;
			}
			if(i>490 && i<501 && n == 'act') return;
			s += '<option value="'+i+'"'+ (def&&def==i?' selected="true"':'') +'>'+i+'-'+o+'</option>';
		});
		err = '编号['+ y +']已经存在，不可以重复操作！';
		if(ck && y) Msg.err(err);
		if(ret) return s;
		if(!s) s = ck && y ? '<option value="">'+ err +'</option>' : '<option value="">编号['+ key +']未曾注册</option>';
		$o('[name="'+ (tag||'pid') +'"]').html(s);
	},
	checkPackData: function(s){
		var d;
		switch(s){
			case 'prop': d = VAR.propMap; break;
			case 'sid': d = L.S; break;
			case 'wmode': d = VAR.wmodeMap; break;
			default: d = VAR[s+'Arr'];
		}
		return d;
	},
	checkpack: function(s,rs,par,name,pArr){//选取礼包
		if(pArr && pArr[1]) name = pArr[1];
		var d = COMM.checkPackData(par);
		if(!d) return;
		VAR['checkpack.'+ name] = s;
		var price = 0, priceArr = VAR[par+'priceArr'] || {}, r = '';
		if(rs && rs.model && rs.model == 'bagworking'){//兼容礼包工作台
			var more = (s.toString().indexOf(',') != -1) ? 1 : 0;
			r = s ? '<input type="hidden" name="'+ name +'" value="'+s+'" /><span class="viewObj checkpack"><b  class="app" fun="checkpack_'+par+','+name+',bagworking"><a></a>'+ ( more ? '多种' : d[s] ) +'</b></span>' : '<a class="app" fun="checkpack_'+par+','+name+',bagworking">['+L.filecheck+']</a>';
		}else{
			r = '<input '+ (par=='sid' ? 'must="'+ L.needcheck +'"' : '') +' name="'+ name +'" value="'+s+'" readonly="true" disabled="true" '+ (par=='sid'?'type="hidden"':'') +' /><span class="viewObj checkpack">';
		}

		if(s === 'all'){
			r += '<b>全平台通用</b>';
		}else if(s){
			if(rs && rs.model && rs.model == 'bagworking'){//兼容礼包工作台
				r += '';
			}else{
				s = s.toString().split(',');
				$.each(s, function(i,o){
					if(!o || !d[o]) return;
					if(priceArr[o]) price += int(priceArr[o]);
					r += '<b onclick="COMM.checkpackdel(this,'+ o +',\''+ par +'\',\''+ name +'\')"><a></a>'+ d[o] +'</b>';
				});
			}
		}
		r += (rs && rs.model && rs.model == 'bagworking') ? '' : '</span>&nbsp;<a class="app" fun="checkpack_'+par+','+name+'">['+L.filecheck+']</a>';//兼容礼包工作台
		if($.inArray(par,['prop','gift','levels']) >= 0){
			var el = $o('[name="'+ name +'"]')[0];
			if(el) setTimeout(function(){bagform.autoName(el)}, 100);
		}else if(par === 'real'){
			$o('[name="'+ name.replace('[val]', '[price]') +'"]').val(price);//实体对应游戏币量
		}
		return r;
	},
	checkpackdel: function(my, v, par, tag){//礼包移除
		var s = ','+VAR['checkpack.'+ tag]+',';
		s = s.replace(','+ v +',',',');
		s = s.replace(/^,|,$/g,'');
		$(my).parent().parent().html(COMM.checkpack(s,'',par,tag));

	},
	loadTblSel: function(tbl, opt){//加载数据表select
		opt = opt || {};
		var i, tb = {}, s, begin = opt.i || 0;
		for(i = begin; i > -MY.tblnum; i--){
			s = tbl + $D.diff(i, 'Ymd');
			tb[s] = s;
		}
		if(opt.tbl) opt.add = '<option value="'+ tbl +'">'+ tbl +'</option>';//不带日期的表名要加载出来
		if(opt.chg) opt.evt = 'onchange="U.commInit(1)"';//change事件
		COMM.loadSelect(opt.name || 'table', tb, opt.def, opt.add, opt.evt);//name, data, def, add, evt
	},
	replace: function(s){
		if(s && typeof s == 'string') s = s.replace(/DKHL/g, '{').replace(/DKHR/g, '}');
		return replaceVars(s, S);
	},
	oneCid: function(cid,tit){//下拉框无子栏目时特殊处理
		var sel = $o('select[name=cid]');
		if($('option',sel).length > 1) return;
		sel.parent().html('<input type="hidden" value="'+ cid +'" name="cid" />'+ (tit || cid) + '<i>('+ cid +')</i>');
	},
	nums: function(n, s){
		return '<'+ s +' title="'+ COMM.numbers(n) +'">'+ COMM.number(n) +'</'+ s +'>';
	},
	number: function(n){//逗号分隔数据
		if($.inArray(S.langfix, ['id','vn']) >= 0){
			return number_format(n, 0, ',', '.');
		}else{
			return number_format(n, 0, '.', ',');
		}
	},
	numbers: function(n){//逗号分隔中文数据
		if(!n) n = 0;
		if(!n || n.length < 4) return n;
		n = n.toString();
		var fh = n.charAt(0) == '-' ? '-' : '';
		if(fh) n = n.replace('-', '');
		var l = n.length - 1, i, r = n.charAt(l), s = ['万','亿','万亿','亿亿'], si = 0;
		for(i = 1; i <= l; i++){
			if(i % 4 == 0){
				r = (' '+s[si++]+' ' || '') + r;
			}
			r = n.charAt(l-i) + r;
		}
		return fh + r;
	},
	checkRadioPar: function(par, tag, config){//tpl修饰函数radio参数检测
		var set;
		if(config && typeof config == 'object'){//直接传参
			set = config;
		}else{
			if(par && par.indexOf('.') > 0){//直接取全局属性，如：VAR.adminuser
				try{
					eval('par='+par);
					return par;
				}catch(e){
					return Msg.err('[COMM.checkRadioPar]'+ par);
				}
			}
			try{
				set = eval(par+'.radio');//取当前应用的radio配置
			}catch(e){
				return Msg.err('[COMM.checkRadioPar]'+ par +'.radio');
			}
		}
		if(!set || !set[tag]){
			if(tag && tag.indexOf('.') >= 0){//参照flashui的mark用法
				var tag2 = tag.split('.')[0];
				if(set && set[tag2]) return set[tag2];
			}
			tag = par +'.radio.'+ tag;
			Msg.err('[COMM.checkRadioPar] 配置错误：【'+  tag + '】');
			return tag;
		}else{
			return set[tag];
		}
	},
	actLeft: function(sign, del, fn){
		$.getScripts([PATH.data +'act/'+S.id+'.js?'+ COMM.version('actArr'), PATH.data +'map/act.js?'+ COMM.version('map.act')], function(){
			sign = sign || 'actSet';
			var s = '<ul>', tit;
			if(sign == 'bag' || sign == 'paypop') s += '<li><a class="app" fun="'+ sign +'">'+ L.all +'</a></li>';
			if(L.actmap) $.extend(VAR.actMap, L.actmap);//扩展翻译
			if(VAR.actArr){
				$.each(VAR.actArr, function(i,o){
					s += '<li><a class="app" fun="'+ sign +'_'+ i +'"><i>'+ i +')</i>'+ (VAR.actMap[i] || '[err]'+i) +'</a></li>';
				});
			}
			if(del) s += '<li><a class="app" fun="'+ sign +'_deled">'+ L.deled +'</a></li>';
			s += '</ul>';
			if(typeof fn == 'function'){
				fn(s);
			}else{
				WIN[0].loadLeft(s);
			}
		});
	},
	actsLeft: function(opt){
		var set = {
			'sign': '',//应用标识
			'del': 0,//回收站
			'init': '',//自定启动函数
			'open': 0,
			'atype': ''//活动属性类型1普通2会员3召回
		};
		if(opt) $.extend(set, opt);
		if(vars.api==2){//移动
			$.getScripts([PATH.data +'map/mbact.js?'+ COMM.version('mbactMap'), PATH.data +'map/act.js?'+ COMM.version('map.act')], function(){
				var sign = set.sign, s = '<ul>', tit;
//				if(sign == 'bag' || sign == 'paypop') s += '<li><a class="app" fun="'+ sign +'">'+ L.all +'</a></li>';
				if(L.actmap) $.extend(VAR.mbactMap, L.actmap);//扩展翻译
				if(VAR.mbactMap){
					var one = 0;
					var loadstr = function(){
						var s = '', c;
						if(!VAR.mbactMap) return s;
						$.each(VAR.mbactMap, function(i,o){//['pid','atype']
							s += '<li><a class="app'+ (!one?' firstNood':'') +'" fun="'+ sign +'_'+ i +'"><i>'+ i +')</i>'+ (o || '[err]'+i) +'</a></li>';
							if(!one) one = 1;
						});
						return s;
					};
					s += '<li><a class="openChild">==移动礼包==</a><ul>'+ loadstr() +'</ul></li>';
				}

//				if(set.del) s += '<li><a class="app" fun="'+ sign +'_deled">'+ L.deled +'</a></li>';
				s += '</ul>';
				if(typeof set.init == 'function'){
					set.init(s);
				}else{
					WIN[0].loadLeft(s);
				}
				if(typeof set.callback == 'function') set.callback();
				if(!PAR && set.open && !WIN[0].leftFirstTime){
					$('a.openChild',WIN[0].left).click();
					WIN[0].leftFirstTime = 1;
				}
			});
		}else{//PC
			$.getScripts([PATH.data +'act/'+S.id+'s.js?'+ COMM.version('actsArr'), PATH.data +'map/act.js?'+ COMM.version('map.act')], function(){
				var sign = set.sign, s = '<ul>', tit;
				if(sign == 'bag' || sign == 'paypop') s += '<li><a class="app" fun="'+ sign +'">'+ L.all +'</a></li>';
				if(L.actmap) $.extend(VAR.actMap, L.actmap);//扩展翻译
				if(VAR.actArrs){
					var one = 0;
					var loadstr = function(n){
						var s = '', c, list = VAR.applistArr[COMM.appId('act')];
						if(!VAR.actArrs[n]) return s;
						var tit = {};
						$.each(list, function(i,o){
							tit[o.par] = o.title;
						});
						$.each(VAR.actArrs[n], function(cid, arr){
							c = '';
							$.each(arr, function(i,o){//['pid','atype']
								var name = VAR.actMap[o[0]] || (int(o[0])>=2000 ? o[1] : '[err]'+o[0]);
								c += '<li><a class="app'+ (!one?' firstNood':'') +'" fun="'+ sign +'_'+ o[0] +'"><i>'+ o[0] +')</i>'+ name +'</a></li>';
								if(!one) one = 1;
							});
							s += '<li><a class="openChild">'+ tit[cid] +'</a><ul>'+ c +'</ul></li>';
						});
						return s;
					};
					s += '<li><a class="openChild">==在线活动==</a><ul>'+ loadstr(1) +'</ul></li>';
					s += '<li><a class="openChild">==过期活动==</a><ul>'+ loadstr(0) +'</ul></li>';
				}

				if(set.del) s += '<li><a class="app" fun="'+ sign +'_deled">'+ L.deled +'</a></li>';
				s += '</ul>';
				if(typeof set.init == 'function'){
					set.init(s);
				}else{
					WIN[0].loadLeft(s);
				}
				if(typeof set.callback == 'function') set.callback();
				if(!PAR && set.open){
					WIN[0].openAll();
				}
			});
		}
	},
	appId: function(s){
		if(APP[s]) return APP[s].id;
		return C.id[s] || 0;//兼容
	},
	allow: function(node){
		if(!MY.allow) return false;
		node = node.toString();
		if($.inArray('*',MY.allow) != -1 || (','+MY.sidstr+',').indexOf(','+node+',') >= 0) return true;//所有权限 或 站点权限判断
		var i, o, str;
		for(i in MY.allow){
			o = MY.allow[i];
			if(!o) continue;//有时候权限里面会出现null
			o = o.toString();
			if(o == node) return true;
			if(o.indexOf(node+'.') >= 0) return true;//o:gift.add, node:gift
			if(node.indexOf('.') > 0){//o:gift.*, node:gift.add
				str = node.replace(/\.[^.]+$/, '');
			}else if(node.match(/\d+$/)){
				str = node.replace(/\d+$/, '');
			}else{
				str = node;
			}
			if(str +'.*' == o) return true;
		}
		return false;
	},
	adminIo: function(obj){//操作权限应用
		$('.group_'+ MY.gid, LOCAL).removeClass('group');//用户组对应权限
		obj = obj ? obj : LOCAL;
		if(MY.allow && MY.allow[0] == 'root'){
			$('.admin', obj).removeClass('admin');
			return;
		}
		if(!VAR.allowArr) return;
		$.each(VAR.allowArr, function(i,o){//data/admin.js
			if(COMM.allow(o)) $('.'+ o.replace('.','_'), obj).removeClass('admin');
		});
	},
	statusCg: function(i){
		$o('#dayObj').css('display', $.inArray(i.value, ['1','2']) >= 0 ? '' : 'none');
		$o('#snstatusObj').css('display', $.inArray(i.value, ['3']) >= 0 ? '' : 'none');
		$o('#clearObj').css('display', i.value == 3 ? '' : 'none');
		$o('#gagObj').css('display', $.inArray(i.value, ['0','10']) >= 0 ? '' : 'none');
		$o('#unlocktipObj').css('display', $.inArray(i.value, ['10']) >= 0 ? '' : 'none');
	},
	status: function(v, rs, par){//状态
		v = v == 0 ? 10 : v;
		if(v == 1 && (!rs.mver || rs.mver == '0')) v = 3;//永久封杀
		var tag = v == 10 ? 'b' : 'u', ret = '<'+ tag +' class="m0">'+ (L.user.statusall[v] || v) +'</'+ tag +'>';
		if(par == 'lock' && tag == 'b') ret = '';
		return ret + (rs.mver && (v == 1 || v == 2) ? '<i>('+ rs.mver +')</i>' : '');
	},
	uHref: function(mid, hash, diy){
		return CMS_PATH +'user/?sid='+ (getPar('sid') || S.id) +'&server='+ vars.server +'&api='+ vars.api + (diy||'') +'&mid='+ mid +'#'+ (hash||'info');
	},
	mid: function(v, rs, par, tag, pars){
		var href = COMM.uHref(v);
		if(par == 'href') return href;
		var name = rs && par && rs[par] ? rs[par] : v;
		if(v == 0) return pars && pars[1] ? pars[1] : '';
		return '<a href="'+ href +'" target="_blank">'+ name +'</a>';
	},
	handcardType: function(v, rs, par){//bonus手牌类型
		type = {1:'AA',	2:'同花AK', 3:'同花AQ或者AJ',4:'非同花的AK',5:'对J到对K',6:'非同花AQ或者AJ',7:'对2到对10',8:'手牌的同花顺子',9:'手牌的同花',10:'手牌的顺子',11:'杂牌'};
		return type[v];
	},
	winType: function(v, rs, par){//bonus输赢类型
		type = {0:'打牌输',1:'平',2:'小赢',4:'打赢',8:'bonus赢',16:'bonus输'};
		return type[v];
	},
	firstwinType: function(v, rs, par){//bonus首注输赢类型
		type = {1:'杂牌',2:'高牌',3:'一对',4:'两对',5:'三条',6:'顺子',7:'同花',8:'葫芦',9:'四条',10:'同花顺',11:'皇家同花顺'};
		return type[v];
	},
	roundInfo: function(v, rs, par){//bonus轮次类型
		type = {0:'停止状态',1:'准备阶段',2:'首注阶段',3:'翻牌阶段',4:'转牌阶段',5:'河牌阶段',6:'结束阶段'};
		return type[v];
	},
	lockHead: function(reset){
		$o('.lockHeadTbl').remove();
		var o = $o('tr.myTableTitle');
		if(!o[0]) return;
		if(reset || !WIN[0].scrollLock){
			o.find('td').each(function(){
				$(this).width($(this).width());
				$(this).height($(this).height());
			});
			var cls = o.parent()[0].tagName == 'TBODY' ? o.parent().parent().attr("class") : o.parent().attr("class");
			cls += ' lockHeadTbl';
			RIGHT.prepend('<table class="'+ cls +'" style="position:absolute;display:none"><tr class="myTableTitle">'+ o.html() +'</tr></table>');
			WIN[0].scrollLock = $o('.lockHeadTbl');
		}
		RIGHT.scroll(function(){
			var oo = WIN[0].scrollLock;
			if(!oo) return;
			if(o.position().top <= 0){
				oo.css('top', RIGHT.scrollTop()).show();
			}else{
				oo.hide();
			}
		});
	},
	maxlen: function(v, o){
		if(!v) return true;
		var ml = o.attr('maxlen');
		if(!ml) return true;
		if(v.length > ml){
			o.focus();
			var tip = o.attr('errtip') || '输入长度#0超过限制长度#1';
			return l(tip,[v.length, ml]);
		}
		return true;
	},
	nextDay: function(o, day, str, fn){//绑定对象,加减天数,格式,回调函数
		VAR.dateDiff = day;//用于判断相关逻辑
		var t = $D.diff(day, str, o.val());
		o.val(t);
		if(typeof fn == 'function') fn();
	},
	setNumber: function(i, max){
		var v = int(i.value,0);
		if(max) v = Math.min(int(max,0), v);
		i.value = v;
	},
	vipCfg: function(d){
		var r = {};
		if(d) r = d;
		if(!LL.user.vipCfg) return r;
		$.each(LL.user.vipCfg, function(i,o){
			r[o] = L.user.vip[o] || 'vip'+o;
		});
		return r;
	},
	fullshow: function(i){
		var n = 'fullshow', t;
		if(i === 1){
			VAR.fullshow = int(cookie(n));
		}else{
			VAR.fullshow++;
			cookie(n, VAR.fullshow, {expires:30});
		}
		$('#fullshowcss').remove();
		t = VAR.fullshow % 2;
		$(document.body).append('<style id="fullshowcss">.fullshow{display:'+ (t ? 'none' : '') +'}</div>');
		t = L['fullshow'+ t];
		if(i === 1){
			return t;
		}else{
			typeof i == 'object' ? $(i).html(t) : VAR.self.html(t);
		}
	},
	ajax: function(p, f){
		var k = f;
		if(typeof f != 'function') f = function(ret){
			Msg.close();
			COMM.suc(ret);
		};
		if(k === 'cfg' || k === 'online'){
			Confirm('此操作是影响线上环境，请确认？', exec);
		}else{
			exec();
		}
		function exec(){
			Msg.doing();
			if(k && typeof k == 'string') p += '&cfgpath='+ k;
			$.JSON(CGI.ajax +'?cmd='+ p, f);
		}
	},
	mousePos: function(ev){
		if(ev.pageX || ev.pageY) return {x:ev.pageX, y:ev.pageY};
		return {
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:ev.clientY + document.body.scrollTop - document.body.clientTop
		};
	},
	fmtNum: function(v){//支持千分位、小数点和指定末位单位
		if(v === 0) return v;
		v = $.trim(v.toString().toUpperCase());
		var len = v.length;
		if(!len) return '';
		var num = v.substring(0,len-1).replace(/[^0-9.,]/g, ''), last = v.charAt(len-1);
		if(isNaN(last) && $.inArray(last,['K','W','M','B']) == -1) last = '';
		return num + last;
	},
	autoNum: function(i){
		var v = $(i).val();
		i.value = COMM.fmtNum(v);
	},
	autoInt: function(i, f){
		var v = $(i).val(), re = f ? /[^0-9.]/g : /[^0-9]/g;
		if(v){
			v = $.trim(v);
			var fu = v.charAt(0) === '-';//负数
			v = v.replace(re, '');
			if(fu) v = '-'+ v;
		}
		i.value = v;
	},
	autoChar: function(i){
		var v = $(i).val();
		if(v) v = v.replace(/[^0-9a-zA-Z_.:|]/g, '');
		i.value = v;
	},
	autoTimes: function(my){
		var v = $.trim(my.value), re = /[^0-9,:\-]/g;
		if(v) v = v.replace(/，/g, ',').replace(re, '');
		var ck = COMM.ckTimes(v, true);
		if(ck.indexOf('错误') >= 0) return Msg.err(ck);
		my.value = ck;
		Msg.clear();
	},
	ckTimes: function(v, ret){
		var arr = v.split(','), arr2, err = '';
		var fmt = function(t){
			if(!t) return false;
			t = t.split(':');
			t[0] = int(t[0]);
			if(t[0] > 23 || t[0] < 0){
				echo('COMM.ckTimes', '0<'+ t[0] +'<23');
				return false;
			}
			t[1] = int(t[1]);
			if(t[1] > 59 || t[1] < 0){
				echo('COMM.ckTimes', '0<'+ t[1] +'<59');
				return false;
			}
			if(t[0] < 10) t[0] = '0'+ t[0];
			if(t[1] < 10) t[1] = '0'+ t[1];
			return t.join(':');
		};
		$.each(arr, function(i,o){
			if(o && o.indexOf('-') >= 0){
				arr2 = o.split('-');
				arr2[0] = fmt(arr2[0]);
				arr2[1] = fmt(arr2[1]);
				if(arr2.length !== 2 || !arr2[0] || !arr2[1]){
					err = o;
					//echo('COMM.ckTimes', 'b', arr2);
					return false;
				}
				if(arr2[1] < arr2[0]){
					err = o;
					//echo('COMM.ckTimes', arr2[1] +'<='+ arr2[0]);
					return false;
				}
				arr[i] = arr2.join('-');
			}else if(o && o.indexOf('-') < 0){ //支持类似00:01,01:00的单个时段
				var single = fmt(o);
				if(!single){
					err = o;
					return false;
				}
				arr[i] = single;
			}else{
				err = o;
				//echo('COMM.ckTimes', 'c', o);
				return false;
			}
		});
		if(err) return '输入时段格式错误：'+ err;
		return ret === true ? arr.join(',') : true;
	},
	applist: function(s){//COMM.applist('tables')
		var d = VAR.applistArr[COMM.appId(s)], r = {};
		if(!d) return r;
		$.each(d, function(i,o){
			if(o.par !== '') r[o.par] = o.title;
		});
		return r;
	},
	chips2Char: function(v){//将数字值转为带单位的值
		var x = LL.chips2Char.x, arr = LL.chips2Char.unit, s = '';
		v = int(v);
		if(v < x) return v;
		$.each(arr, function(i,o){
			if(v % x === 0){
				v = v / x;
				s = arr[i];
			}
		});
		return v + s;
	},
	checkIp: function(ip){//IP格式检测
		if(!ip) return;
		var arr = ip.split('.');
		if(arr.length != 4) return;
		var i, n;
		for(var i = 0; i < 4; i++){
			n = parseInt(arr[i]);
			if(isNaN(n) || n < 0 || n > 255) return;
		}
		return 1;
	},
	childSidSel: function(name, add, evt, def){
		if(def === true && !S.sameSite) S.sameSite = [S.id];
		if(S.sameSite && S.sameSite.length){
			if(!add) add = '<option value="">==请选择站点ID==</option>';
			var sid2 = '<select name="'+ name +'" '+ (evt||'') +'>'+ add;
			$.each(S.sameSite, function(i,o){
				sid2 += '<option value="'+ o +'">'+ (L.S[o] || o) + '('+ o +')' +'</option>';
			});
			sid2 += '<option value="79">'+ L.visitor +'</option><option value="233">'+ L.bymbpass +'</option><option value="237">'+ L.mbTwitter +'</option><option value="238">'+ L.mbYahoo +'</option>';
//			if($.inArray(S.langfix, ['th', 'tl' ,'zh'])) sid2 += '<option value="79">游客79</option>';
			return sid2 +'</select>';
		}
		return def || '';
	},
	sidGetLang: function(sid){
		if(!VAR.langSid) return '';
		var lan = '';
		sid = int(sid);
		$.each(VAR.langSid, function(l, o){
			if($.inArray(sid, o) >= 0){
				lan = l;
				return false;
			}
		});
		return lan;
	},
	addRow: function(i, add){
		i = $o(i).parent();
		if(add){
			i.after(i.clone());
		}else{
			i.remove();
		}
	},
	permissAPI: function(api){//更新权限树
		/*cms.only*/
		$.JSON(PATH.api +'auth.php?api='+ (api||0));
		/*cms.only*/
	},
	getLang: function(v, f){
		if(!v) return;
		var version = Math.random();
		$.getScript(PATH.data+'L/'+ v +'.js?v'+ version, function(){
			if(f && typeof(f) == 'function') f();
			$.getScript(PATH.data+'L/'+ vars.langfix +'.js?v'+ version);
		});
	},
	fmtHrGroup: function(data, def, user){//格式化HR组织架构
		var $group = {},		//fid为大KEY，包括所有子部门
			$radio = def || {},	//有分层级展示的一维数组
			$full = {},			//部门ID对应的完整路径
			aCfg = {};
		if(data){
			$.each(data, function(i,o){
				if(!$group[o.fid]) $group[o.fid] = [];
				if(user && user[o.id]) o.user = user[o.id];//直属成员
				$group[o.fid].push(o);
				aCfg[o.id] = o;
			});
			var getFull = function(id){
				var r = [], o;
				while(1){
					o = aCfg[id];
					if(!o) break;
					r.unshift(o.name);
					id = o.fid;
				}
				return r.join('/');
			};
			var setFid = function(fid, str){
				if(!$group[fid]) return;
				$.each($group[fid], function(i,o){
					$full[o.id] = getFull(o.id);
					$radio['$s'+o.id] = str + o.name + '|tit:'+ $full[o.id];
					setFid(o.id, str +'........');
				});
			};
			setFid(1, '');
		}
		return {'group':$group, 'radio':$radio, 'full':$full};
	}
};
