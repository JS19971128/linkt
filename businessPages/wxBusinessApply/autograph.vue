<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		data(){
			return {
				url:'',
			}
		},
		computed:{
			legalPerson(){
				return this.$store.state.shop.legalPerson;
			},
			enterprise(){
				return this.$store.state.shop.enterprise;
			},
			shopIndex(){
				return this.$store.state.shop.shopIndex;
			},
			statusData(){
				return this.$store.state.shop.statusData;
			}
		},
		methods:{
			async init(){
				try{
					let {legalPerson,enterprise,shopIndex,statusData} = this;
					let prams = {
						...statusData
					};
					let url = `?email=${prams.email}&phone=${prams.phone}&legalPerson=${prams.legalPerson}&legalPersonID=${prams.legalPersonID}&signName=${prams.signName}&address=${prams.address}&`
					uni.showLoading({
						title:'加载中'
					})
					let signContract = await this.$fly.post('/entry/signContract'+url);
					this.url = signContract.data.data;
				}catch(e){
					uni.showToast({
					    title: '连接网络失败，请重试！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
					uni.hideLoading();
				}
			},
		},
		onLoad() {
			this.init()
		}
	}
</script>