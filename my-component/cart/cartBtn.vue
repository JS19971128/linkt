<template>
	<view class="cart" @click="cartUrl">
		<image src="../../static/images/shop/carthot.png" class="cart-img"></image>
		<view class="cart-txt">购物车</view>
	</view>
</template>

<script>
	export default{
		methods:{
			cartUrl(){
				uni.navigateTo({
					url:`/shoppingPages/cart/index`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cart{
		position:fixed;
		right: 20rpx;
		bottom: 20rpx;
		width:100rpx;
		height:100rpx;
		background:rgba(255,255,255,1);
		border:1rpx solid rgba(255, 234, 214, 1);
		box-shadow:1rpx 1rpx 8rpx 0px rgba(0, 0, 0, 0.25);
		border-radius:50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		&-img{
			width: 44rpx;
			height: 42rpx;
		}
		&-txt{
			color: #FF9D12;
			margin-top: 10rpx;
			font-size: 20rpx;
			line-height: 1;
		}
	}
</style>
