<template>
	<view class="container">
		<!-- 已提交审核 -->
		<view class="" v-if="status">
			<view class="main flex_center">
				<image src="../../static/images/business/pass.png" mode="widthFix"></image>
				<view class="tip">
					<view class="fz-14">进件审核已通过</view>
					<view class="fz-12">现在可以正式在链客商业联盟中获取收益啦~</view>
				</view>
			</view>
			<!-- <view class="btn fz-14 flex_center" @click="goEditshopInfo">修改店铺资料</view> -->
			<!-- <view class="notice fz-12">如果店铺资料填错了，可以点击按钮修改</view> -->
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				status:1,
				note: '',
				signStatus:false,
				CopyUrl:''
			}
		},
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
		&.rz{
			background: #FF9D11;
			color: #fff;
		}
		&.nrz{
			background: #DDDDDD;
			border: 2rpx solid #DDDDDD;
			color: #fff;
		}
	}
	.notice{
		color: #ccc;
		margin-top: 20rpx;
		text-align: center;
	}
</style>
