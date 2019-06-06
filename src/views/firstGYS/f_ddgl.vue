<template>
	<yd-layout id='fDdgl'>
		<div class="header" slot='top'>
			<div @click='goFindex' class="header_left">
				首页
			</div>
			<ul class="header_right">
				<li :class='{nav_active:navActiveNum==0}' @click='look_list("0")'>全部</li>
				<li :class='{nav_active:navActiveNum==1}' @click='look_list("1")'>待收款</li>
				<li :class='{nav_active:navActiveNum==-1}' @click='look_list("-1")'>赊销</li>
				<li :class='{nav_active:navActiveNum==5}' @click='look_list("5")'>已完成</li>
			</ul>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>

					<div @click='goFddxq(item)' v-for='item in dataList' class="goods_list">
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
									<div class="list_top_right">{{item.orderStatusName=='新建'?'待收款':item.orderStatusName}}</div>
								</div>
								<div class="list_bottom">
									<div class="l_b_left">
										<div class="l_b_left_top">
											<div class="list_shr_father">
												<div class="list_shr">收货人</div>
											</div>
											<div class="list_name">{{item.buyerName?item.buyerName:'临时客户'}}</div>
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
						<div v-if='item.payType==6||item.payType==4' class="list_btn" >
							<template v-if='item.orderUnpaid&&item.payType==6'>
								<div  class="list_btn_money" >赊销金额:{{(item.orderUnpaid/100).toFixed(2)}}&nbsp;元</div>
							</template>
							<template v-else-if="item.orderTotal&&item.payType==4">
								<div  class="list_btn_money" >总金额:{{(item.sortingOrderTotal/100).toFixed(2)}}&nbsp;元</div>
							</template>
							<div v-if='item.payType==6&&item.orderUnpaid!=0' @click.stop='openMoneyPop(item,1)' class="list_btn_collection list_btn_collection_space">平账</div>
							<div v-if='item.payType==6&&item.orderUnpaid!=0' @click.stop='openMoneyPop(item,2)' class="list_btn_collection list_btn_collection_space">收款</div>
							<div v-if='item.payType==4' @click.stop='openMoneyPop(item,3)' class="list_btn_collection list_btn_collection_space">赊销</div>
							<div v-if='item.payType==4' @click.stop='openMoneyPop(item,4)' class="list_btn_collection">确认收款</div>
						</div>
					</div>

				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
			
			<yd-popup v-model="moneyShow" position="center" width="90%">
				<div class="yg_content">
					<yd-icon class='close_pop' @click.native='moneyShow=false' name="error-outline" size=".6rem" color="#555555"></yd-icon>
					<div class="yg_car_num">{{openMoneyObj.handleTitle}}处理</div>
					<div class="money_list"><div class="money_list_title">用户:</div><span>{{openMoneyObj.buyerName}}</span></div>
					<div class="money_list"><div class="money_list_title">总金额:</div><span>{{openMoneyObj.orderTotal?(openMoneyObj.orderTotal/100).toFixed(2):'0'}}&nbsp;元</span></div>
					<div class="money_list"><div class="money_list_title">已还金额:</div><span>{{((openMoneyObj.orderTotal-openMoneyObj.orderUnpaid)/100).toFixed(2)}}&nbsp;元</span></div>
					<div class="money_list" ><div class="money_list_title">剩余还款:</div><span>{{openMoneyObj.orderUnpaid?(openMoneyObj.orderUnpaid/100).toFixed(2):'0'}}&nbsp;元</span></div>
					<!--<div v-if='openMoneyObj.handleTitle=="平账"' style="margin-bottom: .2rem;" class="money_list"><div class="money_list_title">平账金额:</div><span>{{collectionMoney}}&nbsp;元</span></div>-->
					<!--v-else-->
					<div  class="yg_inweight">
						<span>{{openMoneyObj.handleTitle=='平账'?'收款':openMoneyObj.handleTitle}}金额:</span>
						<!-- v-model.number-->
						<input :style="{display: moneyShow?'block':'none'}" maxlength="12" @blur="blurInput(collectionMoney)" @input='ygChangeInput(collectionMoney)' v-model='collectionMoney' placeholder="请输入" class="inweight_input" type="text" />
						<label>元</label>
					</div>
					<div v-if='flgError()' style="color: red;padding: 0 0 .2rem 0;text-align: center;">**{{openMoneyObj.handleTitle}}金额不能大于剩余还款金额**</div>
					<div @click='moneySubmit()' v-if='flgError_2()' class="yg_btn">确认</div>
					<div style="background: #DDDDDD;" v-else class="yg_btn">确认</div>
				</div>
			</yd-popup>
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
				moneyShow:false,//显示各种还款赊销输入框
				collectionMoney:'',
				openMoneyObj:{handleTitle:''},
			}
		},
		created() {
			
			this.$store.dispatch('changeNavBarTitle', '销售订单')
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
			//重置
			restLoad(){
				this.dataList=[];
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.pageNum=1;
				this.pageSize=8
				this.fnishDataList=false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			flgError(){
				let money=(this.openMoneyObj.orderUnpaid/100).toFixed(2)
				if(parseFloat(this.collectionMoney)>money){
					return true
				}
				return false
			},
			flgError_2(){
				let money=(this.openMoneyObj.orderUnpaid/100).toFixed(2)
				if(this.openMoneyObj.handleTitle=='赊销'||this.openMoneyObj.handleTitle=='平账'){
					//赊销第一次还款金额可以为0
					if(parseFloat(this.collectionMoney)>=0&&parseFloat(this.collectionMoney)<=money){
						return true
					}
				}
				if(parseFloat(this.collectionMoney)>0&&parseFloat(this.collectionMoney)<=money){
					return true
				}
				return false
			},
			//打开弹窗
			openMoneyPop(item,num){
				this.collectionMoney=''
				this.moneyShow=true;
				switch (num){
					case 1:
					this.openMoneyObj.handleTitle='平账';
					//this.collectionMoney=(item.orderUnpaid/100).toFixed(2);
					break;
					case 2:
					this.openMoneyObj.handleTitle='收款';
					break;
					case 3:
					this.openMoneyObj.handleTitle='赊销';
					break;
					case 4:
					this.openMoneyObj.handleTitle='确认收款';
					this.openMoneyObj=Object.assign({},this.openMoneyObj,item)
					this.moneyShow=false;
						this.$dialog.confirm({
	                    title: '提示:',
	                    mes: '请再次确认是否收款?',
	                    opts: () => {
	                    	//确认收款
	                    	this.saveGathering();
	                    }
	                });
					break;
				}
				this.openMoneyObj=Object.assign({},this.openMoneyObj,item)
				
				
			},
			//显示各种还款赊销输入框确认按钮
			moneySubmit(){
				let params= {
			        orderId: this.openMoneyObj.id ,
			        orderPaid: parseFloat((this.collectionMoney*100).toFixed(2)),
			        paidType: 2, // 3 平账   2  收款
			        sellerId: this.openMoneyObj.sellerId,
			        sellerName: this.openMoneyObj.sellerName,
			        buyerId: this.openMoneyObj.buyerId,
			        buyerName: this.openMoneyObj.buyerName,
			        orderNumber: this.openMoneyObj.orderUmber
			     }
				//${this.openMoneyObj.handleTitle}
				var msg=`
							本次收款金额为&nbsp;<span style="color:red;font-weight:bold">${this.collectionMoney}&nbsp;元</span>;<br/>
							剩余还款&nbsp;<span style="color:red;font-weight:bold">${(this.openMoneyObj.orderUnpaid/100-this.collectionMoney).toFixed(2)}&nbsp;元</span>。
						`
				if(this.openMoneyObj.handleTitle=='平账'){
					msg=`
							本次收款金额为&nbsp;<span style="color:red;font-weight:bold">${this.collectionMoney}&nbsp;元</span>;<br/>
							剩余还款&nbsp;<span style="color:red;font-weight:bold">${(this.openMoneyObj.orderUnpaid/100-this.collectionMoney).toFixed(2)}&nbsp;元&nbsp;</span>将做平账处理!。
						`
				}else if(this.openMoneyObj.handleTitle=='收款'){
					params.paidType=2
				}else if(this.openMoneyObj.handleTitle=='赊销'){
					params.paidType=2
				}
				this.$dialog.confirm({
                    title: '提示：',
                    mes: `${msg}`,
                    opts: () => {
                    	this.$dialog.loading.open('数据保存中...');
                    	if(this.openMoneyObj.handleTitle=='平账'){
                    		//收款 false表示不刷新页面
                    		this.saveMoney({params,flg:false}).then(()=>{
                    			params.paidType=3;
								//平账
								var msg=`本次还款${(params.orderPaid/100).toFixed(2)}元<br/><span style="color:red;font-weight:bold">平账失败,请重新平账！</span>`
								this.saveMoney({params,msg});
                    		});
						}else if(this.openMoneyObj.handleTitle=='收款'){
							this.saveMoney({params});
						}else if(this.openMoneyObj.handleTitle=='赊销'){
							//先把订单变成赊销
							this.saveSx({params:{id:this.openMoneyObj.id}}).then(()=>{
								//调用收款接口下面参数的params不是({params:{id:this.openMoneyObj.id}
								params.paidType=2;
								//收款
								var msg=`赊销保存成功;<br/><span style="color:red;font-weight:bold">还款失败,请重新还款！</span>`
								this.saveMoney({params,msg});
							})
						}
                    }
                });
			},
			//收款
			saveGathering() {
				var params = {};
				params = assign({}, pamars, this.openMoneyObj)
				params.shippingStatusId=5;
				params.paymentStatusId=1;
				this.postRequest('order/update', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data && resp.data.state == 0) {
						this.$dialog.notify({
							mes: '操作成功',
							timeout: 1500,
						});
					} else {
						this.$dialog.toast({
							mes: resp.data.msg,
							timeout: 1500,
							icon: 'error',
						});
					}
				})
			},
			//赊销
			saveSx({params,urlName='order/sellOnCredit'}={}){
				console.log(params)
				return new Promise((resolve,reject)=>{
					this.postRequest(urlName,params).then(resp => {
						if(resp.data && resp.data.state == 0) {
							resolve()
						}else{
							this.$dialog.loading.close();
							this.$dialog.toast({
				                mes: '赊销保存失败!',
				                timeout: 1500,
				                icon: 'error',
				                callback: () => {
				                     
				                }
				           });
						}
					})
				})
			},
			//平账和收款保存金额
			saveMoney({params,msg='收款失败！',flg=true}={}){
				console.log(params)
				return new Promise((resolve,reject)=>{
					this.postRequest('orderselloncredit/repayment',params).then(resp => {
							if(resp.data && resp.data.state == 0) {
								if(flg){
									this.$dialog.loading.close();
									this.$dialog.notify({
					                    mes: '操作成功',
					                    timeout: 1500,
					                    callback: () => {
					                    	
					                    }
					                });
					                this.restLoad();
					                this.moneyShow=false;
								}
								resolve()
							}else{
								this.$dialog.loading.close();
								
								if(flg){
									this.restLoad();
					                this.moneyShow=false;
									this.$dialog.alert({mes: msg});
								}else{
					                this.$dialog.toast({
					                    mes: msg,
					                    timeout: 1500,
					                    icon: 'error',
					                    callback: () => {
					                        
					                    }
					                });
								}
								
							}
						})
				})
			},
			loadList() {
				
				var params={
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				if(this.navActiveNum!=0){
					if(this.navActiveNum==1){
						//params.paymentStatusId=0
						params.orderStatusId=4
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
				this.navActiveNum = num
				this.dataList=[];
				this.restLoad()
			},
			goFindex() {
				this.$router.push({
					name: 'f_index'
				})
			},
			goFddxq(item) {
				this.$router.push({ 
					name: 'f_ddxq',
					query:{
						orderId:item.id,
						orderUmber:item.orderUmber
					}
				})
			},
			blurInput(val){
				if(val>0){
					this.collectionMoney=parseFloat(val).toFixed(2)
				}
			},
			ygChangeInput(val) {
				if(val) {
					if(val.length > 12) {
						val = val.slice(0, 12)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(val) || reg_2.test(val)) {
						if(val > 999999999.99) {
							val = '999999999.99'
						}
					} else {
						if(val) {
							val = val.slice(0, val.length - 1)
							if(val > 0) {

							} else {
								val = ''
							}
						}
					}
				}
				this.collectionMoney = val
			},
		}
	}
</script>
<style lang='scss'>
	#fDdgl {
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
				width: 4.4rem;
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
				width: 1.6rem;
				height: 1.6rem;
				flex-grow: 0;
				margin-right: .2rem;
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
		.yg_content {
			background: white;
			height: 30%;
			padding: .2rem .25rem .8rem .25rem;
			border-radius: .1rem;
			position: relative;
			.close_pop{
				position: absolute;
				top: .15rem;
				right: .2rem;
			}
			.yg_car_num {
				font-size: .4rem;
				font-weight: bold;
				padding: .2rem 0;
				text-align: center;
			}
			.money_list{
				font-size: .28rem;
				font-weight: bold;
				color: #555555;
				display: flex;
				padding: .05rem;
				.money_list_title{
					width: 1.5rem;
					margin-right: .15rem;
					text-align: right;
				}
				span{
					color: #848484;
					flex: 1;
				}
			}
			.yg_inweight {
				width: 90%;
				margin: .4rem auto .4rem;
				font-size: .28rem;
				display: flex;
				span {
					flex-grow: 0;
					color: #555555;
					font-weight: bold;
					width: 1.5rem;
					text-align: right;
					align-items: center;
					margin-right: .15rem;
					display: flex;
					align-items: flex-end;
				}
				label{
					display: flex;
					align-items: flex-end;
					color: #848484;
				}
				.inweight_input {
					flex: 1;
					margin: 0 .15rem 0 0;
					height: .8rem;
					outline: none;
					font-size: .28rem;
					padding: .2rem;
					border: 1px solid #D0D0D0;
				}
			}
			.yg_btn {
				width: 80%;
				background: #80c551;
				color: white;
				border-radius: .45rem;
				text-align: center;
				line-height: .88rem;
				margin: auto;
				font-size: .32rem;
			}
		}
	}
</style>