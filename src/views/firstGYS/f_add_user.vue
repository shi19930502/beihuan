<template>
	<yd-layout>
		<div id="addUser">
			<div slot='top' class="header">
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_setting" class="header_left">上一步</a>
					<div v-else></div>
				</div>
				<div class="name">用户管理</div>
				<div>
					<a v-if='$root.userInfo.typeId=="merchant"'  href="javascript:;"></a>
					<div v-else></div>
				</div>
			</div>
			<yd-cell-group v-if='$root.userExtend=="main"'>
				<yd-cell-item arrow @click.native="addUserF">
					<span slot="left" class="add_user">新增用户</span>
				</yd-cell-item>
			</yd-cell-group>
			<div class="user_list">
				<div class="list" v-for='item in userList'>
					<div class="list_name">
						<!--:class='{mani_name:$root.userExtend=="main"}'-->
						<!--:class='{mani_status:$root.userExtend=="main"}'-->
						<div  class="name">{{item.nickName}}</div>
						<div  class="status" >
							<span :style="{color:item.status==1?'rgba(111,177,56,1)':'rgba(107,124,140,1)',
								border:item.status==1?'1px solid rgba(111,177,56,1)':'1px solid rgba(107,124,140,1)'}">
								{{item.status==1?'已激活':'未激活'}}
							</span>
						</div>
					</div>
					
					<div :style="{width:item.extend=='main'?'1.21rem':'2.5rem'}" class="list_btn"  v-if='$root.userExtend=="main"'>
						<div @click='goEditUser(item.userId)' class="list_edit">编辑</div>
						<div v-if='item.extend!="main"' @click="delUser(item.userId)" class=" list_edit list_del ">删除</div>
					</div>
				</div>
			</div>
			<div style="color: #ff3d15;padding: .2rem 0 0rem ;text-align: center;">***&nbsp;最多只能存在1名主用户和3名子用户&nbsp;***</div>
		</div>
	</yd-layout>
</template>
<script>
	//user/user/create
	//	nickName: 用户名称
	//	loginName: 登录账号
	//	mobile: 15281037643
	//	identityCard: 500225199405023817
	//	password: mima123456
	//	status: 1
	//	allowTimeStart: 00:30:00
	//	allowTimeEnd: 03:45:00
	export default {
		data() {
			return {
				show1: false,
				oldPassword: '',
				newPassword: '',
				newPassword2: '',
				partList: [], //角色
				userList: [], //用户
				userPopup: false,
				form: {
					nickName: '用户名称',
					loginName: '登录账号',
					mobile: '15281037643',
					identityCard: '500225199405023817',
					password: 'mima123456',
					status: true,
					allowTimeStart: " 00:30:00",
					allowTimeEnd: "03:45:00",
				},
				password2: ''
			}
		},
		created() {
			this.getExtend();
			this.$store.dispatch('changeNavBarTitle', '用户管理')
			
		},
		mounted() {
			this.init();
		},
		methods: {
			getExtend() {
				this.postRequest('/user/user/list', {
					userId: this.$root.userInfo.userId
				}).then(res => {
					if(res.data.state == 0) {
						this.$root.userExtend = res.data.aaData[0].extend || ""
					}
				})
			},
			//去编辑用户
			goEditUser(userId) {
				this.$router.push({
					name: "f_edit_user",
					query: {
						userId: userId
					}
				})
			},
			//删除用户
			delUser(userId) {
				this.$dialog.confirm({
                    title: '提示：',
                    mes: '确定删除该用户？',
                    opts: () => {
                       	this.postRequest('/user/user/delete', {
							userId: userId
						}).then(resp => {
							if(resp.data.state == 0) {
								this.$dialog.notify({
				                    mes: '删除成功！' ,
				                    timeout: 3000,
				                });
								this.getUserList();
							}else{
								this.$dialog.notify({
				                    mes: resp.data.msg ,
				                    timeout: 4000,
				                    callback: () => {
				                    	
				                    }
				                });
							}
						})
                    }
                });
				
			},
			init() {
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
				//请求用户管理，根据文档最多三个
				this.getUserList();
			},
			getUserList(){
				this.postRequest('/user/user/list', {
					statu: '',
					nickName: '',
					loginName: '',
					pageNum: 1,
					pageSize: 4
				}).then(resp => {
					if(resp.data.state == 0) {
						this.userList = resp.data.aaData
					}
				})
			},
			//新增用户
			addUserF() {
				if(this.userList.length >= 4) {
					this.$dialog.toast({
						mes: '最多只能存在1名主用户和3名子用户!',
						timeout: 3000
					});
					return
				} else if(this.partList.length <= 0) {
					this.$dialog.toast({
						mes: '请先在商家系统中添加角色！',
						timeout: 3000
					});
				} else {
					//this.userPopup = true;
					this.$router.push({
						name: 'f_edit_user'
					})
				}
			},
		}
	};
</script>
<style lang="scss">
	#addUser {
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
					max-width: 100%;
					align-items: center;
					display: flex;
					.name {
						margin-right: .1rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						/*max-width: 79%;*/
						width: 3rem;
						flex-grow: 1;
					}
					.status {
						width: 1rem;
						flex-grow: 0;
						margin-right: .1rem;
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
					.mani_name{
						flex-grow: 1;
						width: 3rem;
						max-width: 100%;
					}
					.mani_status{
						flex-grow: 0;
					}
				}
				.list_btn {
					width: 2.5rem;
					display: flex;
					flex-grow: 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 .2rem 0 0rem;
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
	}
</style>