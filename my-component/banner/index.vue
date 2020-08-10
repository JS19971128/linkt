<template>
	<view class="banner">
		<!-- 公告 -->
		<view class="announcement flex_center">
			<view class="fz-14">公告：</view>
			<view class="content flex_center">
				<!-- <uni-notice-bar class="notice" scrollable="true" :text="article[0].title" background-color="transparent" color='#fff' v-if="article"></uni-notice-bar> -->
				<swiper style="width:100%;height:80rpx" :indicator-dots="false" :autoplay="true" :circular="true" :vertical="true" :interval="2000" :duration="1000">
					<swiper-item v-for="item in article" :key="item.id">
						<view class="swiper-notice fz-14" @click="goAncm(item.id)">{{item.title}}</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- banner -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :circular="true" :duration="1000">
			<swiper-item v-for="item in article" :key="item.id">
				<view class="swiper-item" @click="goAncm(item.id)">
					<image class="banner-img" :src="item.mainUrl" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		name:'myBanner',
		props:['adverts','articles'],
		data() {
			return {
				notice: '',
			}
		},
		computed:{
			banner(){
				return this.adverts;
			},
			article(){
				return this.articles;
			}
		},
		methods:{
			goAncm(id){ //进入公告详情
				uni.navigateTo({
					url:`/userPages/announcement/index?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.banner{
		width: 750rpx;
		height: 330rpx;
		position: relative;
		.announcement{
			width: 100%;
			padding: 0 40rpx;
			box-sizing: border-box;
			background: rgba(0,0,0,.5);
			color: #fff;
			justify-content: flex-start;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 100;
			.fz-14{
				width: 13%;
			}
			.content{
				width: 85%;
				justify-content: flex-start;
				.notice{
					width: 100%;
				}
				.swiper-notice{
					width: 100%;
					line-height: 80rpx;
				}
			}
		}
		.swiper{
			height: 330rpx;
			.swiper-item{
				.banner-img{
					width: 750rpx;
					height: 330rpx;
				}
			}
		}
	}
</style>
