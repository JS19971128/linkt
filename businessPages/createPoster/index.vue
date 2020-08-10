<template>
	<view class="all">
		<view class="poster flex_center">
			<!-- #ifdef MP-ALIPAY -->
				<swiper class="swiper flex_center" :autoplay="false" :circular="true" previous-margin="100rpx" next-margin="100rpx" @change="changePoster">
					<swiper-item class="active-swiper" v-for="item in posterList" :key="item.id">
						<view class="swiper-item">
							<image :src="item.url" mode="aspectFit" :class="{active:current==item.id}"></image>
						</view>
					</swiper-item>
				</swiper>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
				<swiper class="swiper flex_center" :autoplay="false" :circular="true" previous-margin="150rpx" next-margin="150rpx" @change="changePoster">
					<swiper-item class="active-swiper" v-for="item in posterList" :key="item.id">
						<view class="swiper-item">
							<image :src="item.url" mode="aspectFit" :class="{active:current==item.id}"></image>
						</view>
					</swiper-item>
				</swiper>
			<!-- #endif -->
		</view>
		<view class="fz-16 choose">请选择您喜欢的海报模板</view>
		<view class="btn flex_center">保存至相册</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				current:0,
				posterList:[
					{id:0,url:'../../static/images/my/bg2.png'},
					{id:1,url:'../../static/images/my/bg2.png'},
					{id:2,url:'../../static/images/my/bg2.png'},
					{id:3,url:'../../static/images/my/bg2.png'},
					{id:4,url:'../../static/images/my/bg2.png'},
					{id:5,url:'../../static/images/my/bg2.png'},
					{id:6,url:'../../static/images/my/bg2.png'},
					{id:7,url:'../../static/images/my/bg2.png'},
				]
			}
		},
		methods:{
			changePoster($event){
				console.log($event)
				this.current = $event.detail.current;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.poster{
		background: #EEEEEE;
		padding: 100rpx 0;
		.swiper{
			// #ifdef MP-WEIXIN
			width: 626rpx;
			//#endif
			height: 480rpx;
			// #ifdef MP-ALIPAY
			// .active-swiper{
			// 	width: 326rpx;
			// 	height: 480rpx;
			// }
			// #endif
			.swiper-item{
				width: 326rpx;
				height: 480rpx;
				image{
					width: 326rpx;
					height: 480rpx;
					display: block;
					transform: scale(0.9);
				}
				.active{
					animation: bigger 0.5s ease forwards;
				}
				@keyframes bigger{
					from{
						transform: scale(0.9);
					}
					to{
						transform: scale(1);
					}
				}
			}
		}
	}
	.choose{
		color: #999999;
		text-align: center;
		line-height: 32rpx;
		margin-top: 50rpx;
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		color: #fff;
		background: #FF9D29;
		margin: 0 auto;
		margin-top: 140rpx;
	}
</style>
