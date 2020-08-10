<template>
	<view class="category">
		<view class="main">
			<view class="total fz-12 flex_between">
				<view><text>全国商家：</text><text class="quantity">{{total.nationWideMerchantCount || 0}}万</text></view>
				<view><text>全国粉丝：</text><text class="quantity">{{total.nationWideMerchantFans || 0}}万</text></view>
				<view><text>本地粉丝：</text><text class="quantity">{{local || 0}}</text></view>
			</view>
			<scroll-view class="scroll-area fz-12" scroll-x="true" scroll-left="0" @scroll="scrollActive">
				<view class="scroll-item flex_center">
					<view class="item flex_center" v-for="(item,i) in list1" :key="i" @click="goList(item.id)">
						<view>
							<image class="item-img" :src="item.shopBusinessIcon" mode="aspectFit"></image>
						</view>
						<view>{{item.name}}</view>
					</view>
				</view>
				<view class="scroll-item flex_center">
					<view class="item flex_center" v-for="(item,i) in list2" :key="i" @click="goList(item.id,item.name)">
						<view>
							<image class="item-img" :src="item.shopBusinessIcon" mode="aspectFit"></image>
						</view>
						<view>{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="scroll-bar" v-show="list1">
				<view class="scroll-active" :style="{left:slideLeft+'rpx'}"></view>
			</view>
		</view>
		<!-- <view>
			<image class="ad" src="../../static/images/home/guanggao.png" mode="aspectFit"></image>
		</view> -->
	</view>
</template>

<script>
	export default{
		name:'businessCategory',
		props:['statistics','localFans','category'],
		data() {
			return {
				list1:[],
				list2:[],
				slideLeft:'',
				windowWidth:'',
				side:false,
				businessLength:10,
			}
		},
		computed:{
			total(){ //统计
				let data = this.statistics;
				if(data.nationWideMerchantCount && data.nationWideMerchantFans){
					data.nationWideMerchantCount = (data.nationWideMerchantCount / 10000).toFixed(1);
					data.nationWideMerchantFans = (data.nationWideMerchantFans / 10000).toFixed(1);
					return data;
				}
			},
			local(){
				return this.localFans;
			},
			businessType(){ //商户类型
				return this.category;
			}
		},
		watch:{
			businessType(val){
				let length = Math.ceil(val.length / 2),
				arr1 = [],
				arr2 = [];
				for(let i = 0;i < length; i++){
					arr1.push(val[i])
					if(val[i+length]){
						arr2.push(val[i+length])
					}
				}
				this.list1 = arr1;
				this.list2 = arr2;
			}
		},
		methods:{
			goList(id,name){ //进入商户列表页面
				uni.navigateTo({
					url:`/pages/shopList/index?id=${id}&type=category`
				})
			},
			getWindowWidth(){ //获取屏幕宽度
				uni.getSystemInfo({
					success: (res) => {
						this.windowWidth = res.windowWidth;
					}
				})
			},
			scrollActive($event){ //自定义滚动条
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
	.category{
		position: relative;
		padding: 20rpx;
		margin-top: -60rpx;
		.main{
			background: #fff;
			border-radius: 8rpx;
			padding-bottom: 10rpx;
			.total{
				padding: 20rpx;
				color: #999999;
				border-bottom: 2rpx solid #DDDDDD;
				.quantity{
					color: #FF9733;
				}
			}
			.scroll-area{
				// height: 277rpx;
				white-space: nowrap;
				.scroll-item{
					justify-content: flex-start;
					// display: inline-block;
					.item{
						padding: 20rpx 24rpx 0 24rpx;
						white-space: nowrap;
						display: flex;
						flex-direction: column;
						color: #333;
						line-height: 40rpx;
						.item-img{
							width: 80rpx;
							height: 80rpx;
							display: block;
							border-radius: 50%;
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
				margin: 20rpx auto;
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
		.ad{
			width: 100%;
			height: 180rpx;
		}
	}
	
</style>
