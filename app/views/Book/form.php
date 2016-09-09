<link rel="stylesheet" type="text/css" href="/public/bootstrap/dist/css/bootstrap.min.css">
<link href="/public/umeditor-dev/themes/default/_css/umeditor.css" type="text/css" rel="stylesheet">
<script type="text/javascript" charset="utf-8" src="/public/umeditor-dev/umeditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="/public/umeditor-dev/_examples/editor_api.js"></script>
<script type="text/javascript" src="/public/umeditor-dev/lang/zh-cn/zh-cn.js"></script>
<form role="form">

	<div class="form-group">
		<label for="exampleInputEmail1">ISBN</label>
		<div class="input-group">
			<input type="text" class="form-control" name="book[isbn]" placeholder="输入ISBN在线检索图书信息">
			  <span class="input-group-btn">
				<button type="button" class="btn btn-info" id="isbn">在线匹配</button>
			  </span>
		</div>
	</div>
	<div class="form-group">
		<label for="subtitle">书名</label>
		<input type="text" class="form-control" name="book[title]" id="title" placeholder="请输入书名">
	</div>
	<div class="form-group">
		<label for="exampleInputFile">作者</label>
		<input type="text" class="form-control" name="book[subtitle]" placeholder="请输入书的作者">
	</div>
	<div class="form-group">
		<label for="exampleInputFile">出版商</label>
		<input type="text" class="form-control" name="book[publisher]" placeholder="请输入书的出版商">
	</div>
	<div class="form-group">
		<label for="exampleInputFile">目录</label>
		<script type="text/plain" id="catalog" style="width:800px;height:240px;"></script>
	</div>
	<div class="form-group">
		<label for="exampleInputFile">缩略图</label>
		<input type="file" id="exampleInputFile">
		<p class="help-block">支持jpg/png格式图片</p>
	</div>
	<div class="checkbox">
		<label>
			<input type="checkbox"> Check me out
		</label>
	</div>
	<button type="submit" class="btn btn-default">Submit</button>
</form>
<script type="text/javascript">
	window.UMEDITOR_HOME_URL = "/public/";
	var um = UM.getEditor('catalog', {
		//这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
		toolbar: ['fullscreen source undo redo bold italic underline'],
		//focus时自动清空初始化时的内容
		autoClearinitialContent: true,
		initialFrameWidth: 970,
		//关闭字数统计
		wordCount: false,
		//关闭elementPath
		elementPathEnabled: false,
		//默认的编辑区域高度
		initialFrameHeight: 300,
		textarea: 'book[catalog]'
		//更多其他参数，请参考umeditor.config.js中的配置项
	});
	$("#isbn").click(function () {
		if()
	});

</script>