/**
 * OA html5上传控件封装
 * -SeaChen
 * -2015.07.31
 */
define(function(){
	var h5Upolad = function(_obj,opts) {
	    var set = {
	        ImgBox: "fileList",
	        ImgType: ["jpg", "bmp", "png"],
	        height:50,
	        len:0,
	        maxLen:5,
	        size:450,
	        Callback: function () {}
	    };
	    if(opts) $.extend(set,opts || {});
	    var UP={
	        init:function(){
	            _obj.parent().after('<div id="'+set.ImgBox+'"></div>');
	            _obj.change(function () {
	                if (this.value) {
	                    if (!RegExp("\.(" + set.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
	                        M.tips("请选择图片类型：" + set.ImgType.join("，"));
	                        this.value = "";
	                        return false
	                    }
	                    var _size=this.files[0].size;
	                    if(_size>(1024*set.size)) {//文件大小不能超过450KB(1024*450=460800)!
	                        M.tips('文件大小不能超过450KB!');
	                        this.value = "";
	                        return false;
	                    };
	                    set.len++;
	                    if(set.len>set.maxLen){
	                        M.tips('最多上传5张！');
	                        this.value = "";
	                        return false;
	                    };
	                    //添加img对象
	                    $("#" + set.ImgBox).append('<img height="'+set.height+'" src="'+UP.getObjectURL(this.files[0])+'" />')
	                    //回调函数
	                    set.Callback();
	                }
	            });
	        },
	        getObjectURL:function(file){
	           var url = null;
	            if (window.createObjectURL != undefined) {// basic
	                url = window.createObjectURL(file)
	            } else if (window.URL != undefined) {// mozilla(firefox)
	                url = window.URL.createObjectURL(file)
	            } else if (window.webkitURL != undefined) { // webkit or chrome
	                url = window.webkitURL.createObjectURL(file)
	            }
	            return url 
	        }
	    };
	    UP.init();
	};
	return h5Upolad;
});