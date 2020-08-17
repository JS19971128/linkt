import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import goods from '@/store/modules/goods.js';//商城
import order from '@/store/modules/order.js';//订单
import shop from '@/store/modules/shop.js';//商家入驻进件


const store = new Vuex.Store({
   state: {
		baseUrl:'https://chainguest.3zone.net/api',
		// baseUrl:'https://v.liankedl.com/api',
		// baseUrl:'http://192.168.3.197:8566',  //shuguang
		// baseUrl:'http://192.168.3.150:8569', //xianwen
		// baseUrl:'http://192.168.3.148:8566', //liangrongcai
		// mapKey:'LUSBZ-5JYWP-NVMDR-VC5OY-FZI3F-OFBLO',
		
		webSocket:'wss://chainguest.3zone.net/api',
		baiduKey:'fUV7T6UmzIiGFr05ORbzj0NK',
		baiduSecret:'Pqbpv3sEO9WIuaBdLyva5czu3kM0ASED',
		
		mapKey:'L5ZBZ-4NTCP-UZ7D6-LXYJE-2KLKV-TLFPJ',
		scanCodeQuery:'',
		userInfo:{},
		bankInfo: '', // 选择银行卡信息储存
		uid:'',
		longitude: '', //首页经度
		latitude: '', //首页纬度
		regMobile:'', //注册账号
		countDownTime: '', //注册验证码倒计时
		form:{ //支付宝进件数据
			account: '', //支付宝账号
			contactName:'', //联系人名称
			contactMobile:'', //联系人手机号码
			contactEmail:'', //联系人邮箱
			mccCode:'', //经营类目编码
			specialLicensePic:'', //资质补充
			shopSignBoardPic:'', //门头照
			businessLicensePic:'', //营业执照
			businessLicenseNo:'', //执照号码
			longTerm:'',  //营业期限
			dateLimitation:'',  //期限日期
		},
		wxForm:{ //微信入驻数据
			legalName:'', //法人姓名
			
		},
		operatorData:{},//运营人员信息
		isSpecs:false,//选择规格状态
	},
   mutations: {
		SETUSERINFO(state,key){
			state.userInfo = key
		},
		SETISSPECS(state,status){
			state.isSpecs = status
		}
	},
   actions: {
		
	},
	modules:{
		goods,
		order,
		shop
	}
})

export default store