<template>
	<yd-layout id='fIndex'>
		<div class="header" :class="{classBg:city}">
			<div ref='message' class="message">
				<div class="message_children">
					<img src="../../assets/firstImgs/home_icon-person@2x.png" alt="" />
					<div class="meassage_bottom">
						<div class="name">{{userInfo.nickName}}</div>
						<div class="name_tel">
							<span>用户：{{userInfo.loginName}}&nbsp;&nbsp;{{userInfo.mobile}}</span>
							<img  v-if='$root.config.systemid==8' @click="checkQrCode" src="../../assets/firstImgs/icnon.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="nav_list">
			<div class="kong" :style="kongStyle"></div>
			<template v-if='$root.config.systemid==8'>
				<div class="list_href">
					<!--<div class="list_c_com" @click='goNext("Merchant","kj")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_kjxd@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">快捷下单</div>
							<div class="list_sm">快速创建订单</div>
						</div>
					</div>-->
					<div class="list_c_com" @click='goNext("f_ddgl")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_ddgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">销售订单</div>
							<div class="list_sm">销售订单统计与处理</div>
						</div>
					</div>
					<div class="list_c_com" @click='goNext("f_order")''>
						<img class="list_img" src="../../assets/firstImgs/home_icon_ddgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">采购订单</div>
							<div class="list_sm">采购订单统计与处理</div>
						</div>
					</div>
					
					
				</div>
				<div class="list_href">
					<div class="list_c_com" @click='goNext("f_jcgl")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_jcgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">进场管理</div>
							<div class="list_sm">进场信息统计操作</div>
						</div>
					</div>
					<div class="list_c_com" @click='goNext("f_spgl")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_spgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">商品管理</div>
							<div class="list_sm">商品增删改查</div>
						</div>
					</div>
					
				</div>
				<div class="list_href">
					<div class="list_c_com" @click='goNext("f_tjfx")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_tjfx@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">统计分析</div>
							<div class="list_sm">数据统计与分析</div>
						</div>
					</div>
					<div v-if='$store.state.extendStr=="MD"' class="list_c_com" @click='goWantTobuy("NorthShop")'>
						<img class="list_img" src="../../assets/firstImgs/icon_caigou.png" alt="" />
						<div class="list_right">
							<div class="list_title">我要采购</div>
							<div class="list_sm">快捷购买商品</div>
						</div>
					</div>
					<div v-if='$store.state.extendStr=="YP"' class="list_c_com" @click='goNext("f_mine")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_xtsz@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">个人中心</div>
							<div class="list_sm">基础信息查看和设置</div>
						</div>
					</div>
					
				</div>
				<div class="list_href">
					<div v-if='$store.state.extendStr=="MD"' class="list_c_com" @click='goNext("f_mine")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_xtsz@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">个人中心</div>
							<div class="list_sm">基础信息查看和设置</div>
						</div>
					</div>
				</div>
				<!--<div class="list_href" v-if='$root.userInfo.extend=="004"'>
					
				</div>-->
			</template>
			<template v-else>
				<div class="list_href">
					<div class="list_c_com" @click='goNext("f_jcgl")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_jcgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">进场管理</div>
							<div class="list_sm">进场信息统计操作</div>
						</div>
					</div>
					<div class="list_c_com" @click='goNext("f_jcgl","jyjc")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_ddgl@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">检疫检测</div>
							<div class="list_sm">进场信息列表</div>
						</div>
					</div>
				</div>
				<div class="list_href">
					<!--<div class="list_c_com" @click='goNext("f_jcgl")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_tjfx@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">管理费管理</div>
							<div class="list_sm">管理费收取信息</div>
						</div>
					</div>-->
					<div v-if='true' class="list_c_com" @click='goNext("f_setting")'>
						<img class="list_img" src="../../assets/firstImgs/home_icon_xtsz@2x.png" alt="" />
						<div class="list_right">
							<div class="list_title">系统设置</div>
							<div class="list_sm">基础信息设置</div>
						</div>
					</div>
				</div>
			</template>
				
		</div>
		<footer class="f_footer">
			{{$root.config.footerName}}
		</footer>

		<yd-popup v-model="qrShow" position="center" width="89%">
			<div class="qr_code">
				<div class="qr_code_header">
					<img src="../../assets/firstImgs/icon_photo.png" alt="" />
					<div class="right">
						<p class="user_name">{{userInfo.loginName}}</p>
						<p class="market_name">{{userInfo.nickName}}</p>
					</div>
				</div>
				<div class="qr_code_bottom">
					<qriously id='qrRef' v-show='false' :backgroundAlpha="backgroundAlpha" ref='qrRef' :value="initQCode" :size="400" />
					<img :src="imgSrc" alt="" />
				</div>
				<div @click="qrShow=false" class="close">关闭</div>
			</div>
			
		</yd-popup>
	</yd-layout>
</template>

<script>
	import VueQriously from 'vue-qriously'
	import Vue from 'vue'
	Vue.use(VueQriously)
	export default {
		data() {
			return {
				userInfo: this.$root.userInfo,
				kongStyle: {
					width: '100%',
					height: '1.7rem'
				},
				city: CONFIG.ssbhbgimg ? false : true,
				ces: '',
				qrShow: false,
				imgSrc: '',
				backgroundAlpha: 1,
				initQCode: ''
			}
		},
		created() {
			console.log(this.$root.config)
			console.log('u', this.$root.userInfo)
			if(this.$root.config.systemid==8){
				var url='fLogin_first_'
				//userInfo.extend
				if(this.$store.state.extendStr=='MD'){
					url='fLogin_second_'
					if(this.$root.userInfo.extend=='004'){
						url='mLogin_second_'
					}
				}
				var urlParams = url + this.$root.userInfo.typeCode
				if(this.$root.config.quickLogin) {
					this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + this.$root.config.wX_URL + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
				} else {
					this.initQCode = this.$root.config.wX_URL + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
				}
				this.$nextTick(() => {
					var canvas = document.getElementsByTagName('canvas')
					this.imgSrc = canvas[0].toDataURL("image/png");
				})
				this.$store.dispatch('changeNavBarTitle', '首页')
				console.log(this.userInfo)
				if(!this.userInfo.userId) {
					this.$dialog.confirm({
						title: '提示:',
						mes: '请先登录！',
						opts: [{
							txt: '确定',
							color: true,
							callback: () => {
								//							this.$router.push({
								//								name: 'f_login'
								//							})
								localStorage.setItem('quickUserInfo', "{}");
								localStorage.setItem('userInfo', '{}');
								window.location = CONFIG.loginOutUrl
							}
						}]
					});
				} else if(this.userInfo.typeId == 'buyer') {
					this.$router.back();
				}
			}
				
		},
		watch: {
		},
		computed: {

		},
		mounted() {
			this.kongStyle = {
				width: '100%',
				height: this.$refs.message.offsetHeight / 100 * 2 + 'rem'
			}
		},
		methods: {
			checkQrCode() {
				this.qrShow = true;
			},
			goNext(href, str) {
				var o = {
					name: href
				}
				if(str=="kj") {
					o = {
						name: href,
						query: {
							sellerId: this.$root.userInfo.typeCode
						}
					}
				}else if(str=="jyjc"){
					o = {
						name: href,
						query: {
							jyjc: str
						}
					}
				}
				this.$router.push(o)
			},
			/**
			 * 门店账号跳转店铺列表页面购买商品
			 */
			goWantTobuy(str) {
				let userInfo = localStorage.getItem('quickUserInfo')
				localStorage.setItem('userInfo', userInfo)
				sessionStorage.setItem('f_index', 1)
				//NorthShop
				window.location.href = `${this.$root.config.loginGoUrl}${str}`

				// window.location.href = 'http://ssbh.yshfresh.com/mp/index.html#/NorthDoorStore'
				// window.location.href = 'http://localhost:8083/#/NorthDoorStore?mdjunp=1'
			},
		}
	}
</script>

<style lang='scss'>
	#fIndex {
		color: #0C0007;
		/*line-height: .4rem;*/
		img {
			display: block;
		}
		.header {
			position: relative;
			width: 100%;
			height: 4.51rem;
			background: url(../../assets/firstImgs/home_img_banner@2x.png) no-repeat;
			background-size: contain;
			.message {
				width: 100%;
				position: absolute;
				top: 4rem;
				.message_children {
					margin: auto;
					width: 7.1rem;
					padding: .5rem .2rem;
					background: white;
					border-radius: .1rem;
					box-shadow: 6px 10px 20px rgba(6, 58, 95, 0.1);
					display: flex;
					img {
						width: .35rem;
						height: .42rem;
						margin: 0 .35rem 0 .2rem;
					}
					.meassage_bottom {
						line-height: .4rem;
						.name {
							font-weight: bold;
							font-size: .34rem;
							margin-bottom: .18rem;
						}
						.name_tel {
							font-size: .28rem;
							align-items: center;
							display: flex;
							img {
								margin-left: .2rem;
								width: .4rem;
								height: .4rem;
							}
						}
					}
				}
			}
		}
		.classBg {
			background: url(../../assets/firstImgs/home_img_banner@2x_1.png) no-repeat;
			background-size: contain;
		}
		.nav_list {
			color: #343434;
			margin-bottom: .3rem;
			font-size: .24rem;
			.kong {
				background: white;
			}
			.list_href {
				background: white;
				display: flex;
				justify-content: space-between;
				padding: 0 .2rem .2rem .2rem;
				.list_c_com {
					background: -webkit-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Safari 5.1 - 6.0 */
					background: -o-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Opera 11.1 - 12.0 */
					background: -moz-linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* Firefox 3.6 - 15 */
					background: linear-gradient(180deg, #f9f9fd, #FFFFFF);
					/* 标准的语法 */
					width: 49%;
					height: 1.6rem;
					box-sizing: border-box;
					padding: .36rem .2rem .3rem .2rem;
					/*margin-right: .2rem;*/
					align-items: center;
					display: flex;
					.list_img {
						width: .86rem;
						height: .94rem;
						margin-right: .2rem;
					}
					.list_title {
						color: #0C0007;
						font-size: .3rem;
						font-weight: bold;
						margin-bottom: .03rem;
					}
				}
				/*.list_c_com:nth-child(2n){
					border-right: none;
				}*/
			}
		}
		.qr_code {
			border-radius: .08rem;
			background: white;
			padding: .37rem .5rem .5rem .5rem;
			.qr_code_header {
				color: #0C0007;
				margin-bottom: .37rem;
				font-size: .28rem;
				display: flex;
				.right {
					flex: 1;
					.user_name {
						margin: .08rem 0 .1rem 0;
						font-weight: bold;
						font-size: .34rem;
					}
				}
				img {
					width: 1.08rem;
					height: 1.08rem;
					margin-right: .2rem;
				}
			}
			.qr_code_bottom {
				img {
					width: 5.69rem;
					height: 5.69rem;
					margin: auto;
				}
			}
			.close {
				width: 1.5rem;
				border: 1px solid #6FB138;
				border-radius: .3rem;
				height: .6rem;
				line-height: .6rem;
				text-align: center;
				font-size: .28rem;
				color: #6FB138;
				margin: .2rem auto;
			}
		}
	}
</style>