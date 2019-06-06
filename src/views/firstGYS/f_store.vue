<template>
	<yd-layout id='fStore'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' style="width: 1.7rem;" href="#/f_mine" class="header_left">个人中心</a>
				<div v-else></div>
			</div>
			<div class="name">{{isEdit?isAdd?'新增店铺信息':'编辑店铺信息':'店铺信息'}}</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click='isEditFlg' href="javascript:;">{{isAdd?'':isEdit?'取消':'编辑'}}</a>
				<div v-else></div>
			</div>
		</div>
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>店铺名称</strong>
	              	</div>
		        </span>
				<yd-input required v-if='isEdit' slot="right" v-model="editForm.storeName" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
				<span class="list_span" v-else slot="right">{{form.storeName}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>描述</strong>
	              	</div>
		        </span>
				<yd-input v-if='isEdit' slot="right" v-model="editForm.storeSuggest" max="20" :show-success-icon="false" placeholder="请输入"></yd-input>
				<span class="list_span" v-else slot="right">{{form.storeSuggest}}</span>
			</yd-cell-item>
			
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>是否营业</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<yd-radio-group v-model="editForm.isopenTime">
						<yd-radio val="1">是</yd-radio>
						<yd-radio val="0">否</yd-radio>
					</yd-radio-group>
				</div>
				<span class="list_span" v-else slot="right">{{form.isopenTime?'是':'否'}}</span>
			</yd-cell-item>
			
			<yd-cell-item  v-if='isEdit&&editForm.isopenTime!=0'>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>开始营业时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange3()' class="item_select" name="" v-model="editForm.openStart" id="">
						<option value="" disabled selected>请选择开始时间</option>
						<option v-for='item in startOpenNum' :key='item' :value="item-1">{{item-1}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.openStart}}</span>
			</yd-cell-item>
			<yd-cell-item  v-else-if='!isEdit&&form.isopenTime'>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>开始营业时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange3()' class="item_select" name="" v-model="editForm.openStart" id="">
						<option value="" disabled selected>请选择开始时间</option>
						<option v-for='item in startOpenNum' :key='item' :value="item-1">{{item-1}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.openStart}}</span>
			</yd-cell-item>
			<yd-cell-item v-if='isEdit&&editForm.isopenTime!=0'>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>关闭营业时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange4()' class="item_select" name="" v-model="editForm.openEnd" id="">
						<option value="" disabled selected>请选择关闭时间</option>
						<option v-for='item in endOpenNum' :key='item+editForm.openStart' v-if='item>editForm.openStart&&item<=24' :value="item">{{item}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.openEnd}}</span>
			</yd-cell-item>
			<yd-cell-item v-else-if='!isEdit&&form.isopenTime'>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>关闭营业时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange4()' class="item_select" name="" v-model="editForm.openEnd" id="">
						<option value="" disabled selected>请选择关闭时间</option>
						<option v-for='item in endOpenNum' :key='item+editForm.openStart' v-if='item>editForm.openStart&&item<=24' :value="item">{{item}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.openEnd}}</span>
			</yd-cell-item>
			
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>是否当天配送</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<yd-radio-group v-model="editForm.distributionToday">
						<yd-radio val="1">是</yd-radio>
						<yd-radio val="0">否</yd-radio>
					</yd-radio-group>
				</div>
				<span class="list_span" v-else slot="right">{{form.distributionToday?'是':'否'}}</span>
			</yd-cell-item>
			
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>配送周期</strong>
	              	</div>
		        </span>
				<yd-input required regex="^[0-9]+$" v-if='isEdit' slot="right" v-model="editForm.period" max="2" :show-success-icon="false" placeholder="配送周期为1-19天"></yd-input>
				<span class="list_span" v-else slot="right">{{form.period}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>配送开始时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange1()' class="item_select" name="" v-model="editForm.distributionStart" id="">
						<option value="" disabled selected>请选择开始时间</option>
						<option v-for='item in startNum' :key='item' :value="item-1">{{item-1}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.distributionStart}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>配送结束时间</strong>
	              	</div>
		        </span>
				<div v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange2()' class="item_select" name="" v-model="editForm.distributionEnd" id="">
						<option value="" disabled selected>请选择结束时间</option>
						<option v-for='item in endNum' :key='item+editForm.distributionStart' v-if='item>editForm.distributionStart&&item<=24' :value="item">{{item}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.distributionEnd}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>联系电话</strong>
	              	</div>
		        </span>
				<yd-input required v-if='isEdit' slot="right" ref='phoneNumber' v-model="editForm.phoneNumber" regex="mobile" :show-success-icon="false" placeholder="请输入手机号码(必填)"></yd-input>
				<span class="list_span" v-else slot="right">{{form.phoneNumber}}</span>
			</yd-cell-item>
		</yd-cell-group>
		<div class="list_img_f" v-if='isEdit'>
			<div class="list_img">
				<div class="list_img_title">店铺头像</div>
				<template>
					<el-upload :data='{savePath: "productOnline"}' class="upload-demo" :action="imgAction" accept='image/*' :show-file-list='false' :on-success='onSuccess' :on-error='onError' :before-upload='beforeUpload' :limit="1" :file-list="fileList">
						<div v-if='editForm.headPicUrl'>
							<img  class="user_img" :src="$root.config.imgURL+editForm.headPicUrl" alt="" />
						</div>
						<div v-else class="list_img_update">上传用户头像</div>
						<div slot="tip" class="el-upload__tip">
							<div v-if='editForm.headPicUrl' slot="tip" @click="delImg" style="width: 2rem;margin: .3rem auto 0;" class="list_img_update ">
								删除图片
							</div>
							<div  style="color: red;text-align: center;padding: .2rem;">**图片大小不能超过4M**</div>
						</div>
					</el-upload>
				</template>
			</div>

		</div>
		<div v-else class="list_img_f">
			<div class="list_img">
				<div class="list_img_title">店铺头像</div>
				<template v-if='form.headPicUrl'>
					<img class="user_img" :src="$root.config.imgURL+form.headPicUrl" alt="" />
				</template>
				<div v-else class="list_img_no">暂未上传</div>
			</div>
		</div>
		<div v-if='isEdit' class="flex flex-x-center" style="padding: 0 0.24rem;">
			<div @click="submit" class="loginbtn flex flex-y-center flex-x-center">
				<span>保存</span>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import { Upload } from 'element-ui';
	export default {
		components: {
			[Upload.name]: Upload,
		},
		data() {
			return {
				imgAction: '',
				startNum: 23,
				endNum: 24,
				startOpenNum:23,
				endOpenNum:24,
				isEdit: false,
				isAdd: false,
				form: {
					isopenTime:1,
					openStart:0,//营业时间
					openEnd:24,//关店时间
				},
				editForm: {
					id: '',
					storeName: '', //店铺名称
					storeSuggest: '', //描述
					distributionToday: 0, //是否当天配送 0为否，1为是
					period: '', //配送周期
					distributionStart: 0, //配送开始时间
					distributionEnd: 24, //配送结束时间
					phoneNumber: '', //联系电话
					headPicUrl: '',//店铺图片
					openStart:0,//营业时间
					openEnd:24,//关店时间
					isopenTime:1,//0是否，1是确认
					
				},
				fileList: [],

			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '店铺信息')
			this.imgAction = ROOT_API + '/api/comm/fileUpload/file/imgUpload?token=' + this.$root.userInfo.token
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			//获取店铺信息
			this.getCustomerStore()
		},
		methods: {
			delImg(){
				this.editForm.headPicUrl='';
				this.fileList=[]
			},
			onSuccess(resp, file, fileList) {
				console.log(resp)
				this.$dialog.loading.close();

				//resp.aaData.path
				if(resp.state == 0) {
					this.fileList=[]
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
				this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '图片上传失败，请检测网络（有些wifi不能上传）',
					timeout: 1500
				});
			},
			beforeUpload(file) {
//				this.$dialog.loading.open('图片上传中...');

				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$dialog.toast({
						mes: '图片大小不能超过4M~~',
						timeout: 1500
					});
					this.$dialog.loading.close();
				}
				return isLt2M;
			},
			submit() {
				if(!this.editForm.storeName) {
					this.$dialog.toast({
						mes: '请输入店铺名称',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.period) {
					this.$dialog.toast({
						mes: '请输入配送周期',
						timeout: 1500
					})
					return false
				}
				if(this.editForm.period) {
					if(this.editForm.period < 1 || this.editForm.period > 19) {
						this.$dialog.toast({
							mes: '配送周期为1-19的数字,请正确输入',
							timeout: 1500
						})
						return
					}
				}
				if(!this.editForm.distributionStart) {
					this.$dialog.toast({
						mes: '请选择配送开始时间',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.distributionEnd) {
					this.$dialog.toast({
						mes: '请选择配送结束时间',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.phoneNumber) {
					this.$dialog.toast({
						mes: '请填写联系电话',
						timeout: 1500
					})
					return false
				}
				if(this.editForm.phoneNumber) {
					const input = this.$refs.phoneNumber;
					if(!input.valid) {
						this.$dialog.toast({
							mes: '请输入正确的手机号码',
							timeout: 1500
						})
						return false
					}
				}
				this.save()
			},
			save() {
				this.editForm.id ? this.editForm.id = this.editForm.id : this.editForm.id = this.$root.userInfo.typeCode
				this.editForm.headPicUrl?this.editForm.headPicUrl=this.editForm.headPicUrl:this.editForm.headPicUrl=''
				this.editForm.storeSuggest?this.editForm.storeSuggest=this.editForm.storeSuggest:this.editForm.storeSuggest=''
				this.$dialog.loading.open('数据保存中...');
				this.postRequest('store/update', this.editForm).then(d => {
					this.$dialog.loading.close();
					if(d.data && d.data.state == 0) {
						this.isAdd = false;
						this.isEdit = false;
						this.getCustomerStore()
					}else{
						this.$dialog.toast({
		                    mes: d.data.msg,
		                    timeout: 1500,
		                    icon: 'error',
		                });
					}
				})
			},
			selectChange1(code) {

			},
			selectChange2(code) {
				this.startNum = this.editForm.distributionEnd
			},
			selectChange3(){
				
			},
			selectChange4(){
				this.startOpenNum = this.editForm.openEnd
			},
			isEditFlg() {
				if(this.isEdit) {
					this.isEdit = false
				} else {
					this.isEdit = true
					this.editForm = Object.assign({}, this.editForm, this.form)					

				}
			},
			getCustomerStore() {
				this.$dialog.loading.open('数据加载中...');
				this.postRequest('store/queryBySellerId', {
					sellerId: this.$root.userInfo.typeCode
				}).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						if(resp.data.aaData) {
							this.form=Object.assign({},this.form, resp.data.aaData)
							this.startNum = this.form.distributionEnd
						} else {
							this.isAdd = true;
							this.isEdit = true;
						}

					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	#fStore {
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
			margin: .3rem 0 .1rem 0;
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
			.list_img_no{
				margin: .1rem  .2rem;
			}
			.list_img_update{
				margin: .1rem  .2rem;
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