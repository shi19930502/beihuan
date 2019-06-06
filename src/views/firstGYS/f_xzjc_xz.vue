<template>
	<!--<yd-layout id='fXzjcXz'>-->
	<div id='fXzjcXz'>
		<div id='header' class="kong"></div>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">返回</a>
			</div>
			<div class="name">选择商品{{isEdit?'(编辑)':'(新增)'}}</div>
			<div @click='goNext'>
				<a href="javascript:;">完成</a>
			</div>
		</div>
		<div id='search' class="search_input">
			<input @focus='focusInput' @blur="blurInput" v-model="searchVal" type="text" placeholder="搜索" />
			<i></i>
		</div>
		<div class="select_code">
			<div class="select_code_l">分类别名查询:</div>
			<!--@change="gbgoodsIdChange(gbgoodsId,'categoryCode')"-->
			<select class="select_code_r" name="" id="" v-model="gbgoodsId" >
				<option value="" selected="selected">全部</option>
				<option v-for='item in codeList' :key='item.gbgoodsId' :value="item.gbgoodsId">{{item.vulgo}}</option>
			</select>
			<img src="../../assets/imgs/list_icon_right.png" alt="" />
		</div>
		<yd-checklist @click.native='radioClick' v-model="checklist">
			<div class="goods_list">
				<div class="list" v-for='item in goodsData'>
					<div class="name" :id="item.name=='#'?'anchor-':'anchor-'+item.name">{{item.name=='FL'?'待上架':item.name}}</div>
					<!--<div class="list_goods" v-for='i in item.goods'>
						<div class="list_goods_children">{{i.name}}</div>
					</div>-->
					<yd-checklist-item :change='radioChange' v-for='(i ,index) in item.goods' :key="item.f_id" :val="i.f_id||'f_'+i.categoryId">
						<div class="list_content">
							<img class="list_i_img" v-if='i.f_sku_pic_url&&i.f_sku_pic_url!=null' :src="$root.imgURL+i.f_sku_pic_url" alt="" />
							<img class="list_i_img" v-else-if='i.categoryPicURL&&i.categoryPicURL!=null' :src="$root.imgURL+i.categoryPicURL" alt="" />
							<img class="list_i_img" v-else src="../../assets/imgs/img_moren@2x.png" />

							<div v-if='i.f_id' class="list_content_name list_content_name_f">
								<img  v-if='item.isMuslim' class="qingzhen" src="../../assets/firstImgs/qingzhen.jpg" alt="" />
								<div class="list_content_name_c">
									{{i.productName}}<span v-if='i.f_name&&i.f_name'> - {{i.f_name}}</span><span>({{i.measureName}})</span>
								</div>
							</div>
							<div v-else class="list_content_name">
								<span></span>{{i.vulgo}}</span>
							</div>
						</div>
					</yd-checklist-item>
				</div>
			</div>
		</yd-checklist>
		<div class="a_z">
			<ul class="a_z_children">
				<li v-for='item in AZ'>
					<a @click="goAnchor(item=='#'?'#anchor-':'#anchor-'+item)" href='javascript:void(0)'>{{item}}</a>
				</li>
			</ul>
		</div>
		<div v-if='mengban' class="mengban"></div>
	</div>

	<!--</yd-layout>-->
</template>

<script>
	import mixin_code from '../../utils/mixin_code.js'
	import mixin_storage from '../../utils/mixin_storage.js'
	export default {
		mixins: [mixin_storage, mixin_code],
		data() {
			return {
				checklist: [],
				mengban: false,
				searchVal: '',
				goodsData: [],
				AZ: [],
				dataList: [],
				checkGoods: [],
				weightFlGoods: [],
				flGoods: [],
			}
		},
		created() {
			//获取session，看是什么界面进来，true：编辑。false：新增
			this.judgeEdit()
			if(this.isEdit) {
				this.$store.dispatch('changeNavBarTitle', '编辑进场')
			} else {
				this.$store.dispatch('changeNavBarTitle', '新增进场')
			}

			if(this.$route.query.mainId && this.$route.query.url) {
				//通过search进来
				if(sessionStorage.getItem('XZJC_search')) {
					var obj = JSON.parse(sessionStorage.getItem('XZJC_search'))
					this.checklist = obj.checklist
					this.checkGoods = obj.checkGoods
					//					sessionStorage.setItem('XZJC_search', '')
				} else {
					this.getMainAndDetail();
				}
			} else if(this.$route.query.mainId) {
				//通过编辑进来
				var obj = JSON.parse(sessionStorage.getItem('XZJC_edit'))
				this.checklist = obj.checklist
				this.checkGoods = obj.checkGoods
				//				this.getMainAndDetail();
			} else if(this.$route.query.url == 'xzjcedit') {
				//编辑价格页面返回过来
				if(sessionStorage.getItem('XZJC_edit')) {
					var obj = JSON.parse(sessionStorage.getItem('XZJC_edit'))
					this.checklist = obj.checklist
				} else {
					this.getMainAndDetail();
				}
			} else {
				if(this.$route.query.url == 'xzjc') {
					//通过新增过后的search进来
					if(sessionStorage.getItem('XZJC_search')) {
						var obj = JSON.parse(sessionStorage.getItem('XZJC_search'))
						this.checklist = obj.checklist
						//						sessionStorage.setItem('XZJC_search', '')
					} else {
						if(localStorage.getItem('XZJC_add')) {
							var obj = JSON.parse(localStorage.getItem('XZJC_add'))
							this.checklist = obj.checklist
							//							sessionStorage.setItem('XZJC_search', '')
						}
					}
				} else {
					//通过点击新增未完成的步骤进来
					if(localStorage.getItem('XZJC_add')) {
						var obj = JSON.parse(localStorage.getItem('XZJC_add'))
						this.checklist = obj.checklist
						//						sessionStorage.setItem('XZJC_search', '')
					}
				}
			}
			//^^好像上面的代码都没有什么用了
			if(this.$route.query.url == 'xzjc') {
				var obj = JSON.parse(sessionStorage.getItem('XZJC_search'))
				this.checklist = obj.checklist;
				//sessionStorage.setItem('XZJC_search', '')
			} else {
				var obj = JSON.parse(sessionStorage.getItem('XZJC_edit'))
				this.checklist = obj.checklist
			}
			var obj2 = JSON.parse(sessionStorage.getItem('XZJC_edit'))
			this.checkGoods = obj2.checkGoods
			this.weightFlGoods = obj2.flGoods
		},
		watch: {
			checklist: {
				handler(val) {
					var obj = {
						step: 1,
						checklist: val,
					}
				},
				deep: true
			},
			searchVal: function(val, oldVal) {
				if(val.length > 0) {
					var obj = {
						val: val,
						checklist: this.checklist.length > 0 ? this.checklist : []
					}
					document.body.className = '' //去除禁止滚动的样式
					//					document.body.addEventListener('touchmove', function(event) {
					//						window.event.returnValue = true;
					//					}, false);
					sessionStorage.setItem('XZJC_search', JSON.stringify(obj))
					this.$router.push({
						name: "f_search",
						query: {
							url: 'xzjc',
							mainId: this.$route.query.mainId,
							code: this.$root.config.systemid == "7" ? this.$route.query.code : ''
						}
					})
				}
			}
		},
		computed: {

		},
		async mounted() {
			this.init()

		},
		methods: {
			getMainAndDetail() {
				this.postRequest('inmarketdetail/mainAndDetail', {
					mainId: this.$route.query.mainId
				}).then(resp => {
					for(let a = 0; a < resp.data.aaData.detail.length; a++) {
						this.checklist.push(resp.data.aaData.detail[a].skuId)
					}
				})
			},

			//请求数据，处理数据
			async init() {
				//新增进场的接口
				this.$dialog.loading.open('数据加载中...');
				if(this.$root.userInfo.typeId == "merchant") {
					if(this.$root.userInfo.extend == '007') { //厂商的分类
						this.businessScope = await this.getBusinessScope()
						this.getTopCategoryListByCode(this.businessScope);
					} else {
						this.getTopCategoryListByCode();
					}
					this.getGoods(this.$root.userInfo.typeCode)
				} else {
					if(this.$route.query.code) {
						var listObj = await this.getCustomerList({
							code: this.$route.query.code
						})
						this.getGoods(listObj.id)
						listObj.extend == '007' ? this.getTopCategoryListByCode(listObj.businessScope) :
							this.getTopCategoryListByCode();
					} else {
						this.$dialog.loading.close();
						this.$dialog.alert({
							mes: 'code参数不能为空'
						})
					}
				}
			},
			getGoods(sellerId) {
				this.postRequest('productsku/querySkuFirstCharByCustomerId', {
					firstCharStr: '',
					keyWord: '',
					sellerId: sellerId,
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {

						for(let a = 0; a < resp.data.aaData.length; a++) {
							this.dataList.push(resp.data.aaData[a])
							this.goodsCodeList.push(resp.data.aaData[a])
							//如果不这样dataList要被监听
						}
						this.searchList();
//						this.countArr(resp.data.aaData)
					}
				})
			},
			countArr(arrList) {
				var newArr = arrList
				var arr = [];
				for(let a = 0; a < newArr.length; a++) {
					var count = 0
					var o = {
						goods: []
					};
					if(a == newArr.length - 1) {
						if(/^[a-zA-Z]$/.test(newArr[a].firstChar)) {
							o.name = newArr[a].firstChar
							o.goods.push(newArr[a])
						} else {
							o.name = '#'
							o.goods.push(newArr[a])
						}

					} else {
						for(let b = a + 1; b < newArr.length; b++) {
							if(count == 0) {
								if(/^[a-zA-Z]$/.test(newArr[a].firstChar)) {
									o.name = newArr[a].firstChar
									o.goods.push(newArr[a])
								} else {
									o.name = '#'
									o.goods.push(newArr[a])
								}
							}

							if(/^[a-zA-Z]$/.test(newArr[b].firstChar)) {
								if(o.name == newArr[b].firstChar) {
									o.goods.push(newArr[b])
									newArr.splice(b, 1)
									b--
								}

							} else {
								o.goods.push(newArr[b])
								newArr.splice(b, 1)
								b--
							}
							count++
						}
					}
					arr.push(o)
				}
				for(let a = 0; a < arr.length; a++) {
					this.AZ.push(arr[a].name)
				}
				if(sessionStorage.getItem('fl_goods') && sessionStorage.getItem('fl_goods') != '[]') {
					var flGoodsArr=JSON.parse(sessionStorage.getItem('fl_goods'))
					var dsjArr=[]
					this.flGoods = JSON.parse(sessionStorage.getItem('fl_goods'))
					flGoodsArr.forEach((o)=>{
						if(o.categoryCode.slice(0, this.gbgoodsId.length) == this.gbgoodsId) {
							dsjArr.push(o)
						}
					})
					if(dsjArr.length>0){
						arr.push({
							"name": "FL",
							goods: dsjArr
						})
						this.AZ.push('待上架')
					}
					
				}
				this.goodsData = arr
				console.log(this.goodsData )
			},
			//锚点
			goAnchor(selector) {
				if(selector == '#anchor-待上架') {
					selector = 'anchor-FL'
					selector = '#' + selector
				}
				var anchor = this.$el.querySelector(selector)
				//					 -this.$el.querySelector('#header').offsetHeight
				var height = anchor.offsetTop
				if(document.documentElement && document.documentElement.scrollTop) {
					document.documentElement.scrollTop = document.body.scrollTop = height;
				} else if(document.body) {
					document.documentElement.scrollTop = height
					document.body.scrollTop = height;
				}

			},
			goBack() {
				this.$router.push({
					name: 'f_xzjc_xxlr',
					query: {
						mainId: this.$route.query.mainId,
						url: 'xz'
					}
				})
			},
			goNext() {
				console.log('weightFlGoods', this.weightFlGoods)
				if(this.checklist.length > 0) {
					var obj = {
						checklist: this.checklist,
						checkGoods: [],
						flGoods: []
					}
					for(let a = 0; a < this.checklist.length; a++) {
						//对商品进行处理
						for(let b = 0; b < this.dataList.length; b++) {
							if(this.checklist[a] == this.dataList[b].f_id) {
								var o = {};
								o.weight = this.dataList[b].f_sku_weight
								o.weight = ''
								o.price = this.dataList[b].f_price
								o.productName = this.dataList[b].productName
								o.productId = this.dataList[b].f_product_id
								o.skuId = this.dataList[b].f_id
								o.isMuslim=this.dataList[b].isMuslim
								o.skuMeasure=this.dataList[b].f_sku_measure
								o.skuName = this.dataList[b].f_name
								o.measureMethodName = this.dataList[b].measureName
								obj.checkGoods.push(o)
								break
							}
						}
						//对分类进行处理 this.flGoods表示搜索进来，this.weightFlGoods表示编辑进来
						if(('' + this.checklist[a]).indexOf('f_') >= 0) {
							this.flGoods.forEach((o) => {
								if(this.checklist[a].split('_')[1] == o.categoryId) {
									if(this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1])) {
										var weight = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).weight
										o.weight = weight
										o.code = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).code
										o.price = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).price
										o.isMuslim = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).isMuslim
										o.name = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).name
										o.quarantPicUrl = this.weightFlGoods.find(o => o.categoryId == this.checklist[a].split('_')[1]).quarantPicUrl
									}
									obj.flGoods.push(o)
								}
							})
						}
						//对商品老的数据进行反值
						if(this.checkGoods.length > 0) {
							for(let c = 0; c < this.checkGoods.length; c++) {
								if(obj.checkGoods[a]) {
									if(obj.checkGoods[a].skuId == this.checkGoods[c].skuId) {
										obj.checkGoods[a].weight = this.checkGoods[c].weight
										obj.checkGoods[a].quarantPicUrl = this.checkGoods[c].quarantPicUrl
										obj.checkGoods[a].skuMeasure = this.checkGoods[c].skuMeasure||this.checkGoods[c].skuMeasureMethodCode
										break
									}
								}
							}
						}
					}
					//如果点击添加进来的时候，改变了数量，这里记录循环对比查询

					obj.step = 2;
					if(this.isEdit || (this.$store.state.extendStr == 'MD' || this.$root.userInfo.extend == '007')) {
						sessionStorage.setItem('XZJC_edit', JSON.stringify(obj))
					} else {
						localStorage.setItem('XZJC_add', JSON.stringify(obj))
					}
					this.$router.push({
						name: 'f_xzjc_xxlr',
						query: {
							mainId: this.$route.query.mainId,
							url: 'xz'
						}
					})
				} else {
					this.$dialog.toast({
						mes: '请选择商品(*_*)!',
						timeout: 1500
					});
				}
			},
			//获取最后的点击状态。因为要触发两次，所有多了一个radioClick事件
			radioChange(val, flg) {
				this.isSelectFlg = flg
				this.isSelectId = val
			},
			radioClick() {
				console.log(this.isSelectFlg, this.isSelectId)
			},
			focusInput() {
				document.body.className = 'index_body'
				this.mengban = true
				//				document.body.ontouchmove = function(e) {
				//					e.preventDefault();
				//				}
				//				document.body.ontouchmove = function(e) {
				//					e.preventDefault();
				//				}
			},
			blurInput() {
				this.mengban = false
				document.body.className = '' //去除禁止滚动的样式
				//				document.body.addEventListener('touchmove', function(event) {
				//					window.event.returnValue = true;
				//				}, false);
			},
		}
	}
</script>
<style lang='scss'>
	#fXzjcXz {
		line-height: .4rem;
		.kong {
			width: 100%;
			height: 2.54rem;
		}
		.header {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
		}
		.search_input {
			position: fixed;
			
			top: 1.72rem;
			left: 0;
			width: 100%;
			z-index: 999;
			input {
				width: 100%;
				height: .8rem;
				padding: 0 .32rem 0 .8rem;
				border: none;
				border-bottom: 1px solid #D6D6D6;
				background: white;
				font-size: .3rem;
			}
			i {
				display: inline-block;
				position: absolute;
				top: .26rem;
				left: .32rem;
				width: .3rem;
				height: .3rem;
				background: url(../../assets/imgs/fangdajing.png) no-repeat;
				background-size: contain;
			}
		}
		.select_code {
			display: flex;
			background: white;
			position: fixed;
			top: .92rem;
			left: 0;
			width: 100%;
			z-index: 999;
			align-items: center;
			padding: 0 .25rem;
			font-size: .3rem;
			border-bottom: 1px solid #D6D6D6;
			height: .8rem;
			.select_code_l {
				flex-grow: 0;
				width: 2rem;
			}
			.select_code_r {
				flex: 1;
				border: none;
			}
			img {
				width: .14rem;
				height: .24rem;
			}
		}
		.goods_list {
			font-size: .3rem;
			color: #211E1D;
			.yd-checklist-content {
				margin-right: .9rem;
				padding-right: 0;
			}
			.yd-checklist-item-icon {
				color: rgb(76, 216, 100);
			}
			.name {
				font-weight: bold;
				background: #F5F5F9;
				padding-left: .32rem;
			}
			.list_goods {
				.list_goods_children {
					margin: 0 .32rem;
					border-bottom: 1px solid #E1E1E1;
					line-height: .8rem;
					display: flex;
					align-items: center;
				}
				background: white;
			}
			.list_goods:last-child {
				.list_goods_children {
					border-bottom: none;
				}
			}
		}
		.a_z {
			position: fixed;
			display: flex;
			align-items: center;
			top: 2.8rem;
			right: .06rem;
			height: 8rem;
			color: #848484;
			z-index: 999;
			li {
				a {
					width: .8rem;
					text-align: center;
					display: inline-block;
				}
			}
		}
		.mengban {
			width: 100%;
			height: 100%;
			position: fixed;
			/*top: 1.74rem;*/
			top: 2.5rem;
			left: 0;
			z-index: 999999;
			background: rgba(0, 0, 0, .4);
		}
		.list_content {
			padding: .24rem 0;
			display: flex;
			align-items: center;
		}
		.list_i_img {
			width: .6rem;
			height: .6rem;
			flex-grow: 0;
			margin-right: .15rem;
		}
		.list_content_name {
			width: 2rem;
			flex-grow: 1;
		}
		.list_content_name_f{
			display: flex;
			align-items: center;
			.qingzhen{
				width: .4rem;
				height: .4rem;
				margin-right: .1rem;
				flex-grow: 0;
			}
			.list_content_name_c{
				width: 1rem;
				flex: 1;
			}
		}
	}
</style>