<template>
	<view class="container">
		<view class="main flex_center">
			<view class="fail flex_center">
				<uni-icons class="flex_center" type="closeempty" :size="48" color="#fff"></uni-icons>
			</view>
			<view class="notice">
				<view class="fz-16">付款失败</view>
				<view class="fz-12">请重新尝试付款</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.main{
		width: 100%;
		flex-direction: column;
		position: fixed;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		.fail{
			width: 90px;
			height: 90px;
			background: #F04141;
			border-radius: 50%;
		}
		.notice{
			line-height: 40rpx;
			margin-top: 30rpx;
			text-align: center;
			.fz-12{
				color: #999;
			}
			.fz-16{
				color: #333;
				font-weight: bold;
			}
		}
	}
</style>
