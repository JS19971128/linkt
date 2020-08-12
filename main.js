import Vue from 'vue'
import App from './App'
import store from './store'
import fly from './API'
import util from './common/util/util.js'
import websocket from './common/util/websocket'


Vue.prototype.$store = store
// 封装ajax
Vue.prototype.$fly = fly
// 公共方法
Vue.prototype.$util = util

Vue.config.productionTip = false

//#ifdef MP-WEIXIN
// 获取微信code
const getWxCode = ()=>{
	return new Promise((resolve,reject)=>{
		wx.login({
			success:res=>{
				// console.log(res)
				if(res.code){
					resolve(res.code);
				}else{
					reject();
				}
			},
			fail: err=>{
				reject(err)
			}
		})
	})
}
// 用拿到的code请求后台登录接口
const wxLogin = async ()=>{
	getWxCode().then(code=>{
		uni.showLoading({
			title:'加载中'
		})
		fly.get(`/user/getOpenId?code=${code}`)
		.then(res=>{
			uni.hideLoading();
			if(res.code!=0){
				uni.showToast({
					title: res.message,
					duration: 2000
				});
				return false;
			}
			// console.log('wx登录',res)
			// 保存用户信息
			// store.state.userInfo = res.data;
			store.commit('SETUSERINFO',res.data)
			websocket.init(res.data);
		})
		.catch(err=>{
			uni.showToast({
				title:'拉取openid失败！',
				duration: 2000
			});
			uni.hideLoading();
		})
	}).catch(err=>{
		uni.showToast({
			title:'接口请求失败！',
			duration: 2000
		});
		// console.error(err)
	})
}
Vue.prototype.$wxLogin = wxLogin;
//#endif

// #ifdef MP-ALIPAY
// 获取支付宝authcode
const getAliCode = ()=>{
	return new Promise((resolve,reject)=>{
		my.getAuthCode({
			scopes:'auth_user',
			success: res => {
				if(res.authCode){
					// console.log(res.authCode)
					resolve(res.authCode)
				}else{
					reject(res);
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}
// 根据获取到的authcode请求后台登录接口
const aliLogin = ()=>{
	getAliCode().then(code=>{
		uni.showLoading({
			title:'加载中'
		})
		fly.get(`/user/getAliUserId?code=${code}`)
		.then(res=>{
			// console.log('ali登录',res)
			uni.hideLoading();
			if(res.code == 0){
				// 保存用户信息
				store.state.userInfo = res.data;
			}
		})
		.catch(err=>{
			uni.hideLoading();
		})
	}).catch(err=>{
		// console.error(err)
		uni.showToast({
			title: err.authErrorScope.scope,
			icon: 'none'
		})
	})
}
Vue.prototype.$aliLogin = aliLogin;
// #endif

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
