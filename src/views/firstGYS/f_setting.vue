<template>
	<yd-layout>

		<div id="UserSetting">
			<div slot='top' class="header">
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"' style="width: 1.7rem;" href="#/f_mine" class="header_left">个人中心</a>
					<div v-else></div>
				</div>
				<div class="name">系统设置</div>
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
					<div v-else></div>
				</div>
			</div>
			<yd-cell-group>
				<yd-cell-item arrow @click.native="show1=true">
					<span slot="left">修改密码</span>
				</yd-cell-item>
			</yd-cell-group>

			<yd-cell-group v-if='$store.state.extendStr=="YP"'>
				<yd-cell-item arrow @click.native="$router.push({name:'f_add_user'})">
					<span slot="left">用户管理</span>
				</yd-cell-item>
			</yd-cell-group>
			<yd-cell-group v-if='false'>
				<yd-cell-item arrow type="link" href="#">
					<span slot="left">意见反馈</span>
				</yd-cell-item>
				<yd-cell-item arrow type="link" href="#">
					<span slot="left">关于</span>
				</yd-cell-item>
			</yd-cell-group>

			<div class="user_list">

			</div>
			<div v-if='$store.state.extendStr!="GL"' class="update_qr_img">
				<div class="update_qr_img_top">收款二维码</div>
				<div class="update_qr_img_bottom">
					<uploadOneImg @success='successImg("wxcodePic")' @remove='removeImg("wxcodePic")' :uploadNum='0' :qrCode='qrCode' :picUrl.sync='wxcodePic'>
					</uploadOneImg>
				</div>
			</div>
			
			<div v-if='$store.state.extendStr!="GL"&&false' class="update_qr_img">
				<div class="update_qr_img_top">清真食品准营证</div>
				<div class="update_qr_img_bottom">
					<uploadOneImg @success='successImg("muslimfoodPermitPic")' @remove='removeImg("muslimfoodPermitPic")' :uploadNum='1' :picUrl.sync='muslimfoodPermitPic'>
					</uploadOneImg>
				</div>
			</div>
			<div v-if='$store.state.extendStr!="GL"&&property==1&&false' class="update_qr_img">
				<div class="update_qr_img_top">食品流通许可证</div>
				<div class="update_qr_img_bottom">
					<uploadOneImg @success='successImg("foodLicensePic")' @remove='removeImg("foodLicensePic")' :uploadNum='2' :picUrl.sync='foodLicensePic'>
					</uploadOneImg>
				</div>
			</div>
			<!--<yd-button @click.native="logOut" size="large" type="hollow">切换账号</yd-button>-->
			<!--<yd-button @click.native="logOut" size="large" type="hollow">退出登录</yd-button>-->
			<yd-popup v-model="show1" position="bottom" height="100%">
				<div class="popup">
					<div class="popup-title flex flex-x-end flex-y-center">
						<!--<strong>修改密码</strong>-->
						<yd-icon name="error" @click.native="show1=false" size="0.45rem"></yd-icon>
					</div>
					<yd-cell-group>
						<yd-cell-item>
							<span slot="left">
				              <div class="lable">
				                <strong>原密码</strong>
				              </div>
				            </span>
							<yd-input slot="right" type="password" v-model="oldPassword" max="20" :show-success-icon="false" placeholder="请输入原密码"></yd-input>
						</yd-cell-item>

						<yd-cell-item>
							<span slot="left">
				              <div class="lable">
				                <strong>新密码</strong>
				              </div>
				            </span>
							<yd-input slot="right" type="password" v-model="newPassword" placeholder="请输入新密码" :show-success-icon="false"></yd-input>
						</yd-cell-item>

						<yd-cell-item>
							<span slot="left">
				              <div class="lable">
				                <strong>确认密码</strong>
				              </div>
				            </span>
							<yd-input slot="right" type="password" v-model="newPassword2" placeholder="请再次输入新密码" :show-success-icon="false"></yd-input>
						</yd-cell-item>
					</yd-cell-group>
				</div>
				<div class="flex flex-x-center" style="padding: 0 0.24rem;">
					<div @click="updateMyPassword" class="loginbtn flex flex-y-center flex-x-center">
						<span>确认修改</span>
					</div>
				</div>
			</yd-popup>

		</div>
	</yd-layout>
</template>
<script>
	import { Upload, Dialog } from 'element-ui';
	import uploadOneImg from '../component/uploadOneImg.vue'
	export default {
		components: {
			[Upload.name]: Upload,
			[Dialog.name]: Dialog,
			[uploadOneImg.name]: uploadOneImg,
		},
		data() {
			return {
				show1: false,
				oldPassword: '',
				newPassword: '',
				newPassword2: '',
				wxcodePic: '',
				foodLicensePic: '',
				muslimfoodPermitPic: '',
				property:'',
				qrCode:true,
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '系统设置')
			console.log(this.$store.state.extendStr)
			if(!this.$root.userInfo.typeId) {
				if(sessionStorage.getItem('isQrCode') == 0) {
					this.$router.push({
						name: 'login'
					})
				} else {
					if(this.$root.userInfo.userId === 0) {

					} else {
						this.$router.push({
							name: 'f_login'
						})
					}

				}
			}
		},
		mounted() {
			this.postRequest('customer/list', {
				id: this.$root.userInfo.typeCode,
			}).then(resp => {
				if(resp.data.state == 0) {
					//					this.wxcodePic=resp.data.aaData[0].wxcodePic
					//					console.log(this.wxcodePic)
					this.$nextTick(() => {
						this.wxcodePic = resp.data.aaData[0].wxcodePic
						this.foodLicensePic = resp.data.aaData[0].foodLicensePic
						this.muslimfoodPermitPic = resp.data.aaData[0].muslimfoodPermitPic
						this.property = resp.data.aaData[0].property
					})

				}
			})
		},
		methods: {
			successImg(str) {
				var param = {
					id: this.$root.userInfo.typeCode,
					customerProperty: this.$root.userInfo.extend,
				}
				if(str == 'wxcodePic') {
					param.wxcodePic = this.wxcodePic
				} else if(str == 'foodLicensePic') {
					param.foodLicensePic = this.foodLicensePic
				} else {
					param.muslimfoodPermitPic = this.muslimfoodPermitPic
				}
				this.postRequest('customer/update', param).then(resp => {

				})
			},
			removeImg(str) {
				if(this.wxcodePic || this.foodLicensePic || this.muslimfoodPermitPic) {
					var flg=false;
					var param = {
						id: this.$root.userInfo.typeCode,
						customerProperty: this.$root.userInfo.extend,
					}
					if(str == 'wxcodePic'&&this.wxcodePic) {
						param.wxcodePic = ''
						flg=true
					} else if(str == 'foodLicensePic'&&this.foodLicensePic) {
						param.foodLicensePic = ''
						flg=true
					} else if(str == 'muslimfoodPermitPic'&&this.muslimfoodPermitPic) {
						param.muslimfoodPermitPic = ''
						flg=true
					}
					if(flg){
						this.postRequest('customer/update', param).then(resp => {
							if(str == 'wxcodePic') {
								this.wxcodePic=''
							} else if(str == 'foodLicensePic') {
								this.foodLicensePic=''
							} else if(str=='muslimfoodPermitPic'){
								this.muslimfoodPermitPic=''
							}
						})
					}
				}

			},
			/**
			 * 修改密码
			 */
			updateMyPassword() {
				var o = {
					oldPassword: this.oldPassword,
					newPassword: this.newPassword,
					newPassword2: this.newPassword2
				}
				if(o.oldPassword == '') {
					this.$dialog.alert({
						mes: '请输入原密码'
					})
					return false
				}
				if(o.newPassword == '') {
					this.$dialog.alert({
						mes: '请输入新密码'
					})
					return false
				}
				if(o.newPassword2 == '') {
					this.$dialog.alert({
						mes: '请再次输入新密码'
					})
					return false
				}
				if(o.newPassword2 != o.newPassword) {
					this.$dialog.alert({
						mes: '两次输入密码不一致'
					})
					return false
				}

				this.postRequest('user/updateMyPassword', {
					oldPassword: o.oldPassword,
					newPassword: o.newPassword
				}, false, true).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.$dialog.toast({
							mes: '修改成功,请重新登录',
							timeout: 1200,
							icon: 'success',
							callback: function() {
								this.updateLogOut()
								this.show1 = false
							}.bind(this)
						});
					} else {
						this.$dialog.alert({
							mes: resp.data.msg
						})
					}
				})
			},
			/**
			 * 退出登录
			 */
			updateLogOut(){
				if(this.$store.state.extendStr == "GL") {
					this.$store.commit('login', {});
					this.$root.userInfo = {}
					this.$router.push({
						name: 'f_login'
					})
				} else {
					this.$store.commit('login', {});
					this.$root.userInfo = {}
					window.location = this.$root.config.loginOutUrl
				}
			},
			logOut() {
				this.$dialog.confirm({
					title: '提示：',
					mes: '确认切换账号？',
					opts: () => {
						if(this.$store.state.extendStr == "GL") {
							this.$store.commit('login', {});
							this.$root.userInfo = {}
							this.$router.push({
								name: 'f_login'
							})
						} else {
							this.$store.commit('login', {});
							this.$root.userInfo = {}
							window.location = this.$root.config.loginOutUrl
						}
					}
				});

			}
		}
	};
</script>
<style lang="scss">
	#UserSetting {
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.loginbtn {
			width: 100%;
			height: 0.78rem;
			background: #6FB138;
			border-radius: 0.39rem;
			color: #fff;
			font-size: 0.31rem;
			text-align: center;
		}
		color: #2F3927;
		.yd-cell-arrow:after {
			margin-left: 0.1rem;
		}
		.yd-btn-hollow {
			border: none;
		}
		.update_qr_img {
			padding: .24rem;
			font-size: .28rem;
			color: #555;
			background: white;
			.update_qr_img_top {}
			.update_qr_img_bottom {
				display: flex;
				justify-content: space-around;
			}
			#uploadImg {
				/*justify-content: space-around;*/
				.upload_width {
					/*margin: auto;*/
				}
			}
		}
		.el-dialog__body {
			img {
				position: relative;
				z-index: 9999;
			}
		}
		.el-dialog__wrapper {
			z-index: 9999;
		}
		.el-dialog__wrapper {
			top: 1rem;
		}
	}
	
	.v-modal {
		z-index: 2 !important;
		display: none;
	}
</style>