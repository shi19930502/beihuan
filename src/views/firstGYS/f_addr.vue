<template>
	<yd-layout  id='fAddr'>
		<div slot='top' class="header">
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' style="width: 1.7rem;" href="#/f_mine" class="header_left">个人中心</a>
				<div v-else></div>
			</div>
			<div class="name">{{isEdit?isAdd?'新增地址信息':'编辑地址信息':'地址信息'}}</div>
			<div>
				<a v-if='$root.userInfo.typeId=="merchant"' @click='isEditFlg' href="javascript:;">{{isAdd?'':isEdit?'取消':'编辑'}}</a>
				<div v-else></div>
			</div>
		</div>
		<yd-cell-group>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable" >
	                	<strong>省/市</strong>
	              	</div>
		        </span>
		        <div  v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange1(editForm.provinceCode)' class="item_select" name="" v-model="editForm.provinceCode" id="">
						<option value="" disabled selected>请选择省/市(必选)</option>
						<option v-for='item in provinceList' :value="item.areaCode">{{item.areaName}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span"   v-else slot="right">{{form.provinceName}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>市/区</strong>
	              	</div>
		        </span>
		        <div  v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange2(editForm.cityCode)' class="item_select" name="" v-model="editForm.cityCode" id="">
						<option value="" disabled selected>请选择市/区(必选)</option>
						<option v-for='item in cityList' :value="item.areaCode">{{item.areaName}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.cityName}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>区/县</strong>
	              	</div>
		        </span>
		        <div  v-if='isEdit' slot="right" class="item_right list_span">
					<select @change='selectChange3(editForm.districCode)' class="item_select" name="" v-model="editForm.districCode" id="">
						<option value="" disabled selected>请选择区/县(必选)</option>
						<option v-for='item in districList' :value="item.areaCode">{{item.areaName}}</option>
					</select>
					<i class="icon"></i>
				</div>
				<span class="list_span" v-else slot="right">{{form.districName}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>详细地址</strong>
	              	</div>
		        </span>
				<yd-input required  v-if='isEdit' slot="right" v-model="editForm.detailedAddress" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
				<span class="list_span" v-else slot="right">{{form.detailedAddress}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>完整信息</strong>
	              	</div>
		       </span> 
				<span class="list_span" v-if='isEdit' style="text-align: left;" slot="right">{{(editForm.areaName+(editForm.detailedAddress?'-'+editForm.detailedAddress:editForm.detailedAddress))||''}}</span>
				<!--<span class="list_span" v-if='isEdit' slot="right">{{editForm.areaName+(editForm.detailedAddress?'-'+editForm.detailedAddress:editForm.detailedAddress)}}</span>-->
				<span class="list_span" v-else slot="right">{{form.completeAddress}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>联系人</strong>
	              	</div>
		        </span>
				<yd-input required  v-if='isEdit' slot="right" v-model="editForm.contacts" max="20" :show-success-icon="false" placeholder="请输入(必填)"></yd-input>
				<span class="list_span" v-else slot="right">{{form.contacts}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>联系电话</strong>
	              	</div>
		        </span>
				<yd-input required  v-if='isEdit' slot="right" ref='phoneNumber' v-model="editForm.phoneNumber" regex="mobile" :show-success-icon="false" placeholder="请输入手机号码(必填)"></yd-input>
				<span class="list_span" v-else slot="right">{{form.phoneNumber}}</span>
			</yd-cell-item>
			<yd-cell-item>
				<span slot="left">
	              	<div class="lable">
	                	<strong>备注</strong>
	              	</div>
		        </span>
				<yd-input v-if='isEdit' slot="right" v-model="editForm.comment" max="20" :show-success-icon="false" placeholder="请输入"></yd-input>
				<span class="list_span" v-else slot="right">{{form.comment}}</span>
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
	export default{
		data(){
			return {
				isEdit:false,
				isAdd:false,
				form:{},
				editForm:{
					longitude:'',
					latitude:'',
					customerId:'',
					id:'',
					districCode:'',//区编码
					districName:'',//区名称
					cityCode:'',//市编码
					cityName:'',//市名词
					provinceCode:'',//省编码
					provinceName:'',//省名称
					areaName:'',//自定义的拼接完整信息
					detailedAddress:'',//详细地址
					contacts:'',//联系人
					phoneNumber:'',//电话
					comment:'',//备注
				},
				provinceList:[],//省
				cityList:[],//市
				districList:[],//区
				
			}
		},
		created(){
			this.$store.dispatch('changeNavBarTitle', '地址信息')
		},
		watch:{
			
		},
		computed:{
			
		},
		mounted(){
			//获取地址信息
			this.getCustomerAddr()
			//获取省、直辖市
			this.getprovinceList()
		},
		methods:{
			submit(){
				if(!this.editForm.provinceCode) {
					this.$dialog.toast({
						mes: '请选择省/市',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.cityCode) {
					this.$dialog.toast({
						mes: '请选择市/区',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.districCode) {
					this.$dialog.toast({
						mes: '请选择区/县',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.detailedAddress) {
					this.$dialog.toast({
						mes: '请填写详细地址',
						timeout: 1500
					})
					return false
				}
				if(!this.editForm.contacts) {
					this.$dialog.toast({
						mes: '请填写联系人',
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
			save(){
				var params={
					id:this.editForm.id,//更新的id?
					provinceCode:this.editForm.provinceCode,
					cityCode:this.editForm.cityCode,
					districCode:this.editForm.districCode,
					cityName:this.editForm.cityName,
					districName:this.editForm.districName,
					provinceName:this.editForm.provinceName,
					detailedAddress:this.editForm.detailedAddress,
					longitude:this.editForm.longitude,
					latitude:this.editForm.latitude,
					contacts:this.editForm.contacts,
					phoneNumber:this.editForm.phoneNumber,
					customerId:this.editForm.customerId||this.$root.userInfo.typeCode,
					comment:this.editForm.comment,
				}
				var url='address/update'
				if(this.isAdd){
					url='address/create'
				}
				this.$dialog.loading.open('数据保存中...');
				this.postRequest(url, params).then(d => {
					this.$dialog.loading.close();
					if(d.data && d.data.state == 0) {
						this.isAdd=false;
						this.isEdit=false;
						if(url=='address/create'){
							this.form=d.data.aaData
						}else{
							this.getCustomerAddr()
						}
					}else{
						this.$dialog.toast({
		                    mes: d.data.msg,
		                    timeout: 1500,
		                    icon: 'error',
		                });
					}
				})
			},
			selectChange1(code){
				this.editForm.cityCode = '';
				this.editForm.districCode = '';
				this.editForm.areaId = ''
				this.editForm.areaName = ''
				this.cityList = [];
				this.getcityList(code)
				this.editForm.areaId = this.editForm.provinceCode
				this.editForm.areaName = this.getArea(this.editForm.provinceCode, this.provinceList)
			},
			selectChange2(code){
				this.editForm.districCode = '';
				this.editForm.areaId = ''
				this.editForm.areaName = ''
				this.districList = [];
				if(code) {
					this.getdistricList(code)
				}
				if(code) {
					this.editForm.areaId = this.editForm.provinceCode + '-' + this.editForm.cityCode
					this.editForm.areaName = this.getArea(this.editForm.provinceCode, this.provinceList) +
						'-' + this.getArea(this.editForm.cityCode, this.cityList)
				} else {
					this.editForm.areaId = this.editForm.provinceCode
					this.editForm.areaName = this.getArea(this.editForm.provinceCode, this.provinceList)
				}
			},
			selectChange3(code){
				console.log(code)
				if(this.editForm.districCode) {
					this.editForm.areaId = this.editForm.provinceCode + '-' + this.editForm.cityCode + '-' + this.editForm.districCode
					
					console.log(this.getArea(this.editForm.districCode, this.districList))
					
					this.editForm.areaName = this.getArea(this.editForm.provinceCode, this.provinceList) +
						'-' + this.getArea(this.editForm.cityCode, this.cityList) +
						'-' + this.getArea(this.editForm.districCode, this.districList)
//					this.$set(this.editForm,'areaName',areaName)
				} else {
					this.editForm.areaId = this.editForm.provinceCode + '-' + this.editForm.cityCode

					this.editForm.areaName = this.getArea(this.editForm.provinceCode, this.provinceList) +
						'-' + this.getArea(this.editForm.cityCode, this.cityList)
				}
			},
			getArea(code, arr) {
				var areaName = ''
				for(let a = 0; a < arr.length; a++) {
					if(code == arr[a].areaCode) {
						areaName = arr[a].areaName
						break
					}
				}
				return areaName
			},
			
			isEditFlg(){
				if(this.isEdit){
					this.isEdit=false
				}else{
					this.isEdit=true
					this.editForm=Object.assign({},this.editForm,this.form)
					this.editForm=Object.assign({},this.editForm,{areaName:this.editForm.provinceName+'-'+this.editForm.cityName+'-'+this.editForm.districName})
					if(this.editForm.provinceCode){
						this.getcityList(this.editForm.provinceCode)
					}
					if(this.editForm.cityCode){
						this.getdistricList(this.editForm.cityCode)
					}
					
					console.log(this.editForm.districCode)
				}
			},
			getCustomerAddr(){
				this.postRequest('address/queryByCustomerId', {
					customerId: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						if(resp.data.aaData){
							this.form = resp.data.aaData
						}else{
							this.isAdd=true;
							this.isEdit=true;
						}
						
					}
				})
			},
			//省
			getprovinceList(){
				this.postRequest('comArea/list', {
					level: 1
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.provinceList = d.data.aaData
					}
				})
			},
			//市
			getcityList(provinceCode){
				this.postRequest('comArea/list', {
					parentAreaCode: provinceCode,
					level: 2
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.cityList = d.data.aaData
					}
				})
			},
			//区、县
			getdistricList(cityCode){
				this.postRequest('comArea/list', {
					parentAreaCode: cityCode,
					level: 3
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.districList = d.data.aaData
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	#fAddr{
		.lable {
			width: 1.8rem;
			font-size: 0.3rem;
		}
		.list_span {
			text-align: right;
			width: 100%;
			color: #848484;
			font-weight: bold;
		}
		.item_right{
			
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
			select{
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
		}
	}
</style>