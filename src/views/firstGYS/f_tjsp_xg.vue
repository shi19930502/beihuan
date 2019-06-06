<template>
	<yd-layout id='fTjspXg'>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">上一步</a>
			</div>
			<div class="name">修改价格</div>
			<div>
				<a @click='goNext' href="javascript:;">完成</a>
			</div>
		</div>
		<div class="content">
			<div class="goods_list" v-for='item in dataList'>
				<div class="list_img_f">
					<img v-if='item.f_category_pic_url&&item.f_category_pic_url!=null' class="list_img" :src="$root.config.imgURL+item.f_category_pic_url" alt="" />
					<img v-else class="list_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
				</div>
				<div class="list">
					<div class="list_header">
						<div class="list_header_name">{{item.f_vulgo}}</div>
						<div v-if='false' class="list_header_num">库存99999斤</div>
					</div>
					<div class="money_father">
						<div class="money">
							<div class="money_name">
								<div class="money_name_c">单价</div>
							</div>
							<div class="num_input_father">
								<strong>￥</strong>
								<input @blur='blurInput(item)' @input='changeInput(item)' class="num_input" v-model='item.price' type="text" />
							</div>
							
							<div style="font-size: .4rem;line-height: .56rem;">&nbsp;/&nbsp;</div>
							<select class="select" name="" id="" v-model='item.code'>
								<option v-for='i in unitList' :value="i.code+'_'+i.methodType">{{i.name}}</option>
							</select>
							<!--<div class="unit"><span>/</span>kg</div>-->
						</div>
					</div>
					<div class="qingzhen_radio" v-if='customer.muslimfoodPermitPic'>
						<yd-radio-group v-model="item.isMuslim">
					        <yd-radio val="0">非清真</yd-radio>
					        <yd-radio val="1">清真</yd-radio>
					    </yd-radio-group>
					</div>
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import {Radio, RadioGroup} from 'vue-ydui/dist/lib.rem/radio';
	export default {	
		components:{
			[Radio.name]:Radio,
			[RadioGroup.name]:RadioGroup
		},
		data() {
			return {
				dataList:[],
				localObj:{},
				unitList:[],
				customer:{},
				imgURL:''
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '添加商品')
			if(localStorage.getItem('TJSP_add')) {
				this.localObj = JSON.parse(localStorage.getItem('TJSP_add'))
				var arr=JSON.parse(localStorage.getItem('TJSP_add')).checkGoods
				for(let a=0;a<arr.length;a++){
					arr[a].isMuslim='0'
				}
				this.dataList = arr
				this.localObj.step = 2
				localStorage.setItem('TJSP_add', JSON.stringify(this.localObj))
			} else {
				this.$router.push({ name: 'f_spgl' })
			}
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				this.postRequest('measuremethod/list', {
					
				}).then(resp => {
					if(resp.data.state==0&&resp.data.aaData){
						console.log(resp.data)	
						this.unitList=resp.data.aaData
					}
				})
				
				this.postRequest('customer/getCustomerForWeiXin', {
					id: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						this.customer = Object.assign({}, this.customer, resp.data.aaData)
					}
				})
			},
			goBack() {
				this.$router.push({
					name: 'f_tjsp_xz',
				})
			},
			goNext() {
				this.$dialog.loading.open('保存中...');
				
				var arr=[];
				for(let a =0;a<this.dataList.length;a++){
					var o={}
					o.name=this.dataList[a].f_vulgo
					o.categoryId=this.dataList[a].f_id
					o.gbgoodsId=this.dataList[a].f_code
					o.code=this.dataList[a].f_code
					o.skuPrice=this.dataList[a].price
					o.customerId=this.$root.userInfo.typeCode
					o.productPicUrl=this.dataList[a].f_category_pic_url
					o.measureMethod=this.dataList[a].code.split('_')[0]
					o.isMuslim=this.dataList[a].isMuslim
					
					var obj={}
					obj.price=this.dataList[a].price
					obj.name=this.dataList[a].f_vulgo
					obj.basePrice=this.dataList[a].price
					obj.skuPicUrl=this.dataList[a].f_category_pic_url
					obj.chargingModel=this.dataList[a].code.split('_')[1]
					obj.skuWeight='1.00'
					obj.skuMeasure=this.dataList[a].code.split('_')[0]
					obj.isMuslim=this.dataList[a].isMuslim
					
					o.productSkuList=[obj];
					arr.push(o)
				}
				
				
//				o.productSkuList=JSON.stringify(arr);
				console.log(o)
				console.log(arr)
//				{
//					jsonStr:JSON.stringify(o)
//				}
				this.postRequest('product/batchAddAndUpdate', {
					jsonStr:JSON.stringify(arr)
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state==0){
						localStorage.setItem('TJSP_add','')
						this.$router.push({
							name: 'f_spgl'
						})
					}else{
						this.$dialog.toast({
		                    mes: '保存失败',
		                    timeout: 1500,
		                    icon: 'error',
		                    callback: () => {
		                    	
		                    }
		                });
					}
				})
				
			},
			changeInput(item) {
				console.log(item.price>0)
				if(item.price) {
					if(item.price.length > 9) {
						item.price = item.price.slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
						console.log(reg_1.test(item.price))
					if(reg_1.test(item.price) || reg_2.test(item.price)) {
						if(item.price > 9999.99) {
							item.price = '9999.99'
						}
					} else {
						if(item.price) {
							item.price = item.price.slice(0, item.price.length - 1)
							console.log(item.price)
							if(item.price > 0) {

							} else {
								item.price = ''
							}
						}
					}
				}
			},
			blurInput(item) {
				if(item.price > 0) {
					item.price = parseFloat(item.price).toFixed(2)
				} else {
					item.price = '1.00'
				}
			},
		}
	}
</script>
<style lang='scss'>
	#fTjspXg {
		background: white;
		line-height: .4rem;
		img {
			display: inline-block;
		}
		.content {
			padding-left: .26rem;
			.goods_list {
				display: flex;
				padding: .31rem .31rem .31rem 0;
				border-bottom: 1px solid #E1E1E1;
				.list_img_f {
					display: flex;
					align-items: center;
					width: 1.48rem;
					flex-grow: 0;
					margin-right: .3rem;
				}
				.list_img {
					width: 1.48rem;
					height: 1.48rem;
				}
				.list {
					width: 5rem;
					flex-grow: 1;
					display: flex;
					flex-direction: column;
					color: #848484;
					font-size: .24rem;
					.list_header {
						display: flex;
						justify-content: space-between;
						flex-grow: 1;
						margin-bottom: .1rem;
						.list_header_name {
							word-wrap: break-word;
							word-break: break-all;
						 	overflow: hidden;
							flex-grow: 1;
							width: 3rem;
							font-size: .32rem;
							font-weight: bold;
							color: #211E1D;
						}
						.list_header_num {
							flex-grow: 0;
							width: 2rem;
							text-align: right;
						}
					}
					.money_father {
						display: flex;
						margin-bottom: .05rem;
						width: 5rem;
					}
					.qingzhen_radio{
						margin-top: .2rem;
					}
					.money {
						height: .56rem;
						display: flex;
						.money_name {
							align-items: flex-end;
							display: flex;
							.money_name_c {
								margin-bottom: .02rem;
								padding: .03rem .1rem;
								border-radius: .06rem;
								line-height: .24rem;
								font-size: .2rem;
								color: white;
								background: #018BE6;
							}
						}
						.select{
							width: 1.2rem;
							padding-left: .15rem;
							text-align: center;
						}
						.num_input_father {
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
		}
	}
</style>