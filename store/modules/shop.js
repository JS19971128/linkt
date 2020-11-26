const state = {
	legalPerson:{
		
		corporateName:'',
		corporateIdNo:'',
		corporateTel:'',
		contactEmail:'',
		
		
		idCardStartDate:'',
		idCardEndDate:'',
		IDlabel:'短期',
		IDIndex:0,
		isIDLong:false
	}, //法人信息
	enterprise:{
		
		jylxLabel:'',
		industryType:'',
		companyName:'',
		shortName:'',
		nature:'',
		socialCreditCode:'',
		
		longTerm:'',
		businessDateStart:'',
		businessDateLimit:'',
		// businessLicense:''
	},//企业
	bank:{
		bankBranchName:'',
		bankName:'',
		cardNo:'',
		mobile:'',
		
		settleBankType:'',
		
		baneArea:'',
		baneDefaultRegion:["浙江省","杭州市"],
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
		openWishPic:'',
		defaultRegion:["浙江省","杭州市","滨江区"],
		latitude:'',
		longitude:'',
		comProvinceName:'',
		comCityName:''
	},
	merchantCredential:[
		{
			credentialType:'idNoFrontPic',
			credentialUrl:'',
			name:'正面'
		},
		{
			credentialType:'idNoBackPic',
			credentialUrl:'',
			name:'反面'
		},
		{
			credentialType:'storeFrontPic',
			credentialUrl:'',
			name:'证件补充' 
		},
		{
			credentialType:'licensePic',
			credentialUrl:'',
			name:'营业执照'
		},
		{
			credentialType:'permitPic',
			credentialUrl:'',
			name:'资质补充'
		},

		{
			credentialType:'bankCardFrontPic',
			credentialUrl:'',
			name:'正面'
		},
		{
			credentialType:'bankCardBackPic',
			credentialUrl:'',
			name:'反面'
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