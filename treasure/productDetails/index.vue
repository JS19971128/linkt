<template>
	<view class="productDetails">
		<!-- banner -->
		<view class="swiper">
			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="2000" :circular="true" :duration="1000">
				<swiper-item v-for="item in article" :key="item">
					<view class="swiper-item">
						<image class="banner-img" :src="item" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 商品信息 -->
		<view class="product_info">
			<view class="info_title">
				<text class="status">进行中</text>伊利金典有机营养纯牛奶/营养早餐奶整盘250 ml*25桌/营养健康奶
			</view>
			<view class="info_worth">
				<text class="worth_name">价值：</text>
				<text class="worth_price">￥999.00</text>
			</view>
			<view class="wrap_progress_bar"><view class="bar" :style="{width:width + '%'}"></view></view>
			<view class="participate flex_between">
				<view class="treasure"><text>已参与夺宝：</text><text class="num_percentage">2658</text><text>人次</text></view>
				<view class="treasure"><text>夺宝进度：</text><text class="num_percentage">23%</text></view>
			</view>
		</view>
		
		<!-- 参与流程 -->
		<view class="participation_process">
			<view class="title_name">参与流程</view>
			<image class="image_mode" src="../../static/images/shop/participation_process.png" mode=""></image>
		</view>
		
		<!-- 商品详情-->
		<view class="detail-item">
			<view class="detail-item-list" :class="{'active': index == 0}" @click="index = 0">
				商品详情
			</view>
			<view class="detail-item-list" :class="{'active': index == 1}" @click="index = 1">
				参与记录
			</view>
		</view>
		<view class="detail-html" v-if="index == 0">
			<rich-text :nodes="description"></rich-text>
			<!-- <view v-html="description"></view> -->
		</view>
		<view class="participation-record" v-if="index == 1">
			
			<view class="wrap_list_app">
				<view class="content_border">
					<image class="left_image_src" src="" mode=""></image>
					<view class="right_date">
						<view class="number_account">58****58  <text class="winning">已中奖</text></view>
						<view class="participate_page">参与<text class="color_nuxt">25</text>张  <text class="date_time">2020-08-03 20:21:22</text></view>
					</view>
				</view>
			</view>
			
		</view>
		
		<!-- 商品购买选择规格 -->
		<goods-specs :goods="goods" @onGoBtn="onGoBtn" ref="goods"></goods-specs>
		
		<!-- 立即夺宝 -->
		<view class="capture_treasure">
			<view class="treasure_bg" @click="startTreasure">立即夺宝</view>
		</view>
	</view>
</template>

<script>
	import goodsSpecs from '@/my-component/goodsSpecs/index'
	export default {
		data() {
			return {
				goods: {},
				width: 23,
				description: '',
				index: 0,
				isCart:false,
			}
		},
		methods: {
			//购买产品确认
			onGoBtn(e) {
				
			},
			startTreasure() {
				// this.$store.commit('SETISSPECS',true);
				// this.$refs.goods.Init();
				// this.isCart = false;
				uni.redirectTo({
					url: `/treasure/winningOrder/index`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.productDetails {
		background: #f2f2f2;
		padding-bottom: 106rpx;
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
		
		.product_info {
			padding: 30rpx 20rpx;
			background-color: #FFFFFF;
			.info_title {
				font-size:30rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				.status {
					background:rgba(255,151,51,1);
					border-radius:16rpx;
					padding: 5rpx 10rpx;
					margin-right: 15rpx;
					font-size:24rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(255,255,255,1);
				}
			}
			.info_worth {
				margin-top: 18rpx;
				.worth_name {
					font-size:28rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(153,153,153,1);
				}
				.worth_price {
					font-size:46rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,151,51,1);
				}
			}
			.wrap_progress_bar {
				margin-top: 18rpx;
				height:24rpx;
				background:rgba(229,229,229,1);
				border-radius:12rpx;
				.bar {
					height:24rpx;
					background:linear-gradient(180deg,rgba(25,196,41,1),rgba(29,219,47,1));
					border-radius:12rpx;
				}
			}
			.participate {
				margin-top: 18rpx;
				.treasure {
					font-size:24rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:#999999;
					.num_percentage {
						color: #1BD12D;
					}
				}
			}
		}
	
	    .participation_process {
			margin-top: 20rpx;
			padding: 30rpx 20rpx 20rpx 20rpx;
			background-color: #FFFFFF;
			.title_name {
				font-size:26rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
			.image_mode {
				width: 100%;
				height: 150rpx;
				margin-top: 30rpx;
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
		
		.participation-record {
			.wrap_list_app {
				background-color: #FFFFFF;
				padding: 0 20rpx;
				.content_border {
					border-bottom: 1px solid #DDDDDD;
					display: flex;
					padding: 30rpx;
					&:last-child {
						border-bottom: 0;
					}
					.left_image_src {
					    width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 30rpx;
					}
					.right_date {
						flex: 1;
						padding-top: 15rpx;
						.number_account {
							font-size:32rpx;
							font-family:PingFang SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							.winning {
								padding: 3rpx 10rpx;
								background:rgba(239,65,65,1);
								border-radius:8rpx;
								font-size:24rpx;
								font-family:PingFang SC;
								font-weight:500;
								color:rgba(255,255,255,1);
								margin-left: 30rpx;
							}
						}
						.participate_page {
							font-size:28rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							margin-top: 16rpx;
							.color_nuxt {
								color: #FF9733;
							}
							.date_time {
								margin-left: 60rpx;
							}
						}
					}
				}
			}
		}
	
	    .capture_treasure {
			position: fixed;
            left:0;
			bottom: 0;
			right: 0;
			height: 106rpx;
			background-color: #FFFFFF;
			display: flex;
            justify-content: center;
			align-items: center;
			.treasure_bg {
				width:710rpx;
				height:74rpx;
				line-height: 74rpx;
				background:rgba(203,203,203,1);
				border-radius:37rpx;
				font-size:32rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(255,255,255,1);
				margin: 0 auto;
				text-align: center;
			}
		}
	}
</style>
