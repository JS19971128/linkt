<template>
	<view class="bg">
		<!-- //收货地址 -->
		<view class="order-address" v-if="address" @click="choiceAddress">
			<view class="address-title">收货地址</view>
			<view class="address">
				<view class="address-name">{{address.userName}} {{address.telNumber}}</view>
				<view class="addres-xx">{{address.provinceName}} {{address.cityName}} {{address.countyName}} {{address.detailInfo}}</view>
			</view>
			<view class="address-more">
				<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="order-address" v-else @click="choiceAddress">请选择地址</view>
		<!-- 订单合计 -->
		<view class="order-goods">
			<view class="goods">
				<view class="goods-list" >
					<image class="goods-img" :src="drawDetails.listUrl"></image>
					<view class="goods-detail">
						<view class="goods-title">{{drawDetails.commodityName}}</view>
						<view class="goods-price"></view>
						<view class="goods-specs">
							<view class="specs-txt"></view>
							<view class="goods-num">x1</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="order-total">
				<view class="total-title">订单合计</view>
				<view class="order-price">￥{{needPay.priceTotal}}</view>
			</view> -->
		</view>
		<!-- 提交按钮 -->
		<view class="commodiy-btn">
			<view class="btn-price"></view>
			<button type="default" class="btn-go" @click="stm">确认订单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buyNumber: 1,
				isSpecs: true,
				address: '',
				total: 0,
				goods: [],
				orderNo:'',
				consumerInfo:{},
				needPay:{},
				drawDetails: ''
			}
		},
		computed:{
			orderMerchantId(){ //店铺id
				return this.$store.state.order.orderMerchantId;
			},
		},
		methods: {
			//获取地址栏
			choiceAddress() {
				let that = this;
				wx.chooseAddress({
					success: function(res) {
						that.address = res
						that.consumerInfo = {
							name: res.userName,
							areaCode: res.postalCode,
							mobile: res.telNumber,
							address: res.provinceName + ' ' + res.cityName + ' ' + res.countyName + ' ' + res.detailInfo
						}
					}
				})
			},
			getDrawDetails(id) {
				this.$fly.get(`/app/draw/` + id).then(res=>{
					if (res.code == 0) {
						this.drawDetails = res.data;
						this.drawDetails.drawPercent = Math.trunc(this.drawDetails.drawPercent * 100);
						// this.article = res.data.mainUrl.split(';');
						// this.description = res.data.description;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			stm() {
				let {
					consumerInfo
				} = this;

				if (Object.keys(consumerInfo).length == 0) return wx.showToast({
					title: '~请选择收货地址',
					icon: 'none',
					duration: 2500
				})
				
				this.$store.commit('SETADDRESS',consumerInfo); //存储地址栏
				
				uni.redirectTo({
					url: `/shoppingPages/payment/index`
				})
			},
		},
		onLoad(res) {
			console.log(res)
			this.getDrawDetails(res.id);
			if(!this.$store.state.userInfo.uid){
				this.$wxLogin();
			}
		}

	}
</script>

<style lang="scss" scoped>
	.bg {
		background: #f2f2f2;
		width: 100%;
		min-height: 100vh;
		padding-top: 40rpx;
	}

	.order-address {
		display: flex;
		background: #fff;
		padding: 30rpx;
		width: 100%;
		box-sizing: border-box;

		.address-title {
			color: #95989c;
			font-size: 28rpx;
			line-height: 1;
		}

		.address {
			display: flex;
			flex-direction: column;
			color: #282828;
			font-size: 28rpx;
			margin-left: 20rpx;
			flex: 1;
			padding-right: 10rpx;

			.address-name {
				margin-bottom: 20rpx;
				line-height: 1;
			}

			.addres-xx {
				line-height: 1;
			}
		}

		.address-more {
			width: 18rpx;
			height: 26rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.order-goods {
		display: flex;
		flex-direction: column;
		background: #fff;
		margin-top: 16rpx;

		.goods {
			display: flex;
			flex-direction: column;

			&-list {
				display: flex;
				padding: 20rpx 28rpx;
				border-bottom: 1px solid #e5e5e5;
			}

			&-img {
				width: 182rpx;
				height: 164rpx;
				margin-right: 18rpx;
			}

			&-detail {
				display: flex;
				flex: 1;
				flex-direction: column;

				.goods-title {
					font-size: 30rpx;
					color: #282828;
					margin-bottom: 20rpx;
				}

				.goods-price {
					font-size: 28rpx;
					line-height: 1;
					color: #ff9d12;
					margin-bottom: 20rpx;
				}

				.goods-specs {
					color: #95989c;
					display: flex;
					font-size: 26rpx;
					line-height: 1;
					justify-content: space-between;
				}
			}
		}

		.order-total {
			display: flex;
			padding: 20rpx;
			justify-content: space-between;
			font-size: 28rpx;
			color: #282828;
		}
	}

	.commodiy-btn {
		position: fixed;
		height: 100rpx;
		width: 100%;
		background: #fff;
		box-shadow: 0 0 10px #AAAAAA;
		display: flex;
		align-items: center;
		justify-content: space-between;
		bottom: 0;
		z-index: 999;
		padding: 0 30rpx;
		box-sizing: border-box;

		.btn-go {
			height: 75rpx;
			background: #ff9d12;
			border-radius: 52rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #fff;
			justify-content: center;
			width: 240rpx;
			margin: 0;
		}
	}
</style>
