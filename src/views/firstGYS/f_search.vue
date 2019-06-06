<template>
	<yd-layout id='fSearch'>
		<div class="select_code " slot='top'>
			<div class="select_code_l">分类别名查询:</div>
			<!--@change="gbgoodsIdChange(gbgoodsId,$route.query.url=='xzjc'?'categoryCode':'f_code')"-->
			<select class="select_code_r" name="" id="" v-model="gbgoodsId" >
				<option value="" selected="selected">全部</option>
				<option v-for='item in codeList' :key='item.gbgoodsId' :value="item.gbgoodsId">{{item.vulgo}}</option>
			</select>
			<img src="../../assets/imgs/list_icon_right.png" alt="" />
		</div>
		<!--gradient-->
		<div slot='top' style="background: white; border-bottom: 1px solid #D6D6D6;" class="search_input search_input_popup  search_input_children_fixed">
			<input oninput="if(value.length>20)value=value.slice(0,20)" class="search_input_children " ref='searchRef' type="text" placeholder="搜索" v-model='searchInput' />
			<div class="close_popup" @click="submit">确认</div>
			<yd-icon @click.native='clearInput' v-show='flgError' size=".32rem" class='yd-icon-error-c' color='#989E92' name="error"></yd-icon>
		</div>
		
		<yd-checklist v-model="checklist">
			<div class="goods_list">
				<!--:key="item.f_id"-->
				<yd-checklist-item :change='radioChange' @click.native='radioClick'  :key="item.f_id?item.f_id:'f_'+item.categoryId"  v-for='(item ,index) in newDataList'  :val="item.f_id?item.f_id:'f_'+item.categoryId">
					<div v-if='$route.query.url=="xzjc"' class="check_list">
						<span class="fl" v-if='!item.f_id'>待上架</span>
						<div class="check_list_c">
							<span class="name">{{item.productName||item.vulgo}}</span>
							<span v-if='item.f_name&&item.f_name'> - {{item.f_name}}</span>
						</div>
					</div>
					<div v-else class="check_list" ><span >{{item.f_vulgo}}</span></div>
				</yd-checklist-item>
			</div>
		</yd-checklist>
	</yd-layout>
</template>

<script>
	import mixin_code from '../../utils/mixin_code.js'
	export default {
		mixins:[mixin_code],
		data() {
			return {
				dataList: [],
				newDataList:[],
				codeDataList:[],
				checklist: [],
				oldChecklist: [],
				oldCheckFl:[],
				TJSP_sessionObj: {},
				XZJC_sessionObj: {},
				searchInput: '',
				flgError: false,
				count: 0,
			}
		},
		created() {
			if(this.$route.query.url == 'tjsp') {
				if(sessionStorage.getItem('TJSP_search')) {
					this.TJSP_sessionObj = JSON.parse(sessionStorage.getItem('TJSP_search'))
					this.checklist = this.TJSP_sessionObj.checklist;
					this.oldChecklist = this.TJSP_sessionObj.checklist
					//this.searchInput = this.TJSP_sessionObj.val
					var obj = {
						val: '',
						checklist: this.checklist
					}
					sessionStorage.setItem('TJSP_search', JSON.stringify(obj))
				}
			} else if(this.$route.query.url == 'xzjc') {
				if(sessionStorage.getItem('XZJC_search')) {
					this.XZJC_sessionObj = JSON.parse(sessionStorage.getItem('XZJC_search'))
					console.log(this.XZJC_sessionObj)
					this.checklist = this.XZJC_sessionObj.checklist
					this.oldChecklist = this.XZJC_sessionObj.checklist
					//this.searchInput = this.XZJC_sessionObj.val
					var obj = {
						val: '',
						checklist: this.checklist
					}
					sessionStorage.setItem('XZJC_search', JSON.stringify(obj))
				}
			} else {
				this.$router.back();
			}

		},
		watch: {
			gbgoodsId:function(val){
				this.searchList()
			},
			searchInput: function(val, oldVal) {
				if(val.length > 0) {
					this.flgError = true
				} else {
					this.flgError = false
				}
				var arr=[];
//				var params={
//					firstCharStr: '',
//					keyWord: val,
//				}
//				var url='Category/queryCategorylistByfirstChar'
//				if(this.$route.query.url=='xzjc'){
//					url='productsku/querySkuFirstCharByCustomerId'
//					url='productsku/querySkuOrCategoryByCustomerId'
//					params.sellerId=this.$root.userInfo.typeCode
//				}
//				this.init(url,params);
				//categoryName、f_name、productName
				
				for(let a =0 ;a<this.dataList.length;a++){
					var o=this.dataList[a]
//					if(o.categoryName){
//						if(o.categoryName.indexOf(val)>=0){
//							arr.push(o)
//							continue
//						}
//					}
//					if(o.f_name){
//						if(o.f_name.indexOf(val)>=0){
//							arr.push(o)
//							continue
//						}
//					}
					if(o.productName){
						if(o.productName.indexOf(val)>=0){
							arr.push(o)
							continue
						}
					}
					if(o.vulgo){
						if(o.vulgo.indexOf(val)>=0){
							arr.push(o)
							continue
						}
					}
					if(o.f_vulgo){
						if(o.f_vulgo.indexOf(val)>=0){
							arr.push(o)
							continue
						}
					}
				}
				//这里还需要处理
				var newArr=[],str='';
				this.$route.query.url=='xzjc'?str='categoryCode':str='f_code'
				arr.forEach((o)=>{
					if(o[str].slice(0, this.gbgoodsId.length) == this.gbgoodsId){
						newArr.push(o)
					}
				})
				
				this.codeDataList=arr   //记录input框改变过后的值
				this.newDataList=newArr   //input+select改变过后的值
			}
		},
		computed: {

		},
		async mounted() {
				var params={
					firstCharStr: '',
					//keyWord: val,
					keyWord: '',
				}
				//新增进场和extend==007的时候sellerId才有
				var url='Category/queryCategorylistByfirstChar'
				var paramsObj={}
				var customerListObj={}
				if(this.$route.query.url=='xzjc'){
					//url='productsku/querySkuFirstCharByCustomerId'
					url='productsku/querySkuOrCategoryByCustomerId'
					params.sellerId=this.$root.userInfo.typeCode
				}
				if(this.$route.query.code){ //管理员，每个人都要查
					paramsObj={
						code:this.$route.query.code
					}
					customerListObj = await this.getCustomerList(paramsObj)
					params.sellerId = customerListObj.id
					if(customerListObj.extend=="007"){
						this.businessScope = customerListObj.businessScope
					}
					this.getTopCategoryListByCode(this.businessScope);
					
				}else{  //非管理员
					
					if(this.$root.userInfo.extend=='007'){
						paramsObj={
							id: this.$root.userInfo.typeCode
						}
						params.sellerId=this.$root.userInfo.typeCode
						customerListObj = await this.getCustomerList(paramsObj)
						this.businessScope = customerListObj.businessScope
						this.getTopCategoryListByCode(this.businessScope);
					}else{
						this.getTopCategoryListByCode(this.businessScope);
					}
				}
				  //查询customer/list
				this.init(url,params);
		},
		methods: {
			searchList(){
				var val=this.gbgoodsId
				var str=''
				if(this.$route.query.url=='xzjc'){
					str='categoryCode'
				}else {
					str='f_code'
				}
				this.gbgoodsIdChange(val,str)
			},
			//select分类别名查询改变事件
			gbgoodsIdChange(val,str){
				localStorage.setItem('quick_gbgoodsId',val)
				this.newDataList=[];
				var arr=[];
				
				//categoryCode
				this.codeDataList.forEach((o)=>{
					if(o[str].slice(0, val.length) == val){
						arr.push(o)
					}
				})
				this.$nextTick(() => {
					this.newDataList=arr
				})
			},
			
			radioChange(val, flg) {
				this.isSelectFlg = flg
				this.isSelectId = val
			},
			radioClick() {
				if(this.isSelectFlg) {
					this.oldChecklist.push(this.isSelectId)
				} else {
					for(let a = 0; a < this.oldChecklist.length; a++) {
						if( this.oldChecklist[a]==this.isSelectId){
							this.oldChecklist.splice(a,1)
						}
					}
				}
			},
			clearInput() {
				this.searchInput = ''
			},
			init(url,params) {
				this.postRequest(url, params).then(resp => {
					if(resp.data.state==0&&resp.data.aaData){
						this.dataList = resp.data.aaData
						this.newDataList = resp.data.aaData
						this.codeDataList = resp.data.aaData
						if(this.$route.query.url == 'tjsp'){
							this.searchInput = this.TJSP_sessionObj.val
						}else{
							this.searchInput = this.XZJC_sessionObj.val
						}
					}
				})
			},
			submit() {
				var obj = {
					val: '',
					checklist: this.oldChecklist
				}
				if(this.$route.query.url == 'tjsp') {
					sessionStorage.setItem('TJSP_search', JSON.stringify(obj))
					this.$router.push({
						name: "f_tjsp_xz",
						query: {
							url: 'tjsp'
						}
					})
				} else if(this.$route.query.url == 'xzjc') {
					
					var arr=[];
					for(let a =0;a<this.oldChecklist.length;a++){
						if(this.dataList.find(o=>'f_'+o.categoryId==this.oldChecklist[a])){
							arr.push(this.dataList.find(o=>'f_'+o.categoryId==this.oldChecklist[a]))
						}
					}
					sessionStorage.setItem('XZJC_search', JSON.stringify(obj))
					for(let a =0;a<arr.length;a++){
						arr[a].weight=1;
						arr[a].weight='';
						arr[a].code='001_1'
						arr[a].isMuslim='0'
						arr[a].price='';
						arr[a].name='千克';
						arr[a].quarantPicUrl='';
					}
					sessionStorage.setItem('fl_goods',JSON.stringify(arr))
					this.$router.push({
						name: "f_xzjc_xz",
						query: {
							url: 'xzjc',
							mainId:this.$route.query.mainId,
							code:this.$route.query.code
						}
					})
				}
			},
		}
	}
</script>

<style lang='scss'>
	#fSearch {
		.yd-checklist-content{
			width: 5rem;
			flex-grow: 1;
			align-items: center;
			display:flex;
			.check_list{
				align-items: center;
				display: flex;
				.fl{
					color: red;
					width: .8rem;
					flex-grow: 0;
					margin-right: .15rem;
				}
				.check_list_c{
					/*width: 3rem;*/
					flex-grow: 1;
				}
			}
		}
		
		.yd-icon-error-c {
			position: absolute;
			right: 1.15rem;
			top: .25rem;
		}
		.search_input {
			width: 100%;
			position: relative;
			box-sizing: border-box;
			padding: .08rem .25rem;
			/*background: #80C551;*/
			.search_input_children {
				border-radius: .08rem;
				border: 1px solid white;
				width: 100%;
				padding: .15rem;
				font-size: .28rem;
				color: #2F3927;
				text-indent: .5rem;
				width: 100%;
				background-color: white;
				background-image: url(../../assets/imgs/fangdajing.png);
				background-repeat: no-repeat;
				background-size: contain;
				background-size: .4rem .4rem;
				background-position: .1rem .12rem;
			}
		}
		.search_input_popup {
			/*position: fixed;*/
			z-index: 999;
			top: 0;
			display: flex;
			align-items: center;
			padding: .08rem 0 .08rem .25rem;
			.search_input_children {
				width: 5rem;
				flex-grow: 1;
			}
			.close_popup {
				font-size: .32rem;
				text-align: center;
				/*color: white;*/
				color: #018BE6;
				width: 1rem;
				flex-grow: 0;
			}
		}
		.gradient{
			background: -webkit-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Safari 5.1 - 6.0 */
			background: -o-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Opera 11.1 - 12.0 */
			background: -moz-linear-gradient(180deg, #018BE6, #a7d6f6);
			/* Firefox 3.6 - 15 */
			background: linear-gradient( 180deg, #018BE6, #a7d6f6);
			background: #018BE6;
		}
		.select_code {
			display: flex;
			background: white;
			/*position: fixed;*/
			/*top: .82rem;
			left: 0;*/
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
	}
</style>