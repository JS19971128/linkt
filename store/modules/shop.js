const state = {
	legalPerson:{
		legalPerson:'',
		legalPersonID:'',
		idCardStartDate:'yyyymmdd',
		idCardEndDate:'yyyymmdd',
		linkman:'',
		linkPhone:'',
		email:'',
	}, //法人信息
	enterprise:{},//企业
	bank:{},
	merchantCredential:[
		{
			credentialType:'FRONT_OF_ID_CARD',
			credentialUrl:'',
			name:'正面'
		},
		{
			credentialType:'BACK_OF_ID_CARD',
			credentialUrl:'',
			name:'反面'
		},
		{
			credentialType:'HANDHELD_OF_ID_CARD',
			credentialUrl:'',
			name:'手持证件照'
		},
		{
			credentialType:'BUSINESS_LICENSE',
			credentialUrl:'',
			name:'营业执照'
		},
		{
			credentialType:'PERMIT_FOR_BANK_ACCOUNT',
			credentialUrl:'',
			name:'开户许可证'
		},
		
	], //图片集合
}
const mutations = {
	SETLEGALPERSON(state,n){
		state.legalPerson = n;
	},
	SETENTERPRISE(state,n){
		state.enterprise = n;
	},
	SETBANK(state,n){
		state.bank = n;
	},
	SETMERCHANTCREDENTIAL(state,n){
		state.merchantCredential = n;
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