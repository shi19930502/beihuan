export default {
	data() {
		return {
			businessScope: '',
			codeList: [],
			gbgoodsId: '',
			goodsCodeList: [],
		}
	},
	created() {

	},
	async mounted() {
		if(localStorage.getItem('quick_gbgoodsId')&&localStorage.getItem('quick_gbgoodsId')!=null){
			this.gbgoodsId=localStorage.getItem('quick_gbgoodsId')
		}
	},
	watch:{
		gbgoodsId:function(val){
			this.searchList(val)
		}
	},
	methods: {
		searchList(val){
			var val=this.gbgoodsId
			var str=''
			if(this.$route.name=='f_xzjc_xz'){
				str='categoryCode'
			}else {
				str='f_code'
			}
			this.gbgoodsIdChange(val,str)
		},
		//查询list
		getBusinessScope() {
			return new Promise((resolve, reject) => {
				this.postRequest('customer/list', {
					id: this.$root.userInfo.typeCode
				}).then(resp => {
					if(resp.data.state == 0) {
						resolve(resp.data.aaData[0].businessScope);
					}
				})
			})
		},
		getCustomerList(params) {
			return new Promise((resolve, reject) => {
				this.postRequest('customer/list', params).then(resp => {
					if(resp.data.state == 0) {
						resolve(resp.data.aaData[0]);
					}
				})
			})
		},
		//查询分类
		getTopCategoryListByCode(businessScope) {
			this.postRequest('category/getTopCategoryListByCode', {
				codes: businessScope ? businessScope : ''
			}).then(resp => {
				if(resp.data.state == 0) {
					this.codeList = resp.data.aaData
				}
			})
		},
		gbgoodsIdChange(val,str) {
			localStorage.setItem('quick_gbgoodsId',val)
			this.AZ = []
			var arr = []
			this.goodsCodeList.forEach((o) => {
				if(o[str].slice(0, val.length) == val) {
					arr.push(o)
				}
			})
			//注意下面的两行写法。必须的，如果不清空，使用的是缓存DOM，
			//清空过后，在nextTick，页面重载goodsData，不知道为啥上面的:key没有生效
			this.goodsData = []
			this.$nextTick(() => {
				this.countArr(arr)
			})
		},
	}
}