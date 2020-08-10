<template>
	<view class="recommend">
		<view class="top fz-14 flex_between" @click="goList">
			<view class="flex_center">
				<image class="pic" src="../../static/images/home/recommend.png" mode="widthFix"></image>
				<view class="">推荐商家</view>
			</view>
			<image class="more" src="../../static/images/common/more_gray.png" mode="widthFix" v-if="recommendList.length>0"></image>
		</view>
		<scroll-view class="scroll-area fz-12" scroll-x="true" scroll-left="0" @scroll="scrollActive">
			<view class="scroll-item" v-for="(item,i) in recommendList" :key="item.id" @click="goStoreDetail(item)">
				<view class="shop">
					<image class="item-img" :src="item.shopUrl" mode="aspectFill"></image>
					<view class="discount flex_center">
						<view class="fz-10">Sale</view>
						<view class="fz-12">{{item.profits}}%</view>
					</view>
				</view>
				<view>{{item.shopNickName}}</view>
			</view>
		</scroll-view>
		<view class="scroll-bar" v-if="recommendList.length>4">
			<view class="scroll-active" :style="{left:slideLeft+'rpx'}"></view>
		</view>
		<view class="no_data flex_center" v-if="recommendList.length==0">
			<image class="no_img" src="../../static/images/operation/merchant_none.png" mode="widthFix"></image>
			<view class="tip">
				<view class="fz-14">暂无商家</view>
				<view class="fz-12">目前还没推荐商家呢~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'recommend',
		props:['recommend'],
		data() {
			return {
				slideLeft:'',
				windowWidth:'',
			}
		},
		computed:{
			recommendList(){
				return this.recommend;
			}
		},
		methods:{
			goList(){ // 进入商家列表页面
				if(this.recommendList.length <= 0){
					return
				}
				uni.navigateTo({
					url:'/pages/shopList/index?type=recommend'
				})
			},
			goStoreDetail(item){ // 进入商家详情页面
				uni.navigateTo({
					url:`/pages/shopDetails/index?id=${item.id}&discount=${item.profits}&start=${item.shopStartTime}&stop=${item.shopStopTime}&heat=${item.pageViews}&order=${item.orderCount}`
				})
			},
			getWindowWidth(){ // 获取屏幕宽度
				uni.getSystemInfo({ 
					success: (res) => {
						this.windowWidth = res.windowWidth;
					}
				})
			},
			scrollActive($event){ // 自定义滚动条
				// console.log($event)
				let total = ($event.detail.scrollWidth) * (750 / this.windowWidth) - 750;
				let scroll = ($event.detail.scrollLeft) * (750 / this.windowWidth);
				let scale = (scroll / total).toFixed(2);
				
				let result = 80 * scale;
				// console.log(total,scroll,scale,result)
				if(scale > 1){
					this.slideLeft = 80;
					return
				}
				this.slideLeft = result;
			}
		},
		mounted(){
			this.getWindowWidth();
		}
	}
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar{
	    width: 0;
	    height: 0;
	    color: transparent;
	}
	.recommend{
		background: #fff;
		padding-bottom: 20rpx;
		.top{
			padding: 0 20rpx;
			height: 33px;
			color: #333;
			border-bottom: 2rpx solid #DDDDDD;
			line-height: 28rpx;
			.pic{
				width: 10rpx;
				display: block;
				margin-right: 10rpx;
			}
			.more{
				width: 24rpx;
				display: block;
			}
		}
		.scroll-area{
			white-space: nowrap;
			.scroll-item{
				display: inline-block;
				padding: 20rpx;
				padding-bottom: 10rpx;
				line-height: 50rpx;
				text-align: center;
				.shop{
					width: 180rpx;
					height: 180rpx;
					position: relative;
					.item-img{
						width: 180rpx;
						height: 180rpx;
						display: block;
						border-radius: 8rpx;
					}
					.discount{
						width: 44rpx;
						height: 60rpx;
						background: url(../../static/images/home/discount.png) no-repeat;
						background-size: 100% 100%;
						flex-direction: column;
						position: absolute;
						top: 0;
						right: 10rpx;
						.fz-10{
							color: #EDEDED;
							line-height: 20rpx;
							transform: scale(0.8);
						}
						.fz-12{
							line-height: 24rpx;
							color: #fff;
							transform: scale(0.8);
						}
					}
				}
			}
		}
		.scroll-bar{
			width: 120rpx;
			height: 8rpx;
			border-radius: 4rpx;
			background: #E6E6E6;
			position: relative;
			margin: 0 auto;
			.scroll-active{
				position: absolute;
				left: 0;
				top: 0;
				width: 40rpx;
				height: 8rpx;
				border-radius: 4rpx;
				background: #FF9D11;
			}
		}
	}
	.no_data{
		flex-direction: column;
		text-align: center;
		padding-top: 30rpx;
		.no_img{
			width: 136rpx;
			display: block;
		}
		.tip{
			line-height: 40rpx;
			margin-top: 10rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
</style>
