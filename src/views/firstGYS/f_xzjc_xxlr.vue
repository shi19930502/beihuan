<template>
	<yd-layout id='fXzjcXxlr'>
		<div slot='top' class="header">
			<div>
				<a @click='goBack' class="header_left" href="javascript:;">上一步</a>
			</div>
			<div class="name">信息录入{{isEdit?'(编辑)':'(新增)'}}</div>
			<div @click='goNext'>
				<a href="javascript:;">完成</a>
			</div>
		</div>
		<div class="form">
			<div class="content_name_remark" v-if='form.statusId==4'>
				<div class="content_name_remark_title">失败原因</div>
				 
				<div @click="showRemark=showRemark?false:true" :class="{content_name_remark_c_s:showRemark}"  class="content_name_remark_c">
					{{form.remark}}
				</div>
			</div>
			<div v-if='$root.config.ssbhbgimg&&($store.state.extendStr=="GL"||$root.userInfo.extend=="001")' class="form_car" :class='{
					form_car_market:$root.userInfo.typeId=="merchant",
					form_car_transporterId:$store.state.extendStr=="YP"&&!transporterId
				}'>
				<div v-if='customer.extend=="001"&&transporterId'>{{form.transporterId}}</div>
				<div v-if='$root.userInfo.typeId!="merchant"' class="gys_name">{{form.wholesalerName}}</div>
			</div>
			<div class="goods_list">
				<div v-for='(item,index) in dataList' class="list">

					<div class="list_top_name list_margin">
						<div class="list_name list_name_f">
							<img v-if='item.isMuslim' class="qingzhen" src="../../assets/firstImgs/qingzhen.jpg" alt="" />
							<div class="list_name_c">{{item.productName}}<span v-if='item.skuName&&item.skuName!=null'> - {{item.skuName}}</span></div>
						</div>
						<img class="list_img" @click='delGoods(item,index)' src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" />
					</div>

					<div class="list_margin list_cs">
						<div class="list_c_left">
							<div class="list_margin_c">单价:{{item.price}}&nbsp;元&nbsp;/&nbsp;{{(selectList.find(o=>o.code==(item.skuMeasure||item.skuMeasureMethodCode))).name}}</div>
							<div>
								<span>{{(item.skuMeasure||item.skuMeasureMethodCode)=='001'||(item.skuMeasure||item.skuMeasureMethodCode)=='002'||(item.skuMeasure||item.skuMeasureMethodCode)=='003'?'重量:':'数量:'}}</span>
								<input :style='{border:item.weight?"1px solid #DDDDDD":"1px solid #ff3d15"}' @input='changeInput(item,"weight")' @blur='blurInput(item,"weight")' class="list_input" v-model='item.weight' type="text" placeholder="请输入" />
								
								<select v-if='item.skuMeasureMethodCode'  style="width: .8rem;color: #848484;border: 1px solid #D6D6D6;" class="select" name="" id="" v-model='item.skuMeasureMethodCode'>
									<option v-for='i in selectList' :key='i.code' :value="i.code">{{i.name}}</option>
								</select>
								<select  v-else-if='item.skuMeasure' style="width: .8rem;color: #848484;border: 1px solid #D6D6D6;" class="select" name="" id="" v-model='item.skuMeasure'>
									<option v-for='i in selectList' :key='i.code' :value="i.code">{{i.name}}</option>
								</select>
								<!--<span class="list_unit">{{item.measureMethodName}}</span>-->
							
							</div>
						</div>
						<div v-if='$root.userInfo.extend=="007"||$root.userInfo.extend=="004"||$root.userInfo.extend=="008"' class="list_c_right">
							<uploadOneImg class='upload_img' @success='successImg' @remove='removeImg' :detailId='item.id' :uploadNum='index' :autoUpload='true' :picUrl.sync='item.quarantPicUrl'>
							</uploadOneImg>
						</div>

					</div>

				</div>
				<template v-if='flGoods'>
					<div v-if='flGoods.length>0' v-for='(item,index) in flGoods' class="list">
						<div class="list_top_name list_margin">
							<div class="list_name">
								<span style="color: #ff3d15;">待上架 - </span>{{item.vulgo}}
							</div>
							<img class="list_img list_img_qz" style="margin-left: .2rem;" @click='delGoods(item,index,true)' src="../../assets/firstImgs/spgl_icon_delete@2x.png" alt="" />
						</div>

						<div class="list_margin list_cs">
							<div class="list_c_left">
								<div class="list_margin_c">
									<span>单价:</span>
									<input :style='{border:item.price?"1px solid #DDDDDD":"1px solid #ff3d15"}' @input='changeInput(item,"price")' @blur='blurInput(item,"price")' class="list_input" v-model='item.price' type="text" placeholder="请输入" />
									<span>元&nbsp;/&nbsp;{{item.name}}</span>
								</div>
								<div class="list_margin_c">
									<span>{{item.code=='001_1'||item.code=='002_1'||item.code=='003_1'?'重量:':'数量:'}}</span>
									<input :style='{border:item.weight?"1px solid #DDDDDD":"1px solid #ff3d15"}' @input='changeInput(item,"weight")' @blur='blurInput(item,"weight")' class="list_input" v-model='item.weight' type="text" placeholder="请输入" />
									<select @change="unitChange(item,item.code)" class="list_unit" style="width: .8rem;" v-model='item.code' name="" id="">
										<option v-for='i in selectList' :value="i.code+'_'+i.methodType">{{i.name}}</option>
									</select>
								</div>
								<div class="list_qz_bottom" v-if='customer.muslimfoodPermitPic'>
									<yd-radio-group v-model="item.isMuslim">
										<yd-radio val="0">非清真</yd-radio>
										<yd-radio val="1">清真</yd-radio>
									</yd-radio-group>
								</div>
							</div>
							<!--dataList.length>0?dataList.length-1+index:index-->
							<div v-if='$root.userInfo.extend=="007"||$root.userInfo.extend=="004"||$root.userInfo.extend=="008"' class="list_c_right">
								<uploadOneImg class='upload_img' @success='successImg' @remove='removeImg' :detailId='item.id' :autoUpload='true' :uploadNum='dataList.length+index' :picUrl.sync='item.quarantPicUrl'>
								</uploadOneImg>
							</div>
						</div>
					</div>
				</template>

				<div class="list_add" @click='addGoods'>
					添加商品
				</div>
			</div>
			<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>
			<div class="form_item time" v-if='form.inDate'>
				<div class="title">进场时间</div>
				<div class="item_right ces">
					<!--<input v-if='!isTel' placeholder="请选择时间" class="select_date" @blur='blurInput(form.inDate)' type="datetime-local" name="" id="" v-model='form.inDate' value="" />
					<yd-datetime v-else type="datetime" v-model="form.inDate" slot="right"></yd-datetime>-->
					<div class="pfsc">{{form.inDate}}</div>
				</div>
			</div>
			<div v-if='(dataList.length>0||flGoods.length>0)&&form.uploadDate' class="form_item time">
				<div class="title">编辑时间</div>
				<div class="item_right ces">
					<div class="pfsc">{{form.uploadDate}}</div>
				</div>
			</div>
			<div class="form_item " v-if='form.wholesaleMarketName&&form.wholesaleMarketId'>
				<div class="title ">批发市场</div>
				<div class="item_right pfsc">{{form.wholesaleMarketName}}({{form.wholesaleMarketId}})</div>
			</div>
			<div class="form_item ">
				<div class="title ">供应商</div>
				<div class="item_right pfsc" v-if='customer.name'>
					<!--{{form.wholesalerName||customer.name}}-->
					{{form.wholesalerName?form.wholesalerName:customer.name}}
				</div>
				<div class="item_right pfsc" v-else>
					{{form.wholesalerName?form.wholesalerName:'空'}}
				</div>
			</div>
			<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>
			<div v-if='(dataList.length>0||flGoods.length>0)'>
				<div class="form_item ">
					<div class="title ">凭证</div>
					<div class="item_right ">
						<select @change='selectListType(form.voucherType)' class="item_select" name="" v-model="form.voucherType" id="">
							<option value="" :disabled='isMd' selected>{{isMd?'请选择凭证类型(必选)':'凭证类型'}}</option>
							<option v-for='item in listType' :value="item.key">{{item.value}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<div v-if='form.voucherType' class="form_item ">
					<div class="title ">证号/编号</div>
					<div class="item_right ">
						<input maxlength="20" v-if='form.voucherType=="001"' type="text" v-model='form.tranId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="002"' type="text" v-model='form.animalQuarantineId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="003"' type="text" v-model='form.meatInspectionId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="004"' type="text" v-model='form.provId' placeholder="请输入详细号码(必填)" />
						<input maxlength="20" v-if='form.voucherType=="005"' type="text" v-model='form.vegInspectionId' placeholder="请输入详细号码(必填)" />
					</div>
				</div>
				<div v-if='form.voucherType' class="form_item item_img">
					<div class="title ">凭证图片</div>
					<!--voucherPic-->
					<div class="item_right upload_width_father">
						<div class="upload_width">

							<el-upload ref="upload" :data='{savePath: "productOnline"}' :file-list="fileList" :limit='1' :on-error='onError' :on-success='onSuccess' :on-change='imgChange' :accept='acceptImg' :action="imgAction" :auto-upload='autoUpload' list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
								<i class="el-icon-plus"></i>
							</el-upload>
						</div>
						<div v-if='isUpload' @click='uploadImg' class="upload_btn">上传图片</div>
						<el-dialog :fullscreen='true' :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt>
						</el-dialog>
					</div>
				</div>
				<div style="width: 100%;height: .2rem;background: #F5F5F9;"></div>
				<div class="form_item " style="border-bottom: none;">
					<div class="title ">选择产地名称</div>
				</div>
				<div class="form_item ">
					<div class="title ">省/市</div>
					<div class="item_right ">
						<select @change='selectChange1(form.provinceCode)' class="item_select" name="" v-model="form.provinceCode" id="">
							<option value="" disabled selected>请选择省/市(必选)</option>
							<option v-for='item in provinceList' :value="item.areaCode">{{item.areaName}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<div class="form_item ">
					<div class="title ">市/区</div>
					<div class="item_right ">
						<select @change='selectChange2(form.cityCode)' class="item_select" name="" v-model="form.cityCode" id="">
							<option value="" :disabled='isMd' selected>{{isMd?'请选择市/区(必选)':'请选择市/区'}}</option>
							<option v-for='item in cityList' :value="item.areaCode">{{item.areaName}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<div class="form_item ">
					<div class="title ">区/县</div>
					<div class="item_right ">
						<select @change='selectChange3(form.districCode)' class="item_select" name="" v-model="form.districCode" id="">
							<option value="" :disabled='isMd' selected>{{isMd?'请选择区/县(必选)':'请选择区/县'}}</option>
							<option v-for='item in districList' :value="item.areaCode">{{item.areaName}}</option>
						</select>
						<i class="icon"></i>
					</div>
				</div>
				<!--cd_name-->
				<div v-show='form.areaName' class="form_item ">
					<div class="title ">产地名称</div>
					<div class="item_right pfsc">
						<div>{{form.areaName?form.areaName:'请先选择完整的行政区'}}</div>
					</div>
				</div>
				<div v-show='form.areaId' class="form_item ">
					<div class="title ">产地编码</div>
					<div class="item_right pfsc">
						<div>{{form.areaId?form.areaId:'请先选择完整的行政区'}}</div>
					</div>
				</div>
				<div class="form_item ">
					<div class="title ">生产基地(种植户)</div>
					<div class="item_right ">
						<!--:placeholder="isMd?'请输入(必填)':'请输入'"-->
						<input maxlength="50" placeholder='请输入' v-model.trim='form.baseName' type="text" />
					</div>
				</div>
				<div v-if='customer.extend=="001"&&!transporterId' class="form_item ">
					<div class="title ">运输车牌号</div>
					<div class="item_right ">
						<input maxlength="20" type="text" v-model.trim='form.transporterId' :placeholder="customer.extend=='007'?'请输入':'请输入(必填)'" />
					</div>
				</div>
				<div v-else-if='customer.extend=="002"||customer.extend=="007"||customer.extend=="004"||customer.extend=="008"' class="form_item ">
					<div class="title ">运输车牌号</div>
					<div class="item_right ">
						<!--:placeholder="customer.extend=='007'?'请输入':'请输入(必填)'"-->
						<input maxlength="20" type="text" v-model.trim='form.transporterId' placeholder="请输入" />
					</div>
				</div>
			</div>

		</div>
	</yd-layout>
</template>

<script>
	import mixin_storage from '../../utils/mixin_storage.js'
	import { Upload, Dialog } from 'element-ui';
	import { Radio, RadioGroup } from 'vue-ydui/dist/lib.rem/radio';
	import uploadOneImg from '../component/uploadOneImg.vue'
	import Vue from 'vue'
	import axios from 'axios'
	Vue.use(Upload)
	Vue.use(Dialog)

	export default {
		mixins: [mixin_storage],
		components: {
			[Radio.name]: Radio,
			[RadioGroup.name]: RadioGroup,
			[Upload.name]: Upload,
			[Dialog.name]: Dialog,
			[uploadOneImg.name]: uploadOneImg,
		},
		data() {
			return {
				acceptImg: 'image/*',
				imgAction: '',
				autoUpload: false,
				fileList: [],
				dialogVisible: false,
				dialogImageUrl: '',
				isUpload: false,
				successUpload: false,
				form: {
					wholesaleMarketName: '',
					"wholesaleMarketId": "", //批发市场编号
					inDate: '',
					uploadDate: '',
					id: '',
					wholesalerName: '', //供应商名称
					wholesalerId: '', //供应商id
					voucherType: '', //凭证code
					voucherPic: '',
					provinceCode: '', //省、市
					cityCode: '', //市、区
					districCode: '', //区、县
					baseName: '', //生产基地
					areaId: '', //地址code
					areaName: '', //地址
					transporterId: '', //车牌号
					//五个凭证号
					meatInspectionId: '', //003
					provId: '', //004
					animalQuarantineId: '', //002
					tranId: '', //001
					vegInspectionId: '', //005
					remark:'',//失败原因
					statusId:'',
				},
				transporterId: '', //在外的车牌号，到时候通过form.transporterId=transporterId
				customer: {},
				isTel: false,
				listType: [],
				dataList: [],
				flGoods: [],
				//省市区县
				provinceList: [],
				cityList: [],
				districList: [],
				selectList: [],
				isMd: false,
				showRemark:false,
			}
		},
		created() {
			sessionStorage.setItem('XZJC_search', '')
			this.imgAction = ROOT_API + '/api/comm/fileUpload/file/imgUpload?token=' + this.$root.userInfo.token
		},
		watch: {
			dataList: {
				handler(val) {
					if(val.length <= 0) {
						//							wholesaleMarketName: '北环批发市场',
						//							"wholesaleMarketId": "510100002", //批发市场编号
						//							inDate: '',
						//							uploadDate: '',
						this.form.id = ''
						//							this.form.wholesalerName= '' //供应商名称
						this.form.wholesalerId = '' //供应商id
						this.form.voucherType = '' //凭证code
						this.form.voucherPic = ''
						this.form.provinceCode = '' //省、市
						this.form.cityCode = '' //市、区
						this.form.districCode = '' //区、县
						this.form.baseName = '' //生产基地
						this.form.areaId = '' //地址code
						this.form.areaName = '' //地址
						//							this.form.transporterId= '' //车牌号
						//五个凭证号
						this.form.meatInspectionId = '' //003
						this.form.provId = '' //004
						this.form.animalQuarantineId = '' //002
						this.form.tranId = '' //001
						this.form.vegInspectionId = '' //005

					}
				},
				deep: true
			}
		},
		computed: {

		},
		mounted() {
			if((sessionStorage.getItem('XZJC_edit') && sessionStorage.getItem('XZJC_edit') != '{}')||this.$route.query.mainId) {
				this.postRequest('measuremethod/list', {

				}).then(resp => {
					if(resp.data.state == 0) {
						this.selectList = resp.data.aaData
						this.init()
					}else{
						this.init()
					}
				})
			}else{
				this.init()
			}
			
		},
		methods: {
			successImg(picUrl, id) {

			},
			removeImg(id) {

			},
			//单位选择框变化
			unitChange(item, code) {
				var obj = this.selectList.find(o => {
					return o.code == code.split('_')[0]
				})
				item.name = obj.name
			},
			addGoods() {
				var arr = []
				if(!this.dataList) {
					this.dataList = []
				}
				for(let a = 0; a < this.dataList.length; a++) {
					arr.push(this.dataList[a].skuId)
				}
				console.log(this.flGoods)
				for(let a = 0; a < this.flGoods.length; a++) {
					arr.push('f_' + this.flGoods[a].categoryId)
				}
				var o = {
					checklist: arr,
					step: 2,
					checkGoods: this.dataList,
					flGoods: this.flGoods,
				}
				console.log(this.form)
				sessionStorage.setItem('XZJC_edit', JSON.stringify(o))
				sessionStorage.setItem('XZJC_search', '')
				this.$router.push({
					name: 'f_xzjc_xz',
					query: {
						mainId: this.$route.query.mainId,
						code: this.form.wholesalerId
					}
				})

			},
			delGoods(item, index, flg) {
				console.log(index)
				if(flg) {
					this.flGoods.splice(index, 1)
				} else {
					this.dataList.splice(index, 1)
				}

			},
			onError(err, file, fileList) {
				this.$dialog.loading.close();
				this.$dialog.toast({
					mes: '上传图片失败，请点击重新上传',
					timeout: 1500
				});
			},
			onSuccess(resp, file, fileList) {
				this.$dialog.loading.close();
				if(resp.state == 0) {
					this.$nextTick(() => {
						this.form.voucherPic = resp.aaData.path
						this.isUpload = false
						this.successUpload = true
						console.log(this.fileList)
					})
				} else {
					this.$nextTick(() => {
						this.$dialog.toast({
							mes: '图片上传失败,请重新选择！！',
							timeout: 1500
						});
						this.fileList = []
						this.isUpload = false
						var length = 0;
						this.$root.userInfo.extend == '007' ? length = this.dataList.length + this.flGoods.length : length = 0
						document.getElementsByClassName('el-upload')[length].style = 'display:inline-block'
					})
				}
			},
			imgChange(file, fileList) {
				console.log(file, fileList);
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
						var length = 0;
						this.$root.userInfo.extend == '007' ? length = this.dataList.length + this.flGoods.length : length = 0
						document.getElementsByClassName('el-upload')[length].style = 'display:none'
					}
				}
				return isLt2M;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//移除图片
			handleRemove(file, fileList) {
				this.isUpload = false;
				this.successUpload = false;
				this.successUpload = false;
				this.fileList = [];
				this.form.voucherPic = ''
				if(fileList.length < 1) {
					var length = 0;
					this.$root.userInfo.extend == '007' ? length = this.dataList.length + this.flGoods.length : length = 0
					document.getElementsByClassName('el-upload')[length].style = 'display:inline-block'
				}
			},
			uploadImg() {
				this.$dialog.loading.open('图片上传中...');
				this.$refs.upload.submit();
			},
			init() {
				//获取凭证类型
				this.getDatadic()

				//判断端
				this.isTel = this.$root.isPcOS()
				//判断是新增进来还是编辑进来
				console.log(this.isEdit)
				if(this.isEdit) {
					this.$store.dispatch('changeNavBarTitle', '编辑进场')
					//this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
					this.getMainAndDetail()
				} else {
					this.$store.dispatch('changeNavBarTitle', '新增进场')
					//					this.dataList = JSON.parse(localStorage.getItem('XZJC_add')).checkGoods
				}
				//二批供应商
				if(this.$route.query.url == 'xz' && (this.$store.state.extendStr == 'MD' || this.$root.userInfo.extend == '007')) {
					if(sessionStorage.getItem('XZJC_edit')) {
						this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
						this.flGoods = JSON.parse(sessionStorage.getItem('XZJC_edit')).flGoods || []
					}
				}
				//通过端判断用那个时间
				//if(this.isTel) {
				//					this.form.inDate = this.$root.getDate()
				//} else {
				//				2018-02-03T13:23
				//					this.form.inDate = this.$root.getDate().split(' ')[0] + 'T' + this.$root.getDate().split(' ')[1]
				//}
				//请求地址
				this.getprovinceList();
				//请求。。。只有门店的时候这个才有用
				if(this.$store.state.extendStr == 'MD' || this.$root.userInfo.extend == '007') {
					this.getCustomer(this.$root.userInfo.typeCode);
				}

			},
			getCustomerList(id) {
				this.postRequest('customer/list', {
					code: id
				}).then(resp => {
					if(resp.data.state == 0) {
						this.customer = Object.assign({}, this.customer, resp.data.aaData[0])
						if(this.customer.extend == "002" || this.customer.extend == "004" || this.customer.extend == "008") {
							this.isMd = true
						}
					}
				})
			},
			getCustomer(id) {
				this.postRequest('customer/getCustomerForWeiXin', {
					id: id
				}).then(resp => {
					if(resp.data.state == 0) {
						this.customer = Object.assign({}, this.customer, resp.data.aaData)
						if(this.customer.extend == "002" || this.customer.extend == "004" || this.customer.extend == "008") {
							this.isMd = true
						}
					}
				})
			},
			blurInput(val) {
				if(!val) {
					this.form.inDate = this.$root.getDate().split(' ')[0] + 'T' + this.$root.getDate().split(' ')[1]
				}
			},

			goBack() {
				//真通过进场页面的编辑进去，假表示
				if(this.$route.query.mainId) {
					if(JSON.parse(sessionStorage.getItem('XZJC_isJcgl'))) {
						this.$router.push({
							name: 'f_jcgl',
							query: {
								mainId: this.$route.query.mainId
							}
						})
					} else {
						this.$router.push({
							name: 'f_jcxq',
							query: {
								mainId: this.$route.query.mainId
							}
						})
					}
				} else {
					this.$router.push({
						name: 'f_jcgl',
					})
				}
			},
			goodsWeight(arr, str, msg) {
				var weightFlg = true;
				for(let a = 0; a < arr.length; a++) {
					if(!arr[a][str]) {
						weightFlg = false
						break
					}
				}
				if(!weightFlg) {
					this.$dialog.toast({
						mes: msg,
						timeout: 1500
					});
					return
				}
				return weightFlg
			},
			goNext() {

				if(this.dataList.length > 0 || this.flGoods.length > 0) {

				} else {
					this.$dialog.toast({
						mes: '请至少添加一样商品',
						timeout: 1500
					});
					return
				}

				if(!this.goodsWeight(this.dataList, 'weight', '进场重量不能为空')) {
					return
				}
				if(!this.goodsWeight(this.flGoods, 'weight', '进场重量不能为空')) {
					return
				}
				if(!this.goodsWeight(this.flGoods, 'price', '单价不能为空')) {
					return
				}
				if(this.$root.userInfo.extend == '007'||this.$root.userInfo.extend == '004'||this.$root.userInfo.extend == '008') {
					if(!this.goodsWeight(this.dataList, 'quarantPicUrl', '请上传检疫图片')) {
						return
					}
					if(!this.goodsWeight(this.flGoods, 'quarantPicUrl', '请上传检疫图片')) {
						return
					}
				}

				if(!this.form.voucherType && this.isMd) {
					this.$dialog.toast({
						mes: '请选择凭证类型',
						timeout: 1500
					});
					return
				}
				var str = 'tranId';
				if(this.form.voucherType == "001") {
					str = 'tranId'
				} else if(this.form.voucherType == "002") {
					str = 'animalQuarantineId'
				} else if(this.form.voucherType == "003") {
					str = 'meatInspectionId'
				} else if(this.form.voucherType == "004") {
					str = 'provId'
				} else if(this.form.voucherType == "005") {
					str = 'vegInspectionId'
				}
				if(this.isMd) {
					if(!this.form[str] || this.form[str] == null) {
						this.$dialog.toast({
							mes: '请输入证号/编号',
							timeout: 1500
						});
						return
					}
				} else {
					console.log(this.form[str])
					if(this.form.voucherType && (!this.form[str] || this.form[str] == null)) {
						this.$dialog.toast({
							mes: '请输入证号/编号',
							timeout: 1500
						});
						return
					}
				}

				if(!this.form.provinceCode) {
					this.$dialog.toast({
						mes: '请选择省/市',
						timeout: 1500
					});
					return
				}
				if(!this.form.cityCode && this.isMd) {
					this.$dialog.toast({
						mes: '请选择市/区',
						timeout: 1500
					});
					return
				}
				if(!this.form.districCode && this.isMd) {
					this.$dialog.toast({
						mes: '请选择区/县',
						timeout: 1500
					});
					return
				}
				//				if(!this.form.baseName && this.isMd) {
				//					this.$dialog.toast({
				//						mes: '请输入生产基地(种植户)',
				//						timeout: 1500
				//					});
				//					return
				//				}
				if(!this.form.transporterId && this.customer.extend == '001') {
					this.$dialog.toast({
						mes: '请输入车牌号',
						timeout: 1500
					});
					return
				}
				if(!this.$root.carReg(this.form.transporterId)) {
					this.$dialog.toast({
						mes: '请输正确的车牌号!',
						timeout: 1500
					});
					return
				}
				if(this.fileList.length > 0 && !this.successUpload) {
					this.$dialog.confirm({
						title: '提示：',
						mes: '你还有图片尚未上传，是否上传过后在保存？',
						opts: [{
								txt: '跳过直接保存',
								color: false,
								callback: () => {
									if(this.flGoods.length > 0) {
										this.saveFl().then(() => {
											this.save()
										})
									} else {
										this.save()
									}
								}
							},
							{
								txt: '去上传',
								color: true,
								callback: () => {

								}
							}
						]
					});
				} else {
					if(this.flGoods.length > 0) {
						this.saveFl().then(() => {
							this.save()
						})
					} else {
						this.save()
					}
				}

			},
			saveFl() {
				return new Promise((resolve, reject) => {
					var arr = [],
						flGoodsArr = [];
					flGoodsArr = this.flGoods
					this.flGoods.forEach((item) => {
						var o = {},
							obj = {};

						o.name = item.vulgo
						o.categoryId = item.categoryId
						o.gbgoodsId = item.categoryCode
						o.code = item.categoryCode
						o.skuPrice = item.price //先写死
						o.customerId = this.$root.userInfo.typeCode || this.customer.customerId
						o.productPicUrl = item.categoryPicURL
						o.measureMethod = item.code.split('_')[0]
						o.isMuslim = item.isMuslim

						obj.price = item.price
						obj.name = item.vulgo
						obj.basePrice = item.price
						obj.skuPicUrl = item.categoryPicURL
						obj.chargingModel = item.code.split('_')[1]
						//obj.skuWeight = item.weight
						obj.skuWeight = '1.00'
						obj.skuMeasure = item.code.split('_')[0]
						//						obj.purchaserId=this.customer.customerId
						obj.customerId = this.customer.customerId
						obj.isMuslim = item.isMuslim

						o.productSkuList = [obj];
						arr.push(o)
					})

					this.postRequest('product/batchAddAndUpdate', {
						jsonStr: JSON.stringify(arr),
					}).then(resp => {
						if(resp.data.state == 0) {
							//成功后删除fl_goods 的 session,并且设置XZJC_edit的session
							sessionStorage.setItem('fl_goods', '')
							this.flGoods = [];
							var dataArr = []

							resp.data.aaData.forEach((obj, index) => {
								var o = {}
								o.quarantPicUrl = flGoodsArr[index].quarantPicUrl
								o.weight = flGoodsArr[index].weight
								o.price = obj.productSkuList[0].price
								o.productName = obj.name
								o.productId = obj.id
								o.skuId = obj.productSkuList[0].id
								o.skuName = obj.productSkuList[0].name
								o.measureMethodName = (this.selectList.find(item => item.code == obj.productSkuList[0].skuMeasure)).name
								o.skuMeasure = obj.productSkuList[0].skuMeasure
								dataArr.push(o)
							})
							console.log(arr)
							this.dataList = this.dataList.concat(dataArr)
							//防止下一步失败
							var XZJC_edit = JSON.parse(sessionStorage.getItem('XZJC_edit'))
							XZJC_edit.checkGoods = this.dataList
							XZJC_edit.flGoods = [];
							this.dataList.forEach((item) => {
								XZJC_edit.flGoods.push(item.skuId)
							})
							console.log(this.dataList)
							resolve()
						} else {
							this.$dialog.toast({
								mes: '保存失败',
								timeout: 1500,
								icon: 'error',
								callback: () => {

								}
							});
						}
					})
				})
			},
			save() {
				var arr = [];
				var date = ''

				console.log(this.dataList.length)
				for(let a = 0; a < this.dataList.length; a++) {
					var o = {};

					o.tranId = this.form.tranId
					o.animalQuarantineId = this.form.animalQuarantineId
					o.meatInspectionId = this.form.meatInspectionId
					o.provId = this.form.provId
					o.vegInspectionId = this.form.vegInspectionId

					o.areaNameProvince = this.form.provinceCode
					o.areaNameCity = this.form.cityCode
					o.areaNameCountry = this.form.districCode

					o.areaName = this.form.areaName
					o.areaId = this.form.areaId
					o.baseName = this.form.baseName ? this.form.baseName : ''
					o.wsSupplierId = this.customer.extend ? this.customer.code : this.form.wholesalerId
					o.wsSupplierName = this.customer.extend ? this.customer.name : this.form.wholesalerName

					o.inDate = date ? date : this.form.inDate

					o.channelCode = this.$root.userInfo.typeCode
					
					o.skuMeasureMethodCode = this.dataList[a].skuMeasure||this.dataList[a].skuMeasureMethodCode
					
					o.weight = this.dataList[a].weight
					o.price = this.dataList[a].price
					o.productName = this.dataList[a].productName
					o.productId = this.dataList[a].productId
					o.skuId = this.dataList[a].skuId
					o.skuName = this.dataList[a].skuName
					o.quarantPicUrl = this.dataList[a].quarantPicUrl
					if(this.isMd) {
						o.statusId = 1
					}
					if(this.$root.userInfo.extend == '007'||this.$root.userInfo.extend == '004'||this.$root.userInfo.extend == '008' && !this.$route.query.mainId) {
						o.statusId = 0
					}
					arr.push(o)
				}
				var obj = {};
				obj.channelCode = this.$root.userInfo.typeCode
				obj.operationType = 'phone'
				obj.inDate = this.form.inDate
				if(this.form.id) {
					obj.id = this.form.id
				}

				obj.tranId = this.form.tranId
				obj.animalQuarantineId = this.form.animalQuarantineId
				obj.meatInspectionId = this.form.meatInspectionId
				obj.provId = this.form.provId
				obj.vegInspectionId = this.form.vegInspectionId
				//obj.remark = this.form.remark

				obj.areaName = this.form.areaName
				obj.areaId = this.form.areaId
				obj.baseName = this.form.baseName ? this.form.baseName : ''
				obj.wholesaleMarketName = this.form.wholesaleMarketName
				obj.wholesaleMarketId = this.form.wholesaleMarketId
				obj.wholesalerId = this.customer.extend ? this.customer.code : this.form.wholesalerId
				obj.wholesalerName = this.customer.extend ? this.customer.name : this.form.wholesalerName
				obj.voucherType = this.form.voucherType
				obj.voucherPic = this.form.voucherPic
				if(this.isMd) {
					obj.statusId = 1
				}
				if(this.$root.userInfo.extend == '007'||this.$root.userInfo.extend == '004'||this.$root.userInfo.extend == '008' && !this.$route.query.mainId) {
					obj.statusId = 0
				}
				var str = 'tranId';
				if(this.form.voucherType == "001") {
					str = 'tranId'
				} else if(this.form.voucherType == "002") {
					str = 'animalQuarantineId'
				} else if(this.form.voucherType == "003") {
					str = 'meatInspectionId'
				} else if(this.form.voucherType == "004") {
					str = 'provId'
				} else if(this.form.voucherType == "005") {
					str = 'vegInspectionId'
				}
				obj[str] = this.form[str]
				obj.transporterId = this.form.transporterId || ""
				obj.inmarketdetailList = JSON.stringify(arr);
				this.$dialog.loading.open('数据保存中...');
				//console.log(obj)
				this.postRequest('inmarketmain/save', obj).then(resp => {
					this.$dialog.loading.close();
					if(resp.data.state == 0) {
						if(this.isEdit) {
							sessionStorage.setItem('XZJC_isEdit', '')
							sessionStorage.setItem('XZJC_edit', '')
						} else {
							localStorage.setItem('XZJC_add', '')
						}
						this.$router.push({
							name: 'f_jcgl'
						})
					} else {
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
			selectListType() {
				this.form.tranId = ''
				this.form.animalQuarantineId = ''
				this.form.meatInspectionId = ''
				this.form.provId = ''
				this.form.vegInspectionId = ''
				this.fileList = [];
				this.form.voucherPic = ''
				this.isUpload = false
				if(this.form.voucherType) {
					this.$nextTick(() => {
						var length = 0;
						this.$root.userInfo.extend == '007' ? length = this.dataList.length + this.flGoods.length : length = 0
						document.getElementsByClassName('el-upload')[length].style = 'display:inline-block'
					})
				}
			},
			selectChange1(code) {
				this.form.cityCode = '';
				this.form.districCode = '';
				this.form.areaId = ''
				this.form.areaName = ''
				this.cityList = [];
				this.getcityList(code)
				this.form.areaId = this.form.provinceCode

				this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList)
			},
			selectChange2(code) {
				this.form.districCode = '';
				this.form.areaId = ''
				this.form.areaName = ''
				this.districList = [];
				if(code) {
					this.getdistricList(code)
				}
				if(code) {
					this.form.areaId = this.form.provinceCode + '-' + this.form.cityCode
					this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList) +
						'-' + this.getArea(this.form.cityCode, this.cityList)
				} else {
					this.form.areaId = this.form.provinceCode
					this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList)
				}
			},
			selectChange3() {
				//this.form.areaId = this.form.provinceCode + '-' + this.form.cityCode
				//this.form.areaId = this.form.areaId + '-' + this.form.districCode
				if(this.form.districCode) {
					this.form.areaId = this.form.provinceCode + '-' + this.form.cityCode + '-' + this.form.districCode

					this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList) +
						'-' + this.getArea(this.form.cityCode, this.cityList) +
						'-' + this.getArea(this.form.districCode, this.districList)
				} else {
					this.form.areaId = this.form.provinceCode + '-' + this.form.cityCode

					this.form.areaName = this.getArea(this.form.provinceCode, this.provinceList) +
						'-' + this.getArea(this.form.cityCode, this.cityList)
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
			//如果是编辑信息
			getMainAndDetail() {
				if(this.$route.query.mainId) {
					this.postRequest('inmarketdetail/mainAndDetail', {
						mainId: this.$route.query.mainId
					}).then(resp => {
						var inmarketSource=1
						if(resp.data.aaData.detail.length>0){
							inmarketSource=resp.data.aaData.detail[0].inmarketSource
						}
						if(!(resp.data.aaData.main.statusId == 1||resp.data.aaData.main.statusId == 4||inmarketSource==1)) {
							this.$dialog.confirm({
								title: '提示：',
								mes: '该条进场信息不能编辑，请查看其状态',
								opts: [{
									txt: '确定',
									color: true,
									callback: () => {
										this.$router.push({
											name: 'f_jcgl'
										})
									}
								}]
							});
						} else {
							var o = resp.data.aaData.main
							if(this.$route.query.url == 'xz') {
								this.dataList = JSON.parse(sessionStorage.getItem('XZJC_edit')).checkGoods
								this.flGoods = JSON.parse(sessionStorage.getItem('XZJC_edit')).flGoods || []
								console.log('this.flGoods', this.flGoods)
							} else {
								this.dataList = resp.data.aaData.detail
							}

							console.log('this.dataList', this.dataList)
							this.$nextTick(() => {
								this.form.inDate = o.inDate
								this.form.uploadDate = o.uploadDate
								this.form.voucherType = o.voucherType
								this.form.voucherPic = o.voucherPic
								if(o.voucherPic) {
									this.fileList = [{
										name: 'o.voucherPic',
										url: this.$root.imgURL + o.voucherPic
									}]
									this.$nextTick(() => {
										var length = 0;
										this.$root.userInfo.extend == '007' ? length = this.dataList.length + this.flGoods.length : length = 0
										document.getElementsByClassName('el-upload')[length].style = 'display:none'
										this.successUpload = true;
									})
								}
								this.form.wholesaleMarketId = o.wholesaleMarketId
								this.form.wholesaleMarketName = o.wholesaleMarketName
								this.form.baseName = o.baseName
								this.form.areaId = o.areaId
								this.form.areaName = o.areaName
								this.form.id = o.id
								this.form.wholesalerName = o.wholesalerName
								this.form.wholesalerId = o.wholesalerId
								this.form.transporterId = o.transporterId
								this.transporterId = o.transporterId
								this.form.remark=o.remark
								this.form.statusId=o.statusId
								this.form.meatInspectionId = o.meatInspectionId
								this.form.provId = o.provId
								this.form.animalQuarantineId = o.animalQuarantineId
								this.form.tranId = o.tranId
								this.form.vegInspectionId = o.vegInspectionId
								if(o.areaId) {
									this.form.provinceCode = o.areaId.split('-')[0]
									this.getcityList(this.form.provinceCode)
									this.form.cityCode = o.areaId.split('-')[1]
									this.getdistricList(this.form.cityCode)
									this.form.districCode = o.areaId.split('-')[2]
								}
							})
							return resp
						}
					}).then((resp) => {
						if(this.$store.state.extendStr != 'MD') {
							this.getCustomerList(resp.data.aaData.main.wholesalerId)
						}
					})
				}

			},
			//获取凭证号
			getDatadic() {
				this.postRequest('datadic/list', {
					dataType: 'VOUCHER_TYPE'
				}).then(resp => {
					console.log(resp.data)
					this.listType = resp.data.aaData
				})

			},
			/**
			 * 获取省列表
			 */
			getprovinceList() {
				this.postRequest('comArea/list', {
					level: 1
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.provinceList = d.data.aaData
					}
				})
			},
			/**
			 * 获取市列表
			 */
			getcityList(provinceCode) {
				this.postRequest('comArea/list', {
					parentAreaCode: provinceCode,
					level: 2
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.cityList = d.data.aaData
					}
				})
			},
			/**
			 * 获取县区列表
			 */
			getdistricList(cityCode) {
				this.postRequest('comArea/list', {
					parentAreaCode: cityCode,
					level: 3
				}).then(d => {
					if(d.data && d.data.state == 0) {
						this.districList = d.data.aaData
					}
				})
			},
			changeInput(item, str) {
				if(item[str]) {
					if(item[str].length > 9) {
						item[str] = item[str].slice(0, 9)
					}
					var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
						reg_2 = /^[0-9]{1,}$/;
					if(reg_1.test(item[str]) || reg_2.test(item[str])) {
						if(item[str] > 99999.99) {
							item[str] = '99999.99'
						}
					} else {
						if(item[str]) {
							item[str] = item[str].slice(0, item[str].length - 1)
							if(item[str] > 0) {

							} else {
								item[str] = ''
							}
						}
					}
				}
			},
			blurInput(item, str) {
				if(item[str] > 0) {
					item[str] = parseFloat(item[str]).toFixed(2)
				} else {
					item[str] = '1.00'
				}
			},
		}
	}
</script>
<style lang='scss'>
	#fXzjcXxlr {
		background: white;
		.form {
			font-size: .28rem;
			color: #848484;
			.content_name_remark{
				color: red;
				padding: .2rem .2rem 0.26rem .2rem;
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
					white-space: nowrap;
					text-overflow:ellipsis;
					overflow: hidden;
				}
				.content_name_remark_c_s{
					white-space: inherit;
					overflow: auto;
					text-overflow: initial;
				}
			}
			.form_car {
				/*height: 1.2rem;*/
				padding: .15rem .2rem;
				color: #018BE6;
				font-size: 'PingFang-SC-Heavy';
				/*display: flex;*/
				/*align-items: center;*/
				/*justify-content: space-around;*/
				text-align: center;
				font-size: .4rem;
				border-bottom: 1px solid #DDDDDD;
				.gys_name {
					color: #848484;
					font-size: .32rem;
				}
			}
			.form_car_market {
				height: 1.2rem;
				padding: .15rem .2rem;
				color: #018BE6;
				font-size: 'PingFang-SC-Heavy';
				display: flex;
				align-items: center;
				justify-content: space-around;
				text-align: center;
				font-size: .4rem;
				border-bottom: 1px solid #DDDDDD;
			}
			.form_car_transporterId {
				height: 0rem;
				padding: 0;
				border: none;
			}
			.goods_list {
				.list {
					font-size: .28rem;
					border-bottom: 1px solid #DDDDDD;
					margin-left: .2rem;
					padding: .26rem .2rem .26rem 0;
					color: #2F3927;
					.list_top_name {
						display: flex;
					}
					.list_margin {
						margin-bottom: .1rem;
						.list_margin_c {
							margin-bottom: .15rem;
						}
					}
					.list_cs {
						display: flex;
						justify-content: space-between;
						.list_c_right {
							width: 1.46rem;
							height: 1.46rem;
							margin-right: .2rem;
							#uploadImg {
								display: block;
								margin-top: 0;
								.el-upload-list__item {
									width: 1.46rem;
									height: 1.46rem;
								}
							}
							.upload_img {
								.el-upload {
									width: 1.46rem;
									height: 1.46rem;
									line-height: 1.46rem;
								}
							}
						}
					}
					.list_name {
						font-weight: bold;
						width: 3rem;
						flex-grow: 1;
						/*width: 2.3rem;*/
						color: #2F3927;
					}
					.list_name_f {
						display: flex;
						align-items: center;
						.qingzhen {
							flex-grow: 0;
							width: .4rem;
							height: .4rem;
							margin-right: .1rem;
						}
						.list_name_c {
							width: 1rem;
							flex: 1;
						}
					}
					.list_img_qz {
						width: .26rem;
						height: .3rem;
						flex-grow: 0;
						margin-left: .2rem;
					}
					.list_right {
						/*display: flex;
						align-items: center;
						flex-grow: 0;
						width: 3.66rem;
						img{
							margin-left: .2rem;
						}*/
					}
					.list_right_old {
						width: 3.16rem;
						flex-grow: 0;
						.list_right_top {
							display: flex;
							align-items: center;
							flex-grow: 0;
							width: 3.16rem;
							width: 100%;
							img {
								margin-left: .2rem;
							}
						}
						.list_qz_price {
							margin-top: .2rem;
						}
					}
					.list_qz {
						width: 3.16rem;
						flex-direction: column;
						.list_qz_top {
							display: flex;
							width: 100%;
							align-items: center;
							/*width: 3.26rem;*/
						}
						.list_qz_price {
							margin-top: .2rem;
							width: 100%;
							span {
								width: .8rem;
							}
							.list_input {
								width: 1.7rem;
							}
						}
						.list_qz_bottom {
							margin-top: .2rem;
						}
					}
					.list_input {
						text-align: center;
						margin: 0 .15rem;
						width: 2.2rem;
						outline: none;
						border: 1px solid #DDDDDD;
						padding: 0 .2rem;
					}
					.list_unit {
						width: 1rem;
						color: #848484;
					}
					.list_img {
						flex-grow: 0;
						margin-left: .2rem;
						display: block;
						width: .26rem;
						height: .3rem;
					}
				}
				.list_add {
					display: flex;
					align-items: center;
					height: .9rem;
					border-bottom: 1px solid #DDDDDD;
					margin-left: .2rem;
					font-size: .28rem;
					color: #018BE6;
					&:before {
						width: .38rem;
						height: .38rem;
						display: inline-block;
						content: '';
						background: url(../../assets/firstImgs/icon-add@2x.png) no-repeat;
						background-size: contain;
						margin-right: .12rem;
					}
				}
			}
			.form_item {
				padding: 0 .31rem 0 0rem;
				margin-left: .2rem;
				line-height: .88rem;
				display: flex;
				border-bottom: 1px solid #DDDDDD;
				.upload_btn {}
				.title {
					width: 2.3rem;
					margin-right: .07rem;
					color: #2F3927;
					font-weight: bold;
					flex-grow: 0;
				}
				.item_right {
					width: 4rem;
					display: flex;
					align-items: center;
					position: relative;
					flex-grow: 1;
					input {
						width: 100%;
						border: none;
						font-size: .28rem;
						color: #848484;
					}
					.item_select {
						width: 100%;
						line-height: .88rem;
						border: none;
					}
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
				}
				.upload_width_father {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.upload_btn {
						line-height: .4rem;
						background: #018BE6;
						color: white;
						padding: .1rem;
						border-radius: .1rem;
					}
				}
				.pfsc {
					color: #848484;
					opacity: .5;
				}
			}
			.item_img {
				line-height: 1;
				padding: .2rem;
			}
			.time {
				.item_right {
					display: flex;
					justify-content: space-between;
					font-family: 'PingFang-SC-Medium';
				}
			}
			.ces {
				.select_date::-webkit-outer-spin-button,
				.select_date::-webkit-inner-spin-button,
				.select_date::-webkit-clear-button {
					/*-webkit-appearance:none;*/
					/*margin:0;*/
					width: .4rem;
					height: .4rem;
				}
				input:invalid+span:after {
					content: '✖';
					padding-left: 5px;
				}
				input:valid+span:after {
					content: '✓';
					padding-left: 5px;
				}
			}
			.select_date {
				width: 100%;
				height: .4rem;
			}
			.select_time {
				color: #018BE6;
				input {
					/*width: ;*/
				}
			}
			.select {}
			.cd_name {
				border-bottom: none;
				.title {
					font-size: .3rem;
				}
			}
			.select_area {
				height: .88rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #DDDDDD;
				padding: 0 .2rem;
				select {
					width: 30%;
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
			z-index: 9999;
		}
		.el-dialog__wrapper {
			top: 1rem;
		}
	}
	
	.v-modal {
		z-index: 2 !important;
		display: none;
	}
</style>