<template>
	<yd-layout id='fPsMoney'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' style="width: 1.7rem;" href="#/f_mine" class="header_left">个人中心</a>
				<div v-else></div>
			</div>
			<div class="name" style="width: 3rem;text-align: center;">{{isEdit?isAdd?'新增配送金额信息':'编辑配送金额信息':'配送金额信息'}}</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click='isEditFlg' href="javascript:;">{{isAdd?'':isEdit?'取消':'编辑'}}</a>
				<div v-else></div>
			</div>
		</div>

		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>配送金额(元)</strong>
	              	</div>
		        </span>
				<yd-input v-if='isEdit' slot="right" v-model="editFormMoney.shippingTotal" max="20" :show-success-icon="false" placeholder="请输入"></yd-input>
				<span class="list_span" v-else slot="right">{{formMoney.shippingTotal}}</span>
			</yd-cell-item>
		</yd-cell-group>
		<div v-if='isEdit' class="flex flex-x-center" style="padding: 0 0.24rem;">
			<div @click="submit" class="loginbtn flex flex-y-center flex-x-center">
				<span>保存</span>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				isEdit: false,
				isAdd: false,
				formMoney: {
					shippingTotal: ''
				},
				editFormMoney: {
					shippingTotal: '',
				},

			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '配送金额信息')
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			//获取店铺配送金额
			this.storeMoney()
		},
		methods: {
			delImg() {
				this.editForm.headPicUrl = '';
				this.fileList = []
			},
			onSuccess(resp, file, fileList) {
				console.log(resp)
				//resp.aaData.path
				if(resp.state == 0) {
					this.editForm.headPicUrl = resp.aaData.path
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
					})
				}
			},
			onError() {
				this.$dialog.toast({
					mes: '图片上传失败，请检测网络（有些wifi不能上传）',
					timeout: 1500
				});
			},
			beforeUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$dialog.toast({
						mes: '图片大小不能超过4M~~',
						timeout: 1500
					});
				}
				return isLt2M;
			},
			submit() {
				if(this.editFormMoney.shippingTotal) {
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(this.editFormMoney.shippingTotal) || reg_2.test(this.editFormMoney.shippingTotal)) {

					} else {
						this.$dialog.toast({
							mes: '请输入正确的配送金额格式',
							timeout: 1500
						})
						return false
					}
				}
				this.save()
			},
			save() {
				this.$dialog.loading.open('数据保存中...');

				this.postRequest('shippingfee/create', {
					sellerId: this.$root.userInfo.typeCode,
					shippingTotal: this.editFormMoney.shippingTotal
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						this.isAdd = false;
						this.isEdit = false;
						this.storeMoney()
					} else {
						this.$dialog.toast({
							mes: `${resp.data.msg}`,
							timeout: 1500,
						});
					}
				})
			},
			isEditFlg() {
				if(this.isEdit) {
					this.isEdit = false
				} else {
					this.isEdit = true
					this.editForm = Object.assign({}, this.editForm, this.form)
					this.editFormMoney = Object.assign({}, this.editFormMoney, this.formMoney)

				}
			},
			storeMoney() {
				this.postRequest('shippingfee/queryBySellerId', {
					sellerId: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						if(resp.data.aaData) {
							this.formMoney = Object.assign({}, this.formMoney, resp.data.aaData)
						}
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	#fPsMoney {
		.lable {
			width: 2.2rem;
			font-size: 0.3rem;
		}
		.list_span {
			text-align: right;
			width: 100%;
			color: #848484;
			font-weight: bold;
		}
		.item_right {
			align-items: center;
			display: flex;
			.icon {
				width: .11rem;
				height: .2rem;
				display: inline-block;
				background: url(../../assets/imgs/list_icon_right.png) no-repeat;
				background-size: contain;
				/*position: absolute;
				right: 0;
				top: .34rem;*/
				display: flex;
				align-items: center;
			}
			select {
				color: #555;
			}
		}
		.loginbtn {
			width: 100%;
			height: 0.78rem;
			background: #6FB138;
			border-radius: 0.39rem;
			color: #fff;
			font-size: 0.31rem;
			text-align: center;
			margin-top: .3rem;
		}
		.list_img_f {
			margin: .2rem 0;
			background: white;
			padding-left: .24rem;
			.list_img {
				padding: .2rem 0 .1rem 0;
			}
			.list_img_title {
				color: #555555;
				font-weight: bold;
				font-size: .28rem;
			}
			.list_img_no {
				margin: .1rem .2rem;
			}
			.list_img_update {
				margin: .1rem .2rem;
				background: #018BE6;
				color: white;
				padding: .1rem .2rem;
				border-radius: .08rem;
			}
			img {
				display: block;
				margin: .2rem auto .2rem;
				width: 1.5rem;
				height: 1.5rem;
			}
			.user_img {
				margin: .2rem auto .2rem;
				display: block;
				width: 1.5rem;
				height: 1.5rem;
				border: 1px solid #D6D6D6;
			}
			.upload-demo {
				text-align: center;
				.el-upload--text {
					img {
						margin: auto;
					}
				}
			}
		}
	}
</style>