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
		businessDateStart:'请选择营业执照上的经营起始时间',
		businessDateLimit:'请选择营业执照上的经营期限时间'
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
		shopStartTime:'开始时间',
		shopStopTime:'结束时间',
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
	SETSHOPINDEX(state,n){
		state.shopIndex = n;
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