<template>
	<view class="recording">
	    <view class="wrap_top_recording">
	    	<view class="consumption" :class="{'item_is':statusIs == 0}" @click="tabber(0)">消费记录</view>
			<view class="consumption" :class="{'item_is':statusIs == 1}" @click="tabber(1)">购买记录</view>
	    </view>
		<view class="recording_list" v-if="list.length>0">
			<view  v-if="statusIs == 0">
				<view class="left_consumption nuxt_uni" v-for="item in list" :key="item.orderNo" @click="goDetails(item.orderNo)">
					<view class="flex_img">
						<image :src="item.shopLogo" mode=""></image>
					</view>
					<view class="nuxt_bdi">
						<view class="time_pay">
							<text class="date_time">{{item.createDate}}</text>
							<text class="date_time" :style="{color:returnOrderStatus(item.orderStatus).color}">{{returnOrderStatus(item.orderStatus).status}}</text>
						</view>
						<view class="time_pay">
							<text>{{item.shopName}}</text>
							<text>￥{{item.pricePaid}}</text>
						</view>
					</view>
				</view>
				<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
			</view>
			
			<view  v-else>
				<view class="right_buy"  v-for="item in list" :key="item.orderNo" >
					<view @click="goDetails(item.orderNo)">
						<view class="name_status">
							<text>{{item.shopName}}  ></text>
							<text :style="{color:returnOrderStatus(item.orderStatus).color}">{{returnOrderStatus(item.orderStatus).status}}</text>
						</view>
						<view class="list-item">
							<view class="left_consumption" v-for="(goods,i) in item.commodities">
								<view class="flex_img">
									<image :src="goods.picture"></image>
								</view>
								<view class="nuxt_bdi">
									<view class="time_pay">
										<text>{{goods.name}}</text>
										<text>￥{{goods.salePrice}}</text>
									</view>
									<view class="time_pay">
										<text class="date_time">{{goods.commoditySpecName}}</text>
										<text class="date_time">x{{goods.count}}</text>
									</view>
									<view class="time_pay">
										<text class="date_time">{{item.createDate}}</text>
										<text class="date_time"></text>
									</view>
								</view>
							</view>
						</view>
						<view class="total_price nuxt_uni">
							<text>总价 ￥{{item.priceTotal}}  优惠 ￥{{item.sharedCoupons || 0}} </text> <text class="pricePaid"> 实付 ￥{{item.pricePaid}}</text>
						</view>
					</view>
					<view class="text_evaluation">
						<!-- <text class="evaluation">评价</text> -->
						<text  v-if="item.orderStatus == 'Shipped'" class="confirm_receipt" @click="confirmRreceipt(item.orderNo)">确认收货</text>
					</view>
				</view>
				<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
			</view>
		</view>
		
		<!-- 无订单时 -->
		<view class="flex_center no_data" v-else>
			<view>
				<image src="../../static/images/order/order_none.png" mode="widthFix"></image>
			</view>
			<view class="tip">
				<view class="fz-14">暂无订单</view>
				<view class="fz-12">您还没有消费过喔~</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
			    statusIs: 0,
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: [],
				page: 0,
				requestUrl: '/order/list',
				isShop: false, //是否是商城
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		watch: {
			userInfo() { //登录后获取到用户信息则请求数据
				this.getList();
			}
		},
		methods: {
			// 确认收货
			confirmRreceipt(orderNo) {
				var _this = this;
				uni.showModal({
				    title: '提示',
				    content: '确认收货?',
				    success: function (res) {
				        if (res.confirm) {
				            _this.$fly.post(`/app/order/` + orderNo + '/confirm-receipt')
				            	.then(res => {
				            		uni.hideLoading();
				            		if (res.code == 0) {
				            			uni.showToast({
				            			    title: '已确认收货',
				            			    duration: 2000
				            			});
				            			_this.tabber(1);
				            		} else {
										uni.showToast({
										    title: res.message,
										    duration: 2000
										});
									}
				            	})
				        } else if (res.cancel) {
				            
				        }
				    }
				});
				
			},
			tabber(index) {
				this.statusIs = index;
				if (index == 0) {
					this.requestUrl = '/order/list';
				} else {
					this.requestUrl = '/app/order/list';
				}
				this.page = 0;
				this.list = [];
				this.getList();
			},
			returnOrder(status) {
				switch (status) {
					case "Pending":
						return {
							color: "#FF0101",
							status: "待支付"
						};
					case "Paid":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "Shipped":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "NoCommented":
						return {
							color: "#0DAB01",
							status: "已完成"
						}
					case "Finished":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "Canceled":
						return {
							color: "#999999",
							status: "已取消"
						};
					default:
						return "";
				}
			},
			returnOrderStatus(status) {
				switch (status) {
					case "Pending":
						return {
							color: "#FF0101",
							status: "未支付"
						};
					case "Paid":
						return {
							color: "#FF9834",
							status: "待发货"
						};
					case "Shipped":
						return {
							color: "#2998DF",
							status: "已发货"
						};
					case "NoCommented":
						return {
							color: "#0DAB01",
							status: "已完成"
						}
					case "Finished":
						return {
							color: "#0DAB01",
							status: "已完成"
						};
					case "Canceled":
						return {
							color: "#999999",
							status: "已取消"
						};
					default:
						return "";
				}
			},
			getList() { //获取订单列表
				this.status = 'loading';
				uni.showLoading({
					title:'加载中'
				})
				let url = this.requestUrl;
				this.$fly.get(`${url}?userId=${this.userInfo.id}&page=${this.page}`)
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
			goDetails(orderNo) { //进入订单详情页面
			
				if (!this.statusIs) {
					uni.navigateTo({
						url: `/userPages/orderDetails/index?orderNo=${orderNo}`
					})
				} else {
					uni.navigateTo({
						url: `/userPages/orderDetails/index?orderNo=${orderNo}&isShop=true`
					})
				}
			
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
				}
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.recording {
		min-height: 100vh;
		background-color: #EEEEEE;
		.wrap_top_recording {
			width: 100%;
			height: 100rpx;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			background: #EEEEEE;
			position: fixed;
			top: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #999999;
			.consumption {
				flex: 1;
				text-align: center;
			}
			.item_is {
				color: #282828;
			}
		}
		.recording_list {
			padding-top: 100rpx;
			.nuxt_uni {
				border-bottom: 1px solid #D3D3D3;
			}
			.list-item{
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.left_consumption {
				padding: 20rpx;
				background-color: #FFFFFF;
				display: flex;
				margin-bottom: 15rpx;
				border-bottom: 1rpx solid #eee;
				.flex_img {
					width: 150rpx;
					height: 150rpx;
					image {
						width:100%;
						height: 100%;
					}
				}
				.nuxt_bdi {
					flex: 1;
					margin-left: 20rpx;
					.time_pay {
						width: 100%;
						display: flex;
						justify-content: space-between;
						font-size: 26rpx;
						padding: 10rpx 0;
						.date_time {
							color: #999999;
						}
					}
				}
			}
			
			.right_buy {
				width: 95%;
				margin: 0 auto;
				background-color: #FFFFFF;
				border-radius: 10px;
				margin-bottom: 20rpx;
				.name_status {
					display: flex;
					justify-content: space-between;
					padding: 20rpx;
					border-bottom: 1px solid #D3D3D3;
					font-size: 28rpx;
				}
				.total_price {
					color: #999999;
					font-size: 28rpx;
					text-align: right;
					padding: 20rpx;
					.pricePaid {
						color: #333333;
						margin-left: 10rpx;
					}
				}
				.text_evaluation {
					padding: 20rpx 35rpx;
					text-align: right;
					.evaluation {
						display: inline-block;
						width: 150rpx;
						height: 60rpx;
						line-height: 60rpx;
						color: #999999;
						border: 1px solid #D3D3D3;
						border-radius: 200rpx;
						text-align: center;
						font-size: 24rpx;
					}
					.confirm_receipt {
						display: inline-block;
						width: 150rpx;
						height: 60rpx;
						line-height: 60rpx;
						color: #333333;
						border: 1px solid #333333;
						border-radius: 200rpx;
						text-align: center;
						font-size: 24rpx;
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
