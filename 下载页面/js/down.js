var ROOT_API = getQueryString('root_api');

ROOT_API = ROOT_API + '/';
(function() {
	if(!isPcOS()&&getDeviceInfo()=='iOS'){
		$('#content').css({
			display:'block'
		})
	}
})()
//下载
function downPdf() {
	if(isPcOS()&&isPcOS()!='linux') {
		ajaxDown()
	} else {
		if(sources() == 'Weixin') {
			alert('请使用浏览器打开下载!')
		} else {
			ajaxDown()
		}
	}

}

function ajaxDown() {
	$.ajax({
		type: "get",
		url: ROOT_API + 'api/trade/customer/getCusMaterMerChanter',
		async: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {
			id: getQueryString('id')
		},
		success: function(d) {
			var ele = document.createElement('a');
			ele.setAttribute("href", ROOT_API + 'upload/' + d.msg)
			ele.setAttribute("download", d.msg ? (d.msg.split('/')[1]).split('.')[0] : '商品')
			ele.setAttribute("target", '_blank')
			ele.click()
			//不知道为啥这里在ios就打不开了。只有用下面的这种，在vue的down里面能打开
			if(getDeviceInfo()=='iOS'&&isPcOS){
				window.location.href=ROOT_API + 'upload/' + d.msg
			}
		}
	});
}
//获取url参数
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	}
	return null;
}
//获取是否PC端
function isPcOS() { 
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	if(isWin) return 'win'; //'Win'
	var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
	if(isMac) return 'mac'; //'Mac'
	var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	if(isUnix) return 'unix'; //'Unix'
	var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
	if(isLinux) return 'linux'; //'Linux'
	return false
}
//获取来源渠道
function sources() {
	var ua = navigator.userAgent;
	var f = this.getQueryString('f');
	if(f != null) {
		return f;
	}
	var wxFrom = this.getQueryString('from');
	if(wxFrom != null) {
		if(wxFrom == 'groupmessage') {
			return 'Wechat';
		} else if(wxFrom == 'singlemessage') {
			return 'Weixin';
		}
	}
	if(f == null && wxFrom == null) {
		var str = 'FitIdx'
		if(ua.match(/QQ/i) == "QQ") {
			//return "QQ";
			str = 'QQ'
		}
		if(ua.match(/MicroMessenger/i) == "MicroMessenger") {
			//return "Weixin";
			str = 'Weixin'
		}
		return str
	}
}
//获取手机名称
function getDeviceInfo({
	ua,
	a
} = {}) {
	ua = navigator.userAgent;
	a = ['iPhone', 'iPad', 'iPod', 'Nexus', 'BenQ-Siemens', 'Meizu', 'Xiaomi', 'BlackBerry', 'CoolPad', 'Dell', 'HTC', 'Huawei', 'Kindle', 'K-Touch', 'Lenovo', 'LG', 'Motorola', 'Nintendo', 'Nokia', 'Onda', 'OPPO', 'OLPC', 'Palm', 'PlayStation', 'Samsung', 'SonyXperia', 'SonyEricsson', 'vivo', 'ZTE', 'UbuntuPhone', 'UbuntuTablet', 'WindowsPhone']
	console.log(ua.toLowerCase())
	var devices = a,
		device,
		c,
		i = 0;
	while(device = devices[i++]) {
		var d = new RegExp("(" + device + ")", "i");
		if(d.test(ua.toLowerCase())) c = device;
	}
	switch(c) {
		case undefined:
			c = 'Android';
			break;
		case 'iPhone OS':
			c = 'iOS';
			break;
		case 'iPod':
			c = 'iOS';
			break;
		case 'iPhone':
			c = 'iOS';
			break;
		case 'iPad':
			c = 'iOS';
			break;
	}
	return c;
}

function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	}
	return null;
}