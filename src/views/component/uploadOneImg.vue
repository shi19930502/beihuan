<template>
	<div id='uploadImg' class="information_upload">
		<div class="upload_width">
			<el-upload  
				ref="upload" 
				:data='{savePath: "productOnline"}' 
				:file-list="fileList" 
				:limit='1' 
				:on-error='onError' 
				:on-success='onSuccess' 
				:on-change='imgChange' 
				:accept='acceptImg' 
				:action="imgAction" 
				:auto-upload='autoUpload' 
				list-type="picture-card" 
				:before-remove='beforeRemove'
				:on-preview="handlePictureCardPreview" 
				:on-remove="handleRemove">
				<i class="el-icon-plus"></i>
			</el-upload>
		</div>
		<div v-if='isUpload&&!autoUpload' @click='uploadImg' class="upload_btn">上传图片</div>
		<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt>
		</el-dialog>
		<yd-popup v-model="showPop" position="bottom" height="30%">
			<div class="password_pop">
				<div class="password_pop_title_f">
					<div class="password_pop_title">
						该操作有风险，请再次输入密码!
					</div>
					<yd-icon name="error" @click.native="showPop=false" size="0.45rem"></yd-icon>
				</div>
	            <yd-input  type="password" v-model="password" placeholder="请输入密码"></yd-input>
				<div class="password_btn" @click='submitPassword'>
					确认
				</div>
			</div>
        </yd-popup>
	</div>
</template>

<script>
	import { Upload, Dialog } from 'element-ui';
	export default {
		name: 'uploadOneImg',
		components: {
			[Upload.name]: Upload,
			[Dialog.name]: Dialog,

		},
		props: {
			uploadNum: {
				default: 0,
			},
			picUrl: {
				default: '',
			},
			detailId:{
				default: '',
			},
			autoUpload:{
				default:false,
				type:Boolean,
				
			},
			qrCode:{
				default:false,
				type:Boolean,
			}
//			fileList: {
//				default: function() {
//					return []
//				}
//			},
		},
		data() {
			return {
				acceptImg: 'image/*',
				fileList: [],
//      		fileList: [
//      			{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
//      		],
				imgAction: '',
//				autoUpload: false,
				isUpload: false,
				successUpload: false,
				dialogVisible: false,
				dialogImageUrl: '',
				imgToken: '',
				showPop:false,
				password:'',
				removePassword:false,
				uploadFlg:false,
			}
		},
		created() {
			this.imgAction = ROOT_API + '/api/comm/fileUpload/file/imgUpload?token=' + this.$root.userInfo.token
		},
		watch: {
			picUrl:function(val,oldVal){
				if(val){
					if(this.uploadNum==0&&this.qrCode){
						this.uploadFlg=true
					}
					this.fileList= [
		        		{name: 'em.jpeg', url: this.$root.config.imgURL+'/'+this.picUrl},
		        	]
					document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:none'
				}
			}
		},
		computed: {

		},
		mounted() {
			if(this.picUrl){
				
        		this.fileList= [
	        		{name: 'em.jpeg', url: this.$root.config.imgURL+'/'+this.picUrl},
	        	]
				document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:none'
			}
		},
		methods: {
			onSuccess(resp, file, fileList) {
				this.error = resp;
				this.errorFile = file;
				this.errorFileList = fileList
				this.$dialog.loading.close();
				if(this.uploadNum==0&&this.qrCode){
					this.uploadFlg=true
				}
				if(resp.state == 0) {
					
					this.$nextTick(() => {
						this.$emit('update:picUrl', resp.aaData.path)
						console.log(this.picUrl)
						this.isUpload = false
						this.successUpload = true
						this.$emit('success',resp.aaData.path,this.detailId)
					})	
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
						this.fileList = []
						this.isUpload = false
						document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:inline-block'
					})
				}
			},
			onError(err, file, fileList) {

				this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '上传图片失败，请点击重新上传',
					timeout: 1500
				});
				this.fileList = []
				this.isUpload = false
				document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:inline-block'
			},
			imgChange(file, fileList) {
				const isLt2M = file.size / 1024 / 1024 < 4;
				if(!isLt2M) {
					this.$dialog.toast({
						mes: '图片大小不能超过4M~~',
						timeout: 1500
					});
					this.fileList = []
				} else {
					this.fileList = fileList;
					this.isUpload = true;
					if(fileList.length == 1) {
						document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:none'
					}
				}
				return isLt2M;
			},
			//打开dia
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleRemove(file, fileList) {
				console.log(fileList)
				this.$emit('remove',this.detailId)
				this.isUpload = false;
				this.successUpload = false;
				this.fileList = [];
				fileList=fileList||[]
				if(fileList.length < 1) {
					document.getElementsByClassName('el-upload')[this.uploadNum].style = 'display:inline-block'
				}
				this.$emit('update:picUrl','')
			},
			beforeRemove(file, fileList){
				return new Promise((resolve,reject)=>{
					console.log(file, fileList)
					if(this.uploadNum==0&&this.qrCode&&this.uploadFlg){
						this.showPop=true;
						this.password=''
						this.removePassword=true
					}else{
						resolve()
					}
				})
			},
			uploadImg() {
				if(this.uploadNum==0&&this.qrCode){
					this.showPop=true;
					this.removePassword=false
					this.password=''
				}else{
					this.$dialog.loading.open('图片上传中...');
					this.$refs.upload.submit();
				}
				
			},
			submitPassword(){
				this.$dialog.loading.open('验证中，请稍后...');
				this.postRequest('user/checkPassword', {
					loginName:this.$root.userInfo.loginName,
					passWord: this.password,
				}, false, true).then(resp => {
					if(resp.data && resp.data.state == 0) {
						this.showPop=false;
						if(this.removePassword){
							this.$dialog.loading.close()
							this.handleRemove()
						}else{
							this.$dialog.loading.open('图片上传中...');
							this.$refs.upload.submit();
						}
					} else {
						this.$dialog.loading.close()
						this.$dialog.toast({
		                    mes: '密码验证失败！',
		                    timeout: 1500
		                });
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	#uploadImg {
		margin-top: .25rem;
		display: flex;
		align-items: center;
		.upload_btn {
			line-height: .4rem;
			background: #018BE6;
			color: white;
			padding: .1rem;
			border-radius: .1rem;
			margin-left: .25rem;
		}
		.el-upload--picture-card{
			width: 100px;
		    height: 100px;
		    line-height: 100px;
		}
		.el-upload-list__item{
			width: 100px;
		    height: 100px;
		    line-height: 100px;
		}
		.el-upload-list__item-status-label{
			line-height: 1.7;
		}
		.password_pop{
			.password_pop_title_f{
				display: flex;
				padding: .3rem .3rem .3rem .3rem;
				justify-content: space-between;
			}
			.password_pop_title{
				font-size: .32rem;
				color: #f43530;
				font-weight: bold;
			}
			.yd-input{
				/*height: 1rem;*/
				padding: 0rem .3rem;
				border-top: 1px solid #D6D6D6;
				border-bottom: 1px solid #D6D6D6;
				input{
					height: .8rem;
					line-height: .4rem;
					font-size: .28rem;
				}
			}
			.password_btn{
				color: white;
			    background: #018BE6;
			    height: .8rem;
			    text-align: center;
			    line-height: .8rem;
			    border-radius: .1rem;	
			    width: 7rem;
			    margin: .3rem auto 0;
			}
		}
	}
</style>