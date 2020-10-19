<template>
	<view class="container">
		<view class="main" v-if="!isShop">
			<view class="user_info flex_center">
				<view>
					<image :src="details.order.shopLogo" style="width: 150rpx;height: 150rpx;" mode="aspectFill"></image>
				</view>
				<view class="fz-14">{{details.order.shopName}}</view>
				<view class="fz-16">{{details.order.pricePaid > 0 ? '+' : '-'}}{{details.order.pricePaid}}</view>
			</view>
			<view class="order_info fz-12">
				<!-- <view class="flex_center item">
					<view class="title">支付状态</view>
					<view class="content">未支付</view>
				</view> -->
				<view class="flex_center item">
					<view class="title">订单号</view>
					<view class="content">{{details.order.orderNo}}</view>
				</view>
				<view class="flex_center item">
					<view class="title">订单金额</view>
					<view class="content">{{details.order.priceTotal}}</view>
				</view>
				<view class="flex_center item">
					<view class="title">抵扣金额</view>
					<view class="content">{{details.order.sharedCoupons}}</view>
				</view>
				<view class="flex_center item">
					<view class="title">支付时间</view>
					<view class="content">{{details.order.createDate}}</view>
				</view>
				<view class="flex_center item">
					<view class="title">商家地址</view>
					<view class="content flex_center">
						<view class="location">
							<image src="../../static/images/common/location.png" mode="widthFix"></image>
						</view>
						<view class="">{{details.contactAddress}}</view>
					</view>
				</view>
				<view class="flex_center item">
					<view class="title">联系电话</view>
					<view class="content flex_center">
						<view class="phone">
							<image src="../../static/images/common/phone.png" mode="widthFix"></image>
						</view>
						<view class="">{{details.phone}}</view>
					</view>
				</view>
			</view>
		</view>
		<block v-else>
			<view class="main">
				<view class="order_info fz-12">
					<view class="flex_center item">
						<view class="title">收货人</view>
						<view class="content">{{details.consigneePhone}}</view>
					</view>
					<view class="flex_center item">
						<view class="title">联系电话</view>
						<view class="content">{{details.consigneeName}}</view>
					</view>
					<view class="flex_center item">
						<view class="title">收货地址</view>
						<view class="content">{{details.addrInfo}}</view>
					</view>
				</view>
			</view>
			<view class="main" style="margin-top: 20rpx;">
				<view class="order_info fz-12">
					<view class="flex_center item">
						<view class="title">支付时间</view>
						<view class="content">{{details.createDate}}</view>
					</view>
				</view>
				<view class="goods">
					<view class="goods-list" v-for="it in details.commodities">
						<image :src="it.picture" mode="aspectFill"></image>
						<view class="info">
							<view class="fz-14">{{it.name}}</view>
							<view class="fz-12">{{it.commoditySpecName}} x{{it.count}}</view>
							<view class="fz-12">￥{{it.salePrice}}</view>
						</view>
					</view>
				</view>
				<view class="order_info fz-12">
					<view class="flex_center item">
						<view class="title">订单号</view>
						<view class="content">{{details.orderNo}}</view>
					</view>
					<view class="flex_center item">
						<view class="title">订单状态</view>
						<view class="content" :style="{color:returnOrderStatus(details.orderStatus).color}">{{returnOrderStatus(details.orderStatus).status}}</view>
					</view>
					<view class="flex_center item">
						<view class="title">订单金额</view>
						<view class="content">{{details.priceTotal}}</view>
					</view>
					<view class="flex_center item">
						<view class="title">支付时间</view>
						<view class="content">{{details.createDate}}</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				details: {},
				isShop: false
			}
		},
		methods: {
			getDetails(orderNo) {
				uni.showLoading({
					title: '加载中'
				})
				this.$fly.get(`/order/get?orderNo=${orderNo}`)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							let data = res.data;
							data.order.createDate = this.$util.formatTime(data.order.createDate);
							this.details = data;
							console.log(data)
						}
					})
					.catch(err => {
						console.log(err);
					})
			},
			returnOrderStatus(status) {
				switch (status) {
					case "Pending":
						return {
							color: "#FF0101",
							status: "未支付"
						};
					case "Paid":
						return {
							color: "#FF9834",
							status: "待发货"
						};
					case "Shipped":
						return {
							color: "#2998DF",
							status: "已发货"
						};
					case "NoCommented":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "Finished":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "Canceled":
						return {
							color: "#999999",
							status: "已取消"
						};
					default:
						return "";
				}
			},
			shopDetails(orderNo) {
				uni.showLoading({
					title: '加载中'
				})
				this.$fly.get(`/app/order/${orderNo}`)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							let data = res.data;
							data.createDate = this.$util.formatTime(data.createDate);
							this.details = data;
							console.log(data)
						}
					})
					.catch(err => {
						console.log(err);
					})
			}
		},
		onLoad: function(query) {
			if (query.isShop) {
				this.isShop = true
				this.shopDetails(query.orderNo);
			} else {
				this.getDetails(query.orderNo);
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 20rpx;

		.main {
			width: 710rpx;
			background: #fff;
			border-radius: 8rpx;
			margin: 0 auto;
			padding: 0 30rpx;
			box-sizing: border-box;

			.user_info {
				flex-direction: column;
				padding: 50rpx 0;
				line-height: 44rpx;
				border-bottom: 2rpx dashed #DBDBDB;

				image {
					width: 100rpx;
				}
			}

			.order_info {
				padding-top: 20rpx;
				padding-bottom: 30rpx;

				.item {
					margin-top: 30rpx;

					.title {
						width: 25%;
						color: #999999;
					}

					.content {
						width: 75%;
						color: #333;
						justify-content: flex-start;

						.location {
							margin-right: 10rpx;

							image {
								width: 28rpx;
								display: block;
							}
						}

						.phone {
							margin-right: 10rpx;

							image {
								width: 28rpx;
								display: block;
							}
						}
					}
				}
			}
		}
	}
	
	.goods-list {
		display: flex;
		border-bottom: 1px solid #eee;
		padding: 10rpx 0 20rpx;
		image {
			width: 50px;
			height: 50px;
			display: block;
			border-radius: 8rpx;
		}
	
		.info {
			margin-left: 20rpx;
			line-height: 36rpx;
	
			.fz-12 {
				color: #999999;
			}
		}
	}
</style>
