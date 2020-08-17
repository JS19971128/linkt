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
							<view class="left_progress"><view class="bar" :style="{width:Math.trunc(item.drawPercent * 100) + '%'}"></view></view>
							<view class="percentage">{{Math.trunc(item.drawPercent * 100)}}%</view>
						</view>
						<view class="treasure_status"><text class="active_status" :style="{color:returnOrderStatus(item.drawStatus).color}">{{returnOrderStatus(item.drawStatus).status}}</text><image src="../../static/images/common/more_gray.png" mode=""></image></view>
					</view>
				</view>
				<!-- 继续夺宝--确认订单 -->
				<view class="Keep_winning" v-if="drawStatus == 'success' || drawStatus == 'pending'">
					<!-- <view class="winning" v-if="drawStatus == 'pending'"><view class="winning_text" :class="{'background_active' : item.drawPercent < 1}"  @click="startTreasure(item)">继续夺宝</view></view> -->
					<view class="winning" ><view class="winning_text background_active" @click="confirmOrder(item)">确认订单</view></view>
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
				<view class="fz-14">暂无记录</view>
				<!-- <view class="fz-12">您还没有夺宝过喔~</view> -->
			</view>
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
						<view class="info_amount">数量：{{drawDetails.totalCount}}张</view>
					</view>
				</view>
				<!-- 进度条 -->
				<view class="progress_bar">
					<view class="uni_self" :style="{width: Math.trunc(drawDetails.drawPercent * 100) + '%'}"></view>
				</view>
				<view class="participation_progress">
					<view class="left_participation"><text>已参与夺宝：</text><text class="frequency">{{drawDetails.drawCount || 0}}人次</text></view>
					<view class="left_participation"><text>夺宝进度：</text><text class="frequency">{{Math.trunc(drawDetails.drawPercent * 100)}}%</text></view>
				</view>
				<!-- 夺宝券 -->
				<view class="lottery_ticket"><text>夺宝券：</text><text class="sheet">{{drawMyData.drawCouponCount}}张</text></view>
				<view class="lottery_ticket_frequency">1张夺宝券可增加1人次，使用的越多夺宝几率越大</view>
				<view class="lottery_ticket_num">
					<view class="less" :class="{'active': voucher === 0}" @click="lessVoucher">-</view>
					<view class="less_num_add"><input type="number" v-model="voucher" /></view>
					<view class="less" @click="addVoucher">+</view>
				</view>
				<view class="participate_treasure_hunt" @click="participateTreasure">参与夺宝</view>
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
				consumptionRule: false,
				drawDetails: '',
				drawMyData: '',  // 夺宝劵数量
				voucher: 0
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		methods: {
			lessVoucher() {
				if (this.voucher == 0) {
					return false;
				}
				this.voucher --
			},
			addVoucher() {
				this.voucher ++
			},
			tabItem(status) {
				this.drawStatus = status;
				this.page = 0;
				this.list = [];
				this.getList();
			},
			// 确认订单发货
			confirmOrder(item) {
			
				uni.navigateTo({
					url: `/treasure/winningOrder/index?id=` + item.id
				})
			},
			// 参与夺宝
			participateTreasure() {
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
				if (this.voucher > num) {
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
				let drawDetails = this.drawDetails
				this.$fly.get(`/app/draw/addDraw?userId=` + this.$store.state.userInfo.id + '&drawCommodityId=' + drawDetails.id + '&couponCount=' + this.voucher)
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.consumptionRule = false;
						this.voucher = 0;
						this.page = 0;
						this.list = [];
						this.drawDetails = '';
						this.getList();
						this.getMyDrawCount();
						// 查询夺宝数量
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
			getTreasureDetails() {
				this.$fly.get(`/app/draw/myData?userId=${this.userInfo.id}`).then(res=>{
					if (res.code == 0) {
						let data = res.data;
						this.drawMyData = data;
					}				
				})
			},
			startTreasure(item) {
				this.drawDetails = item;
				if (this.drawDetails.drawPercent >= 1) {
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
					// 查询夺宝数量
					this.getTreasureDetails();
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
					// 查询夺宝数量
					this.getTreasureDetails();
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
			height: 70rpx;
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
						.background_active {
							background-color: #FF9D11!important;
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
