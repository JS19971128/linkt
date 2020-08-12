<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		data(){
			return {
				url:'http://test.trx.helipay.com/trx/merchantAgreement/signContract.action?body=RZclGF4PRyTRjOYaOqYzAS2EQeyEltS7VGpk1Bx2ScQSp%2B2hDilG6gZwyK8e0yFpbdbY%2B4C2O6beGxjDdgUszKJAIyTeLfrmC%2BZam3pNjiQIokAvCSxxYvyVgxOwAJvu4%2FaezdWYuYu%2BbWYxvlpqYI31b9DiqQhC7ICenPiPEy6U4SLp%2BFhn5ybv4tD9LEL2ehSKgZpeZjuSP1H52mDSmehwBEnaJfufPEq58GtSBcapX5cs3OzbDXCs0pp2FRUSctWGEz5TGk5N0fz5qWrWjR4fj2HRBBHXShMVKlMCeAaCVFLQdblDU0OBtr%2Fg1WBG3gEMtXKjXMYT2zF03dNHv5QtjAYHQePNOLrvN5rf5WbMIOuKcWdJwNJuCaRPK3r5xKNQxCrGPYzJzM8ITEKdovRRux5rTdaB&merchantNo=C1802466926&sign=fc54adb6960f8ffb87988c2db4466d90&interfaceName=signContract'
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
			}
		},
		methods:{
			async init(){
				try{
					let {legalPerson,enterprise,shopIndex} = this;
					let prams = {
						email:legalPerson.email,
						phone:legalPerson.linkPhone,
						legalPerson:legalPerson.legalPerson,
						legalPersonID:legalPerson.legalPersonID,
						signName:enterprise.signName,
						address:shopIndex.address
					};
					uni.showLoading({
						title:'加载中'
					})
					let signContract = await this.$fly.post('/entry/signContract',prams);
					debugger
					
				}catch(e){
					uni.showToast({
					    title: '连接网络失败，请重试！',
					    duration: 2000,
						icon:'none'
					});
				}finally{
					uni.hideLoading();
				}
			}
		},
		onLoad() {
			this.init()
		}
	}
</script>

<style>
</style>
