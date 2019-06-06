<template>
	<!--<yd-layout id='fTjspXz'>-->
	<div id='fTjspXz'>
		<div id='header' class="kong"></div>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">返回</a>
			</div>
			<div class="name">选择商品</div>
			<div @click='goNext'>
				<a href="javascript:;">下一步({{checklist.length}})</a>
			</div>
		</div>
		<div id='search' class="search_input">
			<input @focus='focusInput' @blur="blurInput" v-model="searchVal" type="text" placeholder="搜索" />
			<i></i>
		</div>
		<div class="select_code">
			<div class="select_code_l">分类别名查询:</div>
			<!--@change="gbgoodsIdChange(gbgoodsId,'f_code')"-->
			<select class="select_code_r" name="" id="" v-model="gbgoodsId" >
				<option value="" selected="selected">全部</option>
				<option v-for='item in codeList' :key='item.gbgoodsId' :value="item.gbgoodsId">{{item.vulgo}}</option>
			</select>
			<img src="../../assets/imgs/list_icon_right.png" alt="" />
		</div>
		<yd-checklist @click.native='radioClick' v-model="checklist">
			<div class="goods_list">
				<div class="list" v-for='(item,index) in goodsData' :key='index'>
					<div class="name" :id="item.name=='#'?'anchor-':'anchor-'+item.name">{{item.name}}</div>
					<!--<div class="list_goods" v-for='i in item.goods'>
						<div class="list_goods_children">{{i.name}}</div>
					</div>-->
					<yd-checklist-item :change='radioChange' v-for='(i ,index) in item.goods' :key="item.f_id" :val="i.f_id">
						<div style="height: 50px;line-height: 50px;">{{i.f_vulgo}}</div>
					</yd-checklist-item>
				</div>
			</div>
		</yd-checklist>
		<div class="a_z">
			<ul class="a_z_children">
				<li v-for='(item,index) in AZ' :key='index'>
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
	export default {
		mixins:[mixin_code],
		data() {
			return {
				checklist: [],
				mengban: false,
				searchVal: '',
				goodsData: [],
				AZ: [],
				dataList: [],
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '添加商品')

			if(this.$route.query.url == 'tjsp' && sessionStorage.getItem('TJSP_search')) {
				//通过新增过后的search进来
				var obj = JSON.parse(sessionStorage.getItem('TJSP_search'))
				this.checklist = obj.checklist
				sessionStorage.setItem('TJSP_search', '')
			} else {
				//通过点击新增未完成的步骤进来
				if(localStorage.getItem('TJSP_add')) {
					var obj = JSON.parse(localStorage.getItem('TJSP_add'))
					this.checklist = obj.checklist
					sessionStorage.setItem('TJSP_search', '')
				}
			}
		},
		watch: {
			checklist: {
				handler(val) {
					var obj = {
						step: 1,
						checklist: val
					}
					if(val.length > 0) {
						localStorage.setItem('TJSP_add', JSON.stringify(obj))
					} else {
						localStorage.setItem('TJSP_add', '')
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
					this.mengban = false
					document.body.className = '' //去除禁止滚动的样式
					//					document.body.addEventListener('touchmove', function(event) {
					//						window.event.returnValue = true;
					//					}, false);
					sessionStorage.setItem('TJSP_search', JSON.stringify(obj))
					console.log(val.length)
					this.$router.push({
						name: "f_search",
						query: {
							url: 'tjsp',
						}
					})
				}
			}
		},
		computed: {

		},
		async mounted() {
			this.init()
			if(this.$root.userInfo.extend == '007') {
				this.businessScope = await this.getBusinessScope()
				this.getTopCategoryListByCode(this.businessScope);
			} else  {
				this.getTopCategoryListByCode();
			}
		},
		methods: {
			
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
			goBack() {
				this.$router.push({
					name: 'f_spgl'
				})
			},
			goNext() {
				if(this.checklist.length > 0) {
					var obj = {
						checklist: this.checklist,
						checkGoods: []
					}
					console.log(this.dataList)
					for(let a = 0; a < this.checklist.length; a++) {
						for(let b = 0; b < this.dataList.length; b++) {
							if(this.checklist[a] == this.dataList[b].f_id) {
								obj.checkGoods.push(this.dataList[b])
							}
						}
					}
					obj.step = 2;
					localStorage.setItem('TJSP_add', JSON.stringify(obj))
					this.$router.push({
						name: 'f_tjsp_xg'
					})
				} else {
					this.$dialog.toast({
						mes: '请选择商品(*_*)!',
						timeout: 1500
					});
				}
			},
			//请求数据，处理数据
			init() {
				//新增进场的接口
				this.$dialog.loading.open('数据加载中...');
				var params = {
					firstCharStr: '',
					keyWord: '',
					//sellerId: this.$root.userInfo.typeCode,
				}
				if(this.$root.userInfo.extend == '007') {
					params.sellerId = this.$root.userInfo.typeCode
				}
				this.postRequest('Category/queryCategorylistByfirstChar', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {

						for(let a = 0; a < resp.data.aaData.length; a++) {
							resp.data.aaData[a].price = '1.00'
							resp.data.aaData[a].code = '001_1'
							this.dataList.push(resp.data.aaData[a])
							this.goodsCodeList.push(resp.data.aaData[a])
							//如果不这样dataList要被监听
						}
						this.searchList();
//						this.countArr(resp.data.aaData);
					}
				})
			},
			countArr(arrList) {
				var arr = [];
				var newArr = arrList
				for(let a = 0; a < newArr.length; a++) {
					var count = 0
					var o = {
						goods: []
					};
					if(a == newArr.length - 1) {
						console.log(o.name)
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
				this.goodsData = arr
				for(let a = 0; a < this.goodsData.length; a++) {
					this.AZ.push(this.goodsData[a].name)
				}
			},
			//锚点
			goAnchor(selector) {
				var anchor = this.$el.querySelector(selector)
				//-this.$el.querySelector('#header').offsetHeight
				var height = anchor.offsetTop
				if(document.documentElement && document.documentElement.scrollTop) {
					document.documentElement.scrollTop = document.body.scrollTop = height;
				} else if(document.body) {
					document.documentElement.scrollTop = height
					document.body.scrollTop = height;
				}

			},

		}
	}
</script>
<style lang='scss'>
	#fTjspXz {
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
				margin-right: .4rem;
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
					width: .3rem;
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
	}
</style>