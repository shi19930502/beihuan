<template>
	<yd-layout id='fOrder'>
		<div class="header" slot='top'>
			<div @click='goFindex' class="header_left">
				首页
			</div>
			<ul class="header_right">
				<li :class='{nav_active:navActiveNum==0}' @click='look_list("0")'>全部</li>
				<li :class='{nav_active:navActiveNum==-1}' @click='look_list("-1")'>赊销</li>
				<li :class='{nav_active:navActiveNum==5}' @click='look_list("5")'>已完成</li>
			</ul>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>

					<div @click='goOrderXq(item)' v-for='item in dataList' class="goods_list">
						<div class="goods_list_top">
							<div class="goods_img_f">
								<img v-if='item.orderitemList[0].skuPicUrl&&item.orderitemList[0].skuPicUrl!=null' class="goods_img" :src="$root.imgURL+item.orderitemList[0].skuPicUrl" alt="" />
								<img  v-else-if='item.orderitemList[0].productPicUrl&&item.orderitemList[0].productPicUrl!=null' class="goods_img" :src="$root.imgURL+item.orderitemList[0].productPicUrl" alt="" />
								<img  v-else class="goods_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
								<div class="goods_img_num">共{{item.orderitemList.length}}件商品</div>
							</div>
							<div class="list">
								<div class="list_top">
									<div class="list_top_left">订单号：<span>{{item.orderUmber.slice(0,12)}}</span><span  style="color: #FF3D15;font-weight: bold;font-size: 15px;">{{item.orderUmber.slice(12,16)}}</span></span></div>
									<!--<div class="list_top_right">{{item.payStatusName=='已支付'?'已完成':'待收款'}}</div>-->
									<div class="list_top_right">{{item.orderStatusName}}</div>
								</div>
								<div class="list_bottom">
									<div class="l_b_left">
										<div class="l_b_left_top">
											<div class="list_shr_father">
												<div class="list_shr">卖家</div>
											</div>
											<div class="list_name">{{item.sellerName}}</div>
										</div>
										<div class="list_time">
											{{item.createdDate}}
										</div>
									</div>
									<div class="l_b_right">
										<img src="../../assets/imgs/list_icon_right.png" alt="" />
									</div>
								</div>
							</div>
						</div>
						<div v-if='item.payType==6&&item.orderUnpaid!=0' class="list_btn" >
							<template v-if='item.sortingOrderTotal&&item.payType==6'>
								<div  class="list_btn_money" >总金额:{{(item.sortingOrderTotal/100).toFixed(2)}}&nbsp;元</div>
							</template>
							<template v-if='item.orderUnpaid>=0&&item.payType==6'>
								<div  class="list_btn_money" >剩余还款:{{(item.orderUnpaid/100).toFixed(2)}}&nbsp;元</div>
							</template>
						</div>
					</div>

				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>

		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				navActive: '',
				navActiveNum: 0,
				dataList: [],
				pageNum:1,
				pageSize:8,
				fnishDataList:false,
			}
		},
		created() {
			
			this.$store.dispatch('changeNavBarTitle', '采购管理')
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.$dialog.loading.open('数据加载中...');
			this.loadList()
		},
		methods: {
			loadList() {
				
				var params={
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					checkType:'buy'
				}
				if(this.navActiveNum!=0){
					if(this.navActiveNum==1){
						//params.paymentStatusId=0
						params.orderStatusId=0
					}else{
						params.orderStatusId=this.navActiveNum
					}
				}
				this.postRequest('order/listByUser',params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data && resp.data.state == 0) {
						console.log(this.dataList)
						this.dataList = [...this.dataList, ...resp.data.aaData];
						if(this.dataList.length >= resp.data.dataCount) {
							/* 所有数据加载完毕 */
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
							this.fnishDataList = true
							return;
						}
						/* 单次请求数据完毕 */
						if(resp.data.aaData.length > 0) {
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
						}
						this.pageNum++;
					}
				})

			},
			look_list(num) {
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList=[];
				this.navActiveNum = num
				this.pageNum=1;
				this.pageSize=8
				this.fnishDataList=false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			goFindex() {
				this.$router.push({
					name: 'f_index'
				})
			},
			goOrderXq(item) {
				this.$router.push({ 
					name: 'f_order_xq',
					query:{
						orderId:item.id,
						orderUmber:item.orderUmber
					}
				})
			}
		}
	}
</script>
<style lang='scss'>
	#fOrder {
		background: white;
		.header {
			background: white;
			padding: 0rem .3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: .32rem;
			height: .9rem;
			border-bottom: 1px solid #D5D5D5;
			.header_left {
				color: #018BE6;
				display: flex;
				align-items: center;
				font-weight: 700;
				&:before {
					content: '';
					display: inline-block;
					width: .32rem;
					height: .32rem;
					border: 2px solid #018BE6;
					transform: rotate(45deg);
					border-top: none;
					border-right: none;
				}
			}
			.header_right {
				display: flex;
				justify-content: space-between;
				width: 3.65rem;
				width: 3rem;
				font-weight: bold;
				li {
					line-height: .9rem;
					display: flex;
					align-items: center;
				}
			}
			.nav_active {
				color: #018BE6;
				border-bottom: .04rem solid #018BE6;
			}
		}
		.goods_list {
			padding: .4rem .4rem 0.2rem 0;
			background: white;
			border-bottom: 1px solid #E1E1E1;
			.goods_list_top{
				display: flex;
				margin: 0rem 0 0rem .4rem;
				align-items: center;
			}
			.goods_img_f{
				width: 1.6rem;
				height: 1.6rem;
				flex-grow: 0;
				position: relative;
				margin-right: .2rem;
				.goods_img_num{
					text-align: center;
					width: 100%;
					height: .24rem;
					line-height: 1;
					color: white;
					background: rgba(52,52,52,.4);
					position: absolute;
					bottom: 0;
					left: 0;
				}
			}
			.goods_img {
				display: block;
				width: 1.6rem;
				height: 1.6rem;
			}
			.list {
				width: 5rem;
				flex-grow: 1;
				color: #848484;
				font-size: .24rem;
				.list_top {
					display: flex;
					justify-content: space-between;
					.list_top_left {
						color: #343434;
						font-size: .26rem;
						font-weight: 600;
					}
				}
				.list_bottom {
					display: flex;
					justify-content: space-between;
					.l_b_left {
						flex-grow: 1;
						width: 3.2rem;
						.l_b_left_top {
							margin: 0rem 0 .45rem 0;
							display: flex;
							.list_shr_father {
								flex-grow: 0;
								width: .94rem;
								display: flex;
								align-items: flex-end;
							}
							.list_shr {
								font-size: .2rem;
								height: .26rem;
								line-height: .28rem;
								color: white;
								background: #018BE6;
								border-radius: .06rem;
								padding: 0 .11rem;
								margin-bottom: .07rem;
							}
							.list_name {
								flex-grow: 1;
								width: 3.6rem;
								font-size: .36rem;
								margin-left: .2rem;
								color: #211E1D;
								font-weight: bold;
								/*如果写了flex，下面的超出隐藏不起作用*/
								/*display: flex;*/  
								align-items: flex-end;
								overflow: hidden;
							    text-overflow: ellipsis;
							    white-space: nowrap;
							}
						}
						.list_time {
							color: #848484;
							font-size: .26rem;
							font-family: 'PingFang-SC';
						}
					}
					.l_b_right {
						width: .11rem;
						flex-grow: 0;
						align-items: center;
						display: flex;
						img {
							width: .11rem;
							height: .2rem;
						}
					}
				}
			}
			.list_btn{
				display: flex;
				justify-content: flex-end;
				padding: .2rem 0 0 .4rem;
				color: #555555;
				font-weight: bold;
				/*align-items: center;*/
				font-size: .28rem;
				.list_btn_money{
					flex: 1;
					padding-right: .2rem;
					justify-content: flex-start;
				}
				.list_btn_collection{
					margin: 0 0rem 0 .25rem;
					color: #018BE6;
				}
				.list_btn_collection_space{
					letter-spacing:.05rem;
				}
			}
		}
	}
</style>