<template>
	<yd-layout id='fJcxq'>
		<div class="header">
			<div>
				<a class="header_left" href="javascript:;" @click='goBack'>进场管理</a>
			</div>
			<div>进场详情</div>
			<div v-if='$route.query.jyjc=="jyjc"'></div>
			<div v-else style="text-align: right;">
				<a v-if='inmarketdetail.statusId==1&&detailArrNum==1' @click='goXzjcXz' href="javascript:;">编辑</a>
				<a v-else-if='$store.state.extendStr!="GL"&&inmarketdetail.statusId==4&&detailArrNum==1' @click='goXzjcXz' href="javascript:;">编辑</a>
			</div>

			<div class="ddzt">

				<ul ref='message' v-if='$root.userInfo.typeId=="merchant"' class="ddzt_children">
					<li>{{inmarketdetail.wholesaleMarketName}}</li>
					<li style="margin-top: .1rem;" v-if='$store.state.extendStr=="GL"&&inmarketdetail.extendId=="001"&&inmarketdetail.channelName'>{{inmarketdetail.channelName}}</li>
					<li class="ddzt_time">进场时间：{{inmarketdetail.inDate}}</li>
					<li style="margin-top: .0rem;" v-if='inmarketdetail.uploadDate' class="ddzt_time">编辑时间：{{inmarketdetail.uploadDate}}</li>
				</ul>
				<ul ref='message' v-else class="ddzt_children">
					<li>{{inmarketdetail.wholesalerName}}&nbsp;<span class="car_code">{{inmarketdetail.transporterId}}</span></li>
					<li style="margin-top: .1rem;" v-if='$store.state.extendStr=="GL"&&inmarketdetail.extendId=="001"&&inmarketdetail.channelName'>{{inmarketdetail.channelName}}</li>
					<li class="ddzt_time">进场时间：{{inmarketdetail.inDate}}</li>
					<li style="margin-top: 0rem;" v-if='inmarketdetail.uploadDate' class="ddzt_time">编辑时间：{{inmarketdetail.uploadDate}}</li>
				</ul>
				<img v-if='inmarketdetail.statusId==2' class="list_cczf" src="../../assets/firstImgs/img_yichuc@2x.png" alt="" />
				<img v-else-if='inmarketdetail.statusId==3' class="list_cczf" src="../../assets/firstImgs/img_yizuofei@2x.png" alt="" />
			</div>
		</div>
		<div class="content">
			<div class="kong" :style="kongStyle"></div>
			<div class="content_name_remark" v-if='inmarketdetail.statusId==4'>
				<div class="content_name_remark_title">失败原因</div>
				<!-- @click="showRemark=showRemark?false:true" :class="{content_name_remark_c_s:showRemark}" -->
				<div class="content_name_remark_c">
					{{inmarketdetail.remark}}
				</div>
			</div>
				
			
			<div class="content_name">进场商品明细</div>
			<div class="goods_list">
				<div class="list_children" v-for='(item,index) in detailArr'>
					<div class="list">
						<div class="list_left_img_f">
							<img v-if='item.productPicUrl&&item.productPicUrl!=null' class="list_left_img" :src="$root.imgURL+item.productPicUrl" alt="" />
							<img v-else class="list_left_img" src="../../assets/imgs/img_moren@2x.png" alt="" />
							<img v-if='item.isMuslim' class="qingzhen" src="../../assets/firstImgs/qingzhen.jpg" alt="" />
						</div>
						<div class="list_right">
							<div class="list_right_top">
								<div class="name">{{item.productName||item.goodsName}}<span v-if='item.skuName&&item.skuName!=null'> - {{item.skuName}}</span></div>
								<div class="money">
									<span class="money_1">￥{{item.price}}</span>
									<span class="money_2">元</span>
									<span class="money_3">/&nbsp;{{item.measureMethodName}}</span>
								</div>
							</div>
							<div class="list_content">
								<div>追溯码:{{item.traceId}}</div>
								<div>批次号:{{item.batchId}}</div>
							</div>
							<div class="list_right_bottom">

								<div>编码:{{item.goodsCode}}</div>
								<div>数量:{{item.weight}}&nbsp;{{item.measureMethodName}}</div>
							</div>
						</div>
					</div>
					<div v-if='$root.config.systemid==7&&$route.query.jyjc=="jyjc"'>
						<div class="jyjc_img_upload">
							<uploadOneImg @success='successImg' @remove='removeImg' :detailId='item.id' :uploadNum='index' :picUrl.sync='item.quarantPicUrl'>
							</uploadOneImg>
						</div>
						<p style="text-align: center;color: #000000;padding-top: 8px;">检疫图片</p>
					</div>
					<div class="jyjc_img" v-else-if='item.quarantPicUrl'>
						<img @click="lookImg($root.imgURL+item.quarantPicUrl)" :src="$root.imgURL+item.quarantPicUrl" alt="" />
						<p>检疫图片</p>

					</div>
				</div>
				<div class="list_fotter">共&nbsp;{{detailArr.length}}&nbsp;件商品</div>
			</div>
			<div class="message">
				<div class="message_name">进场主信息</div>
				<div class="message_list">
					<div class="list_name">供应商</div>
					<div class="list_content">{{inmarketdetail.wholesalerName}}</div>
				</div>
				<div v-if='inmarketdetail.voucherType=="001"||inmarketdetail.voucherType=="007"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">交易凭证号</div>
						<div class="list_content">{{inmarketdetail.tranId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div v-if='inmarketdetail.voucherType=="002"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">动物产品检验合格证号</div>
						<div class="list_content">{{inmarketdetail.animalQuarantineId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div v-if='inmarketdetail.voucherType=="003"' class="message_list message_list_img">

					<div class="message_list_children">
						<div class="list_name">肉品品质检验合格证号</div>
						<div class="list_content">{{inmarketdetail.meatInspectionId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />
				</div>
				<div v-if='inmarketdetail.voucherType=="004"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">产地证明号</div>
						<div class="list_content">{{inmarketdetail.provId}}</div>
					</div>
					<img @click="lookImg($root.imgURL+inmarketdetail.voucherPic)" v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />
				</div>
				<div v-if='inmarketdetail.voucherType=="005"' class="message_list message_list_img">
					<div class="message_list_children">
						<div class="list_name">检测合格证号</div>
						<div class="list_content">{{inmarketdetail.vegInspectionId}}</div>
					</div>
					<img v-if='inmarketdetail.voucherPic' class="message_img" :src="$root.imgURL+inmarketdetail.voucherPic" alt="" />

				</div>
				<div class="message_list">
					<div class="list_name">运输车牌号</div>
					<div class="list_content">{{inmarketdetail.transporterId}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">产地名称</div>
					<div class="list_content">{{inmarketdetail.areaName}}</div>
				</div>
				<div class="message_list">
					<div class="list_name">生产基地(种植户)</div>
					<div class="list_content">{{inmarketdetail.baseName}}</div>
				</div>
			</div>
			<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt>
			</el-dialog>
		</div>
	</yd-layout>
</template>

<script>
	import { Upload, Dialog } from 'element-ui';
	import uploadOneImg from '../component/uploadOneImg.vue'
	export default {
		components: {
			[Upload.name]: Upload,
			[Dialog.name]: Dialog,
			[uploadOneImg.name]: uploadOneImg,
		},
		data() {
			return {
				inmarketdetail: {},
				detailArr: [],
				detailArrNum:1,
				kongStyle: {
					width: '100%',
					height: '1.51rem'
				},
				dialogImageUrl: '',
				dialogVisible: false,
				showRemark:false,
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '进场详情')
			sessionStorage.setItem('mainId', '')

		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.init()
		},
		methods: {
			lookImg(strUrl) {
				this.dialogVisible = true;
				this.dialogImageUrl = strUrl
			},
			successImg(picUrl, id) {
				this.postRequest('inmarketdetail/update', {
					id: id,
					quarantPicUrl: picUrl
				}).then(resp => {

				})
			},
			removeImg(id) {
				this.postRequest('inmarketdetail/update', {
					id: id,
					quarantPicUrl: ''
				}).then(resp => {

				})
			},
			init() {
				this.postRequest('inmarketdetail/mainAndDetail', {
					mainId: this.$route.query.mainId
				}).then(resp => {
					if(resp.data.state == 0 && resp.data.aaData) {
						console.log(resp.data)
						this.inmarketdetail = resp.data.aaData.main
						this.$nextTick(() => {
							this.kongStyle = {
								width: '100%',
								height: this.$refs.message.offsetHeight / 100 * 2 + 'rem'
							}
						})
						this.detailArr = resp.data.aaData.detail
						if(this.detailArr.length>0){
							this.detailArrNum = this.detailArr[0].inmarketSource
						}
						
						//						if(resp.data.aaData.detail.length>0){
						//							this.postRequest('inmarketdetail/mainAndDetail', {
						//								mainId: resp.data.aaData.detail[0].goodsCode,
						//								id:this.$root.userInfo.typeCode,
						//							}).then(res => {
						//								if(res.data.state == 0 && res.data.aaData) {
						//									this.detailArr = res.data.aaData.detail
						//								}else{
						//									this.detailArr = resp.data.aaData.detail
						//								}
						//							})
						//						}
					}

				})
			},
			goXzjcXz() {
				sessionStorage.setItem('XZJC_isEdit', true)
				sessionStorage.setItem('XZJC_isJcgl', false)
				//清除待上架商品
				sessionStorage.setItem('fl_goods', '')
				this.$router.push({
					name: 'f_xzjc_xxlr', //f_xzjc_xz 老的
					query: {
						mainId: this.$route.query.mainId,
						//						url: 'jcxq'
					}
				})
			},
			goBack() {
				var o = {}
				if(this.$route.query.jyjc == 'jyjc') {
					o = {
						name: 'f_jcgl',
						query: {
							jyjc: this.$route.query.jyjc
						}
					}
				} else {
					o = {
						name: 'f_jcgl',
					}
				}
				this.$router.push(o)
			}
		}
	}
</script>
<style lang='scss'>
	#fJcxq {
		background: white;
		img {
			display: block;
		}
		.header {
			padding: .27rem .2rem .87rem .2rem;
			background: #018BE6;
			color: white;
			font-size: .32rem;
			font-weight: bold;
			justify-content: space-between;
			position: relative;
			display: flex;
			div {
				width: 33%;
			}
			div:nth-child(2) {
				text-align: center;
			}
			div:nth-child(3) {
				text-align: right;
			}
			.ddzt {
				position: absolute;
				top: .9rem;
				left: 0;
				width: 100%;
				.ddzt_children {
					font-size: .36rem;
					color: #000000;
					margin: auto;
					width: 7.1rem;
					background: white;
					padding: .4rem 0;
					box-shadow: 5px 10px 18px rgba(6, 58, 95, 0.1);
					border-radius: .1rem;
					text-align: center;
					.car_code {
						font-size: .3rem;
						color: #211E1D;
						border: 1px solid rgba(112, 112, 112, 1);
						padding: 0 .15rem;
						font-family: 'PingFang-SC-Bold';
						border-radius: 2px;
					}
					.ddzt_time {
						font-weight: 500;
						font-size: .24rem;
						margin-top: .23rem;
						color: #848484;
					}
				}
				.list_cczf {
					width: 1.54rem;
					height: 1.17rem;
					position: absolute;
					top: .2rem;
					right: 0rem;
					transform: rotate(50deg);
				}
			}
			.header_left {
				display: flex;
				width: 1.8rem;
				font-weight: 500;
				align-items: center;
				&:before {
					content: '';
					display: inline-block;
					width: .32rem;
					height: .32rem;
					border: 2px solid white;
					transform: rotate(45deg);
					border-top: none;
					border-right: none;
				}
			}
		}
		.content {
			.kong {
				background: white;
			}
			.content_name_remark{
				color: red;
				padding: 0 .2rem 0.26rem .2rem;
				border-bottom: .2rem solid #efeff3;
				.content_name_remark_title{
					font-size: .28rem;
					font-weight: bold;
					color: #2F3927;
					margin-bottom: .27rem;
				}
				.content_name_remark_c{
					padding: .1rem;
					background: #efeff3;
					/*white-space: nowrap;
					text-overflow:ellipsis;
					overflow: hidden;*/
				}
				.content_name_remark_c_s{
					white-space: inherit;
					overflow: auto;
					text-overflow: initial;
				}
			}
			/*padding: 1.51rem 0rem .2rem 0rem;*/
			padding: 0rem 0rem .2rem 0rem;
			background: white;
			font-size: .24rem;
			line-height: .4rem;
			color: #989E92;
			.content_name {
				color: #2F3927;
				font-size: .28rem;
				padding: .27rem 0;
				border-bottom: 3px double #D6D6D6;
				margin: 0 0 0.46rem .2rem;
				font-weight: bold;
			}
			.goods_list {
				background: white;
				padding: 0 .2rem;
				border-bottom: .2rem solid #efeff3;
				.list_children {
					border-bottom: 1px solid #D6D6D6;
					padding-bottom: .2rem;
					margin-bottom: .25rem;
				}
				.jyjc_img_upload {
					display: flex;
					justify-content: space-around;
					.el-upload-list--picture-card .el-upload-list__item {
						margin: 0 8px 0px 0;
					}
				}
				.jyjc_img {
					img {
						margin: auto;
						width: 100px;
						height: 100px;
						background-color: #fff;
						border: 1px solid #c0ccda;
						border-radius: 6px;
						-webkit-box-sizing: border-box;
						box-sizing: border-box;
						margin: 8px auto 8px auto;
					}
					p {
						text-align: center;
						color: #000000;
					}
				}
				.list {
					align-items: center;
					display: flex;
					.list_left_img_f {
						width: 1.3rem;
						height: 1.3rem;
						margin-right: .2rem;
						position: relative;
						flex-grow: 0;
						.list_left_img {
							width: 1.3rem;
							height: 1.3rem;
						}
						.qingzhen {
							width: .4rem;
							height: .4rem;
							position: absolute;
							top: 0;
							right: 0;
						}
					}
					.list_right {
						flex-grow: 1;
						width: 5rem;
					}
					.list_right_top {
						display: flex;
						margin-bottom: .03rem;
						justify-content: space-between;
						.name {
							color: #2F3927;
							font-weight: 500;
							flex-grow: 1;
							width: 3rem;
						}
						.money {
							width: 2.2rem;
							flex-grow: 0;
							/*display: flex;
							align-items: center;
							justify-content: flex-end;*/
							text-align: right;
						}
					}
					.danwei {
						color: #2F3927;
						font-weight: 500;
					}
					.money_1 {
						color: #FF5000;
						font-size: .28rem;
						font-weight: bold;
					}
					.money_2 {
						font-size: .2rem;
					}
					.list_right_bottom {
						display: flex;
						justify-content: space-between;
						.money_1 {
							span {
								font-size: .25rem;
							}
						}
					}
				}
				.list_fotter {
					text-align: center;
					line-height: .8rem;
					color: #797D77;
					font-weight: 500;
				}
				.list:last-child {
					margin-bottom: 0 !important;
				}
			}
			.message {
				color: #2F3927;
				background: white;
				padding: 0 0 .3rem .2rem;
				font-size: .28rem;
				.message_name {
					font-weight: bold;
					padding: .3rem 0 .3rem 0rem;
				}
				.message_list {
					display: flex;
					padding: .2rem 0;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #DDDDDD;
					margin-bottom: 1px solid;
					font-weight: 500;
					.list_content {
						color: #797D77;
						font-weight: normal;
						padding-right: .2rem;
					}
				}
				.message_list_img {
					display: block;
					.message_list_children {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-weight: 500;
						.list_content {
							color: #797D77;
							font-weight: normal;
							padding-right: .2rem;
						}
					}
					.message_img {
						max-width: 5rem;
						height: 2rem;
						margin: .1rem auto 0;
					}
				}
			}
		}
		.el-dialog__body {
			img {
				position: relative;
				z-index: 9999;
			}
		}
		.el-dialog__wrapper {
			z-index: 9999 !important;
		}
		.el-dialog__wrapper {
			/*top: 1rem;*/
		}
		
	}
	.v-modal {
		z-index: 2 !important;
		display: none;
	}
</style>