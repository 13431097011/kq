<html data-ember-extension="1">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>借书系统</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="/public/stylesheets/pb.css">
	<link rel="stylesheet" type="text/css" href="/public/javascripts/jqui/jquery-ui.min.css">
</head>
<body>
<div>
	<div class="wrapper">
		<div class="header">
			<div class="wrap cl">
				<div class="logo">
					<a href="#"></a>
				</div>
				<ul class="nav">
					<li>
						<a key="pe" class="on" href="#">
							人事基础系统
						</a>
					</li>
					<li>
						<a key="hr" href="#">
							考勤系统
						</a>
					</li>
					<li>
						<a key="pe" href="#">
							绩效与调配系统
						</a>
					</li>
					<li>
						<a key="fi" href="http://fi.oa.com/" target="_blank">
							财务系统
						</a>
					</li>
					<li>
						<a key="mb" href="http://meet.oa.com/" target="_blank">
							会议室预定
						</a>
					</li>
					<li class="set_menu">
						<a href="javascript:;" class="sel">
											<span>
												更多系统
											</span>
							<i class="arrow">
							</i>
						</a>
						<div class="sel_box">
							<div class="wrap">
								<p class="cl edit_box">
									<a href="javascript:;" class="icon btn_edit">
										编辑
									</a>
								</p>
								<ul class="sel_nav cl " id="view_nav">
									<li>
										<a key="tr" href="http://u.oa.com/train/" target="_blank" class="ico_nav tr"
										   title="博雅大讲堂">
										</a>
									</li>
									<li>
										<a key="ls" href="http://law.oa.com/" target="_blank" class="ico_nav ls"
										   title="法务系统">
										</a>
									</li>
									<li>
										<a key="it" href="http://it.oa.com/" target="_blank" class="ico_nav it"
										   title="IT需求">
										</a>
									</li>
									<li>
										<a key="as" href="http://assets.oa.com/" target="_blank" class="ico_nav as"
										   title="资产管理">
										</a>
									</li>
									<li class="last">
										<a key="ks" href="http://kms.oa.com" target="_blank" class="ico_nav ks"
										   title="知识分享"></a>
									</li>
								</ul>
								<ul class="sel_nav edit_nav cl" id="edit_nav">
									<li class="ico_nav hr on">
										<a id="hr" value="1" href="#" class="ico_nav hr on">
											考勤系统
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav pe on">
										<a id="pe" value="1" href="#" class="ico_nav pe on">
											绩效与调配系统
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav fi on">
										<a id="fi" value="1" href="http://fi.oa.com/" target="_blank"
										   class="ico_nav fi on">
											财务系统
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav mb on">
										<a id="mb" value="1" href="http://meet.oa.com/" target="_blank"
										   class="ico_nav mb on">
											会议室预定
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav ks on">
										<a id="ks" value="1" href="http://kms.oa.com" target="_blank"
										   class="ico_nav ks on">
											知识分享
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav tr">
										<a id="tr" value="0" href="http://u.oa.com/train/" target="_blank"
										   class="ico_nav tr">
											博雅大讲堂
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav ls">
										<a id="ls" value="0" href="http://law.oa.com/" target="_blank"
										   class="ico_nav ls">
											法务系统
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav it">
										<a id="it" value="0" href="http://it.oa.com/" target="_blank"
										   class="ico_nav it">
											IT需求
										</a>
										<i>
										</i>
									</li>
									<li class="ico_nav as">
										<a id="as" value="0" href="http://assets.oa.com/" target="_blank"
										   class="ico_nav as">
											资产管理
										</a>
										<i>
										</i>
									</li>
								</ul>
								<p class="tips">
									操作提示：1.
									<b>
										绿色
									</b>
									表示当前在导航栏显示 2.最多选择5个在导航栏显示 3.鼠标拖拽自定义排列顺序
								</p>
							</div>
						</div>
					</li>
				</ul>


				<div class="user_info">
					<a href="javascript:;" class="face">
							<span class="g">
								<em class="b">
								</em>
								<img width="30" src="http://by.oa.com/data/headpic/1331.jpg"
									 onerror="this.onerror=null;this.src='images/sex_F.jpg'" alt="">
							</span>
						<i class="icon"></i>
					</a>
					<ul>
						<li>
							<a href="/logout">退出<span class="icon exit">	</span></a>
						</li>
					</ul>
				</div>

			</div>
		</div>
		<div class="mains cl">
			<?php include_once __DIR__ . "/menu.php" ?>
			<div class="right">
				<ul class="books cl">
					<li class="line1 " nname="1">
						<a id="ember457" href="/list/1"
						   title="跟着马克?吕布拍中国（1993~2013）著名摄影家肖全珍藏23年的马克?吕布照片，200多幅珍贵照片首次公开。印刷巨匠雅昌文化集团调图、承印。"
						   class="ember-view"> <img src="http://img3x0.ddimg.cn/18/15/23995440-1_l_11.jpg"
													alt="跟着马克?吕布拍中国（1993~2013）著名摄影家肖全珍藏23年的马克?吕布照片，200多幅珍贵照片首次公开。印刷巨匠雅昌文化集团调图、承印。">
						</a>
						<p class="name">
							<a id="ember472" href="/list/1" class="ember-view">
								跟着马克?吕布拍中国（1993~2013）著名摄影家肖全珍藏23年的马克?吕布照片，200多幅珍贵照片首次公开。印刷巨匠雅昌文化集团调图、承印。
							</a></p>
						<p class="author"><span class="author_t"></span>詹熏欣</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="2">
						<a id="ember474" href="/list/2" title="茧" class="ember-view"> <img
								src="http://img3x1.ddimg.cn/56/26/24002111-1_l_16.jpg" alt="茧">
						</a>
						<p class="name">
							<a id="ember475" href="/list/2" class="ember-view"> 茧
							</a></p>
						<p class="author"><span class="author_t"></span>李大钊</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="3">
						<a id="ember477" href="/list/3" title="给差一点错过的梦想" class="ember-view"> <img
								src="http://img3x8.ddimg.cn/30/23/23986938-1_l_12.jpg" alt="给差一点错过的梦想">
						</a>
						<p class="name">
							<a id="ember478" href="/list/3" class="ember-view"> 给差一点错过的梦想
							</a></p>
						<p class="author"><span class="author_t"></span>鲁迅</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="4">
						<a id="ember480" href="/list/4" title="詹熏欣传说！）" class="ember-view"> <img
								src="http://img3x0.ddimg.cn/86/7/23965610-1_l_12.jpg" alt="詹熏欣传说！）">
						</a>
						<p class="name">
							<a id="ember481" href="/list/4" class="ember-view"> 詹熏欣传说！）
							</a></p>
						<p class="author"><span class="author_t"></span>冰心</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="5">
						<a id="ember483" href="/list/5" title="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）"
						   class="ember-view"> <img src="http://img3x0.ddimg.cn/86/7/23965610-1_l_12.jpg"
													alt="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）">
						</a>
						<p class="name">
							<a id="ember484" href="/list/5" class="ember-view">
								贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）
							</a></p>
						<p class="author"><span class="author_t"></span>冰心</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="6">
						<a id="ember486" href="/list/6" title="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）"
						   class="ember-view"> <img src="http://img3x0.ddimg.cn/86/7/23965610-1_l_12.jpg"
													alt="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）">
						</a>
						<p class="name">
							<a id="ember487" href="/list/6" class="ember-view">
								贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）
							</a></p>
						<p class="author"><span class="author_t"></span>冰心</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="7">
						<a id="ember489" href="/list/7" title="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）"
						   class="ember-view"> <img src="http://img3x0.ddimg.cn/86/7/23965610-1_l_12.jpg"
													alt="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）">
						</a>
						<p class="name">
							<a id="ember490" href="/list/7" class="ember-view">
								贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）
							</a></p>
						<p class="author"><span class="author_t"></span>冰心</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>
					<li class="line1 " nname="8">
						<a id="ember492" href="/list/8" title="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）"
						   class="ember-view"> <img src="http://img3x0.ddimg.cn/86/7/23965610-1_l_12.jpg"
													alt="贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）">
						</a>
						<p class="name">
							<a id="ember493" href="/list/8" class="ember-view">
								贤二前传之宝藏传奇：钱可不是白花的（当当全国独家首发，附赠龙泉寺手工制作“贤二”版画，限量700份，先到先得！）
							</a></p>
						<p class="author"><span class="author_t"></span>冰心</p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1">106</span><span class="tail">.60</span></span><span class="price_r"><span
									class="sign">¥</span><span class="num_1">148</span><span
									class="tail">.00</span></span></p>
						<div class="icon_pop"><span class="product_tags"></span></div>
					</li>

				</ul>

			</div>
		</div>
	</div>
	<div class="footer">
		Copyright © 2015-2025 博雅互动 (Boyaa Interactive)
	</div>


</div>
</body>
</html>