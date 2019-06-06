<template>
	<yd-layout id='fSpgl'>
		<div class="header" slot='top'>
			<div style="width: 33%;">
				<div @click='goFindex' class="header_left">
					首页
				</div>
			</div>
			<ul class="header_right">
				<li :class='{nav_active:navActiveNum==1}' @click='look_list("1")'>出售中</li>
				<li :class='{nav_active:navActiveNum==2}' @click='look_list("2")'>已下架</li>
			</ul>
			<div class="header_plcc">
				<div @click='goFplcz'>批量操作</div>
				<div v-if='false'></div>
				<img @click='add' class="plcc_img" src="../../assets/firstImgs/spgl_icon_add@2x.png" alt="" />
			</div>
		</div>
		<div class="content">
			<yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
				<div class="list" slot='list'>
					<div class="content_list" :key='index' v-for='(item,index) in dataList'>

						<div class="goods_list">
							<div class="list_img_f">
								<img v-if='item.skuPicUrl&&item.skuPicUrl!=null' class="list_img" :src="$root.imgURL+item.skuPicUrl" alt="" />
								<img v-else-if='item.productPicUrl&&item.productPicUrl!=null' class="list_img" :src="$root.imgURL+item.productPicUrl" alt="" />
								<img v-else class="list_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
								<img v-if='item.isMuslim' class="qingzhen" src="../../assets/firstImgs/qingzhen.jpg" alt="" />
							</div>
							<div class="list_right">
								<div class="time">
									<div>添加时间:<span v-if='item.createdDate&&item.createdDate!=null'>{{item.createdDate.split(' ')[0]}}</span></div>
									<div class="time_right">库存{{item.skuStockQuantity}}{{item.skuMeasureName}}</div>
								</div>
								<div class="left_name">{{item.name}}<span v-if='item.skuName&&item.skuName!=null'>{{' - '+item.skuName}}</span></div>
								<div class="money_father">
									<div class="money">
										<div class="money_name">
											<div class="money_name_c">单价</div>
										</div>
										<div v-if='item.isEdit' class="num_input_father">
											<div>
												<strong>￥</strong>
												<input @blur='blurInput(item)' @input='changeInput(item)' v-model.trim='item.oldSkuPrice' class="num_input" type="text" />
											</div>
											<select :key='index' style="border: 1px solid #D6D6D6;" class="select" name="" id="" v-model='item.skuMeasure'>
												<option v-for='i in unitList' :key='i.code' :value="i.code">{{i.name}}</option>
											</select>
										</div>
										
										<div v-else style="display: flex;">
											<div  class="num">￥{{item.skuPrice}}</div>
											<div class="unit"><span>/</span>{{item.skuMeasureName}}</div>
										</div>

									</div>
									<div @click='moneyYes(item,index)' v-if='item.isEdit' class="money_yes">
										确认
									</div>
								</div>
							</div>
						</div>
						<ul class="caozuo">
							<li v-if='false' @click='del(item,index)'>
								<img class="caozuo_img_1" src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" /> 删除
							</li>
							
							<template v-if='item.skuPublished==1'>
								<li style="width: 1.7rem;" v-if='item.measureTypePro==1&&item.measureTypeSKU==2&&item.chargingModel==1'></li>
								<li  v-else @click='edit(item)' :style='{color: item.isEdit?"#018BE6":"#343434"}'>
									<div style="display: flex;align-items: center;width: 1.7rem;">
										<img v-if='item.isEdit' class="caozuo_img_3" src="../../assets/firstImgs/spgl_icon_edita@2x.png" alt="" />
										<img v-else class="caozuo_img_3" src="../../assets/firstImgs/spgl_icon_edit@2x.png" alt="" /> {{item.isEdit?'取消':'快捷编辑'}}
									</div>
								</li>
								<li @click='editAll(item,index)' >
									<img class="caozuo_img_3" src="../../assets/firstImgs/spgl_icon_edit@2x.png" alt="" />
									编辑
								</li>
							</template>
							<li v-else></li>
							<li @click='soldOut(item,index)'>
								<img class="caozuo_img_2" src="../../assets/firstImgs/spgl_icon_xiajia@2x.png" alt="" /> {{item.skuPublished==1?"下架":'上架'}}
							</li>
						</ul>

					</div>
				</div>

				<!-- 数据全部加载完毕显示 -->
				<span slot="doneTip">数据到底了~~</span>

				<!-- 加载中提示，不指定，将显示默认加载中图标 -->
				<img slot="loadingTip" src="http://static.ydcss.com/uploads/ydui/loading/loading10.svg" />

			</yd-infinitescroll>
		</div>
		<yd-popup v-model="showEdit" position="right" width='100%'> 
			<div class="pop_header">
				<div>商品名称：{{objList.name}}</div>
				<yd-icon name="error" @click.native="showEdit=false" size="0.45rem"></yd-icon>
			</div>
			<div class="pop_edit">
				<div class="list">
					<div class="label_name">规格名称</div>
					<input type="text"  v-model.trim="objList.skuName" />
				</div>
				<div class="list">
					<div class="label_name">基本价格</div>
					<input type="text" @blur='blurInput(objList,"basePrice")' @input='changeInput(objList,"basePrice")' v-model.trim="objList.basePrice" />
					<div class="unit">元/千克</div>
				</div>
				<div class="list">
					<div class="label_name">规格换算</div>
					<input v-if='gghs' type="text" @blur='blurInput(objList,"skuWeight")' @input='changeInput(objList,"skuWeight")' v-model.trim="objList.skuWeight" />
					<div v-else class="list_span">{{objList.skuWeight}}</div>
					<div class="unit">元/{{objList.skuMeasure?(unitList.find(o=>o.code==objList.skuMeasure)).name:''}}</div>			
				</div>
				<div class="list">
					<div class="label_name">销售价格</div>
					<div class="list_span" v-if='objList.measureTypePro==1&&objList.measureTypeSKU==2&&objList.chargingModel==1'>{{objList.skuPrice}}</div>
					<input v-else type="text" @blur='blurInput(objList,"skuPrice")' @input='changeInput(objList,"skuPrice")' v-model.trim="objList.skuPrice" />
					<div class="unit">元/{{objList.skuMeasure?(unitList.find(o=>o.code==objList.skuMeasure)).name:''}}</div>
				</div>
				<div class="list">
					<div class="label_name">计量方式</div>
					<select  class="select" @change="selectChange(objList.skuMeasure)" name="" id="" v-model='objList.skuMeasure'>
						<option v-for='i in unitList' :key='i.code' :value="i.code">{{i.name}}</option>
					</select>
					<img class="select_right" src="../../assets/firstImgs/home_icon_right@2x.png" alt="" />
				</div>
				<div class="list">
					<div class="label_name">是否称重</div>
					<yd-radio-group v-model="objList.chargingModel">
				        <yd-radio val="1">是</yd-radio>
				        <yd-radio  val="2" :disabled='objList.measureTypePro==1&&objList.measureTypeSKU==1&&objList.chargingModel==1'>否</yd-radio>
				    </yd-radio-group>
				</div>
				<div class="list_btn" @click="submit">保存</div>
			</div>
        </yd-popup>
	</yd-layout>
</template>

<script>
	import mixin_f_goods from '../../utils/mixin_f_goods.js'
	export default {
		mixins: [mixin_f_goods],
		data() {
			return {
				navActiveNum: 1,
				unitList:[],
				showEdit:false,
				objList:{},
				gghs:true,
				editNum:'',
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '商品管理')
		},
		watch: {
			'objList.basePrice':function(val,oldval){
				var money=(this.objList.skuWeight*val).toFixed(2)
				if(money>9999.99){
					this.objList.basePrice=oldval
					this.objList.skuPrice=(this.objList.skuWeight*oldval).toFixed(2)
					this.$dialog.toast({
	                    mes: '销售价格不能大于9999.99',
	                    timeout: 1500
	                });
				}else{
					this.objList.skuPrice=(this.objList.skuWeight*val).toFixed(2)
				}
			},
			'objList.skuWeight':function(val,oldval){
				var money=(this.objList.basePrice*val).toFixed(2)
				if(money>9999.99){
					this.objList.skuWeight=oldval
					this.objList.skuPrice=(this.objList.basePrice*oldval).toFixed(2)
					this.$dialog.toast({
	                    mes: '销售价格不能大于9999.99',
	                    timeout: 1500
	                });
				}else{
					this.objList.skuPrice=(this.objList.basePrice*val).toFixed(2)
				}
			},
		},
		computed: {

		},
		mounted() {
			
			this.postRequest('measuremethod/list', {

			}).then(resp => {
				if(resp.data.state == 0 && resp.data.aaData) {
					this.unitList = resp.data.aaData
					this.loadList()
				}
			})
		},
		methods: {
			submit(){
				var params={
					id: this.objList.skuId,
					name: this.objList.skuName,
					code: this.objList.code,
					price: this.objList.price,
					chargingModel: this.objList.chargingModel,
					stockLimit: this.objList.stockLimit,
					published: this.objList.published,
					skuPicUrl: this.objList.skuPicUrl,
					skuMeasure: this.objList.skuMeasure,
					skuWeight: this.objList.skuWeight,
					basePrice: this.objList.basePrice,
					remark: this.objList.remark,
					productId: this.objList.id,
//					quotationIds: this.objList.quotationIds,
				}
				this.$dialog.loading.open('数据保存中...');
				this.postRequest('productsku/updateRelate', params)
				.then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0){
						
						this.$dialog.toast({
		                    mes: '保存成功',
		                    timeout: 1500,
		                    icon: 'success',
		                    callback: () => {
		                        this.showEdit=false;
		                        this.$set(this.dataList,this.editNum,this.objList)
		                    }
		                });
						
					}else{
						this.$dialog.toast({
		                    mes: resp.data.msg,
		                    timeout: 1500
		                });
					}
				})
			},
			selectChange(code){
				this.gghs=true;
				this.objList.measureTypeSKU=(this.unitList.find(o=>o.code==code)).methodType
				this.objList.skuMeasureName=(this.unitList.find(o=>o.code==code)).name
				if(this.objList.measureTypePro==1&&this.objList.measureTypeSKU==1){
					if(this.objList.skuMeasure=='001'){
						this.objList.skuWeight=1;
						this.gghs=false;//规格换算
					}
					this.objList.chargingModel='1';
				}else{
					this.objList.skuPrice=(this.objList.skuWeight*this.objList.basePrice).toFixed(2)
				}
			},
			editAll(item,index){
				this.editNum=index;
				this.showEdit=true;
				item.isEdit=false;
				this.objList=Object.assign({},this.objList,item)
			},
			look_list(num) {
				this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
				this.dataList = [];
				this.navActiveNum = num
				this.pageNum = 1;
				this.pageSize = 12
				this.fnishDataList = false
				this.$dialog.loading.open('数据加载中...');
				this.loadList()
			},
			//批量操作
			goFplcz() {
				if(this.dataList.length > 0) {
					this.$router.push({
						name: 'f_plcz',
						query: {
							navActiveNum: this.navActiveNum
						}
					})
				} else {
					this.$dialog.toast({
						mes: '没有可操作的数据啦^_^！',
						timeout: 1500
					});
				}

			},
			//增加
			add() {
				if(localStorage.getItem('TJSP_add')) {
					this.$dialog.confirm({
						title: '提示：',
						mes: '你尚有未完成的添加商品，是否前往？',
						opts: [{
								txt: '取消',
								color: false,
								callback: () => {

								}
							},
							{
								txt: '新建添加商品',
								color: '#018BE6',
								callback: () => {
									sessionStorage.setItem('TJSP_search', '')
									localStorage.setItem('TJSP_add', '')
									this.$router.push({
										name: 'f_tjsp_xz',
									})
								}
							},
							{
								txt: '前往',
								color: true,
								callback: () => {
									var name = 'f_tjsp_xz'
									if(JSON.parse(localStorage.getItem('TJSP_add')).step == 2) {
										name = 'f_tjsp_xg'
									}
									this.$router.push({
										name: name,
									})
								}
							}
						]
					});
				} else {
					this.$router.push({
						name: 'f_tjsp_xz',
					})
				}
			},
			//删除
			del(item, index) {
				this.$dialog.confirm({
					title: '提示',
					mes: `立即删除${item.name}?`,
					opts: () => {
						var mes = '删除成功~~'
						var params = {
							id: item.skuId,
							deleted: 1
						}
						this.productskuFun(params, index, mes)
					}
				});

			},
			//下架
			soldOut(item, index) {
				//商品状态：1在售2下架
				var mes = '上架成功~~';
				var published = item.skuPublished; //防止watch监听
				if(published == 1) {
					published = 2
					mes = '下架成功~~'
				} else {
					published = 1
				}
				var params = {
					id: item.skuId,
					published: published,
				}
				this.productskuFun(params, index, mes)
			},
			moneyYes(item) {
				var mes = '编辑成功~~';
				var params = {
					id: item.skuId,
					price: item.oldSkuPrice,
					skuMeasure:item.skuMeasure,
				}
				this.productskuFun(params, -1, mes).then((flg) => {
					if(flg) {
						item.isEdit = false;
						item.skuMeasureName =(this.unitList.find((o)=>o.code==item.skuMeasure)).name;
						item.skuPrice = item.oldSkuPrice;
					}
				})
			},
			//编辑
			edit(item) {
				item.oldSkuPrice = item.skuPrice
				item.skuMeasure=(this.unitList.find((o)=>o.name==item.skuMeasureName)).code
				item.isEdit = !item.isEdit
			},

			goFindex() {
				this.$router.push({
					name: 'f_index'
				})
			},
			
		}
	}
</script>
<style lang='scss'>
	#fSpgl {
		line-height: .4rem;
		background: white;
		img {
			display: inline-block;
		}
		.header {
			background: white;
			padding: 0rem .3rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: .32rem;
			height: .9rem;
			font-weight: bold;
			border-bottom: 1px solid #D5D5D5;
			.header_left {
				width: 1.2rem;
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
				width: 33%;
				display: flex;
				/*justify-content: space-between;
				justify-content: space-around;*/
				width: 3.65rem;
				font-weight: bold;
				li {
					line-height: .9rem;
					display: flex;
					align-items: center;
				}
				li:nth-child(1) {
					margin-right: .36rem;
				}
			}
			.header_plcc {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 33%;
				color: #018BE6;
				.plcc_img {
					width: .36rem;
					height: .36rem;
				}
			}
			.nav_active {
				color: #018BE6;
				border-bottom: .04rem solid #018BE6;
			}
		}
		.content {
			.content_list {
				border-bottom: .2rem solid #F5F5F9;
			}
			.goods_list {
				align-items: center;
				border-bottom: .2rem solid #F5F5F9;
				font-size: .24rem;
				color: #848484;
				padding: .31rem .31rem 0.31rem 0rem;
				margin: 0 0 0 .31rem;
				border-bottom: 1px solid #E1E1E1;
				display: flex;
				.list_img_f {
					width: 1.48rem;
					height: 1.48rem;
					margin-right: .3rem;
					flex-grow: 0;
					position: relative;
				}
				.list_img {
					width: 1.48rem;
					height: 1.48rem;
				}
				.qingzhen {
					position: absolute;
					right: 0;
					top: 0;
					width: .5rem;
					height: .5rem;
				}
				.list_right {
					width: 5rem;
					flex-grow: 1;
					.time {
						display: flex;
						justify-content: space-between;
						color: #343434;
						font-family: 'PingFang-SC-Medium';
						.time_right {
							color: #848484;
							font-family: 'NotoSansCJKsc-Regular';
						}
					}
					.left_name {
						font-size: .32rem;
						color: #211E1D;
						font-weight: bold;
						margin: .04rem 0 .1rem 0;
						word-wrap: break-word;
						word-break: break-all;
						overflow: hidden;
					}
					.money_father {
						display: flex;
						justify-content: space-between;
						.money_yes {
							width: 1.2rem;
							height: .56rem;
							background: rgba(249, 11, 65, 1);
							border-radius: .04rem;
							color: white;
							text-align: center;
							font-size: .32rem;
							line-height: .56rem;
						}
					}
					.money {
						height: .56rem;
						display: flex;
						.money_name {
							align-items: flex-end;
							display: flex;
							.money_name_c {
								padding: .03rem .1rem;
								border-radius: .06rem;
								line-height: .24rem;
								font-size: .2rem;
								color: white;
								background: #018BE6;
							}
						}
						.num_input_father {
							display: flex;
							position: relative;
							font-weight: bold;
							color: #FF5000;
							font-size: .28rem;
							strong {
								height: .56rem;
								display: flex;
								align-items: center;
								position: absolute;
								top: 0.02rem;
								left: .2rem;
							}
						}
						.num_input {
							font-family: 'PingFang-SC-Bold';
							height: .56rem;
							border: 1px solid rgba(4, 0, 0, 0.23);
							background: #EFEFEF;
							margin: 0 .1rem 0 .16rem;
							border-radius: 2px;
							padding: 0 .1rem 0 0.3rem;
							width: 2rem;
							font-weight: bold;
							color: #FF5000;
						}
						.num {
							font-weight: bold;
							display: flex;
							align-items: flex-end;
							line-height: .36rem;
							font-size: .36rem;
							color: #FF5000;
							font-family: 'PingFang-SC-Bold';
							margin: 0 .1rem 0 .15rem;
						}
						.unit {
							span {
								font-size: .32rem;
								line-height: .3rem;
							}
							line-height: .28rem;
							display: flex;
							align-items: flex-end;
							justify-content: flex-end;
						}
					}
				}
			}
			
			.caozuo {
				display: flex;
				font-size: .28rem;
				justify-content: space-between;
				align-items: center;
				height: .8rem;
				padding: 0 .56rem;
				li {
					display: flex;
					align-items: center;
				}
				img {
					margin-right: .13rem;
				}
				.caozuo_img_1 {
					width: .26rem;
					height: .3rem;
				}
				.caozuo_img_3,
				.caozuo_img_2 {
					width: .28rem;
					height: .28rem;
				}
			}
		}
		.pop_header{
			font-size: .32rem;
			font-weight: bold;
			padding: .2rem .25rem;
			color: #211E1D;
			border-bottom: 1px solid #D6D6D6;
			display: flex;
			justify-content: space-between;
		}
		.pop_edit{
			.list{
				padding: .3rem .3rem .3rem 0rem;
				margin-left: .24rem;
				border-bottom: 1px solid #D6D6D6;
				align-items: center;
				display: flex;
				.label_name{
					width: 1.8rem;
					padding-right: .2rem;
					font-weight: bold;
					font-size: .3rem;
					color: #555;
				}
				.list_span{
					text-align: left;
				    color: #848484;
				    flex: 1;
				    font-size: .26rem;
				    font-weight: bold;
				}
				input,select{
					flex: 1;
				    border: none;
				    border-bottom: .04rem solid transparent;
				    font-size: .28rem;
				    background: transparent;
				    color: #555;
				    text-align: left;
				    height: .4rem;
				    line-height: .4rem;
				    font-weight: 500;
				}
				.select_right{
					width: .14rem;
					height: .24rem;
				}
			}
			.list_btn{
				    width: 90%;
				    height: 0.78rem;
				    line-height: .78rem;
				    background: #6FB138;
				    border-radius: 0.39rem;
				    color: #fff;
				    font-size: 0.31rem;
				    margin: .5rem auto 0;
				    text-align: center;
			}
		}
	}
</style>