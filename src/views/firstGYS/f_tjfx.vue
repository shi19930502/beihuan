<template>
	<yd-layout id='fTjfx'>
		<div slot='top' class="header">
			<div>
				<a  style="color: #018BE6;"   v-if='$root.userInfo.typeId=="merchant"' href="#/f_index" class="header_left">首页</a>
				<div v-else></div>
			</div>
			<div class="name">统计分析</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
				<div v-else></div>
			</div>
		</div>
		<div class="tj_header">
			<div class="header_content">
				<img class="img" v-if="customerObj.customerHeadPic" id='customerHeadPic' :src="$root.imgURL+customerObj.customerHeadPic" alt="" />
				<img class="img" v-else id='customerHeadPic' src="../../assets/imgs/mine_icon_toux.png" alt="" />
				<div class="header_right">
					<div class="header_right_name"><span id='customerInfoName'>{{customerObj.customerInfo?customerObj.customerInfo.name:''}}</span></div>
					<div class="header_right_sc">收藏 &nbsp;<span id='productcollectionCount'>{{customerObj.productcollectionCount}}</span></div>
				</div>
			</div>
			<div class="header_thr">
				<ul>
					<li>有效订单</li>
					<li id='orderCount7Days'>{{customerObj.orderCount7Days?customerObj.orderCount7Days:'0'}}</li>
					<li>7日</li>
				</ul>
				<ul>
					<li>支付金额(元)</li>
					<li id='orderTotalAmount7Days'>{{customerObj.orderTotalAmount7Days?customerObj.orderTotalAmount7Days.toFixed(2):'0'}}</li>
					<li>7日</li>
				</ul>
				<ul>
					<li>成交转化率</li>
					<li id='orderSubmitRadio7Days'>{{customerObj.orderSubmitRadio7Days&&customerObj.orderSubmitRadio7Days!='NaN'?customerObj.orderSubmitRadio7Days.toFixed(2)+'%':'0'}}</li>
					<li>7日</li>
				</ul>
			</div>
			<div class="header_pj">
				<div class="header_pj_list" v-for='item in customerObj.storeScore'><span id='reviewName_0'>{{item.reviewName}}</span>&nbsp;&nbsp;<span class="span" id='typeScore_0'>{{item.typeScore}}</span></div>
				<!--<div class="header_pj_list"><span id='reviewName_1'>商品质量</span>&nbsp;&nbsp;<span class="span" id='typeScore_1'></span></div>
				<div class="header_pj_list"><span id='reviewName_2'>服务态度</span>&nbsp;&nbsp;<span class="span" id='typeScore_2'></span></div>-->
			</div>
		</div>
		<div class="chart_line">
		<div class="look_btn" :class="{line_border:showLine1}" ref='orderChart'>
			<div class="look_btn_name" >订单销量走势</div>
			<div  @click="showLine1=true" v-show='!showLine1' class="look_btn_down">
				<span>查看详情</span>
				<i class="zhankai" :class="{shouqi:false}"></i>
			</div>
		</div>
		<div class="order" v-show='showLine1'>
			<div class="order_header">
				<div class=""></div>
				<ul>
					<li @click='searchBtn(6)' :class="{active:btnNum==6}">近一周</li>
					<li @click='searchBtn(14)' :class="{active:btnNum==14}">近半月</li>
					<li @click='searchBtn(29)' :class="{active:btnNum==29}">近一月</li>
				</ul>
			</div>
			<div class="order_chart" id='orderChart' ></div>
			<div class="btn_shouqi">
				<span @click="showLine1=false">收起</span>
				<i></i>
			</div>
		</div>
		<!--:class="{line_border:showLine2}"-->
		<div class="look_btn line_border" >
			<div class="look_btn_name" >进货统计</div>
			<div  @click="showLine2=true" v-show='!showLine2' class="look_btn_down">
				<span>查看详情</span>
				<i class="zhankai" :class="{shouqi:false}"></i>
			</div>
		</div>
		<div class="order" v-show='showLine2'>
			<div class="order_header">
				<div class=""></div>
				<ul>
					<li @click='searchBtnIn(6)' :class="{active:btnNumIn==6}">近一周</li>
					<li @click='searchBtnIn(14)' :class="{active:btnNumIn==14}">近半月</li>
					<li @click='searchBtnIn(29)' :class="{active:btnNumIn==29}">近一月</li>
				</ul>
			</div>
			<div class="order_chart" id='chartIn'>ggg</div>
			<div class="btn_shouqi">
				<span @click="showLine2=false">收起</span>
				<i></i>
			</div>
		</div>
		<div class="look_btn line_border" v-if='false'>
			<div class="look_btn_name" >出货统计</div>
			<div  @click="showLine3=true" v-show='!showLine3' class="look_btn_down">
				<span>查看详情</span>
				<i class="zhankai" :class="{shouqi:false}"></i>
			</div>
		</div>
		<div class="order"  v-if='false' v-show='showLine3'>
			<div class="order_header">
				<div class=""></div>
				<ul>
					<li @click='searchBtn(6)' :class="{active:btnNum==6}">近一周</li>
					<li @click='searchBtn(14)' :class="{active:btnNum==14}">近半月</li>
					<li @click='searchBtn(29)' :class="{active:btnNum==29}">近一月</li>
				</ul>
			</div>
			<div class="order_chart" id='chartOut'>ggg</div>
			<div class="btn_shouqi">
				<span @click="showLine3=false">收起</span>
				<i></i>
			</div>
		</div>
		</div>
		<div class="merchandise">
			<div class="title_name_tx">
				<div class="title_name ">商品</div>
				<div class="down_pdf" @click='downPdf' >
					<div class="down_pdf_xz">下载</div>
					<img src="../../assets/firstImgs/down_down.png" alt="" />
				</div>
			</div>
			<div class="content">
				<ul>
					<li>在售商品数&nbsp;(件)</li>
					<li id='saleSKUAllCount'>{{customerObj.saleSKUAllCount}}</li>
				</ul>
				<ul>
					<li>近30日下单商品占比</li>
					<li><span id='saleSKURadio30Days'>{{customerObj.saleSKURadio30Days&&customerObj.saleSKURadio30Days!='NaN'?customerObj.saleSKURadio30Days.toFixed(2):"0"}}</span>%</li>
				</ul>
			</div>
		</div>
		

		<!--v-if='dataList.length>0'-->
		<template v-if='customerObj.salesSKUSortForWeek'>
			<div id='weekList' v-if='customerObj.salesSKUSortForWeek.length>0' class="week_list">
				<div class="title_name">周热销榜</div>
				<div id='salesSKUSortForWeek'>
					<div class="content" v-for='(item,index) in customerObj.salesSKUSortForWeek'>
						<ul>
							<li>第{{index+1}}：<span>{{item.productName}}&nbsp;({{item.skuName}})</span></li>
							<li>{{item.saleTotal?item.saleTotal:'0'}}&nbsp;<span class='unit'>{{item.measureName}}</span></li>
						</ul>
						<ul>
							<li>销售金额占比</li>
							<li>{{(item.saleAmountTotal/customerObj.orderTotalAmount7Days*100).toFixed(2)}}%</li>
						</ul>
					</div>
				</div>
			</div>
		</template>
		
		<div class="merchandise">
			<div class="title_name">订单与金额</div>
			<div class="content">
				<ul>
					<li>昨日有效订单&nbsp;(笔)</li>
					<li id='yestodayOrderCount'>{{customerObj.yestodayOrderCount}}</li>
				</ul>
				<ul>
					<li>昨日销售金额&nbsp;(元)</li>
					<li id='yestodayOrderTotalAmount'>{{customerObj.yestodayOrderTotalAmount?customerObj.yestodayOrderTotalAmount.toFixed(2):'0'}}</li>
				</ul>
			</div>
		</div>
		<div class="merchandise">
			<div class="zf_money_header">
				<div class="title_name">用户与赊销金额</div>
				<ul>
					<li @click='sxSearch(1)' :class="{active:sxBtnNum==1}">近7日</li>
					<li @click='sxSearch(7)' :class="{active:sxBtnNum==7}">近15日</li>
					<li @click='sxSearch(30)' :class="{active:sxBtnNum==30}">近30日</li>
				</ul>
			</div>
			<div class=" zf_money">
				<ul class="zf_money_top">
					<li>用户</li>
					<li>未还金额&nbsp;(单)</li>
					<li>已还金额&nbsp;(元)</li>
				</ul>
				<ul v-for='(item,index) in sxData' :key='index'>
					<li>{{item.buyerName}}</li>
					<li>{{(item.orderUnpaid/100).toFixed(2)}}</li>
					<li>{{(item.orderPaid/100).toFixed(2)}}</li>
				</ul>
			</div>
		</div>
		<div class="merchandise">
			<div class="zf_money_header">
				<div class="title_name">支付类型与收款金额</div>
				<ul>
					<li @click='orderSearch(1)' :class="{active:orderBtnNum==1}">昨日</li>
					<li @click='orderSearch(7)' :class="{active:orderBtnNum==7}">近7日</li>
					<li @click='orderSearch(30)' :class="{active:orderBtnNum==30}">近30日</li>
				</ul>
			</div>
			<div class=" zf_money">
				<ul class="zf_money_top">
					<li>支付类型</li>
					<li>订单数&nbsp;(单)</li>
					<li>金额&nbsp;(元)</li>
				</ul>
				<ul v-for='item in orderList'>
					<li>{{item.payType}}</li>
					<li>{{item.orderCount}}</li>
					<li>{{item.orderTotalAmount}}</li>
				</ul>
			</div>
			<div class="notice">*注：该表的统计范围为截止昨日22点30分已支付的订单。</div>
		</div>
	</yd-layout>
</template>

<script>
	let e = require('../../utils/zd_echarts.min.js')
	let echarts = e.echarts
	export default {
		data() {
			return {
				startTime: '',
				startTimeIn:'',
				endTime: '',
				dataList: [],
				myChart: {},
				chartIn:{},
				chartOut:{},
				btnNum: 6,
				btnNumIn: 6,
				customerObj: {},
				orderList: [],
				orderBtnNum: 1,
				
				showLine1:false,
				showLine2:false,
				showLine3:false,
				inData:[],//进货
				sxData:[],
				sxBtnNum:1,
				sxStartTime:''
			}
		},
		created() {
			this.disposeDate();
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.myChart = echarts.init(document.getElementById('orderChart'))
			this.chartIn = echarts.init(document.getElementById('chartIn'))
			//this.chartOut = echarts.init(document.getElementById('chartOut'))
			this.init()
			this.endTime = this.$root.yugi(0)
			this.startTime = this.$root.yugi(6)
			this.startTimeIn = this.$root.yugi(6)
			this.sxStartTime = this.$root.yugi(6)
			//进货统计
			this.getIn();
			this.searchDate();
			//或许赊销
			this.getSxData()
		},
		methods: {
			getSxData(){
				this.postRequest('orderselloncredit/getArrearsMerchantsList', {
					sellerId:this.$root.userInfo.typeCode,
					startTime: this.sxStartTime ,
					endTime: this.endTime+ ' 23:59:59',
				}).then(resp => {
					if(resp.data.state==0){
						this.sxData=resp.data.aaData
					}else{
						this.$dialog.toast({
			                mes: resp.data.msg,
			                timeout: 1500,
			                icon: 'error',
			            });
					}
				})
			},
			downPdf(){
				if(this.$root.isPcOS()!='linux'&&this.$root.isPcOS()){
					this.postRequest('customer/getCusMaterMerChanter', {
						id:this.$root.userInfo.typeCode,
					}).then(resp => {
						if(resp.data.state==0){
							var ele=document.createElement('a');
							ele.setAttribute("href",this.$root.config.root_api+'upload/'+resp.data.msg)
//							ele.setAttribute("download",resp.data.msg?(resp.data.msg.split('/')[1]).split('.')[0]:'商品')
							ele.setAttribute("download",resp.data.msg)
							ele.setAttribute("target",'_blank')
							ele.click()
						}else{
							this.$dialog.toast({
			                    mes: resp.data.msg,
			                    timeout: 1500,
			                    icon: 'error',
			                });
						}
					})
				}else{
					window.location.href=this.$root.config.root_api_down+'downPdf.html?id='+this.$root.userInfo.typeCode+'&root_api='+this.$root.config.root_api
				}
				return 
				if(!this.$root.isPcOS()&&this.$root.sources()=='Weixin'){
					//苹果微信手机
//					window.location.href='http://10.2.15.105:8020/%E6%B5%8B%E8%AF%95/var%E5%92%8Clet%EF%BC%8C%E4%BD%9C%E7%94%A8%E5%9F%9F/down.html?__hbt=1559527164398'
					//非PC且是苹果手机微信的时候 
					if(this.$root.sources()=='Weixin'){
						this.$router.push({
							name:'f_down',
							query:{
								id:this.$root.userInfo.typeCode,
							}
						})
						//打开去一个新页面
						//然后给提示。
					}
				}else{
					//pc的时候
					this.postRequest('customer/getCusMaterMerChanter', {
						id:this.$root.userInfo.typeCode,
					}).then(resp => {
						if(resp.data.state==0){
							var ele=document.createElement('a');
							ele.setAttribute("href",this.$root.config.root_api+'upload/'+resp.data.msg)
							ele.setAttribute("download",resp.data.msg?(resp.data.msg.split('/')[1]).split('.')[0]:'商品')
							ele.setAttribute("target",'_blank')
							ele.click()
//							alert(this.$root.config.root_api+'upload/'+resp.data.msg)
//							window.location.href='http://10.2.15.105:8020/%E6%B5%8B%E8%AF%95/var%E5%92%8Clet%EF%BC%8C%E4%BD%9C%E7%94%A8%E5%9F%9F/down.html?__hbt=1559527164398'
						}else{
							this.$dialog.toast({
			                    mes: resp.data.msg,
			                    timeout: 1500,
			                    icon: 'error',
			                });
						}
					})
				}
				
				

			},
			
			getIn(){
				this.postRequest('inmarketdetail/getProdectInmarketdetailTotalPriceAndTotalQuality', {
					StartTime: this.startTimeIn,
					endTime: this.endTime,
					customerId: this.$root.userInfo.typeCode,
				}).then(resp => {
					if(resp.data.state==0) {
						this.getNewObj(resp.data.aaData,'inDate','totalPrice','totalQuality')
						.then((o)=>{
							this.chartIn.setOption({
								grid: {
									left: '3%',
									right: '4%',
									bottom: '3%',
									containLabel: true
								},
								xAxis: {
									data: o.x
								},
								series: [{
									name: '重量',
									// 根据名字对应到相应的系列
									data: o.y,
								}, {
									name: '金额',
									// 根据名字对应到相应的系列
									data: o.y1,
								}]
							})
						})
					}else{
						this.$dialog.toast({
		                    mes: resp.data.msg,
		                    timeout: 1500,
		                    icon: 'error',
		                });
					}
				})
			},
			searchBtnIn(num) {
				this.startTimeIn = this.$root.yugi(num)
				this.btnNumIn = num
				this.getIn()
			},
			disposeDate() {
				this.postRequest('customer/queryStatisticalAnalysisByCustomerId', {})
					.then(resp => {
						if(resp.data.state==0){
							resp.data.aaData.salesSKUSortForWeek = resp.data.aaData.salesSKUSortForWeek.splice(0, 3)
							this.customerObj = resp.data.aaData
							this.orderList = this.customerObj.OrderTotalByPayTypeLastDay.aaData
						}
						
					})
			},
			searchBtn(num) {
				this.startTime = this.$root.yugi(num)
				this.btnNum = num
				this.searchDate()
			},
			orderSearch(num) {
				this.orderBtnNum = num
				if(num == 1) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastDay.aaData
				} else if(num == 7) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastWeek.aaData
				} else if(num == 30) {
					this.orderList = this.customerObj.OrderTotalByPayTypeLastMonth.aaData
				}
			},
			sxSearch(num){
				this.sxBtnNum = num
				if(num == 1) {
					this.sxStartTime = this.$root.yugi(6)
				} else if(num == 7) {
					this.sxStartTime = this.$root.yugi(14)
				} else if(num == 30) {
					this.sxStartTime = this.$root.yugi(29)
				}
				this.getSxData()
			},
			searchDate(startTime, endTime) {
				this.postRequest('order/getOrderSum', {
					startTime: this.startTime,
					endTime: this.endTime,
					sellerId: this.$root.userInfo.typeCode,
				}).then(resp => {
					if(resp.data.aaData.length > 0) {
						this.getNewObj(resp.data.aaData,'orderDate','orderCount','orderTotal')
						.then((o)=>{
							this.myChart.setOption({
								grid: {
									left: '3%',
									right: '4%',
									bottom: '3%',
									containLabel: true
								},
								xAxis: {
									data: o.x
								},
								series: [{
									name: '数量',
									// 根据名字对应到相应的系列
									data: o.y,
								}, {
									name: '金额',
									// 根据名字对应到相应的系列
									data: o.y1,
								}]
							})
						})
					}
				})
			},
			getNewObj(d,dateStr,str1,str2) {
				return new Promise((resolve,reject)=>{
					var orderDate = [],
						orderCount = [],
						orderTotal = [];
					for(let a = 0; a < d.length; a++) {
						var arr = d[a][dateStr].split(' ')[0].split('-')
						if(arr[1][0] == 0) {
							arr[1] = arr[1][1]
						}
						if(arr[2][0] == 0) {
							arr[2] = arr[2][1]
						}
						orderDate.push(arr[1] + '/' + arr[2])
						orderCount.push(d[a][str1])
						orderTotal.push(d[a][str2])
					}
					var o={
						x:orderDate,
						y:orderCount,
						y1:orderTotal
					}
					resolve(o)
				})
				
				
			},
			* getNameArr(){
				yield [{param_1:'数量',param_2:'金额'},{param_1:'数量(单)',param_2:'金额'}]
				yield [{param_1:'重量',param_2:'金额'},{param_1:'重量(kg)',param_2:'金额'}]
				yield [{param_1:'重量',param_2:'金额'},{param_1:'重量(kg)',param_2:'金额'}]
			},
			getOption(arr){
				return {
					title: {
						text: ''
					},
					legend: {
						data: [{
							name: arr[0].param_1
						}, {
							name: arr[0].param_2
						}],
						x: 'center',
						show: true,
					},
					grid: {
						bottom: '3%',
					},
					xAxis: {
						boundaryGap: false,
						data: []
					},
					yAxis: [{
							type: 'value',
							position: 'right',
							name:arr[1].param_1,
						},
						{
							type: 'value',
							name: arr[1].param_2,
							position: 'left',
							axisLabel: {
								formatter: '{value}'
							},
							splitLine: {
								show: false //不显示Y轴的横线
							},
							axisTick: {
								show: true, //这里是要不要下面的juju
							},
						},
					],
					series: [{
							name: arr[0].param_1,
							type: 'line',
							smooth:true,
							data: [],
						},
						{
							name: arr[0].param_2,
							smooth:true,
							type: 'line',
							yAxisIndex: 1,
							data: [],
							itemStyle: {
								normal: {
									color: 'rgb(255,162,38)'
								}
							},
						}
					]
				};
			},
			init() {
				var [arr_1,arr_2,arr_3]=[...this.getNameArr()]
				var width=this.$refs.orderChart.offsetWidth
				// 使用刚指定的配置项和数据显示图表。 
				this.myChart.setOption(this.getOption(arr_1));
				this.myChart.resize({
					width:width
				})
				this.chartIn.setOption(this.getOption(arr_2));
				this.chartIn.resize({
					width:width
				})
//				this.chartOut.setOption(this.getOption(arr_3));
//				this.chartOut.resize({
//					width:width
//				})
			}
		},

	}
</script>

<style lang='scss'>
	#fTjfx {
		background: white;
		a {
			text-decoration: none;
			color: black;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			-moz-tap-highlight-color: rgba(0, 0, 0, 0);
			-ms-tap-highlight-color: rgba(0, 0, 0, 0);
			-o-tap-highlight-color: rgba(0, 0, 0, 0);
			tap-highlight-color: rgba(0, 0, 0, 0);
		}
		input {
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
			border-radius: 0;
		}
		li {
			list-style: none;
		}
		body {
			font-family: Arial, "Microsoft YaHei", sans-serif, "Helvetica Neue", Helvetica, Arial;
		}
		p,
		span {
			word-wrap: break-word;
			word-break: break-all;
			overflow: hidden;
		}
		.title_name {
			margin: .02rem 0 .32rem 0;
			font-size: 0.3rem;
			color: #211E1D;
			font-weight: 700;
			padding-left: .08rem;
			&:before {
				width: 0.06rem;
				height: 0.2rem;
				content: '';
				display: inline-block;
				background: #C5092C;
				margin: 0 .11rem 0 0;
				border-radius: 20px;
			}
		}
		.title_name_tx{
			display: flex;
			justify-content: space-between;
			.down_pdf{
				margin:0 .25rem  .32rem 0;
				align-items: center;
				font-size: .28rem;
				display: flex;
				.down_pdf_xz{
					color: #018BE6;
					margin-right: .2rem;
				}
				img{
					width: .34rem;
					height: .34rem;
				}
			}
		}
		.order_header {
			margin: .02rem 0 .32rem 0;
			.title_name {
				margin: 0;
			}
		}
		.tj_header {
			width: 100%;
			overflow: hidden;
			padding: 0.25rem;
			box-sizing: border-box;
			border-bottom: 0.2rem solid #EEEEEE;
			font-size: 0.24rem;
			color: #848484;
			.header_content {
				display: flex;
				.img {
					flex-grow: 0;
					display: inline-block;
					width: 0.9rem;
					height: 0.9rem;
					margin: 0 0.25rem 0 0;
					border-radius: 50%;
					// border: 1px solid;
				}
				.header_right {
					flex-grow: 1;
					/*//这里width随便写，不写就会扯拐*/
					width: 6rem;
					.header_right_name {
						font-size: 0.3rem;
						color: #211E1D;
						font-weight: 700;
						line-height: 0.35rem;
						margin: 0.07rem 0 0.15rem;
					}
				}
			}
			.header_pj {
				width: 100%;
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				line-height: .4rem;
				.header_pj_list {
					width: 33%;
					text-align: center;
				}
				.span {
					color: #C5092C;
				}
			}
			
			.header_thr {
				margin: 0.67rem 0 0.28rem;
				display: flex;
				justify-content: space-around;
				ul {
					li {
						font-size: 0.26rem;
						color: #211E1D;
						margin-bottom: 0.17rem;
						text-align: center;
					}
					li:nth-child(2) {
						font-size: 0.32rem;
						font-weight: 700;
					}
					li:nth-child(3) {
						font-size: 0.24rem;
						color: #848484;
					}
				}
			}
		}
		.chart_line{
			width: 100%;
			padding:.2rem 0 .25rem 0;
			border-bottom: 0.2rem solid #EEEEEE;
		}
		.look_btn{
			display: flex;
			justify-content: space-between;
			width: 93.33%;
			margin: auto;
			border-bottom: 1px solid #D6D6D6;
			padding: .2rem 0rem .2rem 0rem ;
			.look_btn_name{
				color: #211E1D;
				font-size: .3rem;
				font-weight: bold;
			}
			.look_btn_down{
				display: flex;
				align-items: center;
				span{
					font-size: .26rem;
					color: #018BE6;
					margin-right: .05rem;
				}
				.zhankai{
					display: inline-block;
					width: .15rem;
					height: .15rem;
					border-top: 1px solid #018BE6;
					border-right: 1px solid #018BE6;
					border-bottom: 1px solid transparent;
					border-left: 1px solid transparent;
					transform: rotate(45deg);
				}
				.shouqi{
					border-top: 1px solid  #018BE6;
					border-right: 1px solid transparent;
					border-bottom: 1px solid transparent;
					border-left: 1px solid  #018BE6;
					margin-top: .1rem;
				}
			}
		}
		.line_border{
			border-bottom: none;
		}
		.order {
			padding: 0.25rem;
			border-bottom: 0.2rem solid #EEEEEE;
			.order_header {
				display: flex;
				justify-content: space-between;
				ul {
					display: flex;
					li {
						font-size: .24rem;
						color: #848484;
						margin-left: .29rem;
					}
					.active {
						color: #018BE6;
						border-bottom: .04rem solid #018BE6;
					}
				}
			}
			.order_chart {
				width: 100%;
				height: 5.92rem;
				margin: 0rem 0 0 0;
			}
			.btn_shouqi{
				margin-top: .2rem;
				display: flex;
				justify-content: center;
				font-size: .28rem;
				color: #018BE6;
				i{
					width: .15rem;
					height: .15rem;
					border-top: 1px solid  #018BE6;
					border-right: 1px solid transparent;
					border-bottom: 1px solid transparent;
					border-left: 1px solid  #018BE6;
					transform: rotate(45deg);
					margin: .18rem 0 0 .15rem;
				}
			}
			&:last-child{
				border-bottom: none;
				padding-bottom: 0;
			}
		}
		.merchandise,
		.week_list {
			padding: .25rem 0 0 0;
			border-bottom: 0.2rem solid #EEEEEE;
			.title_name {
				padding-left: .25rem;
			}
			.content {
				display: flex;
				border-top: 1px solid #E1E1E1;
				ul {
					width: 50%;
					li {
						color: #848484;
						font-size: .26rem;
						padding-left: .33rem;
						.unit {
							font-size: .24rem;
							color: #848484;
						}
					}
					li:nth-child(2) {
						font-size: .4rem;
						color: #211E1D;
						margin: .18rem 0;
						padding-bottom: .22rem;
					}
					li:nth-child(1) {
						padding-top: .25rem;
					}
				}
				ul:nth-child(2) {
					box-sizing: border-box;
					border-left: 1px solid #E1E1E1;
					li {
						padding-left: .34rem;
					}
				}
			}
			.zf_money_header {
				display: flex;
				justify-content: space-between;
				margin: .02rem 0 .32rem 0;
				.title_name {
					margin: 0;
				}
				ul {
					display: flex;
					li {
						margin-right: .3rem;
					}
					.active {
						color: #018BE6;
						border-bottom: .04rem solid #018BE6;
					}
				}
			}
			.zf_money {
				ul {
					display: flex;
					li {
						box-sizing: border-box;
						font-size: .26rem;
						color: #848484;
						width: 33.3%;
						border-right: 1px solid #E1E1E1;
						border-bottom: 1px solid #E1E1E1;
						padding: .3rem .2rem;
					}
					li:nth-child(3) {
						border-right: none;
					}
				}
				.zf_money_top {
					border-top: 1px solid #E1E1E1;
					li {
						color: #211E1D;
						font-size: .3rem;
						font-weight: 700;
					}
				}
			}
			.notice {
				text-align: center;
				color: red;
				padding: .2rem;
			}
		}
	}
</style>