<template>
	<yd-layout  id='fInformationEdit'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click="$router.go(-1)" style="width: 1.7rem;" href="javascript:;" class="header_left">返回</a>
				<div v-else></div>
			</div>
			<div class="name">编辑基本信息</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="javascript:;"></a>
				<div v-else></div>
			</div>
		</div>
		<div class="list_img">
			<div class="list_img_title">用户头像</div>
			<template >
				<el-upload
				:data='{savePath: "productOnline"}' 
				  class="upload-demo"
				  :action="imgAction"
					accept='image/*' 
					:show-file-list='false'
					:on-success='onSuccess'
					:on-error='onError' 
					:before-upload='beforeUpload'
				  :limit="1"
				  :file-list="fileList">
					<img v-if='userImg' class="user_img" :src="$root.config.imgURL+userImg" alt="" />
				  	<div v-else class="list_img_no">上传用户头像</div>
				  	<div slot="tip" class="el-upload__tip" style="color: red;">**图片大小不能超过4M**</div>
				</el-upload>
			</template>
			
		</div>
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>备案用户ID</strong>
		            </div>
				</span>
					<!--<yd-input  slot="right" v-model="form.customerId" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>-->
				<span class="list_span"  slot="right">{{form.customerId}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>邀请码</strong>
		            </div>
				</span>
				<span class="list_span"  slot="right">{{form.code}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>昵称</strong>
		            </div>
				</span>
				<yd-input  required slot="right" v-model="form.customerName" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>证件号码</strong>
		            </div>
				</span>
				<yd-input  required slot="right" v-model="form.regId" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>地址</strong>
		            </div>
				</span>
				<yd-input  slot="right" v-model="form.address" max="50" :show-success-icon="false" placeholder="请输入"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>联系电话</strong>
		            </div>
				</span>
				<yd-input required slot="right" ref='phoneNumber' v-model="form.tel" regex="mobile" :show-success-icon="false" placeholder="请输入手机号码(必填)"></yd-input>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
		            <div class="lable">
				    	<strong>备注</strong>
		            </div>
				</span>
           		<yd-textarea v-model='form.remark' slot="right" placeholder="请输入" maxlength="150"></yd-textarea>
			</yd-cell-item>
		</yd-cell-group>
		<div class="flex flex-x-center" style="padding: 0 0.24rem;">
			<div @click="submit" class="loginbtn flex flex-y-center flex-x-center">
				<span>保存</span>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	import { Upload } from 'element-ui';
	export default{
		components:{
			[Upload.name]: Upload,
		},
		data(){
			return {
				form:{},
				userImg:'',
				fileList:[],
				imgAction:'',
			}
		},
		created(){
			this.$store.dispatch('changeNavBarTitle', '编辑基本信息')
			this.imgAction = ROOT_API + '/api/comm/fileUpload/file/imgUpload?token=' + this.$root.userInfo.token
		},
		watch:{
			
		},
		computed:{
			
		},
		mounted() {
			this.init()
		},
		methods: {
			onSuccess(resp, file, fileList){
					this.$dialog.loading.close();
				if(resp.state == 0) {
					this.fileList=[]
					this.postRequest('/user/user/update', {
						userId: this.$root.userInfo.userId,
						filePath:resp.aaData.path,
					}).then(r => {
						if(r.data.state == 0) {
							this.userImg=resp.aaData.path
						}
					})
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
					})
				}
			},
			onError(){
					this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '图片上传失败，请检测网络（有些wifi不能上传）',
					timeout: 1500
				});
			},
			beforeUpload(file){
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
			submit(){
				if(!this.form.customerName) {
					this.$dialog.toast({
						mes: '请输入昵称',
						timeout: 1500
					})
					return false
				}
				if(!this.form.regId) {
					this.$dialog.toast({
						mes: '请输入证件号码',
						timeout: 1500
					})
					return false
				}
				if(!this.form.tel) {
					this.$dialog.toast({
						mes: '请输入联系电话',
						timeout: 1500
					})
					return false
				}
				if(this.form.tel) {
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
			save(){
				var params={
					id:this.form.customerId,
					name:this.form.customerName,
					regId:this.form.regId,
					address:this.form.address,
					tel:this.form.tel,
					remark:this.form.remark,
					extend:this.form.extend,
				};
				this.$dialog.loading.open('数据保存中...');
				this.postRequest('customer/updateCusMer', params).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						this.$router.push({
							name:'f_information'
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
			init(){
				this.postRequest('customer/list', {
					id: this.$root.userInfo.typeCode,
				}).then(resp => {
					if(resp.data.state == 0) {
						this.form=Object.assign({},this.form,resp.data.aaData[0])
					}
				})
				this.postRequest('/user/user/list', {
					id: this.$root.userInfo.userId,
				}).then(resp => {
					if(resp.data.state == 0) {
						this.userImg=resp.data.aaData[0].filePath
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	#fInformationEdit{
		.list_img{
			background: white;
			border-bottom: 1px solid #D6D6D6;
			padding: .2rem 0 .1rem .24rem;
			.list_img_title{
				color: #555555;
				font-weight: bold;
				font-size: .28rem;
			}
			.list_img_no{
				margin: .1rem  .2rem;
				background: #018BE6;
				color: white;
				padding: .1rem .2rem;
				border-radius: .08rem;
			}
			.user_img{
				margin: .2rem auto .2rem;
				display: block;
				width: 1rem;
				height: 1rem;
				border-radius: 50%;
				border: 1px solid #D6D6D6;
			}
			.upload-demo{
				text-align: center;
				.el-upload--text{
					img{
						margin: auto;
					}
				}
			}
		}
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.list_span {
			text-align: left;
			width: 100%;
			color: #848484;
			font-weight: bold;
		}
		.yd-cell-item:last-child{
			.yd-cell-left{
				display: flex;
				align-items: flex-start;
				padding-top: .175rem;
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
		}
	}
</style>