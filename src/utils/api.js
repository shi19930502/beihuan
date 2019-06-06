import axios from 'axios'
import { Alert, Confirm } from 'vue-ydui/dist/lib.rem/dialog'
import configs from '../configs'
import router from '../router'

axios.interceptors.request.use(config => {
	return config;
}, err => {
	Alert({
		mes: '请求超时!'
	})
	return Promise.resolve(err);
})

axios.interceptors.response.use(data => {
	var hash = router.history.current.path;
	if(data.status && data.status == 200 && data.data.status == 'error') {
		Alert({
			mes: data.data.msg
		})
		return;
	} else if(data.data.state == 97) {
		Confirm({
			title: '提示：',
			mes: data.data.msg,
			opts: [{
				txt: '确定',
				color: true,
				callback: () => {
					if(SYSTEMID == 8) {
						var isQrCode = sessionStorage.getItem('isQrCode')
						if(isQrCode == 1) {
							router.push({
								name: 'qrcodelogin'
							})
						} else {
							localStorage.setItem('quickUserInfo', "{}");
							localStorage.setItem('userInfo', '{}');
							window.location = CONFIG.loginOutUrl
						}
					} else {
						router.push({
							name: 'f_login'
						})
					}
					//下面的是老的判断，有快捷下单的时候
					//					var isQrCode = sessionStorage.getItem('isQrCode')
					//					//通过hash判断一批过期后去f_login
					//					if(
					//						hash == '/f_ddgl' || hash == '/f_ddxq' ||
					//						hash == '/f_index' || hash == '/f_jcgl' ||
					//						hash == '/f_jcxq' || hash == '/f_plcz' ||
					//						hash == '/f_spgl' || hash == '/f_tjsp_xg' ||
					//						hash == '/f_tjsp_xz' || hash == '/f_xzjc_xg' ||
					//						hash == '/f_xzjc_xxlr' || hash == '/f_xzjc_xz'
					//					) {
					//						router.push({
					//							name: 'f_login'
					//						})
					//					} else {
					//						if(isQrCode == 1) {
					//							router.push({
					//								name: 'qrcodelogin'
					//							})
					//						} else if(isQrCode == 2) {
					//							router.push({
					//								name: 'f_login'
					//							})
					//						} else {
					//							router.push({
					//								name: 'Login'
					//							})
					//						}
					//					}
				}
			}]
		});
	}
	if(
		hash == '/f_ddgl' || hash == '/f_ddxq' ||
		hash == '/f_index' || hash == '/f_jcgl' ||
		hash == '/f_jcxq' || hash == '/f_plcz' ||
		hash == '/f_spgl' || hash == '/f_tjsp_xg' ||
		hash == '/f_tjsp_xz' || hash == '/f_xzjc_xg' ||
		hash == '/f_xzjc_xxlr' || hash == '/f_xzjc_xz'
	) {
		if(localStorage.getItem('quickUserInfo')) {
			if(JSON.parse(localStorage.getItem('quickUserInfo')).typeId == 'buyer') {
				Confirm({
					title: '提示：',
					mes: '请使用供应商账号登录！',
					opts: [{
						txt: '确定',
						color: true,
						callback: () => {
							var name = 'f_login'
							if(sessionStorage.getItem('isQrCode') == 0) {
								name = 'Login'
							}
							router.push({
								name: name
							})
						}
					}]
				});
			}
		}
	}
	return data;
}, err => {
	if(err.response) {
		if(err.response.status == 504 || err.response.status == 404) {
			Alert({
				mes: '服务器错误⊙﹏⊙∥'
			})
		} else if(err.response.status == 403) {
			Alert({
				mes: '权限不足,请联系管理员!'
			})
		} else {
			Alert({
				mes: '未知错误!'
			});
		}
		return Promise.resolve(err);
	} else {
		Alert({
			mes: '未知错误!'
		});
	}
})

export const postRequest = (url, params, isLogin, isUser) => {
	let urlp;
	if(isLogin) { //是否登录调用
		urlp = `${configs.loginAPI}${url}`
	} else {
		if(url.split('/').length > 2) {
			urlp = `${configs.api}${url}`
		} else {
			if(isUser) {
				urlp = `${configs.userAPI}${url}`
			} else {
				urlp = `${configs.rootAPI}${url}`
			}
		}
	}
	// 获取token
	let userInfo = JSON.parse(localStorage.getItem('quickUserInfo'));
	if(!params.token) {
		if(userInfo) {
			params.token = userInfo.token
		}
	}
	return axios({
		method: 'post',
		url: urlp,
		data: params,
		transformRequest: [function(data) {
			let ret = ''
			for(let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			}
			return ret
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}

export const getRequest = (url) => {
	return axios({
		method: 'get',
		url: `${configs.api}${url}`
	});
}

export const uploadFileRequest = (url, params) => {
	return axios({
		method: 'post',
		url: `${configs.rootAPI}${url}`,
		data: params,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
}

export const putRequest = (url, params) => {
	return axios({
		method: 'put',
		url: `${configs.rootAPI}${url}`,
		data: params,
		transformRequest: [function(data) {
			let ret = ''
			for(let it in data) {
				ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			}
			return ret
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}

export const deleteRequest = (url) => {
	return axios({
		method: 'delete',
		url: `${configs.rootAPI}${url}`
	});
}