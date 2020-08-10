<template>
	<view class="bg">
		<!-- banner -->
		<view class="swiper">
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :circular="true" :duration="1000">
				<swiper-item v-for="item in article" :key="item">
					<view class="swiper-item">
						<image class="banner-img" :src="item" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper-info" v-if="goods.isDraw">
				此商品参与消费夺宝券
			</view>
		</view>
		
		<!-- 商品基础信息 -->
		<view class="goods">
			<view class="goods-price">
				<view class="goods-price-info">
					<text class="symbol">￥</text>{{goods.priceSale}}
				</view>
				<view class="goods-price-txt">
					优惠券可折扣{{goods.profits}}%
				</view>
			</view>
			<view class="goods-title">
				<text class="goods-title-info">{{goods.isSelfManage?'直营':'商家'}}</text>
				{{goods.commodityName}}
			</view>
			<!-- <view class="goods-coupon">消费满100元可得夺宝券</view> -->
		</view>		
		<!-- 商品基础信息end -->
		<!-- 商品发货以及销量 -->
		<view class="address">
			<view class="address-name">
				<view class="address-name-info">发货
					<text class="info-address">{{goods.merchant && address(goods.merchant.area)}}</text>
				</view>
				<view class="address-express">快递：{{goods.freight || '免运费'}}</view>
			</view>
			<view class="address-sale">月销{{goods.monthSaleSum || 0}}</view>
		</view>
		<!-- 商品发货以及销量end -->
		<!-- 店铺详情 -->
		<view class="shop" @click="clickShop(goods.merchant.id)" v-if="!shop">
			<view class="shop-detail">
				<image class="shop-img" :src="goods.merchant.shopUrl"></image>
				<view class="shop-info">
					<view class="shop-title">{{goods.merchant.shopName}}</view>
					<view class="shop-sale">总销量：{{goods.merchant.totalSaleNum || 0}}</view>
				</view>
			</view>
			<view class="shop-btn">进店逛逛</view>
		</view>
		<!-- 店铺详情end -->
		<!-- 商品详情-->
		<view class="detail-item">
			<view class="detail-item-list active">
				商品详情
			</view>
		</view>
		<view class="detail-html">
			<rich-text :nodes="description"></rich-text>
			<!-- <view v-html="description"></view> -->
		</view>
		<!-- 商品详情 end-->
		<!-- 商品购买选择规格 -->
		<goods-specs :goods="goods" @onGoBtn="onGoBtn" ref="goods"></goods-specs>
		<!-- 商品购买选择规格 -->
		
		<!-- 购买浮动框 -->
		<view class="commodiy-btn" v-if="!isSpecs">
			<!-- <button type="default" class="btn-go" @click="isSpecsStatus">立即购买</button> -->
			<!-- <button type="default"></button> -->
			<view class="btns">
				<button type="default" class="btn-go" @click="cartUrl">加入购物车</button>
				<button type="default" class="btn-go red" @click="isSpecsStatus">立即购买</button>
			</view>
		</view>
		<!-- 购买浮动框 end-->
	</view>
</template>

<script>
	import goodsSpecs from '@/my-component/goodsSpecs/index'
	export default {
		data() {
			return {
				goods: {},
				article: [],
				description: '',
				commoditySpecList: [],
				isCart:false,
				shop:false
			}
		},
		components: {
			goodsSpecs
		},
		computed:{
			isSpecs(){
				return this.$store.state.isSpecs;
			},
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			}
		},
		methods: {
			//购买产品确认
			onGoBtn(e) {
				let specId = e.specification.id
				if(!specId) return wx.showToast({
				  title: '请选择商品规格',
				  icon: 'none',
				  duration: 2500
				})
				let commoditySum = e.buyNumber;
				let {goods,commodityId,userId} = this;
				let param = {
					specId,
					userId,
					commoditySum,
					commodityId,
				}
				
				uni.showLoading({
					title:'加载中'
				})
				
				//是否加入购物车
				if(!this.isCart){
					this.$fly.post(`/app/cart/needPay`,param).then(res => {
						uni.hideLoading();
						if(res.code!=0){
							wx.showToast({
							  title: res.message,
							  icon: 'none',
							  duration: 2500
							})
							return
						};
						this.$store.commit('SETBUYCOMMODITYINFO',param); //存储订单信息
						this.$store.commit('SETORDERMERCHANTID',goods.merchant.id); //存储merchantId
						uni.setStorageSync('needPay',res.data);
						if(this.shop){
							uni.redirectTo({
								url: `/shoppingPages/order/index`
							})
						}else{
							uni.navigateTo({
								url: `/shoppingPages/order/index`
							})
						}
						
					})
				}else{
					param.merchantId = goods.merchantId;
					this.$fly.post(`/app/cart/add`,param).then(res => {
						uni.hideLoading();
						wx.showToast({
						  title: res.message,
						  icon: 'none',
						  duration: 2500
						})
						if(res.code!=0){
							return
						};
						this.$store.commit('SETISSPECS',false);
					})
				}
			},
			//获取商品详情
			goodsDetails(id) {
				this.$fly.get(`/web/commodity/${id}`).then(res => {
					let {
						data
					} = res;
					if(!data||data.commodityStatus==="offline"){
						uni.showModal({
						    title: '温馨提示',
							confirmText: "知道了",
							showCancel: false,
						    content: '此商品已被删除或下架，请问需要返回吗？',
						    success: function (res) {
						        if (res.confirm) {
									uni.navigateBack();
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
						return ;
					}
					this.goods = data;
					this.article = data.mainUrl.split(';');
					this.description = data.description.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ');
					uni.setNavigationBarTitle({
					　　title:data.commodityName
					})
				})
			},
			//弹出框状态
			isSpecsStatus(){
				this.$store.commit('SETISSPECS',true);
				this.$refs.goods.Init();
				this.isCart = false;
			},
			//加入购物车
			cartUrl(){
				this.isSpecsStatus();
				this.isCart = true;
			},
			//跳转到店铺页面
			clickShop(id){
				uni.navigateTo({
					url:`/shoppingPages/shop/index?merchantId=${id}`
				})
			},
			address(res){
				let arr = res.split(' ');
				return arr[1]+arr[2]
			}
		},
		onLoad(op) {
			let {
				id,
				shop,
			} = op;
			this.shop = shop || '';
			this.commodityId = Number(id);
			this.goodsDetails(id);
		},
		onUnload(){
			this.$store.commit('SETISSPECS',false);
		}

	}
</script>

<style lang="scss" scoped>
	.bg {
		background: #f2f2f2;
		padding-bottom: 100rpx;
	}

	.swiper {
		height: 750rpx;
		position: relative;
		&-info{
			width:300rpx;
			height:48rpx;
			background:rgba(255,152,52,1);
			box-shadow:0px 10px 12rpx 0px rgba(0, 0, 0, 0.1);
			border-radius:0px 24rpx 24rpx 0px;
			position: absolute;
			left: 0;
			top: 50rpx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size:26rpx;
			line-height:32px;
		}
		.swiper-item {
			.banner-img {
				width: 750rpx;
				height: 750rpx;
			}
		}
	}


	.goods{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		background: #fff;
		&-price{
			display: flex;
			align-items: flex-end;
			margin-bottom: 25rpx;
			line-height: 1;
			&-info{
				display: flex;
				font-size:46rpx;
				align-items: flex-end;
				color:rgba(255,152,52,1);
				.symbol{
					font-size:28rpx;
					line-height: 1.2;
				}
			}
			&-txt{
				margin-left: 30rpx;
				font-size:26rpx;
				color:rgba(254,69,69,1);
			}
		}
		&-title{
			font-size:30rpx;
			font-weight:bold;
			line-height: 42rpx;
			overflow : hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			&-info{
				background:rgba(255,152,52,1);
				border-radius:16rpx;
				font-size:24rpx;
				color:rgba(255,255,255,1);
				line-height: 32rpx;
				text-align: center;
				margin-right: 10rpx;
				padding: 5rpx 10rpx;
			}
		}
		&-coupon{
			margin-top: 20rpx;
			margin-bottom: 10rpx;
			background:rgba(255,220,220,1);
			border:2rpx solid rgba(255, 176, 176, 1);
			border-radius:8rpx;
			font-size:24rpx;
			color:rgba(255,96,96,1);
			line-height:1;
			width:286rpx;
			height:44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
		}
	}

	.address{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		background: #fff;
		margin: 20rpx 0;
		color: #999999;
		font-size: 26rpx;
		display: flex;
		justify-content: space-between;
		.address-name{
			display: flex;
			align-items: center;
			.address-name-info{
				display: flex;
				align-items: center;
				.info-address{
					margin-left: 20rpx;
					margin-right: 16rpx;
					color: #333;
				}
			}
			.address-express{
				color: #333;
				box-shadow:- 1px 0 0 0 #DCDCDC;
				padding-left: 20rpx;
			}
		}
	}
	
	.shop{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		background: #fff;
		margin: 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-detail{
			display: flex;
			align-items: center;
		}
		&-img{
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		&-info{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			height: 90rpx;
		}
		&-title{
			font-size:28rpx;
			font-weight:bold;
			color:rgba(51,51,51,1);
			line-height:1;
		}
		&-sale{
			font-size:24rpx;
			font-weight:bold;
			color:rgba(153,153,153,1);
			line-height:1;
		}
		&-btn{
			padding: 0rpx 20rpx;
			background: #FF9834;
			height: 48rpx;
			border-radius: 24rpx;
			font-size:24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color:#fff;
		}
	}
	
	.detail-item {
		box-sizing: border-box;
		width: 100%;
		margin: 20rpx 0;
		padding:0 20rpx 15rpx;
		display: flex;
		.detail-item-list {
			box-sizing: border-box;
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			line-height: 1;
			color: #999999;
			margin-right: 80rpx;
			&.active{
				color: #FF9834;
				position: relative;
				&::after{
					display: block;
					content: '';
					color: #FF9733;
					width: 20rpx;
					height: 10rpx;
					background: url(../../static/images/home/tab_icon.png) no-repeat;
					background-size: 100% 100%;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -15rpx;
				}
			}
		}
	}
	.detail-html {
		padding: 40rpx 24rpx;
		background: #fff;

		img {
			max-width: 100%;
		}
	}

	.commodiy-btn {
		position: fixed;
		height: 100rpx;
		width: 100%;
		background: #fff;
		box-shadow:0px 0px 10px rgba(222,222,222,1);
		display: flex;
		bottom: 0;
		z-index: 999;
		justify-content: center;
		padding: 16rpx 20rpx;
		box-sizing: border-box;
		.btns{
			display: flex;
			align-items: center;
			margin-left: auto;
		}
		.btn-go {
			height: 74rpx;
			background: #ff9d12;
			border-radius: 36rpx;
			margin-left: 20rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: #fff;
			justify-content: center;
			width: 220rpx;
			box-sizing: border-box;	
			&.red{
				background: #FF2C2C;
			}
		}

		&.active {
			box-shadow: none;
		}
	}

	
</style>
