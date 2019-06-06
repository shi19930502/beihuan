<template>
	<yd-layout>
		<div id="editUser">
			<div slot='top' class="header">
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_add_user" class="header_left">上一步</a>
					<div v-else></div>
				</div>
				<div class="name">{{$route.query.userId?"编辑用户":"新增用户"}}</div>
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
					<div v-else></div>
				</div>
			</div>
			<div class="popup">
				<yd-cell-group>
					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong>用户名称</strong>
					              </div>
					            </span>
						<yd-input v-if='isEdit' slot="right" v-model="form.nickName" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
						<span class="list_span" v-else slot="right">{{form.nickName}}</span>
					</yd-cell-item>

					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong>登录账号</strong>
					              </div>
					            </span>
						<yd-input v-if='isEdit' slot="right" v-model="form.loginName" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
						<span class="list_span" v-else slot="right">{{form.loginName}}</span>
					</yd-cell-item>

					<yd-cell-item v-if='isEdit'>
						<span slot="left">
					              <div class="lable">
					                <strong>密码</strong>
					              </div>
					            </span>
						<yd-input slot="right" type="password" v-model="form.password" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
					</yd-cell-item>

					<yd-cell-item v-if='isEdit'>
						<span slot="left">
					              <div class="lable">
					                <strong>确认密码</strong>
					              </div>
					            </span>
						<yd-input slot="right" type="password" v-model="password2" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
					</yd-cell-item>

					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong>手机号</strong>
					              </div>
					            </span>
						<yd-input slot="right" ref='phoneNumber' v-model="form.mobile" regex="mobile" :show-success-icon="false" placeholder="请输入手机号码"></yd-input>
						<!--<yd-input slot="right" v-model="form.mobile" max="20"  placeholder="请输入"></yd-input>-->
					</yd-cell-item>

					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong>身份证</strong>
					              </div>
					            </span>
						<yd-input slot="right" v-model="form.identityCard" max="20" :show-success-icon="false" placeholder="请输入身份证号码"></yd-input>
					</yd-cell-item>

					<yd-cell-item v-if='form.extend!="main"'>
						<span slot="left">
					              <div class="lable">
					                <strong>是否激活</strong>
					              </div>
					            </span>
						<yd-switch slot="right" v-model="form.status"></yd-switch>
					</yd-cell-item>

					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong>登录时间</strong>
					              </div>
					            </span>
						<yd-datetime type="time" v-model="allowTimeStart" slot="right"></yd-datetime>
					</yd-cell-item>

					<yd-cell-item>
						<span slot="left">
					              <div class="lable">
					                <strong></strong>
					              </div>
					           </span>
						<yd-datetime type="time" v-model="allowTimeEnd" slot="right"></yd-datetime>
					</yd-cell-item>
					<div class="part_bd">
						<div class="strong">角色绑定</div>
						<yd-checklist v-model="checkList">
							<yd-checklist-item v-for='item in partList' :val="item.id">
								<div style="height: 50px;line-height: 50px;">{{item.name}}</div>
							</yd-checklist-item>
						</yd-checklist>
					</div>

				</yd-cell-group>
			</div>
			<div class="flex flex-x-center" style="padding: 0 0.24rem;">
				<div @click="submit" class="loginbtn flex flex-y-center flex-x-center">
					<span>保存</span>
				</div>
			</div>
		</div>
	</yd-layout>
</template>
<script>
	export default {
		data() {
			return {
				show1: false,
				partList: [], //角色
				userList: [], //用户
				userPopup: false,
				checkList: [],
				allowTimeStart: '00:00',
				allowTimeEnd: '23:59',
				isEdit: true,
				form: {
					nickName: '',
					loginName: '',
					mobile: '',
					identityCard: '',
					password: '',
					status: true,
					allowTimeStart: "00:00",
					allowTimeEnd: "23:59",
					extend: '',
				},
				password2: '',
				userId: '',
			}
		},
		watch: {
			allowTimeStart: function(val, oldVal) {
				var startHour = val.split(":")[0] > 10 ? val.split(":")[0] : parseFloat(val.split(":")[0]) + 0
				var endHour = this.allowTimeEnd.split(":")[0] > 10 ? this.allowTimeEnd.split(":")[0] : parseFloat(this.allowTimeEnd.split(":")[0]) + 0
				var startMin = val.split(":")[1] > 10 ? val.split(":")[1] : parseFloat(val.split(":")[1]) + 0
				var endMin = this.allowTimeEnd.split(":")[1] > 10 ? this.allowTimeEnd.split(":")[1] : parseFloat(this.allowTimeEnd.split(":")[1]) + 0
				if(startHour > endHour) {
					this.$dialog.toast({
						mes: '结束时间不能小于开始时间，以为你重置结束时间',
						timeout: 2000
					});
					this.allowTimeEnd = '23:59'
				} else if(startHour == endHour) {
					if(startMin > endMin) {
						this.$dialog.toast({
							mes: '结束时间不能小于开始时间，以为你重置结束时间',
							timeout: 2000
						});
						this.allowTimeEnd = '23:59'
					}
				}
			},
			allowTimeEnd: function(val, oldVal) {
				var endHour = val.split(":")[0] > 10 ? val.split(":")[0] : parseFloat(val.split(":")[0]) + 0
				var startHour = this.allowTimeStart.split(":")[0] > 10 ? this.allowTimeStart.split(":")[0] : parseFloat(this.allowTimeStart.split(":")[0]) + 0
				var endMin = val.split(":")[1] > 10 ? val.split(":")[1] : parseFloat(val.split(":")[1]) + 0
				var startMin = this.allowTimeStart.split(":")[1] > 10 ? this.allowTimeStart.split(":")[1] : parseFloat(this.allowTimeStart.split(":")[1]) + 0
				if(startHour > endHour) {
					this.$dialog.toast({
						mes: '结束时间不能小于开始时间，以为你重置结束时间',
						timeout: 2000
					});
					this.allowTimeEnd = '23:59'
				} else if(endHour == startHour) {
					if(startMin > endMin) {
						this.$dialog.toast({
							mes: '结束时间不能小于开始时间，以为你重置结束时间',
							timeout: 2000
						});
						this.allowTimeEnd = '23:59'
					}
				}

			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '用户管理')
			
		},
		mounted() {
			this.init();

		},
		methods: {
			init() {
				this.getPartList();
				this.userId = this.$route.query.userId
				//请求用户管理，根据文档最多三个
				if(this.userId) {
					this.getUser();
					//获取绑定角色
					this.getRolesByUserId();
				}
			},
			getPartList() {
				this.$dialog.loading.open('数据加载中...');
				//请求角色管理
				this.postRequest('/permission/tsysRole/list', {
					statu: 1
				}).then(resp => {
					if(resp.data.state == 0) {
						this.$dialog.loading.close();
						this.partList = resp.data.aaData
					}
				})
			},
			getRolesByUserId() {
				this.postRequest('/permission/tsysRoleUser/getRolesByUserId', {
					userId: this.userId,
				}).then(resp => {
					if(resp.data.state == 0) {
						resp.data.aaData.forEach((item) => {
							this.checkList.push(item.id)
						})
					}
				})
			},
			getUser() {
				this.postRequest('/user/user/list', {
					userId: this.userId,
					statu: '',
					nickName: '',
					loginName: '',
					pageNum: 1,
					pageSize: 4
				}).then(resp => {
					if(resp.data.state == 0) {
						this.isEdit = false
						this.form.nickName = resp.data.aaData[0].nickName
						this.form.loginName = resp.data.aaData[0].loginName
						this.form.mobile = resp.data.aaData[0].mobile
						this.form.status = resp.data.aaData[0].status ? true : false
						this.form.userId = resp.data.aaData[0].userId
						this.form.extend = resp.data.aaData[0].extend

						var allowTimeStart = resp.data.aaData[0].allowTimeStart
						var allowTimeEnd = resp.data.aaData[0].allowTimeEnd
						var sStr = [],
							eStr = [];
						allowTimeStart ? sStr = allowTimeStart.split(":")[0] + ":" + allowTimeStart.split(":")[1] : sStr = '00:00';
						allowTimeEnd ? eStr = allowTimeEnd.split(":")[0] + ":" + allowTimeEnd.split(":")[1] : eStr = '23:59';
						this.allowTimeStart = this.form.allowTimeStart = sStr
						this.allowTimeEnd = this.form.allowTimeEnd = eStr
						console.log(this.form)
					}
				})
			},
			//保存
			submit() {
				var url = '/user/user/create';
				if(this.userId) {
					url = '/user/user/update';
				} else {
					if(!this.form.nickName) {
						this.$dialog.alert({
							mes: '请输入用户名称'
						})
						return false
					}
					if(!this.form.loginName) {
						this.$dialog.alert({
							mes: '请输入登录账号'
						})
						return false
					}
					if(!this.form.password) {
						this.$dialog.alert({
							mes: '请输入密码'
						})
						return false
					} else {
						var regPassword = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/
						if(!regPassword.test(this.form.password)) {
							this.$dialog.alert({
								mes: '密码长度应为6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格!'
							})
							return false
						}
					}
					if(this.password2 != this.form.password) {
						this.$dialog.alert({
							mes: '两次密码不一致'
						})
						return false
					}
					if(this.form.mobile) {
						const input = this.$refs.phoneNumber;
						if(!input.valid) {
							this.$dialog.alert({
								mes: '请输入正确的手机号码'
							})
							return false
						}
					}
					if(this.form.identityCard) {
						var regIdCar = /^(\d{15}|\d{17}(\d|X))$/
						if(!regIdCar.test(this.form.identityCard)) {
							this.$dialog.alert({
								mes: '请输入正确的身份证号'
							})
							return false
						}
					}

				}

				this.form.allowTimeEnd = this.allowTimeEnd + ':00'
				this.form.allowTimeStart = this.allowTimeStart + ':00'
				var o = {};
				if(this.userId) {
					o.mobile = this.form.mobile
					o.identityCard = this.form.identityCard
					o.userId = this.form.userId
					o.status = this.form.status
					o.allowTimeStart = this.form.allowTimeStart
					o.allowTimeEnd = this.form.allowTimeEnd
				} else {
					var o = this.form;

				}
				o.status ? o.status = 1 : o.status = 0;
				console.log(this.form.status)
				this.save(url, o);
				console.log(o)
			},
			//保存
			save(url, o) {
				this.$dialog.loading.open('数据保存中...');
				this.postRequest(url, o).then(resp => {
					if(resp.data.state == 0) {
						//绑定角色
						this.postRequest('/permission/tsysRoleUser/binDing', {
							roleId: this.checkList,
							userId: this.userId ? this.userId : resp.data.aaData.userId
						}).then(res => {
							if(res.data.state == 0) {
								this.$dialog.loading.close();
								this.$dialog.toast({
									mes: '保存成功',
									timeout: 1500,
									icon: 'success',
									callback: () => {
										this.$router.push({
											name: 'f_add_user'
										})
									}
								});
							}
						})
					} else {
						this.$dialog.loading.close();
						this.$dialog.alert({
							mes: resp.data.msg
						})
					}
				})
			},
		}
	};
</script>
<style lang="scss">
	#editUser {
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.list_span {
			text-align: left;
			width: 100%;
			color: #848484;
			font-weight: bold;
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
		.add_user {
			color: rgba(111, 177, 56, 1);
			/*color: rgba(255,61,21,1);*/
			/*color: rgba(107,124,140,1);*/
		}
		.user_list {
			background: white;
			.list {
				margin-left: .2rem;
				border-bottom: 1px solid #e4e4e4;
				line-height: 1rem;
				display: flex;
				justify-content: space-between;
				.list_name {
					font-size: .28rem;
					flex-grow: 1;
					align-items: center;
					display: flex;
					.name {
						margin-right: .1rem;
						max-width: 3.65rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.status {
						align-items: center;
						display: flex;
						span {
							display: inline-block;
							box-sizing: content-box;
							padding: .01rem .1rem;
							height: .24rem;
							line-height: .24rem;
							/*line-height: 1;*/
							border-radius: .2rem;
							font-size: .2rem;
						}
					}
				}
				.list_btn {
					width: 2.5rem;
					display: flex;
					flex-grow: 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 .2rem 0 .1rem;
					.list_edit {
						border-radius: .2rem;
						text-align: center;
						width: 1rem;
						height: .5rem;
						line-height: .5rem;
						color: rgba(111, 177, 56, 1);
						/*border: 1px solid rgba(111, 177, 56, 1);*/
						background: rgba(111, 177, 56, .1);
					}
					.list_del {
						color: rgba(255, 61, 21, 1);
						/*border: 1px solid rgba(255,61,21,1);*/
						background: rgba(255, 61, 21, .1);
					}
				}
			}
		}
		.part_bd {
			.strong {
				padding: .2rem .2rem .2rem .25rem;
				font-size: .3rem;
				color: #555555;
				font-weight: bold;
			}
		}
	}
</style>