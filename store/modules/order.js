const state = {
	consumerInfo:{}, //地址栏
	buyCommodityInfo:{},//购物车id等
	orderMerchantId:{}, //店铺id
	payCommission:0,//店铺手续费
}
const mutations = {
	SETBUYCOMMODITYINFO(state,n){ //设置购物车
		state.buyCommodityInfo = n;
	},
	SETADDRESS(state,n){ //设置地址栏
		state.consumerInfo = n;
	},
	SETORDERMERCHANTID(state,n){ //店铺id
		state.orderMerchantId = n;
	},
	SETPAYCOMMISSION(state,n){ //店铺手续费
		state.payCommission = n;
	}
}
const actions = {

};
const getters = {

};

export default{
	state,
	mutations,
	actions,
	getters
}