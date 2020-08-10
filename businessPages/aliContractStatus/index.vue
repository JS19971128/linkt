<template>
	<view class="container">
		<view class="main flex_center">
			<image src="../../static/images/business/review.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">{{status ? '签约完成' : '签约已提交'}}</view>
				<view class="fz-12">{{status ? '您的签约已完成，马上开始入驻吧~' : '您的签约已提交，等待支付宝审核中'}}</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" v-if="status" @click="goApply">马上入驻</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				status:0,
			}
		},
		methods:{
			goApply(){
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyOne/index'
				})
			}
		},
		onLoad:function(query){
			this.status = query.status
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		flex-direction: column;
		line-height: 40rpx;
		text-align: center;
		padding-top: 300rpx;
		image{
			width: 170rpx;
			display: block;
		}
		.tip{
			margin-top: 30rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background:  #FF9D11;
		color: #fff;
		margin: 0 auto;
		margin-top: 100rpx;
	}
	.notice{
		color: #ccc;
		margin-top: 20rpx;
		text-align: center;
	}
</style>
