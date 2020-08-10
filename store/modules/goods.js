const state = {
	popup: false, //增加库存弹出框
	releaseImg: [], //添加商品图片
	releaseSpecs: [], //添加商品规格
	releaseParamList: [], //添加商品规格列表
	releaseDetails: '', //添加商品详情
	merchantId:'', //商户id
	isSpecsModify:false, //是否修改了规格
	goodsProfits:0,//让利比存储
};
const mutations = {
	SHOWPOPUP(state, n) {
		state.popup = n;
	},
	//图片
	SETReleaseImg(state, n) {
		state.releaseImg = n;
	},
	//添加商品规格
	SETReleaseSpecs(state, n) {
		state.releaseSpecs = n;
	},
	//添加商品规格列表
	SETReleaseParamList(state, n) {
		state.releaseParamList = n;
	},
	//添加商品详情
	SETReleaseDetails(state, n) {
		state.releaseDetails = n;
	},
	//设置商户id
	SETMerchantId(state, n){
		state.merchantId = n;
	},
	//设置修改了规格
	SETIsSpecsModify(state, n){
		state.isSpecsModify = n;
	},
	// 设置让利比
	SETGoodsProfits(state, n){
		state.goodsProfits = n;
	}
	
};
const actions = {

};
const getters = {

};

export default {
	state,
	mutations,
	actions,
	getters
}
