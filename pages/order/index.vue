<template>
	<view class="container">
		<view class="tabber">
			<view class="tabber-list" :class="{'active':item.is}" v-for="(item,index) in tabberList" :key="item.name" @click="tabber(item)">
				{{item.name}}
			</view>
		</view>
		<view class="main" v-if="list.length>0">
			<view class="item flex_between" v-for="item in list" :key="item.orderNo" @click="goDetails(item.orderNo)">
				<block v-if="!isShop">
					<view class="item_left flex_center">
						<view>
							<image :src="item.shopLogo" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="fz-12">{{item.createDate}}</view>
							<view class="fz-14">{{item.shopName}}</view>
						</view>
					</view>
					<view class="status">
						<view class="fz-16">{{item.pricePaid > 0 ? '+' : '-'}}{{item.pricePaid}}</view>
					</view>
				</block>
				<block v-else>
					<view class="item_left flex_center" v-for="it in item.commodities" @click="goDetails(item.orderNo)">
						<view>
							<image :src="it.picture" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="fz-12">{{item.createDate}}</view>
							<view class="fz-14">{{it.name}}</view>
							<view class="fz-12">{{it.commoditySpecName}} x{{it.count}}</view>
						</view>
					</view>
					<view class="status">
						<view class="fz-14 unpay" :style="{color:returnOrderStatus(item.orderStatus).color}">{{returnOrderStatus(item.orderStatus).status}}</view>
						<view class="fz-16">{{item.pricePaid}}</view>
					</view>
				</block>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		<!-- 缺省 -->
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
	export default {
		data() {
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: [],
				page: 0,
				tabberList: [{
					name: '消费记录',
					is: true,
					url: '/order/list'
				}, {
					name: '购买记录',
					is: false,
					url: '/app/order/list'
				}],
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
			// tabber 切换
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
					case "Canceled":
						return {
							color: "#2998DF",
							status: "已发货"
						};
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
			tabber(row) {
				let {
					tabberList
				} = this;
				//tabber切换
				let isShop = false
				for (let i of tabberList) {
					if (row.name === i.name) {
						i.is = true;
						if (row.name === '购买记录') {
							isShop = true
						}
					} else {
						i.is = false;
					}
				}
				this.isShop = isShop;
				this.page = 0;
				this.list = [];
				this.requestUrl = row.url;
				this.getList();
				this.tabberList = tabberList;
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
				if (!this.isShop) {
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
	.container {
		min-height: 100vh;
		height: auto;
	}

	.main {
		width: 710rpx;
		margin: 0 auto;

		.item {
			width: 100%;
			// height: 70px;
			padding: 10rpx 30rpx;
			box-sizing: border-box;
			background: #fff;
			border-radius: 8rpx;
			margin-bottom: 20rpx;
			color: #333;

			.item_left {
				image {
					width: 50px;
					height: 50px;
					display: block;
					border-radius: 8rpx;
				}

				.info {
					margin-left: 20rpx;
					line-height: 36rpx;

					.fz-12 {
						color: #999999;
					}
				}
			}

			.status {
				text-align: right;
				line-height: 40rpx;

				.finished {
					color: #0DAB01;
				}

				.cancel {
					color: #999999;
				}

				.unpay {
					color: #FF0001;
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

	.tabber {
		display: flex;
		align-items: center;
		height: 100rpx;

		.tabber-list {
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			color: #999;

			&.active {
				color: #282828;
			}
		}
	}
</style>
