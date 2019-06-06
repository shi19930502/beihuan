<template>
	<yd-layout id='fJcgl'>
		<div slot='top' class="header">
			<div>
				<!--v-if='$root.userInfo.typeId=="merchant"'-->
				<a  href="#/f_index" class="header_left">首页</a>
				<!--<div v-else></div>-->
			</div>
			<div class="name">{{$route.query.jyjc=="jyjc"?"检疫列表":"进场列表"}}</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click='goXZ' href="javascript:;">新增进场</a>
				<div v-else></div>
			</div>
		</div>
		<div slot='top' class="serch_all">
			<!--<div>{{$store.state.extendStr}}</div>-->
			<div v-if='$store.state.extendStr=="GL"&&$root.userInfo.typeCode' class="moren_channel">
				<span v-if='channelArr.length>0'>所属渠道：{{(channelArr.find(o=>o.code==$root.userInfo.typeCode)).name||'获取错误'}}</span>
			</div>
			<div v-else-if='$store.state.extendStr=="GL"' class="select_channel">
				<span>渠道查询：</span>
				<select @change="selectChange(selectVal)" class="select_channel_select" v-model="selectVal" name="" id="">
					<option value="" selected="selected">全部</option>
					<option :value="item.code" :key='item.code' v-for="item in channelArr">{{item.name}}</option>
				</select>
				<img src="../../../static/imgs/list_icon_right.png" alt="" />
			</div>
			<div class="search_top">
				<div :class="topActiveNum==5?'top_active':''" @click='topActive(5)'>全部</div>
				<div v-if='$store.state.extendStr=="GL"||$store.state.extendStr=="YP"' :class="topActiveNum==0?'top_active':''" @click='topActive(0)'>{{$root.userInfo.extend=="007"?"待审核":"预告"}}</div>
				<div v-else-if='$root.userInfo.extend=="004"||$root.userInfo.extend=="008"||$root.userInfo.extend=="007"' :class="topActiveNum==0?'top_active':''" @click='topActive(0)'>审核</div>
				<div v-if='$store.state.extendStr=="GL"||$store.state.extendStr=="YP"||$root.userInfo.extend=="004"||$root.userInfo.extend=="008"||$root.userInfo.extend=="007"' :class="topActiveNum==4?'top_active':''" @click='topActive(4)'>未通过</div>
				<div :class="topActiveNum==1?'top_active':''" @click='topActive(1)'>进场</div>
				<div :class="topActiveNum==2?'top_active':''" @click='topActive(2)'>出场</div>
				<div :class="topActiveNum==3?'top_active':''" @click='topActive(3)'>作废</div>
			</div>
			<div class="search_bottom">
				<div class="search_bottom_list">
					<div class="div" @click='openCar("car")'>
						<span :style="{color:carCode?'#018BE6':'#848484'}">全部车辆</span>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
				<div class="search_bottom_list">
					<div class="div" @click='openCar("goods")'>
						<span :style="{color:goodsName?'#018BE6':'#848484'}">全部商品</span>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
				<div class="search_bottom_list" v-show='noYG'>
					<div class="div">
						<span v-if='dateTime' class="get_date" @click='selectTime'>{{dateTime}}</span>
						<span v-else @click='selectTime'>选择时间</span>
						<yd-icon class='clear_date' @click.native='clearDate' v-if='dateTime' size='.2rem' name="error-outline"></yd-icon>
						<!--openDateTime-->
						<yd-datetime :init-emit='false' :placeholder='dateplaceholder' :callback='callbackDate' v-show='openDateTime' ref="datetime" type="date" v-model="selectDateTime" slot="right"></yd-datetime>
						<img src="../../assets/firstImgs/icon_up.png" alt="" />
					</div>
				</div>
			</div>
		</div>

		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>
					<div class="list_children" @click='goJcxq(item)' v-for='(item,index) in dataList' :key='item.id'>
						<div class="list_top">
							<div class="name"><span v-if='item.detailNum>0'>共{{item.detailNum}}件商品&nbsp;</span><span class="car" ><i :style="{border:item.transporterId!='null'&&item.transporterId!=null&&item.transporterId!=''?'1px solid #707070':'none'}">{{item.transporterId!='null'&&item.transporterId!=null&&item.transporterId!=''?item.transporterId:''}}</i></span></div>
							<div v-if='item.statusId==0' class="time">已预告</div>
							<div v-else-if='item.statusId==1' class="time">已进场</div>
							<div v-else-if='item.statusId==2' class="time">已出场</div>
							<div v-else-if='item.statusId==3' class="time">作废</div>
							<div v-else-if='item.statusId==4' style="color: red;" class="time">未通过</div>
						</div>
						<!--wholesaleMarketName-->
						<template v-if='$route.query.jyjc!="jyjc"'>
							<div class="indate">
								<span>{{item.inDate}}</span>
								<span v-if='item.statusId==1&&$root.config.systemid==8&&item.detailNum!=0' @click.stop='lookQr(item)' class="look_qr">查看二维码</span>
								<span v-if='item.statusId==0&&$root.config.systemid==7' @click.stop='ygClick(item,index,true)' class="look_qr">审核</span>
								<span v-if='item.statusId==1&&$root.config.systemid==7' @click.stop='ygClick(item,index,false)' class="look_qr">出场</span>
								<span style="letter-spacing: .05rem;" v-if='(item.statusId==0||item.statusId==4)&&$root.config.systemid==8&&($root.userInfo.extend=="001"||$root.userInfo.extend=="004"||$root.userInfo.extend=="008"||$root.userInfo.extend=="007")' @click.stop='cancellation(item,index,false)' class="look_qr">作废</span>
							</div>
						</template>

						<div class="list_bottom" v-if='item.statusId!=0'>
							<div>
								<div class="list_name">{{item.wholesalerName}}</div>
								<div v-if='item.areaName||item.baseName' class="name">
									{{item.areaName}}&nbsp;&nbsp; {{item.baseName}}
								</div>
							</div>
							<template v-if='$route.query.jyjc!="jyjc"'>
								<div v-if='item.statusId==1' class="list_bottom_btn">
									<div v-if='item.detailNum==0' @click.stop='goXzjcXz(item.id)' class="sz_btn">设置详情</div>
									<img v-else-if='item.detailNum!=0&&item.inmarketSource==1' @click.stop='goXzjcXz(item.id)' src="../../assets/firstImgs/jcgl_icon_edit@2x.png" alt="" />
								</div>
								<div v-else-if='item.statusId==4' class="list_bottom_btn">
									<img v-if='$store.state.extendStr!="GL"&&$root.userInfo.extend!="001"' @click.stop='goXzjcXz(item.id)' src="../../assets/firstImgs/jcgl_icon_edit@2x.png" alt="" />
								</div>
							</template>
						</div>
						<div @click.stop="item.moreRemark=item.moreRemark?false:true" class="no_remark" :class="{no_remark_more:item.moreRemark}" v-if='item.statusId==4'>
							<div :class="{no_remark_y_2:item.moreRemark}" class="no_remark_y" ><span style="color: red;">失败原因：</span>{{item.remark}}</div>
							<!--<span :class="{no_remark_more_btn_2:item.moreRemark}"  @click.stop="item.moreRemark=item.moreRemark?false:true" class="no_remark_more_btn">{{item.moreRemark?'收起':'展开'}}</span>-->
							
						</div>
						
						<img v-if='item.statusId==2' class="list_cczf" src="../../assets/firstImgs/img_yichuc@2x.png" alt="" />
						<img v-else-if='item.statusId==3' class="list_cczf" src="../../assets/firstImgs/img_yizuofei@2x.png" alt="" />
						
					</div>
				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
		</div>
		<yd-popup v-model="qrShow" position="center" width="100%">
			<div class="qr_bg">
				<qriously id='qrRef' v-show='false' :backgroundAlpha="backgroundAlpha" ref='qrRef' :value="initQCode" :size="400" />
				<img :src="imgSrc" alt="" />
			</div>

		</yd-popup>
		<yd-popup v-model="ygShow" position="center" width="90%">

			<div class="yg_content">
				<div class="yg_car_num">车牌号：{{inWeightObj.transporterId}}</div>
				<div class="yg_inweight">
					<span>{{isIn?'进场重量':'出场重量'}}：</span>
					<input :style="{display: ygShow?'block':'none'}" maxlength="9" @input='ygChangeInput(ygWeight)' v-model='ygWeight' :placeholder="isIn?'请输入进场重量':'请输入出场重量'" class="inweight_input" type="text" />
					<span>千克</span>
				</div>
				<div @click='ygSubmit(false)' v-if='ygWeight&&ygWeight>0' class="yg_btn">{{isIn?'确认进场':'确认出场'}}</div>
				<div style="background: #DDDDDD;" v-else class="yg_btn">{{isIn?'确认进场':'确认出场'}}</div>
			</div>
		</yd-popup>
		

		<yd-popup v-model="carShow" position="bottom" height="30%">
			<div class='car_show'>
				<div class="car_show_title">{{isCarPopup?'请输入车牌号':'请输入商品名称'}}</div>
				<div style="position: relative;">
					<input  @keyup.enter='downEnter' class="car_show_input" v-model='carInput' :placeholder="isCarPopup?'请输入车牌号':'请输入商品名称'" type="text" />
					<yd-icon class='clear_input' @click.native='clearInput' v-if='carInput' size='.2rem' name="error-outline"></yd-icon>
				</div>
				<div class="car_show_btn" @click='carBtn'>确认</div>
			</div>
		</yd-popup>
		
		<yd-popup v-model="remarkContentShow" position="center" width="90%">
			<div class="yg_content">
				<div class="yg_car_num">车牌号：{{inWeightObj.transporterId}}</div>
				<div class="yg_inweight">
					<span>原因：</span>
					<input :style="{display: remarkContentShow?'block':'none'}" maxlength="100"  v-model.trim='remarkContent' placeholder="请输入失败原因" class="inweight_input" type="text" />
				</div>
				<div @click='ygSubmit(true)' v-if='remarkContent' class="yg_btn">确认</div>
				<div style="background: #DDDDDD;" v-else class="yg_btn">确认</div>
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
				initQCode: '',
				pageNum: 1,
				pageSize: 12,
				dataList: [],
				qrShow: false,
				backgroundAlpha: 1,
				imgSrc: '',
				ygShow: false,
				ygWeight: '',
				inWeightObj: {},
				inWeightNum: 0,
				isIn: true,
				dateTime: "",
				selectDateTime: '',
				topActiveNum: 0,
				carShow: false,
				carInput: '',
				carCode: '',
				goodsName: '',
				isCarPopup: false,
				isGoodsPopup: false,
				openDateTime: false,
				dateplaceholder: '请选择时间',
				noTime: true,
				num: 1,
				fnishDataList:false,
				noYG:true,
				channelArr:[],//渠道
				selectVal:'',
				remarkContent:'',//审核不通过原因
				remarkContentShow:false,
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', this.$route.query.jyjc=="jyjc"?"检疫管理":"进场管理")
			sessionStorage.setItem('XZJC_edit', '')
			sessionStorage.setItem('mainId', '')
			if(this.$root.config.systemid == 8) {
				this.topActiveNum = 1
			}
		},
		watch: {
			//@click.stop="doThis" 下面两个方法可以用vue的一个属性解决
			
			carShow(val) {
				if(val) {
					this.isCarPopup ? this.carInput = this.carCode : this.carInput = this.goodsName
				} else {
					this.isGoodsPopup = false;
					this.isCarPopup = false
				}
			},
		},
		computed: {

		},
		mounted() {
			this.dateTime = this.selectDateTime = this.$root.yugi(0)
			if(this.$root.config.systemid == 8) {
				this.getCode().then(() => {
					this.loadList()
				})
			} else {
				this.getChannel();
				this.loadList()
			}

		},
		methods: {
			downEnter() { //回车键的键值为13
				this.carBtn() //调用登录按钮的登录事件
			},
			//渠道查询
			selectChange(val){
				this.pageNum = 1;
				this.pageSize = 12;
				this.fnishDataList=false;
				this.dataList = []
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.loadList()
			},
			//获取渠道
			getChannel(){
				this.postRequest('channel/list', {
					level:3,
				}).then(resp => {
					if(resp.data.state===0){
						this.channelArr=resp.data.aaData	
					}
				})
			},
			clearDate() {
				this.dateTime = ''
				this.selectDateTime = this.$root.yugi(0)
				this.noTime = false
				this.pageNum = 1;
				this.pageSize = 12;
				this.fnishDataList=false;
				this.dataList = []
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.loadList()
			},
			clearInput() {
				this.carInput = ''
			},
			callbackDate() {
				if(this.noTime) {
					this.dateTime = this.selectDateTime
					this.pageNum = 1;
					this.pageSize = 12;
					this.fnishDataList=false;
					this.dataList = []
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
					//防止第一次进来多加载一次
					this.num > 1 ? this.loadList() : this.num++

				}

			},
			selectTime() {
				if(!this.dateTime) {
					this.selectDateTime = this.$root.yugi(0)
				}
				this.noTime = true
				this.$refs.datetime.open();

			},
			carBtn() {
				this.isCarPopup ? this.carCode = this.carInput : this.goodsName = this.carInput
				this.carShow = false;
				this.pageNum = 1;
				this.pageSize = 12;
				this.fnishDataList=false;
				this.dataList = []
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.loadList()
			},
			openCar(str) {
				str == 'car' ? this.isCarPopup = true : this.isGoodsPopup = true
				this.carShow = true;
			},
			topActive(num) {
				if(this.topActiveNum != num) {
					this.topActiveNum = num;
					//判断是否显示时间
					if(this.topActiveNum&&this.topActiveNum!=4){
						this.noYG=true
					}else{
						if(this.$root.userInfo.extend=='001'||this.$root.userInfo.extend=='004'||this.$root.userInfo.extend=='007'||this.$root.userInfo.extend=='008'){
							this.noYG=false;
						}
					}
					this.pageNum = 1;
					this.pageSize = 12;
					this.fnishDataList=false;
					this.dataList = []
					this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
					this.loadList()
				}
			},
			ygSubmit(flg) {
					this.$dialog.loading.open('加载中，请稍后...');
					if(flg){
						console.log(flg)
						var params = {
							id: this.inWeightObj.id,
							statusId: 4,
							remark:this.remarkContent
						}
					}else{
						var params = {
							id: this.inWeightObj.id,
							statusId: this.isIn ? 1 : 2,
						}
						this.isIn ? params.inWeight = this.ygWeight : params.outWeight = this.ygWeight;
					}

					this.postRequest('inmarketdetail/updateStatusByMainId', params).then(resp => {
						this.$dialog.loading.close();
						if(resp.data.success && resp.data.state == 0) {
//							if(this.isIn) {
//								this.inWeightObj.statusId = 1
//								this.inWeightObj.inWeight = this.ygWeight
//								this.inWeightObj.statusName = "已确认进场"
//							} else {
//								this.inWeightObj.statusId = 2
//								this.inWeightObj.outWeight = this.ygWeight
//								this.inWeightObj.statusName = "已出场"
//							}
//							this.$set(this.dataList, this.inWeightNum, this.inWeightObj)
							
							//minxi_f_goods方法没有下面这个完美
//							this.dataList.splice(this.inWeightNum,1)
//							if(!this.fnishDataList){
//								this.getOneList().then((d)=>{
//									
//								})
//							}
							
							//根据业务需求，最好每次进场或者出场后都重新加载dataList。
							//因为所有一批进场都在超级管理员操作，一批连续进场，后台更新了，前端更新，导致其他进场的数据看不到。
							this.pageNum = 1;
							this.pageSize = 12;
							this.fnishDataList=false;
							this.dataList = []
							this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
							this.loadList()
							
							this.ygShow = false
							this.remarkContentShow = false
							this.$dialog.notify({
								mes: '操作成功',
								timeout: 1500,
								icon: 'success',
								callback: () => {

								}
							});

						} else {
							this.ygShow = false
							this.remarkContentShow = false
							this.$dialog.notify({
								mes: '操作失败',
								timeout: 3000,
								callback: () => {

								}
							});
						}
					})
				
			},
			getOneList(){
				return new Promise((resolve,reject)=>{
					console.log(this.dataList.length)
					var params = {
						pageNum: this.dataList.length + 1,
						pageSize: 1,
						statusId: this.topActiveNum == 4 ? '' : this.topActiveNum = this.topActiveNum,
						transporterId: this.carCode,
						startTime: this.dateTime,
						endTime: this.dateTime,
						goodsCode: this.goodsName,
					}
					this.postRequest('inmarketmain/baseList', params).then(resp => {
						this.$dialog.loading.close();
						if(resp.data && resp.data.state == 0) {
							this.dataList = [...this.dataList, ...resp.data.aaData];
							resolve(resp.data.aaData)
						}
					})
				})
				
			},
			convertCanvasToImage(canvas) {
				var image = new Image();
				image.src = canvas.toDataURL("image/png");
				return image;
			},
			getCode() {
				return new Promise((resolve, reject) => {
					this.postRequest('customer/getCustomerForWeiXin', {
						id: this.$root.userInfo.typeCode
					}).then(resp => {
						if(resp.data.aaData) {
							this.customerCode = resp.data.aaData.code
						}
						resolve()
					})
				})

			},
			loadList() {
				this.$dialog.loading.open('数据加载中...');
				var params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					statusId: this.topActiveNum == 5 ? '' : this.topActiveNum = this.topActiveNum,
					transporterId: this.carCode,
					startTime:( this.topActiveNum&& this.topActiveNum!=4)||this.$store.state.extendStr=='GL'?this.dateTime:'',
					endTime: ( this.topActiveNum&& this.topActiveNum!=4)||this.$store.state.extendStr=='GL'?this.dateTime:'',
					goodsCode: this.goodsName,
					channelCode:this.$store.state.extendStr=="GL"&&this.$root.userInfo.typeCode?this.$root.userInfo.typeCode:this.selectVal,
				}
				if(this.$root.config.systemid == 8) {
					params.wholesalerId = this.customerCode
				}
				this.postRequest('inmarketmain/baseList', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data && resp.data.state == 0) {
						for(let a =0;a<resp.data.aaData.length;a++){
							resp.data.aaData[a].moreRemark=false
						}
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
			goXZ() {
				if(this.$root.config.ssbhbgimg) {
					if(this.$store.state.extendStr=='MD') {
						sessionStorage.setItem('XZJC_isEdit',false)
						this.$router.push({
							name: 'f_xzjc_xxlr'
						})
					} else {
						if(this.$root.userInfo.extend=='007'){
							sessionStorage.setItem('XZJC_isEdit',false)
							this.$router.push({
								name: 'f_xzjc_xxlr'
							})
						}else{
							this.$router.push({
								name: 'f_xzjc_car'
							})
						}
					}
				} else {
					sessionStorage.setItem('XZJC_isEdit',false)
					this.$router.push({
						name: 'f_xzjc_xxlr'
					})
				}
			},
			lookQr(item) {
				var name = "fLogin_first"
				if(this.$store.state.extendStr=="MD") {
					name = 'fLogin_second'
					if(this.$root.userInfo.extend=='004'){
						name = 'mLogin_second'
					}
				}
				var urlParams =name + "_" + this.$root.userInfo.typeCode + '_' + item.id
				console.log(urlParams)
				this.qrShow = true
				if(this.$root.config.quickLogin) {
					this.initQCode = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc197a55ff6d0decc&redirect_uri=" + this.$root.config.wX_URL + "&response_type=code&scope=snsapi_base&state=" + urlParams + "#wechat_redirect"
				} else {
					this.initQCode = this.$root.config.wX_URL + "?code=081H2kqP1CRtO11HO6sP1JHZpP1H2kqv&state=" + urlParams + "#/qr_index"
				}
				console.log(this.initQCode)
				this.$nextTick(() => {
					var canvas = document.getElementsByTagName('canvas')
					this.imgSrc = canvas[0].toDataURL("image/png");
					//this.convertCanvasToImage(canvas)
				})
			},
			ygClick(item, num, isIn) {
				if(isIn){
					this.$dialog.confirm({
	                    title: '提示：',
	                    mes: '请选择审核状态!',
	                    opts: [
	                        {
	                            txt: '不通过',
	                            color: 'red',
	                            callback: () => {
	                            	this.remarkContent='';
	                            	this.remarkContentShow=true;
	                            	this.inWeightObj = item
									this.inWeightNum = num
	                            }
	                        },
	                        {
	                            txt: '通过',
	                            color: true,
	                            callback: () => {
	                                this.ygShow = true;
									this.ygWeight = '';
									isIn ? this.isIn = true : this.isIn = false
									this.inWeightObj = item
									this.inWeightNum = num
	                            }
	                        },
	                        {
	                            txt: '取消',
	                            color: false,
	                            callback: () => {
	                            	
	                            }
	                        },
	                    ]
	                });
				}else{
					this.ygShow = true;
					this.ygWeight = '';
					isIn ? this.isIn = true : this.isIn = false
					this.inWeightObj = item
					this.inWeightNum = num
				}
				
			},
			//作废
			cancellation(item, num, isIn){
				 this.$dialog.confirm({
                    title: '提示：',
                    mes: '立即作废该？',
                    opts: () => {
                       	var o={};
						o=Object.assign({},o,item)
						o.statusId=3;
						this.postRequest('inmarketdetail/updateStatusByMainId', o).then(resp => {
							if(resp.data.state===0){
								this.$dialog.notify({
									mes: `操作成功`,
									timeout: 1000,
								});
								this.dataList.splice(num, 1)
								this.pageSize = this.dataList.length
								if(this.dataList.length <= 5 && !this.fnishDataList) {
									this.pageSize = 12;
									this.pageNum=1;
									this.dataList=[];
									this.loadList()
								}
							}else{
								this.$dialog.toast({
				                    mes: resp.data.msg,
				                    timeout: 1500,
				                    icon: 'error',
				                    callback: () => {
				                    	
				                    }
				                });
							}
						})
                    }
                });
					
			},
			//编辑
			goXzjcXz(id) {
				sessionStorage.setItem('XZJC_isEdit', true)
				sessionStorage.setItem('XZJC_isJcgl', true)
				sessionStorage.setItem('mainId', id)
				//清除待上架商品
				sessionStorage.setItem('fl_goods','')
				this.$router.push({
					name: 'f_xzjc_xxlr', //f_xzjc_xz 老的
					query: {
						mainId: id
					}
				})
			},
			//这里写复杂了，其实只用判断007，其他的都没有预告了，
			goJcxq(item) {
				if(item.statusId == 0||item.statusId == 4) {
					if(item.extendId=='007'||item.extendId=='004'||item.extendId=='008'){
						if(this.$root.config.systemid == 7&&this.$route.query.jyjc=='jyjc') {
							var massage = '审核失败，请告知商家！'
							this.$dialog.toast({
			                    mes:massage,
			                    timeout: 1500
			               });
			               return
						}
					}else{
						//这里只有001起作用
						var massage = '请等待管理员审核!'
						if(this.$root.config.systemid == 7){
							if(item.statusId==4){
								massage='审核失败，请告知商家！'
							}else{
								massage = '请先审核！'
							}
						}else{
							if(item.statusId==4){
								massage='审核失败，请作废重新进场!'
							}
						}
						
						if(this.ygShow) {
	
						} else {
							this.$dialog.toast({
			                    mes:massage,
			                    timeout: 1500
			               });
						}
						return
					}
				} 
				var o={
					name: 'f_jcxq',
					query: {
						mainId: item.id
					}
				}
				if(this.$route.query.jyjc=='jyjc'){
					o.query={
						mainId: item.id,
						jyjc:this.$route.query.jyjc
					}
				}
				this.$router.push(o)
				
			},
			ygChangeInput(val) {
				if(val) {
					if(val.length > 9) {
						val = val.slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(val) || reg_2.test(val)) {
						if(val > 999999.99) {
							val = '999999.99'
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
				this.ygWeight = val
			},
		}
	}
</script>
<style lang='scss'>
	#fJcgl {
		.yd-accordion-title {
			font-size: .3rem;
		}
		img {
			display: block;
		}
		.yd-list-loading {
			background: #efeff3;
		}
		.serch_all {
			
			background: white;
			.moren_channel{
				padding: .2rem;
				font-size: .28rem;
				color: #343434;
				border-bottom: 1px solid #E1E1E1;
			}
			.select_channel{
				padding: .2rem;
				font-size: .28rem;
				color: #343434;
				border-bottom: 1px solid #E1E1E1;
				align-items: center;
				display: flex;
				.select_channel_select{
					flex: 1;
					border: none;
				}	
				img{
					width: .12rem;
					height: .24rem;
				}
				span{
					font-size: .28rem;
					color: #343434;
				}
			}
			.search_top {
				padding: 0 .33rem;
				font-size: .28rem;
				justify-content: space-between;
				border-bottom: 1px solid #D5D5D5;
				color: #343434;
				display: flex;
				div {
					padding: .34rem .0rem .29rem .0rem;
				}
				.top_active {
					color: #018BE6;
					border-bottom: 2px solid #018BE6;
				}
			}
			.search_bottom {
				background: #F5F5F9;
				display: flex;
				padding: .31rem .34rem;
				color: #848484;
				/*justify-content: space-between;*/
				.search_bottom_list {
					width: 33.33%;
					align-items: center;
					justify-content: flex-start;
					font-size: .28rem;
					display: flex;
					img {
						width: .16rem;
						height: .12rem;
						margin-left: .11rem;
					}
					.div {
						display: flex;
						align-items: center;
					}
				}
				.search_bottom_list:nth-child(3) {
					height: .46rem;
					position: relative;
					justify-content: flex-end;
					.get_date {
						border: 1px solid #D5D5D5;
						padding: .0rem .08rem;
						border-radius: .04rem;
						color: rgb(1, 139, 230);
					}
					.clear_date {
						position: absolute;
						top: -.03rem;
						color: #018BE6;
						right: .17rem;
						font-size: .2rem;
						z-index: 100;
					}
				}
				.search_bottom_list:nth-child(2) {
					justify-content: space-around;
				}
			}
		}
		.content {
			background: white;
			.list_children {
				position: relative;
				padding: .34rem .32rem .34rem 0;
				margin-left: .32rem;
				color: #343434;
				font-size: .28rem;
				border-bottom: 1px solid #E1E1E1;
				.list_top {
					display: flex;
					justify-content: space-between;
					font-size: .32rem;
					font-weight: 700;
					/*align-items: center;*/
					color: #211E1D;
					.name {
						flex: 1;
						display: flex;
						align-items: center;
					}
					.time {
						width: 1.3rem;
						font-size: .28rem;
						font-weight: normal;
						color: #848484;
						&:after {
							width: .11rem;
							height: .2rem;
							display: inline-block;
							content: '';
							background: url(../../assets/imgs/list_icon_right.png) no-repeat;
							background-size: contain;
							margin-left: .16rem;
						}
					}
				}
				.indate {
					font-family: 'PingFang-SC-Medium';
					font-size: .28rem;
					color: #848484;
					margin: .15rem 0 .15rem 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.look_qr {
						/*border: 1px solid #018BE6;*/
						padding: .05rem .1rem;
						border-radius: .04rem;
						color: #018BE6;
					}
				}
				.car {
					/*display: inline-block;*/
					/*margin-top: .05rem;*/
					font-size: .28rem;
					line-height: .32rem;
					/*height: .32rem;*/
					max-width: 3.2rem;
					flex: 1;
					i{
						font-weight: 700;
						padding: 0 .12rem;
						border-radius: 2px;
						display: inline-block;
						border: 1px solid rgba(112, 112, 112, 1);
					}
				}
				.list_name {
					font-size: .28rem;
				}
				.list_name_check{
					display: flex;
					justify-content: space-between;
					.look_check{
						color: #018BE6;
						padding: .05rem .1rem;
						margin-left: .45rem;
						text-align: right;
					}
				}
				.list_bottom {
					display: flex;
					justify-content: space-between;
					/*align-items: center;*/
					.name {
						color: #848484;
						padding: .1rem .2rem 0 0;
						/*flex-grow: 0;*/
						width: 5.2rem;
					}
					.list_bottom_btn {
						display: flex;
						align-items: flex-end;
					}
					.sz_btn {
						color: #018BE6;
						font-size: .28rem;
						padding: 0 .13rem;
						/*line-height: .52rem;
						height: .52rem;*/
						/*height: .48rem;*/
						/*border: 1px solid #018BE6;*/
						border-radius: .04rem;
						/*width: 1.65rem;*/
						font-weight: 500;
						text-align: right;
						flex-grow: 1;
					}
					img {
						width: .4rem;
						height: .4rem;
						position: relative;
						z-index: 20;
					}
				}
				.no_remark{
					font-size: .24rem;
					color: #848484;
					padding: .1rem 0 .1rem .1rem;
					margin-top: .1rem;
					background: #efeff3;
					display: flex;
					
				}
				.no_remark_y{
					flex: 1;
					white-space: nowrap;
					text-overflow:ellipsis;
					overflow: hidden;
				}
				.no_remark_y_2{
					white-space: inherit;
					overflow: auto;
					text-overflow: initial;
				}
				.no_remark_more{
					flex-direction: column;
					justify-content: center;
					padding: .1rem ;
				}
				.no_remark_more_btn{
					margin-left: .15rem;
					width: .6rem;
					color: #018BE6;
				}
				.no_remark_more_btn_2{
					margin: .15rem auto 0 auto;
				}
				.list_cczf {
					width: 1.54rem;
					height: 1.17rem;
					position: absolute;
					/*top: 1.07rem;*/
					bottom: .2rem;
					right: .05rem;
				}
				.list_cc {
					position: absolute;
					top: .96rem;
					right: 1rem;
					width: 1.08rem;
					height: 1.08rem;
					color: white;
					background: rgba(0, 0, 0, .2);
					border-radius: 50%;
					z-index: 9999;
					display: flex;
					align-items: center;
					justify-content: space-around;
					text-align: center;
				}
			}
			.list_children:last-child {
				/*border-bottom: none;*/
			}
		}
		.yd-scrollview:after {
			display: none;
		}
		.qr_bg {
			background: white;
			padding: .2rem;
			margin: auto;
			text-align: center;
			img {
				margin: auto;
				border: .1rem solid #D6D6D6;
				width: 200px;
				height: 200px;
			}
		}
		.yg_content {
			background: white;
			height: 30%;
			padding: .5rem .25rem .8rem .25rem;
			border-radius: .1rem;
			.yg_car_num {
				font-size: .32rem;
				font-weight: bold;
				padding: .2rem 0;
				text-align: center;
			}
			.yg_inweight {
				width: 90%;
				margin: .4rem auto .4rem;
				font-size: .28rem;
				align-items: center;
				display: flex;
				span {
					flex-grow: 0;
					text-align: right;
				}
				.inweight_input {
					width: 1rem;
					flex-grow: 1;
					margin: 0 .15rem 0 0;
					height: .6rem;
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
		.car_show {
			position: relative;
			padding: .3rem .25rem .25rem .25rem;
			.car_show_title {
				color: #343434;
				font-size: .32rem;
				font-weight: bold;
			}
			.car_show_input {
				border: 1px solid #BFBFBF;
				height: .72rem;
				width: 100%;
				margin: .25rem 0 .5rem 0;
				padding: 0 .45rem 0 .25rem;
				font-size: .28rem;
			}
			.clear_input {
				position: absolute;
				top: .48rem;
				right: .2rem;
				z-index: 1502;
			}
			.car_show_btn {
				color: white;
				background: #018BE6;
				height: .8rem;
				text-align: center;
				line-height: .8rem;
				border-radius: .1rem;
			}
		}
	}
</style>