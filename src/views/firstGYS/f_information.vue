<template>
	<yd-layout id='fInformation'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' style="width: 1.7rem;" href="#/f_mine" class="header_left">个人中心</a>
				<div v-else></div>
			</div>
			<div class="name">基本信息</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' href="#f_information_edit">编辑</a>
				<div v-else></div>
			</div>
		</div>
		<div class="list">
			<yd-cell-group>
				<yd-cell-item>
					<span slot="left">
		        	    <div class="lable">
		              		<strong>备案用户ID</strong>
			          	</div>
			        </span>
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
					<span class="list_span"  slot="right">{{form.customerName}}</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
		        	    <div class="lable">
		              		<strong>证件号码</strong>
			          	</div>
			        </span>
					<span class="list_span"  slot="right">{{form.regId}}</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
		        	    <div class="lable">
		              		<strong>地址</strong>
			          	</div>
			        </span>
					<span class="list_span"  slot="right">{{form.address}}</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
		        	    <div class="lable">
		              		<strong>联系电话</strong>
			          	</div>
			        </span>
					<span class="list_span"  slot="right">{{form.tel}}</span>
				</yd-cell-item>
				<yd-cell-item>
					<span slot="left">
		        	    <div class="lable">
		              		<strong>备注</strong>
			          	</div>
			        </span>
					<span class="list_span"  style="padding: .2rem 0;" slot="right">{{form.remark}}</span>
				</yd-cell-item>
			</yd-cell-group>
			<div class="list_img_f">
				<div class="list_img">
					<div class="list_img_title">用户头像</div>
					<template v-if='userImg'>
						<img class="user_img" :src="$root.config.imgURL+userImg" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div>
				</div>
				<div class="list_img">
					<div class="list_img_title">收款二维码</div>
					<template v-if='form.wxcodePic'>
						<img :src="$root.config.imgURL+form.wxcodePic" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div>
				</div>
				<div class="list_img">
					<div class="list_img_title">{{form.property=="2"?'市场证明':'营业执照'}}</div>
					<template v-if='form.businessLicensePic'>
						<img :src="$root.config.imgURL+form.businessLicensePic" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div>
				</div>
				<div class="list_img">
					<div class="list_img_title">食品许可证</div>
					<template v-if='form.foodLicensePic'>
						<img :src="$root.config.imgURL+form.foodLicensePic" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div>
				</div>
				<div v-if='form.muslimfoodPermitPic' class="list_img">
					<div class="list_img_title">清真食品图片</div>
					<template >
						<img :src="$root.config.imgURL+form.muslimfoodPermitPic" alt="" />
					</template>
					<!--<div v-else class="list_img_no">暂未上传</div>-->
				</div>
				<div class="list_img">
					<div class="list_img_title">法人照片</div>
					<template v-if='form.legalpepresentPic'>
						<img :src="$root.config.imgURL+form.legalpepresentPic" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div>
				</div>
				<div class="list_img" v-if='$root.userInfo.extend=="004"'>
					<div class="list_img_title">门头照片</div>
					<template v-if='form.storePic'>
						<img :src="$root.config.imgURL+form.storePic" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div> 
				</div>
				<div class="list_img">
					<div class="list_img_title">身份证正面</div>
					<template v-if='form.idCard' >
						<img :src="$root.config.imgURL+form.idCard.split(';')[0]" alt="" />
					</template>
					<div v-else class="list_img_no">暂未上传</div> 
				</div>
				<div class="list_img">
					<div class="list_img_title">身份证反面</div>
					<template v-if='form.idCard' >
						<img :src="$root.config.imgURL+form.idCard.split(';')[1]" alt="" />
					</template>		
					<div v-else class="list_img_no">暂未上传</div> 
				</div>
			</div>
		</div>
	</yd-layout>
</template>

<script>
	export default {
		data() {
			return {
				form:{},
				userImg:'',
			}
		},
		created() {
			this.$store.dispatch('changeNavBarTitle', '基本信息')
		},
		watch: {

		},
		computed: {

		},
		mounted() {
			this.init()
		},
		methods: {
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
#fInformation{
	.list_img_f{
		margin-top: .2rem;
		background:white;
		padding-left: .24rem;
		.list_img{
			border-bottom: 1px solid #D6D6D6;
			padding: .2rem 0 .1rem 0;
			.list_img_title{
				color: #555555;
				font-weight: bold;
				font-size: .28rem;
			}
			.list_img_no{
				margin: .1rem  .2rem;
			}
			img{
				display: block;
				max-width: 6rem;
				margin: .2rem auto .2rem;
				max-height: 8rem;
			}
			.user_img{
				width: 1rem;
				height: 1rem;
				border-radius: 50%;
				border: 1px solid #D6D6D6;
			}
			&:last-child{
				border-bottom: none;
			}
		}
	}
	.list_span {
			text-align: right;
			width: 100%;
			color: #848484;
			font-weight: bold;
		}
		
}
</style>