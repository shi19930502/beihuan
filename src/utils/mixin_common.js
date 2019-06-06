import configs from '../configs'
import morenImg from '../assets/imgs/img_moren@2x.png'
export default {
	data() {
		return {
			city: CITY,
			imgURL: configs.imgURL,
			userInfo: '',
			isFirstGYS: false,
			config: CONFIG,
			userExtend:'',
		}
	},
	watch:{
		userInfo:function(val){
//			alert(this.$route.name)
			//&&this.$route.name!='f_login'
			if(val&&SYSTEMID==8){
				if(val.typeId=='merchant_buyer'){
					val.typeId='merchant'
				}
				if(val.userType){
					var obj=JSON.parse(window.localStorage.getItem('quickUserInfo'));
					obj.userType='';
					window.sessionStorage.setItem('quickUserInfo', JSON.stringify(obj));
				}
				
				if(val.userId||val.userId===0){
					if(localStorage.getItem('userId')){
						if(localStorage.getItem('userId')!=val.userId){
							localStorage.setItem('TJSP_add','')
							sessionStorage.setItem('fl_goods','')
							localStorage.setItem('quick_gbgoodsId','')
						}
					}
					localStorage.setItem('userId',val.userId)
					
				}
			}
		},
		deep:true,
	},
	created() {
		if(ADDR == 'all' || ADDR == 'beihuan') {
			this.isFirstGYS = true
		}
	},
	mounted() {
		this.userInfo=JSON.parse(localStorage.getItem('quickUserInfo')) || { nickName: '', userId: '' }
		this.$store.commit({
			type:'getQuickUserInfo',
			userInfo:this.userInfo
		})
		this.$store.commit({
			type:'getExtendStr',
			str:this.userInfo.extend
		})
		if(this.$store.state.extendStr=='YP'){
			this.config.isTowGYS=false
		}else if(this.$store.state.extendStr=='MD'){
			this.config.isTowGYS=true
		}
		if(this.config.typeId) {
			if(this.config.systemid == 7 && (this.config.typeId == 'merchant' || this.config.typeId == 'buyer' || this.config.typeId == 'merchant_buyer')) {
				this.$dialog.confirm({
					title: '提示：',
					mes: '登录账号与系统不符,请重新登录！',
					opts: [{
						txt: '确定',
						color: true,
						callback: () => {
							this.$router.push({
								name: 'f_login'
							})
						}
					}]
				});
			}
		}
	},
	methods: {
		getDate() {
			var date = new Date();
			var year = date.getFullYear()
			var month = date.getMonth()
			var day = date.getDate()
			var h = date.getHours();
			var min = date.getMinutes();
			var s = date.getSeconds()
			//			+ ":" + (s < 10 ? '0' + s : s)
			var d = date.getFullYear() + '-' + (month < 9 ? '0' + (month + 1) : (month + 1)) + '-' + (day < 10 ? '0' + day : day) +
				' ' + (h < 10 ? '0' + h : h) + ":" + (min < 10 ? '0' + min : min)
			return d
		},
		yugi(n) {
			var now = new Date;
			now.setDate(now.getDate() - n);
			var nowY = now.getFullYear();
			var nowM = now.getMonth() + 1;
			var nowD = now.getDate();
			var enddate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
			return enddate;
		},
		//获取手机名称
		getDeviceInfo({ua, a}={}) {
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
			console.log(c)
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
		},
		//获取是否PC端
		isPcOS() {
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			if(isWin) return 'win'; //'Win'
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			if(isMac) return 'mac'; //'Mac'
			var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
			if(isUnix) return 'unix'; //'Unix'
			var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
			if(isLinux) return 'linux'; //'Linux'
			return false
		},
		carReg(str) {
			if(this.config.carReg) {
				return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str)
			} else {
				return true
			}
		},
		//获取来源渠道
		sources() {
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
		},
		getQueryString(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			var r = window.location.search.substr(1).match(reg);
			if(r != null) {
				return unescape(r[2]);
			}
			return null;
		},
		//抛物线动画
		animationCar(id_1, id_2, id_3, id_4, imgUrl) {
			//y=ax^2+bx+c  
			//传入原点id_1 (0,0)、 第二个点id_2 (x_2,y_2)、 第三个id_3(x_3,y_3)
			
			var e_1 = document.getElementById(id_1)
			var e_2 = document.getElementById(id_2)
			var e_3 = document.getElementById(id_3)
//			var e_4 = document.getElementById(id_4)
			var x1 = e_1.getBoundingClientRect().left //购物车x点
			var x2 = e_2.getBoundingClientRect().left //商品x点
			var x3 = e_3.getBoundingClientRect().left //定点x点
			var y1 = -e_1.getBoundingClientRect().top
			var y2 = -e_2.getBoundingClientRect().top
			var y3 = -e_3.getBoundingClientRect().top
			var abcArr = this.getABC(x1, x2, x3, y1, y2, y3);
			var eImg = document.createElement('img');
			eImg.setAttribute('class', 'animationImg')
//			eImg.setAttribute('style', 'width:0.5rem;height:0.5rem;position:absolute;top:'+x2+'px;right: '+y2+'px;z-index: 9999999;')
			if(imgUrl) {
				eImg.setAttribute('src', this.imgURL + imgUrl)
			} else {
				eImg.setAttribute('src', morenImg)
			}
			e_2.appendChild(eImg)
//			e_4.appendChild(eImg)
			var x = x2,
				y = y2;
			var x = 0,
				y = 0;
				
			var imgAnimation = setTimeout(function fn(){
				x2 = x2 - 10
				if(x2 < x1) {
					eImg.remove();
					return false
				} else {
					setTimeout(fn,10)
					eImg.setAttribute('style', 'transform:translate(' + (x) + 'px,' + y * (-1) + 'px)')
					y = abcArr[0] * x2 * x2 + abcArr[1] * x2 + abcArr[2] - y2
					y = y.toFixed(2)
				}
				x = x - 10
			}, 10)
			
		},
		getABC(x1, x2, x3, y1, y2, y3) {
			var arr = [];
			var a = ((y1 - y2) / (x1 - x2) - (y3 - y2) / (x3 - x2)) / ((x1 * x1 - x2 * x2) / (x1 - x2) - (x3 * x3 - x2 * x2) / (x3 - x2))
			var b = ((y1 - y2) - ((x1 * x1 - x2 * x2) * a)) / (x1 - x2)
			var c = y1 - a * x1 * x1 - b * x1
			arr.push(a)
			arr.push(b)
			arr.push(c)
			return arr
		},

	}
}