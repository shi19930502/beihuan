<template>
	<yd-layout id='fMine'>
		<!--其实这里应该提出来写一个公共模块的-->
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="#/f_index" class="header_left">首页</a>
				<div v-else></div>
			</div>
			<div class="name">个人中心</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
				<div v-else></div>
			</div>
		</div>
		<div class="list">
			<div class="list_item" @click="goNext('f_information')">
				<img class="list_item_icon_1" src="../../assets/firstImgs/icon_mine.png" alt="" />
				<div class="list_title">
					<div class="title">基本信息</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
			<div class="list_item" @click="goNext('f_addr')">
				<img class="list_item_icon_2" src="../../assets/firstImgs/icon_ad.png" alt="" />
				<div class="list_title">
					<div class="title">地址信息</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
			<div class="list_item" @click="goNext('f_store')">
				<img class="list_item_icon_3" src="../../assets/firstImgs/icon_store.png" alt="" />
				<div class="list_title">
					<div class="title">店铺信息</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
			<div class="list_item" @click="goNext('f_ps_money')">
				<img class="list_item_icon_5" src="../../assets/firstImgs/ps_money.png" alt="" />
				<div class="list_title">
					<div class="title">配送金额信息</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
			<div class="list_item" @click="goNext('f_setting')">
				<img class="list_item_icon_4" src="../../assets/firstImgs/home_tabicon_shezhi_a@2x.png" alt="" />
				<div class="list_title">
					<div class="title">系统设置</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
			<div class="list_item" style="margin-bottom: .2rem;" @click="logOut('f_setting')">
				<img class="list_item_icon_4" src="../../assets/firstImgs/cut.png" alt="" />
				<div class="list_title">
					<div class="title">切换账号</div>
					<img src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '个人中心')
		},
		watch: {

		},
		computed: {

		},
		mounted() {

		},
		methods: {
			goNext(str){
				this.$router.push({
					name: str
				})
			},
			logOut() {
				//				if(sessionStorage.getItem('isQrCode')==0){
				//					this.$router.push({
				//						name:'login'
				//					})
				//				}else{
				//					this.$router.push({
				//						name:'f_login'
				//					})
				//				}
				//				window.location='http://ssbh.yshfresh.com/mp/index.html#/Login'
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
	}
</script>

<style lang='scss'>
	#fMine{
		/*background: white;*/
		.list{
			margin-top: .2rem;
			font-size: .32rem;
			.list_item{
				color: #211E1D;
				padding-left: .25rem;
				background: white;
				font-weight: 500;
				font-family: 'PingFang-SC-Medium';
				display: flex;
				align-items: center;
				.list_item_icon_1{
					width: .36rem;
					height: .34rem;
					margin-right: .3rem;
				}
				.list_item_icon_2{
					width: .31rem;
					height: .36rem;
					margin-right: .3rem;
				}
				.list_item_icon_3{
					width: .35rem;
					height: .34rem;
					margin-right: .3rem;
				}
				.list_item_icon_4{
					width: .33rem;
					height: .34rem;
					margin-right: .3rem;
				}
				.list_item_icon_5{
					width: .34rem;
					height: .27rem;
					margin-right: .3rem;
				}
				.list_title{
					padding: .22rem .2rem .22rem 0;
					flex: 1;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #D6D6D6;
					justify-content: space-between;
					.title{
						flex: 1;
					}
					img{
						width: .14rem;
						height: .24rem;
					}
				}
				&:nth-child(4){
					margin-bottom: .2rem;
					.list_title{
						border-bottom: none;
					}
				}
				&:last-child{
					.list_title{
						border-bottom: none;
					}
				}
			}
			.list_item:nth-child(4){
				.list_title{
					border-bottom: none;
				}
			}
		}
		
		
	}
	
</style>