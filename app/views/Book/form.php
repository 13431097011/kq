<link rel="stylesheet" type="text/css" href="/public/bootstrap/dist/css/bootstrap.min.css">
<link href="/public/umeditor-dev/themes/default/_css/umeditor.css" type="text/css" rel="stylesheet">
<script type="text/javascript" charset="utf-8" src="/public/umeditor-dev/umeditor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="/public/umeditor-dev/_examples/editor_api.js"></script>
<script type="text/javascript" src="/public/umeditor-dev/lang/zh-cn/zh-cn.js"></script>
<link rel="stylesheet" type="text/css" href="/public/tagsinput/jquery.tagsinput.css">
<script type="text/javascript" src="/public/tagsinput/jquery.tagsinput.min.js"></script>

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
		<input type="text" class="form-control" name="book[author]" id="author" placeholder="请输入书的作者">
	</div>
	<div class="form-group">
		<label for="exampleInputFile">出版商</label>
		<input type="text" class="form-control" name="book[publisher]" id="publisher" placeholder="请输入书的出版商">
	</div>
	<div class="form-group">
		<label for="exampleInputFile">目录</label>
		<script type="text/plain" id="catalog" style="width:800px;height:240px;"></script>
	</div>
	<input type="hidden" name="book[image]" id="image" value="">
</form>
<iframe name="upload_hidden_files" id="upload_hidden_files" style="display:none"></iframe>
<form method="post" action="/Book/uploadpic" id='exportForm' target="upload_hidden_files">
	<div class="form-group">
		<label for="exampleInputFile">缩略图</label>
		<input type="file" id="exampleInputFile">
		<p class="help-block">支持jpg/png格式图片</p>
		<p class="help-block">
			<img src="" alt="" id="imagelist">
		</p>
	</div>
</form>
<div class="form-group">
	<button type="button" class="btn btn-primary">提交</button>
</div>
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
		var val = $("input[name='book[isbn]']").val();
		val = $.trim(val);
		if (val == "") {
			M.tipsErr("请输入ISBN");
			return false;
		}
		$.post('/Book/getISBN', {isbn: val}, function (data) {
			if (data.err != '') {
				M.tipsErr(data.err);
				return false
			}
			var d = data.data;
			var fields = ['title', 'author', 'publisher', 'catalog', 'image'];
			if (typeof d.code != 'undefined' && d.code == 6000) {
				M.tipsErr("查无此书");
				return false;
			} else {
				d.author = d.author.join('、');
				d.catalog = d.catalog.replace(/\r\n/g, "<br>");
				d.catalog = d.catalog.replace(/\n/g, "<br>");
				for (var i = 0; i < fields.length; i++) {
					var k = fields[i];
					if (k == 'catalog') {
						um.setContent(d[k]);
					} else if (k == 'image') {
						$("#" + k).val(d[k]);
						$("#imagelist").attr('src', d[k]);
					} else {
						$('#' + k).val(d[k]);
					}


				}
			}
		}, 'json');
	});

</script>