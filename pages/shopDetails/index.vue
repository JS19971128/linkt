<template>
	<view class="container">
		<view class="top">
			<view class="bg">
				<image :src="detail.shopUrl" mode="top"></image>
				<view class="cover"></view>
			</view>
			<view class="info flex_center">
				<view class="shop">
					<image :src="detail.shopUrl" mode="aspectFill"></image>
				</view>
				<view class="detail">
					<view class="fz-16 title">{{detail.shopNickName}}</view>
					<view class="discount flex_center">
						<view class="fz-14 coupon">最高可享{{profitsDiscount(lastData.discount)}}折</view>
						<view class="fz-12">营业时间：{{lastData.start}} - {{lastData.stop}}</view>
						<view class="heat flex_center">
							<view class="flex_center">
								<view><image src="../../static/images/common/heat.png" mode="widthFix"></image></view>
								<view class="fz-12">{{lastData.heat}}</view>
							</view>
							<view class="flex_center comment">
								<view><image src="../../static/images/common/order_quantity.png" mode="widthFix"></image></view>
								<view class="fz-12">{{lastData.order}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex_between address" @click="goHere">
				<view class="flex_center">
					<view class="location">
						<image src="../../static/images/common/location.png" mode="widthFix"></image>
					</view>
					<view class="fz-14">地址：<text>{{detail.contactAddress}}</text></view>
				</view>
				<view class="more">
					<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 商家相册 -->
		<view class="album">
			<view class="fz-14 title">商家相册</view>
			<view class="main flex_center">
				<view class="item" v-for="(item,i) in detail.shopImageUrl" :key="i" @click="previewImg(item)">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<!-- 商家商品 -->
		<view class="album" v-if="commodityDetail.length > 0">
			<view class="fz-14 title flex_text"><span>商家商品</span><span @click="lookMore">更多</span></view>
			<view class="main padding_bott flex_center">
				<view class="item_image_text" v-for="(item,i) in commodityDetail" :key="i" @click="goCommodity(item.id)">
					<image class="merchant_goods" :src="item.listUrl" mode="aspectFill"></image>
					<view class="commodity_name">{{item.commodityName}}</view>
					<view class="price_number">
						<view class="price">￥{{item.priceSale}}</view>
						<view class="sold">已售{{item.saleSum}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 去这里 -->
		<view class="btn flex_center">
			<view class="fz-14 flex_center" @click="goHere">去这里</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				lastData:{},
				detail:{},
				commodityDetail: ''
			}
		},
		methods:{
			profitsDiscount(profits){
				let price = this.profitClass(profits);
				let shop = ((price*10)*(0.7*10))/100; //70%可以用优惠券抵扣
				let transform = ((100*10)-(shop*10))/100; //100份分成10份算折扣
				return transform;
			},
			profitClass(number = 5){
				let num = Number(number);
				let profits = num;
				if(num>=6 && num<=11){  //商家让利6%-11%之间，消费10元拿出1%送0.1元夺宝券，剩下的5-10%用于分润和抵扣优惠券
					profits = num - 1
				}else if(num>=12 && num<=17){ //商家让利12%-17%之间，消费10元拿出2%送0.2元夺宝券，剩下的10-15%用于分润；
					profits = num - 2
				}else if(num>=18 && num<=23){  //商家让利18%-23%之间，消费10元拿出3%送0.3元夺宝券，剩下的15-20%用于分润；
					profits = num - 3
				}else if(num>=24 && num<=29){ //商家让利24%-29%之间，消费10元拿出4%送0.4元夺宝券，剩下的20-25%用于分润；
					profits = num - 4
				}else if(num===30){ //商家让利30%，消费10元拿出5%送0.5元夺宝券，，剩下的25%用于分润；
					profits = num - 5
				}
				return profits;
			},
			// 查看
			lookMore() {
				uni.navigateTo({
					url:`/shoppingPages/shop/index?merchantId=` + this.lastData.id
				})
			},
			getDetail(id){ //获取商户信息
				this.$fly.get(`/merchant/get?id=${id}`)
				.then(res=>{
					if(res.code == 0){
						res.data.shopImageUrl = res.data.shopImageUrl.split(',');
						this.detail = res.data;
						// 获取商品列表
						this.getCommodityList(this.$store.state.userInfo.id,res.data.id);
					}
				})
			},
			getCommodityList(id,merchantId) {
				this.$fly.get(`/app/mall/list?userId=${id}&merchantId=${merchantId}&size=3&sort=createDate,asc&page=0&commodityStatus=online`)
				.then(res=>{
					if(res.code == 0){
						const data = res.data.content;
						this.commodityDetail = data;
					}
				})
			},	
			//跳转商品详情页
			goCommodity(id){
				let str = `?id=${id}`;
				uni.navigateTo({
					url:`/shoppingPages/commodity/index${str}`
				})
			},
			// 图片预览
			previewImg(img){
				uni.previewImage({
					loop:true,
					current:img,
					urls: this.detail.shopImageUrl,
					success:res=>{
						console.log(res)
					}
				})
			},
			// 导航
			goHere(){
				this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?address=${encodeURI(this.detail.area+this.detail.contactAddress)}&key=${this.$store.state.mapKey}`)
				.then(res=>{
					console.log(res.result.location.lat)
					uni.openLocation({
						latitude: res.result.location.lat,
						longitude: res.result.location.lng,
						name: this.detail.contactAddress,
						address:res.result.title,
						success:res=>{
							console.log(res)
						},
						fail: (err) => {
							console.log(err)
						}
					})
				})
				.catch(err=>{
					console.log(err)
				})
			},
		},
		onLoad:function(query){
			this.lastData = query;
			this.getDetail(query.id);
			
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		// height: 360rpx;
		background: #fff;
		.bg{
			width: 100%;
			height: 57px;
			position: relative;
			// margin-bottom: -72rpx;
			image{
				width: 100%;
				height: 57px;
				display: block;
				filter: blur(10rpx);
			}
			.cover{
				width: 100%;
				height: 57px;
				background: rgba(0,0,0,.3);
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		.info{
			width: 100%;
			height: 125px;
			padding: 0 20rpx;
			padding-bottom: 30rpx;
			box-sizing: border-box;
			position: relative;
			margin-top: -36px;
			justify-content: flex-start;
			border-bottom: 2rpx solid #DDDDDD;
			.shop{
				image{
					width: 110px;
					height: 110px;
					display: block;
					border-radius: 8rpx;
				}
			}
			.detail{
				height: 110px;
				margin-left: 20rpx;
				.title{
					line-height: 36px;
					color: #fff;
					text-shadow: 0 4rpx 4rpx rgba(0,0,0,.2);
					font-weight: bold;
				}
				.discount{
					flex-direction: column;
					justify-content: space-around;
					align-items: flex-start;
					height: 74px;
					padding: 5px 0;
					// padding-top: 5px;
					box-sizing: border-box;
					color: #999;
					.coupon{
						color: #FF9D12;
					}
					.heat{
						justify-content: flex-start;
						image{
							width: 24rpx;
							display: block;
							margin-right: 10rpx;
						}
						.comment{
							margin-left: 20rpx;
						}
					}
				}
			}
		}
		.address{
			width: 100%;
			height: 40px;
			padding: 0 20rpx;
			box-sizing: border-box;
			.fz-14{
				color: #999;
				text{
					color: #333;
				}
			}
			.location{
				margin-right: 10rpx;
				image{
					width: 28rpx;
					display: block;
				}
			}
			.fz-12{
				width: 600rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.more{
				image{
					width: 24rpx;
					display: block;
				}
			}
		}
	}
	.album{
		margin-top: 20rpx;
		background: #fff;
		.flex_text {
			display: flex;
			justify-content: space-between;
		}
		.title{
			padding: 30rpx 20rpx;
			color: #999999;
		}
		.padding_bott {
			padding-bottom: 136rpx;
		}
		.main{
			padding-left: 30rpx;
			padding-right: 30rpx;
			flex-wrap: wrap;
			justify-content: flex-start;
			.item{
				margin: 0 22rpx;
				margin-bottom: 30rpx;
				image{
					width: 300rpx;
					height: 300rpx;
					display: block;
					border-radius: 8rpx;
				}
				.merchant_goods {
					width: 200rpx;
					height: 200rpx;
					display: block;
					border-radius: 8rpx;	
				}
				.commodity_name {
					font-size: 26rpx;
					color: #333;
					margin: 10rpx 0;
				}
				.price_number {
				    display: flex;
					justify-content: space-between;
					.price {
					   	color: #FF9D12;
						font-size: 24rpx;
					}
					.sold {
					   font-size: 24rpx;
					   color: #999999;
					}
				}
			}
			.item_image_text {
				margin: 0 15rpx;
				margin-bottom: 30rpx;
				// height: 320rpx;
				.merchant_goods {
					width: 200rpx;
					height: 200rpx;
					display: block;
					border-radius: 8rpx;	
				}
				.commodity_name {
					font-size: 26rpx;
					color: #333;
					margin: 10rpx 0;
					width: 200rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.price_number {
				    display: flex;
					justify-content: space-between;
					.price {
					   	color: #FF9D12;
						font-size: 24rpx;
					}
					.sold {
					   font-size: 24rpx;
					   color: #999999;
					}
				}
			}
		}
	}
	.btn{
		width: 100%;
		height: 106rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		view{
			width: 710rpx;
			height: 74rpx;
			background: #FF9834;
			color: #fff;
			border-radius: 37rpx;
		}
	}
</style>
