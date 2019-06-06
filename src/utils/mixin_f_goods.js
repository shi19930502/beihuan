export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 12,
			fnishDataList: false,
			dataList: [],
		}
	},
	created() {
		
	},
	mounted() {

	},
	methods: {
		productskuFun(pamars, index, mes) {
			var url = 'productsku/update'
			if(index == 'url') {
				url = 'product/batchUpdate'
			}
			return new Promise((resolve, reject) => {
				this.postRequest(url, pamars).then(resp => {
					if(resp.data.state == 0) {
						this.$dialog.notify({
							mes: mes,
							timeout: 1000,
							callback: () => {

							}
						});
						if(index == 'url') {
							this.delDataList();
							this.checklist = []
							this.pageSize = this.dataList.length
							if(this.dataList.length <= 5 && !this.fnishDataList) {
								this.pageSize = 12
								this.look_list()
							}
						} else {
							if(index >= 0) {
								this.dataList.splice(index, 1)
								this.pageSize = this.dataList.length
								if(this.dataList.length <= 5 && !this.fnishDataList) {
									this.pageSize = 12
									this.look_list(this.navActiveNum)
								}
							}
						}
						resolve(true)
					} else {
						this.$dialog.notify({
							mes: '操作失败-_-!',
							timeout: 1000,
							callback: () => {

							}
						});
						resolve(false)
					}
				})
			})
		},
		loadList() {
			//product/queryList
			// category/getLastLevel
			this.postRequest('product/queryDtoList', {
				published: this.navActiveNum, //商品状态：1在售2下架
				keyWord: '',
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				customerId:this.$root.userInfo.typeCode
			}).then(resp => {
				this.$dialog.loading.close();
				if(resp.data && resp.data.state == 0) {
					console.log(this.dataList)
					for(let a = 0; a < resp.data.aaData.length; a++) {
						resp.data.aaData[a].isEdit = false
						resp.data.aaData[a].oldSkuPrice = resp.data.aaData[a].skuPrice
					}
					this.dataList = [...this.dataList, ...resp.data.aaData];
					console.log(this.dataList)
					if(this.dataList.length >= resp.data.dataCount) {
						/* 所有数据加载完毕 */
						this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
						this.fnishDataList = true
						return;
					}
					/* 单次请求数据完毕 */
					if(resp.data.aaData.length > 0) {
						this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
					}
					this.pageNum++;
				}
			})

		},
		changeInput(item,str='oldSkuPrice') {
			if(item[str]) {
				if(item[str].length > 9) {
					item[str] = item[str].slice(0, 9)
				}
				var reg_1 = /^([0-9]{1,}[.][0-9]*)$/,
					reg_2 = /^[0-9]{1,}$/;
				if(reg_1.test(item[str]) || reg_2.test(item[str])) {
					if(item[str] > 9999.99) {
						item[str] = '9999.99'
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
		blurInput(item,str='oldSkuPrice') {
			if(item[str] > 0) {
				item[str] = parseFloat(item[str]).toFixed(2)
			} else {
				item[str] = '1.00'
			}
		},
	}
}