<?php
defined('BASEPATH') OR exit('No direct script access allowed');
$this->load->helper('url');
?>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>博雅OA系统</title>
		<link rel="stylesheet" type="text/css" href="/public/css/kq_kq.css?20160106">
		<link rel="stylesheet" type="text/css" href="/public/js/base/jqui/jquery-ui.min.css?20160106">
	</head>
	<body>
		<div class="wrapper">
			<div class="header">
				<div class="wrap cl">
					<div class="logo"><a href="http://vm.oa.com/"></a></div>
					<ul class="nav">
						<li><a key="hr" class="on" href="?_a=hr&amp;_m=index">考勤系统<span class="num"><em>1</em><b class="a1"></b><b class="a2"></b></span></a></li>
						<li><a key="pe" href="?_a=pe&amp;_m=index">绩效与调配系统<span class="num"><em>1</em><b class="a1"></b><b class="a2"></b></span></a></li>
						<li><a key="pb" href="http://basic.oa.com" target="_blank">人事基础</a></li>
						<li><a key="zp" href="http://zp.oa.com/" target="_blank">招聘系统</a></li>
						<li><a key="fi" href="http://fi.oa.com/" target="_blank">财务系统</a></li>
						<li class="set_menu"><a href="javascript:;" class="sel"><span>更多系统</span><i class="arrow"></i></a>
							<div class="sel_box">
								<div class="wrap">
									<p class="cl edit_box"><a href="javascript:;" class="icon btn_edit">编辑</a></p>
									<ul class="sel_nav cl " id="view_nav">
										<li><a key="mb" href="http://meet.oa.com/" target="_blank" class="ico_nav mb" title="会议室预定"></a></li>
										<li><a key="ks" href="http://kms.oa.com" target="_blank" class="ico_nav ks" title="知识分享"></a></li>
										<li><a key="tr" href="http://u.oa.com/train/" target="_blank" class="ico_nav tr" title="博雅大讲堂"></a></li>
										<li><a key="ls" href="http://law.oa.com/" target="_blank" class="ico_nav ls" title="法务系统"></a></li>
										<li><a key="it" href="http://it.oa.com/" target="_blank" class="ico_nav it" title="IT需求"></a></li>
										<li class="last"><a key="as" href="http://assets.oa.com/" target="_blank" class="ico_nav as" title="资产管理"></a></li>
									</ul>
									<ul class="sel_nav edit_nav cl" id="edit_nav">
										<li class="ico_nav hr on" draggable="true"><a id="hr" value="1" href="?_a=hr&amp;_m=index" class="ico_nav hr on">考勤系统</a><i></i></li>
										<li class="ico_nav pe on" draggable="true"><a id="pe" value="1" href="?_a=pe&amp;_m=index" class="ico_nav pe on">绩效与调配系统</a><i></i></li>
										<li class="ico_nav pb on" draggable="true"><a id="pb" value="1" href="http://basic.oa.com" target="_blank" class="ico_nav pb on">人事基础</a><i></i></li>
										<li class="ico_nav zp on" draggable="true"><a id="zp" value="1" href="http://zp.oa.com/" target="_blank" class="ico_nav zp on">招聘系统</a><i></i></li>
										<li class="ico_nav fi on" draggable="true"><a id="fi" value="1" href="http://fi.oa.com/" target="_blank" class="ico_nav fi on">财务系统</a><i></i></li>
										<li class="ico_nav mb not" draggable="true"><a id="mb" value="0" href="http://meet.oa.com/" target="_blank" class="ico_nav mb">会议室预定</a><i></i></li>
										<li class="ico_nav ks not" draggable="true"><a id="ks" value="0" href="http://kms.oa.com" target="_blank" class="ico_nav ks">知识分享</a><i></i></li>
										<li class="ico_nav tr not" draggable="true"><a id="tr" value="0" href="http://u.oa.com/train/" target="_blank" class="ico_nav tr">博雅大讲堂</a><i></i></li>
										<li class="ico_nav ls not" draggable="true"><a id="ls" value="0" href="http://law.oa.com/" target="_blank" class="ico_nav ls">法务系统</a><i></i></li>
										<li class="ico_nav it not" draggable="true"><a id="it" value="0" href="http://it.oa.com/" target="_blank" class="ico_nav it">IT需求</a><i></i></li>
										<li class="ico_nav as not" draggable="true"><a id="as" value="0" href="http://assets.oa.com/" target="_blank" class="ico_nav as">资产管理</a><i></i></li>
									</ul>
									<p class="tips">操作提示：1. <b>绿色</b>表示当前在导航栏显示  2.最多选择5个在导航栏显示  3.鼠标拖拽自定义排列顺序</p>
								</div>
							</div>
						</li>
					</ul>
					<div class="user_info">
						<a href="javascript:;" class="face"><span class="g"><em class="b"></em><img width="30" src="http://by.oa.com/data/headpic/1331.jpg" onerror="this.onerror=null;this.src='/static/skin/img/faceM.jpg'" alt=""></span><i class="icon"></i></a>
						<ul style="display: none;">
							<li class="line"><a href="http://devpb.oa.com/user/myInfo/1331" target="_blank">个人资料</a></li>
							<li><a href="api/login.php?cmd=out&amp;id=hr">退出<span class="icon exit"></span></a></li>
						</ul>
					</div>
				</div>
			</div><!-- header end -->

			<div class="mains cl">
				<?php include __DIR__."/menu.php";?>
				<div class="right"> 
					<?php echo $content;?>
				</div>
			</div>
			<div class="footer">
				Copyright © 2015-2025 博雅互动 (Boyaa Interactive)
			</div><!-- footer end -->
		</div>
		<script src="/public/js/base/jq.1.8.2.js"></script>
		<script src="/public/js/base/seajs.3.0.js" id="seajsnode"></script>
		 <script type="text/javascript">
            var vars = {
				baseUrl: '<?=base_url()?>',
				keditor:{ 
					resizeType : 1,
					allowPreviewEmoticons : false,
					allowImageUpload : false,
					items:[
						'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
						'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
						'insertunorderedlist']
				}
			};
        </script>
		 <script type="text/javascript">
            var version = 20160307;
            var __cdn__ = 'http:://vm';
            seajs.config({
                base: __cdn__ + 'jsdev/{{env("APP_TAG", "pe")}}/',
                map: [[/^(.*\jsdev\/.*\.(?:css|js))(?:.*)$/i, '$1?' + version]],
                alias: {
                    jqui: __cdn__ + 'js/jqui/jquery-ui.min.js',
                    Msg: __cdn__ + 'jsdev/comm/Msg.js',
                    M: __cdn__ + 'jsdev/comm/app.dialog.js',
                    replaceVars: __cdn__ + 'jsdev/comm/fn.replaceVars.js',
                    D: __cdn__ + 'jsdev/comm/app.Calendar.js',
					$D: __cdn__ + 'jsdev/comm/app.Date.js',
					K: __cdn__ + 'jsdev/plugins/keidtor/kindeditor-min.js',
					chart:__cdn__ + 'js/Chart/Chart.min.js',
					uCheck: __cdn__ + 'jsdev/comm/uCheck.js'
                }
            });
            //检查开始时间小于结束时间
				function check(){
					var sdate = $('.pm_time').find('input[readonly]:eq(0)').val();
					var edate = $('.pm_time').find('input[readonly]:eq(1)').val();
					var begin=new Date(sdate.replace(/-/g,'/'));
					var end=new Date(edate.replace(/-/g,'/'));
					if(begin-end>0){
					
					 	$('.pm_time').find('input[readonly]:eq(1)').val("请选择正确的时间");
					 }
				}
				// 结束
            seajs.use(['common', 'app']);
        </script>
		<style>
			.dialogBg{width:100%}
			.dialogBody{overflow:hidden;}
			.dialogBody,.dialogBody input{font-size:12px}
			.dialogBody,.dialogBg{position:fixed;left:0;top:0;z-index:99;}
			.dialogBody{left:50%;top:50%; border-radius: 5px;box-shadow: 0 1px 30px rgba(0,0,0,0.1);}
			.dialogTitle{background:url(../../../static/skin/img/dialogTitle.jpg) repeat-x;}
			.dialogTitle b{font-size:16px;text-align:left;display:block;height:49px;line-height:49px;color:#fff;padding-left:20px;}
			.dialogTitle a{filter:alpha(opacity=70);opacity:1;background:url(../../../static/skin/img/ico_dialog_cls.png?1.001) no-repeat;width:15px;height:15px;cursor:pointer;display:inline;position:absolute;right:20px;top:17px;}
			.dialogTitle a:hover{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);-moz-transform:rotate(90deg);-o-transform:rotate(90deg);-webkit-transform:rotate(90deg);transform:rotate(90deg)}
			.dialogTitle a:active{filter:alpha(opacity=80);opacity: 0.8;}.dialogContent{  overflow-y: auto; max-height: 700px;}.dialogContents iframe{width:100%;border:0;overflow:hidden;overflow-y:auto}
			.dialogButtons{text-align:center;margin: 40px 0 114px;}
			table.dialogContents{width:auto;border:0}
			table.dialogContents td{text-align:left;border:0}
			.dialogButtons input{cursor:pointer;margin:0 10px;width:80px;height:41px;color:#fff;display:inline-block;background-color:#80c414;line-height:41px;text-align:center;font-size:14px;font-weight:bold;}
			.dialogButtons input:hover{}
			.dialogButtons input.dialog_y{color:#282d37; background:#f0f2f7}
			.dialog_img{width:36px;padding:0}
			.dialog_img p{width:32px;height:32px;margin:0 auto;background:url(../../../static/skin/img/ico_dialog.png?1.003) no-repeat}
			p.dialog_img_confirm{background-position:0 3px}
			p.dialog_img_alert{background-position:0 -272px}
			p.dialog_img_tips{background-position:0 -380px}p.dialog_img_ok{background-position:0 -106px}
			p.dialog_img_err{background-position:0 -52px}
			.dialogText{margin:0}
			.dialogText_ok{color:green}
			.dialogText_err{}
			.dialogText_loading{color:#666;font-size:14px;display:none;}
			td.dialog_img_loading{width:40px}
			td.dialog_img_loading p{width:100px;height:100px}
			.dialog_img p.dialog_img_loading{background:url(../../../static/skin/img/loading.gif) no-repeat;color:#666;font-size:14px;opacity: 0.3;filter:alpha(opacity=30);}
			.dialogAll b{font-weight:bold;margin:0}
			.dialogText{font-size:18px;font-weight:bold;}
			#dialogbtn1{ margin-left:20px}
		</style>
	</body>
</html>