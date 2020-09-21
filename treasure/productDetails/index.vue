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
				<text class="status">{{returnOrderStatus(drawDetails.drawStatus).status}}</text>{{drawDetails.commodityName}}
			</view>
			<view class="info_worth">
				<text class="worth_name">价值：</text>
				<text class="worth_price">￥{{drawDetails.priceOriginal}}</text>
			</view>
			<view class="wrap_progress_bar"><view class="bar" :style="{width:drawDetails.drawPercent + '%'}"></view></view>
			<view class="participate flex_between">
				<view class="treasure"><text>已参与夺宝：</text><text class="num_percentage">{{drawDetails.drawCount || 0}}</text><text>人次</text></view>
				<view class="treasure"><text>夺宝进度：</text><text class="num_percentage">{{drawDetails.drawPercent}}%</text></view>
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
			<view class="detail-item-list" :class="{'active': index == 2}" @click="index = 2">
				中奖记录
			</view>
		</view>
		<view class="detail-html" v-if="index == 0">
			<rich-text :nodes="description"></rich-text>
			<!-- <view v-html="description"></view> -->
		</view>
		<view class="participation-record" v-if="index == 1">
			
			<view class="wrap_list_app" v-for="(item,index) in list">
				<view class="content_border">
					<image class="left_image_src" :src="item.wechatHeadImg" mode=""></image>
					<view class="right_date">
						<view class="number_account">{{item.uid}} <!-- <text class="winning">已中奖</text> --></view>
						<view class="participate_page">参与<text class="color_nuxt">{{item.couponCount}}</text>张  <text class="date_time">{{item.createTime}}</text></view>
					</view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		
		<view class="participation-record" v-if="index == 2">
			
			<view class="wrap_list_app" v-if="winningRecord">
				<view class="content_border">
					<image class="left_image_src" :src="winningRecord.wechatHeadImg" mode=""></image>
					<view class="right_date">
						<view class="number_account">{{winningRecord.uid}} <text class="winning_number">夺宝编号: {{winningRecord.treasureCode}}</text></view>
						<view class="participate_page"><text>{{winningRecord.drawDate}}</text></view>
					</view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		
		<!-- 商品购买选择规格 -->
		<goods-specs :goods="goods" @onGoBtn="onGoBtn" ref="goods"></goods-specs>
		
		<!-- 立即夺宝 -->
		<view class="capture_treasure">
			<view class="treasure_bg" :class="{'background_active' : drawDetails.drawPercent < 100}" @click="startTreasure">立即夺宝</view>
		</view>
		
		<!-- 消费夺宝--参与夺宝 -->
		<view class="consumption" v-if="consumptionRule">
			<view class="middle_content">
				<image class="shut_down" @click="consumptionRule=false" src="../../static/images/shop/border_close.png" mode=""></image>
				<view class="commodity_list">
					<view class="left_wrap_image">
						<image :src="drawDetails.listUrl" mode=""></image>
					</view>
					<view class="right_info_show">
						<view class="info_title">{{drawDetails.commodityName}}</view>
						<view class="info_amount">价值：{{drawDetails.priceOriginal}}</view>
						<view class="info_amount">数量：{{drawDetails.goodsCount}}张</view>
					</view>
				</view>
				<!-- 进度条 -->
				<view class="progress_bar">
					<view class="uni_self" :style="{width: drawDetails.drawPercent + '%'}" ></view>
				</view>
				<view class="participation_progress">
					<view class="left_participation"><text>已参与夺宝：</text><text class="frequency">{{drawDetails.drawCount || 0}}人次</text></view>
					<view class="left_participation"><text>夺宝进度：</text><text class="frequency">{{drawDetails.drawPercent}}%</text></view>
				</view>
				<!-- 夺宝券 -->
				<view class="lottery_ticket"><text>夺宝券：</text><text class="sheet">{{drawMyData.drawCouponCount}}张</text></view>
				<view class="lottery_ticket_frequency">1张夺宝券可增加1人次，使用的越多夺宝几率越大</view>
				<view class="lottery_ticket_num">
					<view class="less" :class="{'active': voucher === 0}" @click="lessVoucher">-</view>
					<view class="less_num_add"><input type="number" v-model="voucher" /></view>
					<view class="less" @click="addVoucher">+</view>
				</view>
				<view class="participate_treasure_hunt" @click="statrTreasure">参与夺宝</view>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsSpecs from '@/my-component/goodsSpecs/index'
	export default {
		data() {
			return {
				id: '',
				consumptionRule: false,
				goods: {},
				width: 23,
				description: '',
				index: 0,
				isCart:false,
				drawDetails: '',
				drawMyData: '',  // 夺宝劵数量
				article: [],
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: [],
				winningRecord: '',
				page: 0,
				voucher: 0
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		methods: {
			//购买产品确认
			onGoBtn(e) {
				
			},
			startTreasure() {
				if (this.drawDetails.drawPercent >= 100) {
					return false;
				}
			    this.consumptionRule = true;
			},
			returnOrderStatus(status) {
				switch (status) {
					case "pending":
						return {
							color: "#47D347",
							status: "进行中"
						};
					case "drawing":
						return {
							color: "#FF9733",
							status: "待开奖"
						};
					case "success":
						return {
							color: "#EF4141",
							status: "已开奖"
						};
					case "gameOver":
						return {
							color: "#999999",
							status: "已结束"
						};
					default:
						return "";
				}
			},
			getDrawDetails(id) {
				this.$fly.get(`/app/draw/` + id).then(res=>{
					if (res.code == 0) {
						this.drawDetails = res.data;
						console.log(this.drawDetails)
						// 获取中奖记录
						this.getLotteryRecord(id);
						this.drawDetails.drawPercent = Math.trunc(this.drawDetails.drawPercent * 100);
						this.article = res.data.mainUrl.split(';');
						this.description = res.data.description.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block" ');
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			lessVoucher() {
				if (this.voucher == 0) {
					return false;
				}
				this.voucher --
			},
			addVoucher() {
				this.voucher ++
			},
			getDrawList(id) {
				this.$fly.get(`/app/draw/drawList?drawCommodityId=${id}&page=${this.page}&size=50`).then(res=>{
					if (res.code == 0) {
						let data = res.data.content;
						data.forEach(item => {
							item.createTime = this.$util.formatTime(item.createTime);
						})
						this.list = this.list.concat(data);
						this.page++;
						if (this.page > res.data.totalPages - 1) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			getTreasureDetails() {
				this.$fly.get(`/app/draw/myData?userId=${this.userId}`).then(res=>{
					if (res.code == 0) {
						let data = res.data;
						this.drawMyData = data;
					}				
				})
			},
			// 参与夺宝
			statrTreasure() {
				if (this.voucher == 0) {
					uni.showToast({
					    title: '夺宝劵数量不能为0或为空',
						icon: 'none',
					    duration: 2000
					});
					return false;
			    }
				
				if (this.voucher > Number(this.drawMyData.drawCouponCount)) {
					uni.showToast({
					    title: '数量大于已有夺宝券数量',
						icon: 'none',
					    duration: 2000
					});
					return false;
				}
				
				// 夺宝劵总数减去使用劵数
				let num = this.drawDetails.totalCount - this.drawDetails.drawCount;
				console.log(num);
				// voucher  用户输入的夺宝劵数量
				if (this.voucher >= num) {
					uni.showToast({
					    title: '夺宝失败，剩余人次不足',
				        icon: 'none',
					    duration: 2000
					});
					return false;
				}
				uni.showLoading({
				    title: '加载中'
				});
				this.startGrabTreasure();
			},
			startGrabTreasure() {
				let participateTreasureHunt = this.drawDetails;
				this.$fly.get(`/app/draw/addDraw?userId=` + this.$store.state.userInfo.id + '&drawCommodityId=' + participateTreasureHunt.id + '&couponCount=' + this.voucher)
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.consumptionRule = false;
						this.voucher = 0;
						this.page = 0;
						this.list = [];
						this.drawDetails = '';
						this.getDrawDetails(this.id);
						// 获取参与记录
						this.getDrawList(this.id);
						// 查询夺宝商品详情
						this.getTreasureDetails();
						uni.showToast({
							title: '夺宝成功！',
							icon: 'none',
							duration: 2000
						});
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			getLotteryRecord(id) {
				this.$fly.get(`/app/draw/draw/lottery?drawCommodityId=` + id + '&number=' + this.drawDetails.number)
				.then(res => {
					if (res.code == 0) {
						if (res.data) {
							res.data.drawDate = this.$util.formatTime(res.data.drawDate);
							this.winningRecord = res.data;
						}
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			}
		},
		
		onLoad(option) {
			this.id = option.id;
			this.getDrawDetails(option.id);
			// 获取参与记录
			this.getDrawList(option.id);
			// 查询夺宝商品详情
			this.getTreasureDetails();
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
				max-width: 100%!important;
			}
			image {
				max-width: 100%!important;
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
							.winning_number {
								margin-left: 50rpx;
								font-size: 28rpx;
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
			.background_active {
				background-color: #FF9733!important;
			}
		}
		
		.consumption {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0,0,0,0.7);
			z-index: 666;
			display: flex;
			justify-content: center;
			align-items: center;
			.middle_content {
				width: 94.66vw;
				background:rgba(255,255,255,1);
				box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.2);
				border-radius:8rpx;
				padding: 58rpx 20rpx 49rpx 20rpx;
				box-sizing: border-box;
				position: relative;
				.shut_down {
					width: 28rpx;
					height: 28rpx;
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}
				.commodity_list {
					display: flex;
					.left_wrap_image {
						width: 140rpx;
						flex: 0 0 140rpx;
						height: 140rpx;
						margin-right: 20rpx;
						image {
							height: 100%;
							width: 100%;
						}
					}
					.right_info_show {
						flex: 1;
						.info_title {
							font-size:32rpx;
							font-family:PingFang SC;
							font-weight:800;
							color:rgba(51,51,51,1);
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
						.info_amount {
							font-size:26rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							margin-top: 10rpx;
						}
					}
				}
				.progress_bar {
					height:24rpx;
					background:rgba(229,229,229,1);
					border-radius:12rpx;
					margin-top: 20rpx;
					.uni_self {
						height:24rpx;
						background:linear-gradient(180deg,rgba(25,196,41,1),rgba(29,219,47,1));
						border-radius:12rpx;
					}
				}
				.participation_progress {
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;
					padding-bottom: 30rpx;
					border-bottom: 2rpx solid #DBDBDB;
					.left_participation {
						font-size:26rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:#999999;
						.frequency {
							color: #FF9733;
						}
					}
				}
				.lottery_ticket {
					margin-top: 48rpx;
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:800;
					color:rgba(51,51,51,1);
					text-align: center;
					.sheet {
						color: #FF9733;
					}
				}
				.lottery_ticket_frequency {
					font-size:26rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(153,153,153,1);
					text-align: center;
					margin-top: 10rpx;
				}
				.lottery_ticket_num {
		            margin-top: 30rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.less {
						display: flex;
						justify-content: center;
						align-items: center;
						width:50rpx;
						height:50rpx;
						background:rgba(255,185,85,1);	
						color: #FFFFFF;
					}
					.less_num_add {
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0 30rpx;
						width:90rpx;
						height:50rpx;
						background:rgba(227,227,227,1);
						input {
							width: 100%;
							height: 100%;
							text-align: center;
							font-size:30rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(51,51,51,1);
						}
					}
					.active {
					    background-color: #e3e3e3!important;
					}
				}
				
				.participate_treasure_hunt {
					margin-top: 50rpx;
					height:74rpx;
					line-height: 74rpx;
					text-align: center;
					background:rgba(255,157,17,1);
					border-radius:37rpx;
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(255,255,255,1);
				}
				
			}
		}
	}
</style>
