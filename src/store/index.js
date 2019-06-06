import Vue from 'vue'
import Vuex from 'vuex'

import Cart from './moudules/cart'
import Products from './moudules/products'
import ShopList from './moudules/ShopList'
import Address from './moudules/address'
import Order from './moudules/order'



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    quickUserInfo: {
      name: window.localStorage.getItem('quickUserInfo' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem(
        'quickUserInfo' || '[]')).username,
    },
    navBarTitle: '',
    isLoading: false,
    extendStr:''
  },
  getters:{
  	//YP表示一批和厂商，MD表示二批，配送商，门店GR表示个人
    extendStr:state=>{
    	var str=state.quickUserInfo.extend
    	if(str=='001'||str=='007'){
    		//一批、厂商
    		return state.extendStr='YP'
    	}else if(str=='002'||str=='004'||str=='008'){
    		//二批、门店、配送商
    		return state.extendStr='MD'
    	}else if(str=='005'){
    		//个人
    		return state.extendStr='GR'
    	}else if(str=='006'){
    		//自营平台
    		return state.extendStr='ZY'
    	}else{
    		
    		//管理员=
    		return state.extendStr='GL'
    	}
    	
    },
  },
  mutations: {
    login(state, quickUserInfo) {
      state.quickUserInfo = quickUserInfo;
      window.localStorage.setItem('quickUserInfo', JSON.stringify(quickUserInfo));
    },
    getQuickUserInfo(state,obj){
    	state.quickUserInfo = obj.userInfo;
    },
    //登录调用
    getExtendStr(state,obj){
    	if(obj.str=='001'||obj.str=='007'){
    		//一批、厂商
    		state.extendStr='YP'
    	}else if(obj.str=='002'||obj.str=='004'||obj.str=='008'){
    		//二批、门店、配送商
    		state.extendStr='MD'
    	}else if(obj.str=='005'){
    		//个人
    		state.extendStr='GR'
    	}else if(obj.str=='006'){
    		//自营平台
    		state.extendStr='ZY'
    	}else{
    		//管理员
    		if(SYSTEMID==7){
    			state.extendStr='GL'
    		}else{
    			state.extendStr=''
    		}
    	}

    },
    changeNavBarTitle(state, name) {
      state.navBarTitle = name;
      document.title = state.navBarTitle;
    },
    updateLoadingStatus(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
  	
    changeNavBarTitle({
      commit,
      state
    }, name) {
      commit('changeNavBarTitle', name)
    }
  },
  modules: {
    Cart,
    Products,
    Address,
    Order
  },
});
