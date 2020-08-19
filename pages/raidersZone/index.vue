<template>
	<view class="raiders_zone">
		<view class="raiders_bg">
			<image src="../../static/images/shop/tu-min.png" mode=""></image>
			<view class="voucher">
				<view class="left_voucher">
					<view class="frist_uni">0</view>
					<view class="second_uni">夺宝券</view>
				</view>
				<view class="left_voucher right_my" @click="goMyTreasure">
					<view class="frist_uni">{{drawMyData.drawCommodityCount || 0}}</view>
					<view class="second_uni">我的夺宝</view>
				</view>
			</view>
			<view class="treasure" @click="voucherRule=true" >
				<image src="../../static/images/shop/rule.png" mode=""></image><text class="text_rule">夺宝规则</text>
			</view>
		</view>
		<!-- 夺宝规则 -->
		<view class="wrap_flex_bg" v-if="voucherRule">
			<view class="rule_bdi">
				<image class="shut_down" @click="voucherRule=false" src="../../static/images/shop/border_close.png" mode=""></image>
				<view class="rule_title"><text class="middle_text">夺宝规则</text></view>
				<view class="rule_text">
                    在95折以下（不包含95折）的商家消费，或者购买95折以下（不包含95折）的商品后，会获得夺宝券。夺宝券的面额将以消费金额中的商家折扣计算得出。
				</view>
				<view class="rule_text">
					夺宝券可单张或多张同时使用。如果该商品夺宝进度已满，将不能再继续对该商品夺宝。
				</view>
				<view class="rule_text">
					当商品夺宝进度充满后，将会抽取幸运号码，拥有该幸运号码夺宝券的用户，可直接获得该商品。在我的夺宝中填写收货地址，平台会将产品进行发货。
				</view>
			</view>
		</view>
		
		<!-- 消费夺宝--参与夺宝 -->
		<view class="consumption" v-if="consumptionRule">
			<view class="middle_content">
				<image class="shut_down" @click="consumptionRule=false" src="../../static/images/shop/border_close.png" mode=""></image>
				<view class="commodity_list">
					<view class="left_wrap_image">
						<image :src="participateTreasureHunt.listUrl" mode=""></image>
					</view>
					<view class="right_info_show">
						<view class="info_title">{{participateTreasureHunt.commodityName}}</view>
						<view class="info_amount">价值：{{participateTreasureHunt.priceOriginal }}</view>
						<view class="info_amount">数量：{{participateTreasureHunt.totalCount }}张</view>
					</view>
				</view>
				<!-- 进度条 -->
				<view class="progress_bar">
					<view class="uni_self" :style="{width: Math.trunc(participateTreasureHunt.drawPercent * 100) + '%'}"></view>
				</view>
				<view class="participation_progress">
					<view class="left_participation"><text>已参与夺宝：</text><text class="frequency">{{participateTreasureHunt.drawCount || 0}}人次</text></view>
					<view class="left_participation"><text>夺宝进度：</text><text class="frequency">{{Math.trunc(participateTreasureHunt.drawPercent * 100)}}%</text></view>
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
		
		<!-- 夺宝商品 -->
		<view class="event_goods">
			<image src="../../static/images/shop/hot.png" mode=""></image>
			<text class="active_text">夺宝商品</text>
			<image src="../../static/images/shop/hot.png" mode=""></image>
		</view>
		<!-- 列表 -->
		<view class="treasure_bdi" v-if="navList.length > 0">
			
			<view class="wrap_list_content" v-for="(item,index) in navList" :key='index' @click="goProductDetails(item.id)">
				<view class="left_img_src">
					<image class="statr_oss" :src="item.listUrl " mode=""></image>
				</view>
				<view class="right_title_schedule">
					<view class="product_title">{{item.commodityName}}</view>
					<view class="worth">价值：{{item.priceOriginal}}</view>
					<view class="worth">数量：{{item.totalCount }}</view>
					<view class="worth"><text>夺宝进度：</text><text class="percentage">{{Math.trunc(item.drawPercent * 100)}}%</text></view>
					<view class="schedule">
						<view class="topline" :style="{width:Math.trunc(item.drawPercent * 100) + '%'}"></view>
					</view>
					<view class="treasure_icon" v-if="item.drawPercent < 1" @click.native.stop="openConsumptionRule(item)">
						<image src="../../static/images/shop/treasure.png" mode=""></image>
					</view>
					<view v-else class="carry_out_status" :style="{color:returnOrderStatus(item.drawStatus).color}">
						{{returnOrderStatus(item.drawStatus).status}}
					</view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		
		<view class="no_data" v-else>
			<view class="wrap_image_src">
				<image src="../../static/images/shop/underConstruction.png" mode="widthFix"></image>
			</view>
			<view class="tip">
				<view class="fz-14">即将开放</view>
				<view class="fz-12">开发小哥哥们正在全力开发中</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import goodsList from '@/my-component/goodsList/index'
	export default{
		data() {
			return {
				width: 23,
				//产品数据
				navList:[],
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				page:0,//页码
				status:'noMore',//请求切换
				total: 0,
				voucherRule: false,
				consumptionRule: false, // 消费夺宝
				drawMyData: '',
				participateTreasureHunt: '', // 参与消费夺宝商品
				voucher: 0, // 参与使用夺宝卷数
			}
		},
		components:{goodsList},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		onLoad() {
			// 获取夺宝商品列表
			this.navListFun();
			// 查询夺宝商品详情
			this.getTreasureDetails();
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
		onPullDownRefresh(){
			// this.clickTabListItem()
			if(!this.$store.state.userInfo.uid){
				this.$wxLogin();
			}
			this.page = 0;
			this.navList = [];
			// 获取夺宝商品列表
			this.navListFun();
			// 查询夺宝商品详情
			this.getTreasureDetails();
		},
		methods: {
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
				let num = this.participateTreasureHunt.totalCount - this.participateTreasureHunt.drawCount;
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
				let participateTreasureHunt = this.participateTreasureHunt
				this.$fly.get(`/app/draw/addDraw?userId=` + this.$store.state.userInfo.id + '&drawCommodityId=' + participateTreasureHunt.id + '&couponCount=' + this.voucher)
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.consumptionRule = false;
						this.voucher = 0;
						// 更新夺宝劵数量
						this.getTreasureDetails();
						this.page = 0;
						this.navList = [];
						// 获取夺宝商品列表
						this.navListFun();
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
			lessVoucher() {
				if (this.voucher == 0) {
					return false;
				}
				this.voucher --
			},
			addVoucher() {
				this.voucher ++
			},
			goProductDetails(id) {
				uni.navigateTo({
					url:'/treasure/productDetails/index?id=' + id
				})
			},
			// 消费夺宝
			openConsumptionRule(item) {
				this.participateTreasureHunt = item;
				this.consumptionRule = true;
			},
			goMyTreasure() {
				uni.navigateTo({
					url:'/treasure/myTreasure/index'
				})
			},
			navListFun() {
				this.$fly.get(`/app/draw/list?size=10&page=${this.page}&userId=${this.userId}&sort=createDate,desc`).then(res=>{
					let data = res.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.navList = []
					}
					this.navList = this.navList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.raiders_zone {
		min-height: 100vh;
		background-color: #f2f2f2;
		.raiders_bg {
			height: 76.66vw;
			position: relative;
			image {
				width: 100%;
				height: 100%;
			}
			.treasure {
				position: absolute;
				top: 30rpx;
				right: 20rpx;
				font-size:24rpx;
				font-family:'PingFang SC';
				font-weight:500;
				color:rgba(255,255,255,1);
				image {
					width: 26rpx;
					height: 26rpx;
					margin-right: 7rpx;
					vertical-align: middle;
				}
				.text_rule {
					border-bottom: 2rpx solid #FFFFFF;
				}
			}
			.voucher {
				position: absolute;
				bottom: 0rpx;
				left: 20rpx;
				width: 710rpx;
				height: 160rpx;
				background: rgba(255,255,255,1);
				box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
				border-radius: 8px;
				padding: 20rpx 0;
				box-sizing: border-box;
				display: flex;
				.left_voucher {
					flex: 1;
					text-align: center;
					.frist_uni {
						font-size:42rpx;
						font-family:'PingFang SC';
						font-weight:800;
						color:rgba(255,132,0,1);
					}
					.second_uni {
						font-size:28rpx;
						font-family:'PingFang SC';
						font-weight:800;
						color:rgba(153,153,153,1);
						margin-top: 30rpx;
					}
				}
				.right_my {
					border-left: 2rpx solid #DCDCDC;
				}
			}
		}
		.wrap_flex_bg {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0,0,0,0.7);
			z-index: 666;
			display: flex;
			justify-content: center;
			align-items: center;
			.rule_bdi {
				width:710rpx;
				height:480rpx;
				background:rgba(255,239,161,1);
				box-shadow:0px 1px 6px 0px rgba(0, 0, 0, 0.2);
				border-radius:8px;
				padding: 60rpx 20rpx 0 20rpx;
				box-sizing: border-box;
				position: relative;
				.shut_down {
					width: 28rpx;
					height: 28rpx;
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}
				.rule_title {
					font-size:32rpx;
					font-family:'PingFang SC';
					font-weight:800;
					color:rgba(255,132,0,1);
					text-align: center;
					margin-bottom: 25rpx;
					.middle_text {
					    position: relative;	
					}
				}
				.rule_text {
					font-size:24rpx;
					font-family:'PingFang SC';
					font-weight:500;
					color:rgba(220,123,20,1);
					line-height: 36rpx;
					text-indent: 2em;
				}
			}
		}
		.event_goods {
			padding: 30rpx;
			text-align: center;
			font-size:28rpx;
			font-family:'PingFang SC';
			font-weight:500;
			color:rgba(51,51,51,1);
			.active_text {
				margin: 0 10rpx;
				vertical-align: middle;
			}
			image {
			    width: 35rpx;
				height: 26rpx;
				vertical-align: middle;
			}
		}
		.treasure_bdi {
			.wrap_list_content {
				padding: 20rpx;
				background-color: #FFFFFF;
				border-bottom: 1px solid #DDDDDD;
				display: flex;
				&:last-child {
					border-bottom: 0!important;
				}
				.left_img_src {
					width: 240rpx;
					flex: 0 0 240rpx;
					height: 240rpx;
					margin-right: 20rpx;
					.statr_oss {
						width: 100%;
						height: 100%;
						border-radius:8rpx;
					}
				}
				.right_title_schedule {
					flex: 1;
					position: relative;
					.product_title {
						font-size:28rpx;
						font-family:PingFang SC;
						font-weight:500;
						min-height: 77rpx;
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
						.percentage {
							color: #1BD12D;
						}
					}
					.schedule {
						margin-top: 12rpx;
						height:24rpx;
						background:rgba(229,229,229,1);
						border-radius:12rpx;
						overflow: hidden;
						.topline {
							height:24rpx;
							background:linear-gradient(180deg,rgba(25,196,41,1),rgba(29,219,47,1));
							border-radius:12rpx;
						}
					}
					.treasure_icon {
					    position: absolute;	
						right: 20rpx;
						bottom: 55rpx;
						width:80rpx;
						height:80rpx;
						background:rgba(255,151,51,1);
						border-radius:50%;
						display: flex;
						justify-content: center;
						align-items: center;
						image {
							width: 36rpx;
							height: 24rpx;
						}
					}
					.carry_out_status {
						position: absolute;
						right: 25rpx;
						bottom: 98rpx;
						font-size:24rpx;
						font-family:'PingFang SC';
						font-weight:500;
					}
				}
			}
		}
		.no_data {
			flex-direction: column;
			position: absolute;
			top: 78%;
			left: 50%;
			transform: translate(-50%, -50%);
		
			image {
				width: 115rpx;
				display: block;
				margin: 0 auto;
			}
		
			.tip {
				margin-top: 22rpx;
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
