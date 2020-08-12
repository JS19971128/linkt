<template>
	<view class="detail_details">
		<view class="info_show">
			<view class="top_avatar">
				<image class="src_image_avatar" src="" mode=""></image>
				<view class="title_name">秃头小宝贝秃头小宝贝</view>
				<view class="title_price">+1.23</view>
			</view>
			<view class="type_order">
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">类型</view> <view class="date_time">分账收益（商家回馈）</view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">订单号</view> <view class="date_time">分账收益（商家回馈）</view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">订单金额</view> <view class="date_time">分账收益（商家回馈）</view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">抵扣金额</view> <view class="date_time">分账收益（商家回馈）</view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">支付时间</view> <view class="date_time">分账收益（商家回馈）</view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">联系电话</view> <view  class="date_time">分账收益（商家回馈）</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss" scoped>
	.detail_details {
		min-height: 100vh;
		background-color: #EEEEEE;
		padding: 20rpx;
		box-sizing: border-box;
		.info_show {
			width:710rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			margin: 0 auto;
			padding: 50rpx 30rpx;
			box-sizing: border-box;
			.top_avatar {
				border-bottom: 2rpx dotted #DBDBDB;
				padding-bottom: 50rpx;
				text-align: center;
				.src_image_avatar {
					width:100rpx;
					height:100rpx;
					border-radius:6rpx;
					margin: 0 auto;
				}
				.title_name {
					font-size:30rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					margin-top: 18rpx;
					text-align: center;
				}
				.title_price {
					font-size:36rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,151,51,1);
					margin-top: 18rpx;
					text-align: center;
				}
			}
			.type_order {
				margin-top: 48rpx;
				.wrap_flex_nuxt {
					margin-bottom: 18rpx;
					font-size:24rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					.type_split_account {
						display: inline-block;
						width: 150rpx;
						font-size:24rpx;
						font-family:PingFang SC;
						font-weight:400;
						color:rgba(153,153,153,1);
					}
					.date_time {
						display: inline-block;
					}
				}
			}
		}
	}
</style>
