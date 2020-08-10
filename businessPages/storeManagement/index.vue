<template>
	<view class="bg">
		<view class="tab fz-14 flex_center">
			<view :class="{active:type == 'main'}" @click="changeTab('main')">主店信息</view>
			<!-- <view :class="{active:type == 'chain'}" @click="changeTab('chain')">连锁店信息</view> -->
		</view>
		<!-- 主店信息 -->
		<main-store :show='type=="main" ? true : false' :info="mainInfo"></main-store>
		<!-- 连锁店信息 -->
		<chain-store :show='type=="chain" ? true : false'></chain-store>
	</view>
</template>

<script>
	import mainStore from './mainStore/index.vue';
	import chainStore from './chainStore/index.vue';
	export default{
		components:{
			mainStore,
			chainStore
		},
		data() {
			return {
				type:'main',//main chain
				mainInfo:{}
			}
		},
		methods:{
			changeTab(type){
				this.type = type;
			},
			getMerchant(){ //获取主店信息
				this.$fly.get(`/merchant/getMerchantByUserId/${this.$store.state.userInfo.id}`)
				.then(res=>{
					if(res.code == 0){
						this.mainInfo = res.data.merchant;
					}
				})
			},
		},
		onLoad:function(){
			this.getMerchant();
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		min-height: 100vh;
		padding-bottom: 30rpx;
		.tab{
			padding: 30rpx 0;
			view{
				flex: 1;
				text-align: center;
				line-height: 28rpx;
				color: #999999;
			}
			.active{
				position: relative;
				color: #FF9834;
				&::after{
					display: block;
					content: '';
					width: 20rpx;
					height: 10rpx;
					background: url(../../static/images/home/tab_icon.png) no-repeat;
					background-size: 100% 100%;
					position: absolute;
					top: 35rpx;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
	}
</style>
