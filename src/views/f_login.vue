<template>
	<yd-layout>
		<div v-if='showLogin' class="Login">
			<div class="logo flex flex-x-center">
				<img v-if='ycLogo' src="../assets/firstImgs/s_logo_1.png" alt="">
				<img style="width: 4.78rem;height: 2.34rem;" v-else src="../assets/firstImgs/s_logo.png" alt="">

			</div>

			<div class="form">
				<div class="flex form-group">
					<img src="../assets/firstImgs/login_icon_user@2x.png" alt="" class="pswicon">
					<yd-input style="padding-left: 10px" type="text" v-model="username" :show-success-icon="false" max="20" placeholder="请输入用户名"></yd-input>
				</div>
				<div class="flex form-group">
					<img src="../assets/firstImgs/login_icon_password@2x.png" alt="" class="pswicon">
					<yd-input @keydown.native='downEnter' style="padding-left: 10px" type="password" :show-success-icon="false" v-model="password" max="20" placeholder="请输入密码"></yd-input>
				</div>
				<div class="flex flex-x-end forget">
					<div>
						<yd-checkbox v-model="checkbox">记住账号</yd-checkbox>
					</div>
					<div>忘记密码？</div>
				</div>
				<div class=" flex flex-x-center">
					<div @click="login" class="loginbtn flex flex-y-center flex-x-center">
						<span>登录</span>
					</div>
				</div>
			</div>
			<div v-if='false' class="reg">还没有账号？
				<span @click="reg">立即注册</span>
			</div>
			<div class="l_footer">{{$root.config.footerName}}</div>
		</div>
	</yd-layout>
</template>
<script>
	import configs from '../configs'
	export default {
		data() {
			return {
				showLogin: false,
				openId: '',
				username: '',
				password: '',
				isFirst: true,
				checkbox: false,
				ycLogo: CONFIG.ssbhbgimg ? true : false
			}
		},
		created() {
			this.$dialog.loading.close();
			window.sessionStorage.setItem('isQrCode', 2);
			window.sessionStorage.setItem('loginSellerId', 'goLogin');
			if(window.localStorage.getItem('quickUserInfo')){
				var obj=JSON.parse(window.localStorage.getItem('quickUserInfo'));
				if(obj.userType){
					//这里配合mixin_common.js里面的userType判断是否重师兄那边跳过来
					//防止跳过来由于网速在login页面，而无法跳转
					obj.userType='';
					window.localStorage.setItem('quickUserInfo', JSON.stringify(obj));
					this.$router.push({name:'f_index'})
				}else{
					this.$store.commit('login', {});
					this.$root.userInfo = {}
				}
				
			}else{
				this.$store.commit('login', {});
				this.$root.userInfo = {}
			}
			if(this.$root.config.isSearch) {
				this.$dialog.loading.open('加载中，请稍后...');
				this.postRequest('customer/wxAuthor', {
					code: this.$root.config.code
				}).then(res => {
					this.$dialog.loading.close();
					if(!res) {
						this.showLogin = true
					} else {
						if(res.data.state == 0 && res.data.aaData.openid) {
							this.$dialog.loading.open('快捷登录中，请稍后...');
							this.openId = res.data.aaData.openid
							window.sessionStorage.setItem('openId', this.openId)
							this.postRequest('', {
								openId: res.data.aaData.openid,
								systemId: SYSTEMID,
								flag: 1,
								authCode: '',
							}, true).then(resp => {
								this.$dialog.loading.close();
								if(resp && resp.status == 200 && resp.data.state == 0) {
									if(resp.data && resp.data.state == 0) {
										//塞上北环
										if(this.$root.config.ssbhbgimg && this.$root.config.systemid == 8) {
											this.whoLogin(resp.data)
										} else {
											//银川
											this.isFirst = false;
											resp.data.sessionUser.token = resp.data.token
											if(resp.data.sessionUser.typeId == 'buyer') {
												this.$dialog.alert({
													mes: `尊敬的${resp.data.sessionUser.nickName},请使用供应商账号登录`
												})
												this.showLogin = true
											} else {
												this.merchantOrbuyer(resp);
											}
										}

									}
								} else {
									this.$dialog.toast({
										mes: '快捷登录失败，请使用账号密码登录！',
										timeout: 1500
									});
									this.showLogin = true
								}
								console.log('login', resp)

							})
						} else {
							this.showLogin = true
						}
					}
				})
			} else {
				this.showLogin = true
			}

		},
		mounted() {
			this.$store.dispatch('changeNavBarTitle', '登录')
			if(localStorage.getItem('accountObj')) {
				var o = JSON.parse(localStorage.getItem('accountObj'));
				this.checkbox = o.checkbox;
				this.username = o.username
			}
		},
		methods: {
			/**
			 * 注册
			 */
			reg() {
				this.$router.push({
					name: 'UserReg'
				})
			},
			/**
			 * 登录
			 */
			//绑定微信
			updateMyDetail(resp) {
				return new Promise((resolve, rejct) => {
					this.$nextTick(() => {
						this.$dialog.confirm({
							title: ' ',
							mes: `是否将${this.username}与微信绑定,方便下次直接登录!`,
							opts: [{
									txt: '否',
									color: false,
									callback: () => {
										resolve()
									}
								},
								{
									txt: '是',
									color: true,
									callback: () => {
										this.postRequest('user/updateMyDetail', {
											wxopenid: sessionStorage.getItem('openId') || '',
											userId: resp.data.sessionUser.userId,
											token: resp.data.token,
										}, false, true).then(res => {
											resolve(res.data)
										})
									}
								}
							]
						});
					})

				})
			},
			//买家登录
			loginBuyer(resp) {
				this.$store.commit('login', resp.data.sessionUser);
				this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
				if(sessionStorage.getItem('openId') && this.isFirst) {
					this.updateMyDetail(resp).then((d) => {
						this.$router.push({
							name: 'Enshrine'
						})
					})
				} else {
					this.$router.push({
						name: 'Enshrine'
					})
				}
			},
			//卖家登录，这里也包括那个超级管理员登录
			loginMerchant(resp) {
				this.$store.commit('login', resp.data.sessionUser);
				this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
				var urlStr = 'f_index'
				if(SYSTEMID == 7) {
					urlStr = 'f_jcgl'
					urlStr = 'f_index'
				}
				this.$store.commit({
					type:'getExtendStr',
					str:''
				})
				if(sessionStorage.getItem('openId') && this.isFirst) {
					this.updateMyDetail(resp).then((d) => {
						this.$router.push({
							name: urlStr,
						})
					})
				} else {
					this.$router.push({
						name: urlStr,
					})
				}
			},
			//既是买家也是卖家
			merchantOrbuyer(resp) {
				if(resp.data.sessionUser.typeId == 'merchant_buyer') {
					resp.data.sessionUser.typeId = 'merchant'
				}
				this.loginMerchant(resp)
			},
			downEnter(event) {
				var e = event || window.event;
				if(e && e.keyCode == 13) { //回车键的键值为13
					this.login() //调用登录按钮的登录事件
				}
			},
			//登录
			login() {
				if(this.username == '') {
					this.$dialog.alert({
						mes: '请输入用户名'
					});
					return false
				}
				if(this.password == '') {
					this.$dialog.alert({
						mes: '请输入密码'
					});
					return false
				}
				this.$dialog.loading.open('登录中，请稍后...');
				this.postRequest('', {
					loginName: this.username,
					password: this.password,
					systemId: SYSTEMID,
					flag: 1,
					authCode: '',
				}, true).then(resp => {
					this.$dialog.loading.close();
					if(resp && resp.status == 200) {
						if(resp.data && resp.data.state == 0) {
							var accountObj = {
								checkbox: this.checkbox,
								username: ''
							}
							if(this.checkbox) {
								accountObj.username = this.username
							}
							window.localStorage.setItem('accountObj', JSON.stringify(accountObj));
							if(this.$root.config.ssbhbgimg && this.$root.config.systemid == 8) {
								this.whoLogin(resp.data)
							} else {
								resp.data.sessionUser.token = resp.data.token
								if(resp.data.sessionUser.typeId == 'buyer') {
									this.$dialog.alert({
										mes: `尊敬的${resp.data.sessionUser.nickName},请使用供应商账号登录`
									})
								} else {

									this.merchantOrbuyer(resp);
								}
							}

						} else {
							this.$dialog.alert({
								mes: resp.data.msg
							});
						}
					} else {
						this.$dialog.alert({
							mes: resp.data.msg
						});
					}
				})
			},
			whoLogin(data) {
				return new Promise((resolve, rejct) => {
					if(data.sessionUser.typeCode) {
						this.postRequest('customer/list', {
							id: data.sessionUser.typeCode,
							token: data.token,
						}).then(res => {
							if(res.data.state == 0 && res.data.success) {
								this.$store.commit({
									type:'getExtendStr',
									str:res.data.aaData[0].extend
								})
								
								if(this.$store.state.extendStr=='MD'||this.$store.state.extendStr=='YP') {
									if(this.$store.state.extendStr=='YP'){
										this.$root.config.isTowGYS=false
									}else if(this.$store.state.extendStr=='MD'){
										this.$root.config.isTowGYS=true
									}
									data.sessionUser.typeId = 'merchant'
									data.sessionUser.extend = res.data.aaData[0].extend
									data.sessionUser.token = data.token
									this.$store.commit('login', data.sessionUser);
									this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
									this.$router.push({
										name: 'f_index'
									})
								} else {
									this.$dialog.alert({
										mes: '请使用一批、厂商、门店、二批或者配送商权限账号登录！'
									});
								}
									
								//塞上北环门店
//								if(this.$root.config.loginname == 'md') {
//									if(this.$store.state.extendStr=='MD') {
//										data.sessionUser.typeId = 'merchant'
//										data.sessionUser.extend = res.data.aaData[0].extend
//										data.sessionUser.token = data.token
//										this.$store.commit('login', data.sessionUser);
//										this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
//										this.$router.push({
//											name: 'f_index'
//										})
//									} else {
//										this.$dialog.alert({
//											mes: '请使用门店、二批或者配送商权限账号登录！'
//										});
//									}
//								} else {
//									//塞上北环一批	
//									if(this.$store.state.extendStr=='YP') {
//										data.sessionUser.typeId = 'merchant'
//										data.sessionUser.extend = res.data.aaData[0].extend
//										data.sessionUser.token = data.token
//										this.$store.commit('login', data.sessionUser);
//										this.$root.userInfo = JSON.parse(localStorage.getItem('quickUserInfo'))
//										this.$router.push({
//											name: 'f_index'
//										})
//									} else {
//										this.$dialog.alert({
//											mes: '请使用一批或厂商权限账号登录！'
//										});
//									}
//								}
							}
						})
					} else {
						this.$dialog.alert({
							mes: '请使用正确的账号登录'
						});
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	.yd-scrollview:after {
		height: 0;
	}
	
	.Login {
		input {
			font-family: 'PingFang-SC-Medium';
			font-size: 0.28rem;
		}
		height: 100%;
		background: url(../assets/firstImgs/bg_bg.png);
		background-size: 100% 100%;
		.logo {
			padding-top: 1.74rem;
			padding: 1.62rem 0 1.2rem 0;
			img {
				width: 2.6rem;
				height: 2.84rem;
			}
		}
		.form {
			width: 5.3rem;
			margin: 0 auto;
			.form-group {
				.yd-input {
					height: 0.46rem;
					font-size: 0.28rem;
				}
				border-bottom: 1px solid #C6C6C6;
				padding: 0.18rem 0;
				margin-bottom: 0.15rem;
				img.pswicon {
					width: 0.4rem;
					height: 0.46rem;
				}
			}
			.loginbtn {
				width: 100%;
				margin-top: 0.3rem;
				height: 0.78rem;
				background: #00A3FF;
				border-radius: 0.39rem;
				color: #fff;
				font-size: 0.31rem;
				text-align: center;
			}
		}
		.reg {
			padding-top: 2.5rem;
			width: 100%;
			text-align: center;
			span {
				color: #00A3FF;
			}
		}
		.forget {
			color: #626262;
			font-size: 0.24rem;
			display: flex;
			justify-content: space-between;
		}
		.l_footer {
			text-align: center;
			margin-top: 1.2rem;
		}
	}
</style>