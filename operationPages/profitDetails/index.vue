<template>
	<view class="container">
		<view class="main">
			<view class="user_info flex_center">
				<view><image src="../../static/images/my/avatar.png" mode="widthFix"></image></view>
				<view class="fz-14">秃头小宝贝</view>
				<view class="fz-16">- 320.00</view>
			</view>
			<view class="order_info fz-12">
				<view class="flex_center item">
					<view class="title">交易状态</view>
					<view class="content">未支付</view>
				</view>
				<view class="flex_center item">
					<view class="title">交易单号</view>
					<view class="content flex_between">
						<view>20200523559966332255</view>
						<view class="copy flex_center">复制</view>
					</view>
				</view>
				<view class="flex_center item">
					<view class="title">分润时间</view>
					<view class="content">2020-05-23 12:45:14</view>
				</view>
				<view class="flex_center item">
					<view class="title">让利比例</view>
					<view class="content">10%</view>
				</view>
				<view class="flex_center item">
					<view class="title">消费金额</view>
					<view class="content">100元</view>
				</view>
				<view class="flex_center item">
					<view class="title">抵扣金额</view>
					<view class="content">20元</view>
				</view>
				<view class="flex_center item">
					<view class="title">实际分润</view>
					<view class="content">20元</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.container{
		padding-top: 20rpx;
		.main{
			width: 710rpx;
			background: #fff;
			border-radius: 8rpx;
			margin: 0 auto;
			padding: 0 30rpx;
			box-sizing: border-box;
			.user_info{
				flex-direction: column;
				padding: 50rpx 0;
				line-height: 44rpx;
				border-bottom: 2rpx dashed #DBDBDB;
				image{
					width: 100rpx;
				}
			}
			.order_info{
				padding-top: 20rpx;
				padding-bottom: 30rpx;
				.item{
					margin-top: 30rpx;
					.title{
						width: 25%;
						color: #999999;
					}
					.content{
						width: 75%;
						color: #333;
						.copy{
							width: 72rpx;
							height: 32rpx;
							border-radius: 16rpx;
							border: 2rpx solid #999999;
							color: #999;
							transform: scale(0.9);
						}
					}
				}
			}
		}
	}
</style>
