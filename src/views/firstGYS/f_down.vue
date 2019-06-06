<template>
	<yd-layout  id='fDown'>
		<a :href="downUrl" download="download" target="_blank" class="down">{{weiXin?'在线预览':'下载'}}</a>
		<div v-if='weiXin' class="down_notice">***注:手机微信不支持下载，下载请使用浏览器打开。***</div>
		<yd-popup  @click.native='closeShow' class='pop_ts' v-model="show" position="bottom" height="100%">
        	<img class="ts_img_2" src="../../assets/firstImgs/wx_ts_2.png" alt="" />
		</yd-popup>
		<!--<div v-if='!weiXin'>
			<img class="ts_img_3" src="../../assets/firstImgs/wx_ts_3.png" alt="" />
		</div>-->
		<div class="content">
			<div class="title">浏览器下载操作方法：</div>
			<p>点击下载按钮，打开pdf文件。</p>
			<img v-if='weiXin' class="ts_img_4" src="../../assets/firstImgs/wx_ts_4.png" alt="" />
			<p>第一步：</p>
			<img class="ts_img_4" src="../../assets/firstImgs/wx_ts_6.png" alt="" />
			<div class="fangfa">方法一(当pdf文件大小较小时)：</div>
			<img class="ts_img_4" src="../../assets/firstImgs/wx_ts_5.png" alt="" />
			<div class="fangfa">方法二(当pdf文件大小较大时)：</div>
			<img class="ts_img_4" src="../../assets/firstImgs/wx_ts_7.png" alt="" />
			<p>存储文件,最后在手机中找到应用程序“文件”即可打开。</p>
			<img class="ts_img_4" src="../../assets/firstImgs/wx_ts_8.png" alt="" />
		</div>
	</yd-layout>
</template>

<script>
	export default{
		data(){
			return {
				show:true,
				weiXin:false,
				downUrl:'',
			}
		},
		created(){
			if(this.$root.sources()=='Weixin'&&!this.$root.isPcOS()&&this.$root.getDeviceInfo()!='Android'){
				//这个说明在微信的手机端
				this.weiXin=true
			}else{
				this.show=false
			}
		},
		watch:{
			
		},
		computed:{
			
		},
		mounted(){
			if(this.$route.query.id||this.$route.query.id==0){
				this.postRequest('customer/getCusMaterMerChanter', {
					id:this.$route.query.id,
				}).then(resp => {
					if(resp.data.state==0){
						this.downUrl=this.$root.config.root_api+'upload/'+resp.data.msg
					}else{
						this.$dialog.toast({
			                mes: '网络加载失败，请重新加载页面！',
			                timeout: 1500,
			            });
					}
				})
			}else{
				this.$router.go(-1)
			}
		},
		methods:{
			closeShow(){
				this.show=false
			}
		}
	}
</script>

<style lang='scss'>
	#fDown{
		background: white;
		img{
			display: block;
		}
		.down{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: .32rem;
			width: 3rem;
			height: .8rem;
			background: #018BE6;
			color: white;
			text-align: center;
			margin: 1rem auto 0;
			border-radius: .4rem;
			font-weight: bold;
		}
		.pop_ts{
			.yd-mask{
				/*background: transparent !important;*/
			}
			.yd-popup{
				background: transparent;
			}
			.yd-popup-content{
				background: rgba(255,255,255,.1);
				background: transparent;
			}
		}
		.ts_img_2{
			display: block;
			margin: auto;
			width: 6.37rem;
			height: 3.28rem;
		}
		.down_notice{
			color: red;
			margin:.2rem;
			text-align: center;
			margin-bottom: 1rem;
		}
		.content{
			padding: .2rem;
			.title{
				padding: .2rem 0;
				font-size: .32rem;
				font-weight: bold;
			}
			.fangfa{
				font-size: .3rem;
				font-weight: bold;
				margin: .2rem;
			}
		}
		.ts_img_3,.ts_img_4{
			width: 90%;
			margin: auto;
		}
		p{
			font-weight: bold;
			padding: .2rem;
			font-size: .26rem;
		}
	}
</style>