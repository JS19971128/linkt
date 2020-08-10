<template>
	<view class="container">
		<!-- 已提交审核 -->
		<view class="" v-if="status">
			<view class="main flex_center">
				<image src="../../static/images/business/review.png" mode="widthFix"></image>
				<view class="tip">
					<view class="fz-14">已提交审核</view>
					<view class="fz-12">工作人员会在1-3个工作日内完成审核，请耐心等待</view>
				</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<view class="ali_sign">
				<view class="sign_btn fz-14 flex_center" @click="goSign">自主签约分账功能</view>
				<view class="fz-12 notice">商家完成签约服务后，才可以入驻链客平台，参与分账系统哦~</view>
			</view>
			<!-- #endif -->
			<!-- <view class="btn fz-14 flex_center" @click="goEditshopInfo">修改店铺资料</view> -->
			<!-- <view class="notice fz-12">如果店铺资料填错了，可以点击按钮修改</view> -->
		</view>
		<!-- 审核未通过 -->
		<view class="" v-else>
			<view class="main flex_center">
				<image src="../../static/images/business/unpass.png" mode="widthFix"></image>
				<view class="tip">
					<view class="fz-14">审核未通过</view>
					<view class="fz-12">{{note}}</view>
				</view>
			</view>
			<view class="btn fz-14 flex_center" @click="goApply">重新提交资料</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				status:1,
				note: '',
			}
		},
		methods:{
			goApply(){
				// #ifdef MP-ALIPAY
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyOne/index'
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url:'/businessPages/businessApplyOne/index'
				})
				// #endif
			},
			goEditshopInfo(){
				// #ifdef MP-ALIPAY
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyThree/index'
				})
				// #endif
			},
			goSign(){
				uni.navigateTo({
					url:'/businessPages/aliSign/index'
				})
			}
		},
		onLoad:function(query){
			this.status = query.status;
			this.note = query.note;
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		flex-direction: column;
		line-height: 40rpx;
		text-align: center;
		padding-top: 200rpx;
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
	.ali_sign{
		margin: 100rpx auto;
		.sign_btn{
			width: 670rpx;
			height: 38px;
			border-radius: 19px;
			background: #FF9D11;
			color: #fff;
			margin: 0 auto;
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		border: 2rpx solid #FF9D11;
		color: #FF9D11;
		background: #fff;
		margin: 0 auto;
		margin-top: 100rpx;
	}
	.notice{
		color: #ccc;
		margin-top: 20rpx;
		text-align: center;
	}
</style>
