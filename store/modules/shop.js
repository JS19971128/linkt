const state = {
	legalPerson:{
		legalPerson:'',
		legalPersonID:'',
		idCardStartDate:'',
		idCardEndDate:'',
		linkman:'',
		linkPhone:'',
		email:'',
	}, //法人信息
	enterprise:{
		jylxLabel:'',
		merchantType:'',
		jylxIndex:0,
		jylxKey:'个体工商户',
		
		jylmLabel:'',
		merchantCategory:'',
		jylmIndex:0,
		jylmKey:'线下零售',
		
		jyhyIndex:0,
		jyhyLabel:'',
		industryTypeCode:'',
		
		regionCode:'',
		addressName:'',
		
		jyqxLabel:'',
		jyqxIndex:0,
		longTerm:true,
		
		signName:'',
		showName:'',
		businessLicense:'',
		businessDateStart:'',
		businessDateLimit:''
	},//企业
	bank:{
		settleBankType:'',
		bankName:'',
		bankCode:'',
		accountNo:''
	},
	shopIndex:{
		shopBusinessId:'',
		shopBusinessName:'',
		shopStartTime:'',
		shopStopTime:'',
		profits:'',
		areaCode:'',
		areaCodeCity:'',
		areaCodeAreas:'',
		area:'',
		address:'',
		positive:'', //门头照
		piclist:'', //内景照
		defaultRegion:["浙江省","杭州市","滨江区"],
		latitude:'',
		longitude:''
	},
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
	statusData:{
		email:'',
		phone:'',
		legalPerson:'',
		legalPersonID:'',
		signName:'',
		address:''
	}
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
	SETSHOPINDEX(state,n){
		state.shopIndex = n;
	},
	SETMERCHANTCREDENTIAL(state,n){
		state.merchantCredential = n;
	},
	SETSTATUSDATA(state,n){
		state.statusData = n;
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