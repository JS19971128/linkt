<template>
	<view class="my_treasure">
		<view class="treasure_table">
			<view class="table_title" :class="{'active': drawStatus == 'pending'}" @click="tabItem('pending')">夺宝中 {{myDrawCount.drawingCount}}</view>
			<view class="table_title" :class="{'active': drawStatus == 'success'}" @click="tabItem('success')">已中奖 {{myDrawCount.successCount}}</view>
			<view class="table_title" :class="{'active': drawStatus == 'gameOver'}" @click="tabItem('gameOver')">已结束 {{myDrawCount.gameOverCount}}</view>
		</view>
		<view class="list_bdi_wrap" v-if="list.length>0">
			
			<view class="treasure_list" v-for="(item,index) in list">
				<view class="image_title_status">
					<view class="left_image">
						<image :src="item.listUrl" mode=""></image>
					</view>
					<view class="right_info_name">
						<view class="name">{{item.commodityName}}</view>
						<view class="worth">价值：{{item.priceOriginal}}</view>
						<view class="worth">数量：{{item.totalCount}}</view>
						<view class="worth">已参与：{{item.drawCount }}张券</view>
						<view class="worth" v-if="drawStatus == 'success'">中奖编号：{{item.drawCommodityNo}}</view>
						<view class="flex_between progress_bar" v-if="drawStatus == 'pending'">
							<view class="left_progress"><view class="bar" :style="{width:item.drawPercent + '%'}"></view></view>
							<view class="percentage">{{item.drawPercent}}%</view>
						</view>
						<view class="treasure_status"><text class="active_status" :style="{color:returnOrderStatus(item.drawStatus).color}">{{returnOrderStatus(item.drawStatus).status}}</text><image src="../../static/images/common/more_gray.png" mode=""></image></view>
					</view>
				</view>
				<!-- 继续夺宝--确认订单 -->
				<view class="Keep_winning" v-if="drawStatus == 'success' || drawStatus == 'pending'">
					<view class="winning"><view class="winning_text">继续夺宝</view></view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>

		</view>
		
		<!-- 无订单时 -->
		<view class="flex_center no_data" v-else>
			<view>
				<image src="../../static/images/order/order_none.png" mode="widthFix"></image>
			</view>
			<view class="tip">
				<view class="fz-14">暂无订单</view>
				<view class="fz-12">您还没有夺宝过喔~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				width: 23,
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: [],
				page: 0,
				drawStatus: 'pending',
				myDrawCount: '', // 商品数量
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		methods: {
			tabItem(status) {
				this.drawStatus = status;
				
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
							status: "已中奖"
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
			getList() { //获取列表
				this.status = 'loading';
				uni.showLoading({
					title:'加载中'
				})

				this.$fly.get(`/app/draw/myDrawList?userId=${this.userInfo.id}&page=${this.page}&size=20&drawStatus=${this.drawStatus}&sort=createDate,asc`)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							let data = res.data.content;
							data.forEach(item => {
								item.createDate = this.$util.formatTime(item.createDate);
							})
							this.list = this.list.concat(data);
							this.page++;
							if (this.page > res.data.totalPages - 1) {
								this.status = 'noMore';
							} else {
								this.status = 'more';
							}
						}
					})
			},
			getMyDrawCount() {
				this.$fly.get(`/app/draw/myDrawCount?userId=${this.userInfo.id}`)
					.then(res => {
						if (res.code == 0) {
							this.myDrawCount = res.data;
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
		onReachBottom: function() { //触底加载
			if (this.status == 'noMore') {
				return
			}
			this.getList();
		},
		onShow: function() {
			// 判断是否已登录，已登录则直接请求数据，未登录则登录
			// 微信登录
			// #ifdef MP-WEIXIN
			if (!this.$store.state.userInfo.uid) {
				this.$wxLogin();
			} else {
				if (this.list.length == 0) {
					this.getList();
					this.getMyDrawCount();
				}
			}
			// #endif
			// 支付宝登录
			// #ifdef MP-ALIPAY
			if (!this.$store.state.userInfo.uid) {
				this.$aliLogin();
			} else {
				if (this.list.length == 0) {
					this.getList();
					this.getMyDrawCount();
				}
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.my_treasure {
		min-height: 100vh;
		background-color: #EEEEEE;
		padding-top: 68rpx;
		box-sizing: border-box;
		.treasure_table {
			height: 68rpx;
			background-color: #EEEEEE;
			display: flex;
			font-size:26rpx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(153,153,153,1);
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			.table_title {
				flex: 1;
				display: flex;
			    justify-content: center;
				padding-top: 10rpx;
 			}
			.active{
				position: relative;
				color: #FF9834;
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
					bottom: 10rpx;
				}
			}
		}
		.list_bdi_wrap {
			padding-bottom: 20rpx;
			.treasure_list {
				background-color: #FFFFFF;
				margin-bottom: 20rpx;
				.image_title_status {
					padding: 20rpx;
					display: flex;
					.left_image {
						width:240rpx;
						height:240rpx;
						margin-right: 20rpx;
						image {
							width: 100%;
							height: 100%;
							border-radius:8rpx;
						}
					}
					.right_info_name {
						flex: 1;
						position: relative;
						.name {
							font-size:28rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(0,0,0,1);
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.worth {
							font-size:24rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							margin-top: 10rpx;
						}
						.progress_bar {
							margin-top: 10rpx;
							.left_progress {
								width: 370rpx;
								flex: 0 0 370rpx;
								height:24rpx;
								background:rgba(229,229,229,1);
								border-radius:12rpx;
								.bar {
									height:24rpx;
									background:linear-gradient(180deg,rgba(25,196,42,1),rgba(29,219,47,1));
									border-radius:12rpx;
								}
							}
							.percentage {
								font-size:24rpx;
								font-family:PingFang SC;
								font-weight:500;
								color:rgba(27,209,45,1);
							}
						}
						.treasure_status {
							position: absolute;
							top: 100rpx;
							right: 20rpx;
							font-size:28rpx;
							font-family:PingFang SC;
							font-weight:500;
							.active_status {								
								color:rgba(71,211,71,1);
								vertical-align: middle;
							}
							image {
								width: 12px;
								height: 12px;
								vertical-align: middle;
								margin-left: 10rpx;
							}
						}
					}
				}
				.Keep_winning {
					padding-left: 20rpx;
					.winning {
						border-top: 1px solid #DEDEDE;
						padding: 20rpx;
						text-align: right;
						.winning_text {
							display: inline-block;
							width:138rpx;
							height:46rpx;
							line-height: 46rpx;
							background:rgba(204,204,204,1);
							border-radius:23rpx;
							text-align: center;
							font-size:24rpx;
							font-family:PingFang SC;
							font-weight:500;
							color:rgba(255,255,255,1);
							line-height:46rpx;
						}
					}
				}
			}
		}
		
		.no_data {
			flex-direction: column;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		
			image {
				width: 180rpx;
				display: block;
			}
		
			.tip {
				margin-top: 50rpx;
				text-align: center;
				line-height: 40rpx;
		
				.fz-14 {
					color: #999999;
				}
		
				.fz-12 {
					color: #CBCBCB;
				}
			}
		}
	}
</style>
