/**
 * Copyright (c) zmr8.com
 * Developer - 安凌志
 * Last modify - 2012.01.19
 * Info -模板操作类(基于JQ)
 */
define(function(require){
	window.replaceVars = require('./fn.replaceVars');
	var Tpl = function(obj){
		var I = this;
		I.obj = obj;//范围对象
		I.tpl = typeof obj == 'object' ? obj.html() : '';//模板
		I.content = '';//内容
		I.data = {};//数据
		I.config = '';//配置
		I.funBase = '';//处理函数前缀

		//兼容修复数据
		I.repair = function(){
			I.tpl = I.tpl.replace(new RegExp("\r?\n","g"),"").replace(new RegExp("\t","g"),"").replace(new RegExp('}="">','g'),'}>').replace(new RegExp('%7B','g'),'{').replace(new RegExp('%7D','g'),'}');//代码修正(火狐下)
			var ie = navigator.userAgent.indexOf("MSIE") > 0 ? /(\s+\w+=)('|")?(.*?)('|")?(?=\s+\w+=|\s*>|\s*\/>)/gi : "";
			if(ie){
				I.tpl = I.tpl.replace(ie,"$1\"$3\"");//还原IE下html属性双引号
				I.tpl = I.tpl.replace(/\s\{css\}\">/g, ' {css}>');//修复IE8下翻页插件的BUG
			}
		};

		I.node = function(){
			I.$node = arguments;
		};

		//加载数据前，快速删除标签
		I.before = function(){
			if(!I.tpl) return;
			I.repair();
			var s = I.tpl;
			s = s.replace(/{([^$}]*)}/g, '');
			s = s.replace(/{([^}]*)}(.*?){\/\1}/g, '');
			I.obj.html(s);
		};

		//执行模版替换
		I.exec = function(){
			if(!I.tpl){
				if(typeof console == 'object') console.log('#Error:tpl is empty!');
				return false;
			}
			I.repair();
			I.tpl = I.tpl.replace(new RegExp('<!--','g'),'').replace(new RegExp('-->','g'),'');//删除注释标签，本系统注释是用来写模板的，为了让标签不显示出来
			I.content = I.reLabel(I.tpl,I.data);//简单变量标签
			I.content = I.content.replace(/DKHL/g,'{').replace(/DKHR/g,'}');//暂还原大括号
			I.content = replaceVars(I.content);
			return true;
		};

		//块标签替换
		I.reLabels = function(tpl,data){
			var re = /{([^}]*)}(.*?){\/\1}/, e = tpl.match(re), s, d, No = 1, tmp;
			while(e && e[1] && e[2]){//e[0]是整个标签 e[1]是标签名 e[2]是标签内部字符
				s = '';
				d = I.getDb(data, e[1]);
				d = typeof d == 'undefined' ? null : d;
				if(d){//有数据
					if(typeof d == 'object'){//数组
						$.each(d, function(k, o){
							if(typeof o != 'object') o = {'value':o};
							o.index = k;
							o.No = No++;
							tmp = I.reLabel(e[2], o, 1);//一条记录处理结果
							if(tmp){
								if(tmp.indexOf('tpl.continue') > 0) return;
								if(tmp.indexOf('tpl.break') > 0) return false;
							}
							s += tmp;
						});
					}else{//简单数据
						s += I.reLabel(e[2], d);
					}
				}
				tpl = tpl.replace(e[0],s);//删除已经替换好的标签
				e = tpl.match(re);//进行下一个标签的处理
			}
			return tpl;
		};

		I.reLabel = function(tpl,rs,child){//标签替换
			tpl = I.reLabels(tpl,rs);//子块标签
			var re = /{([^$}]*)}/g, e = tpl.match(re), s = '', f, par, arr, val;
			if(!e) return tpl;
			$.each(e,function(i,o){
				if(tpl.indexOf(o) < 0) return;
				s = o.replace(/^{|}$/g,'');
				if(s && s.indexOf('|') > 0){//自定义函数
					arr = s.split('|');
					f = s.replace(arr[0]+'|','');
					s = arr[0];
					if(f.indexOf('_') > 0){//自定义参数
						arr = f.split('_');
						par = f.replace(arr[0]+'_', '');//第一个下划线为分隔符，支持存在下划线的参数
						f = arr[0];
					}else{
						par = '';
					}
					if(typeof I.funBase == 'object' && typeof I.funBase[f] == 'function'){
						f = I.funBase[f];
					}else{
						if(f.indexOf('.') < 0 && I.funBase) f = I.funBase +'.'+ f;
						try{eval('f='+f)}catch(e){alert(e)};
					}
				}else{
					f = '';
				}
				val = I.getDb(rs,s);
				val = typeof val == 'undefined' ? '' : val;
				if(typeof f == 'function'){
					par = typeof I.pars == 'function' ? I.pars(par) : I.par(par);//pars为CMS扩展的函数
					val = f(val, rs, par[0], s, par, I.config);//值,数据,标签字符自定参数,标签名,自定参数数组,配置(radio)
				}
				while(tpl.indexOf(o) >= 0 && o != val){//替换所有标签(正则不好写)，如果标签与值一样，会是死循环，所以要判断下
					tpl = tpl.replace(o, val);
				}
				//if(child && I.test) console.log(o, "\n", val, "\n", tpl, "\n\n");
			});
			return tpl;
		};

		I.par = function(p){
			return p && p.indexOf(',') ? p.split(',') : [p];
		};

		I.check = function(ret,cb){//返回数据检测
			if(!ret || !ret.ok){
				cb = typeof cb == 'function' ? cb : function(e){M.err(e)};
				if(ret && ret.msg) cb(ret.msg);
				return false;
			}
			return true;
		};

		I.fetch = function(){
			if(I.exec()){
				return I.content;
			}else{
				return '';
			}
		};

		I.display = function(opt){
			if(I.$node){//多组模板标签，一次性解析
				var obj, base;
				if(!I.$nodeTpl) I.$nodeTpl = {};
				$.each(I.$node, function(i,sel){
					if(i == 0){
						base = sel;
						return;
					}
					obj = $(sel ,base);
					if(typeof I.$nodeTpl[sel] == 'undefined') I.$nodeTpl[sel] = obj.html();
					I.tpl = I.$nodeTpl[sel];
					obj.html(I.fetch());
				});
				return;
			}
			if(!opt || !opt.data){//输出
				I.obj.html(I.fetch());
			}else{
				/* 设置参数并输出(包括分页)
				 * 分页模板可留空，使用默值认值，见下方对应的模板逻辑。
				 * 对应样式：page_first page_back page_next page_last
				 * 使用示例：
				 *
					var tpl = new Tpl($o('.xxx'));
					tpl.display({
						data: {},			//模板数据
						pageSet: {
							sel: '.page',	//可以为JQ对象(可以不在主框内)，也可以为JQ选择符(必须要在主框内)
							page: 1,		//第几页
							size: 10,		//每页数
							all: 100,		//总数
							lan: [false,'上一页','下一页',false],	//默认值为lang.page，若不要显示对应标签，对应值传参false
							callback: ''	//翻页回调函数
						}
					});
				*/
				I.data = opt.data;
				if(opt.funBase) I.funBase = opt.funBase;
				var p = opt.pageSet;
				if(p && (p.callback || opt.funPage)){//有分页
					if(!p.page) p.page = 1;
					if(opt.funPage) p.callback = opt.funPage;
					if(!I.pg || !I.pg2){//分页模板只实例化一次
						var o = p.sel;//若分页在主对象内部，请使用jq选择符，否则使用目标jq对象
						if(typeof o == 'string') o = $(o, I.obj);//内部分页
						I.pg = new Tpl(o);
						I.pg.tpl = p.tpl || o.html();
						if(!I.pg.tpl){//分页模板
							var s = '', lan = p.lan || lang.page || ['','','','',''];
							if(lan[4]) s += lan[4];
							if(lan[0] !== false) s += '<a href="javascript:{p.first}" class="page_first">'+ lan[0] +'</a>';//首页
							if(lan[1] !== false) s += '<a href="javascript:{p.back}" class="page_back">'+ lan[1] +'</a>';//上一页
							s += '{p.body}<a href="javascript:{url}"{css}>{page}</a>{/p.body}';//主体
							if(lan[2] !== false) s += '<a href="javascript:{p.next}" class="page_next">'+ lan[2] +'</a>';//下一页
							if(lan[3] !== false) s += '<a href="javascript:{p.last}" class="page_last">'+ lan[3] +'</a>';//尾页
							I.pg.tpl = s;
						}
						I.pg2 = P.init(p);//分页类
					}else{
						I.pg2.set(p);//更新分页参数
					}
					I.pg.data.p = I.pg2.getObj();
				}
				I.display();//一定要等分页的模板获取后才可以执行主页面输出
				if(I.pg && p){
					if(typeof p.sel == 'string') I.pg.obj = $(p.sel, I.obj);//内部分页，需要重新取一次对象
					I.pg.display();
					$('a[href="javascript:"]',I.pg.obj).addClass('nopage');
				}
			}
		};

		I.getDb = function(d,k){//不能直接使用eval，因为要兼容JS压缩
			if(!d || !k) return '';
			if(k == '[index]') return d;
			if(k.indexOf('.') > 0){
				var s = k.split('.')[0];
				return I.getDb(d[s],k.replace(s+'.',''));
			}else{
				//暂时去除大括号
				if(typeof d[k] == 'string' && d[k] != '') d[k] = d[k].replace(/\{/g,'DKHL').replace(/\}/g,'DKHR');
				return d[k];
			}
		};
	};
	return Tpl;
});