<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		data(){
			return {
				url:''
			}
		},
		onLoad(res){
			this.url = res.pay_url;
		}
	}
</script>

<style>
</style>
