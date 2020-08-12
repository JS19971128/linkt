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
					<view class="frist_uni">0</view>
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
                    在95折以下（不包含95折）的商家消费后，或者购买95折以下（不包含95折）的商品后，会获得夺宝券。夺宝券的面额将以消费金额中的商家折扣计算得出。
				</view>
				<view class="rule_text">
					每张夺宝券有一个专属编号，可单张或多张同时使用，给商品充能。如果该商品能量已充满，将不能继续再对此商品继续充能，可更换其他商品充能。
				</view>
				<view class="rule_text">
					当商品能量充满后，将在会抽取幸运号码，拥有该幸运号码者，将直接获得该商品。
				</view>
			</view>
		</view>
		
		<!-- 消费夺宝--参与夺宝 -->
		<view class="consumption" v-if="consumptionRule">
			<view class="middle_content">
				<image class="shut_down" @click="consumptionRule=false" src="../../static/images/shop/border_close.png" mode=""></image>
				<view class="commodity_list">
					<view class="left_wrap_image">
						<image src="http://xlzx.oss-cn-shenzhen.aliyuncs.com/user/20200808164252707_statr.png" mode=""></image>
					</view>
					<view class="right_info_show">
						<view class="info_title">一二三四五六七八九十一二三四五一二三四五六七八九十一二三四五...</view>
						<view class="info_amount">价值：999.00</view>
						<view class="info_amount">价值：999.00</view>
					</view>
				</view>
				<!-- 进度条 -->
				<view class="progress_bar">
					<view class="uni_self" :style="{width:width + '%'}"></view>
				</view>
				<view class="participation_progress">
					<view class="left_participation"><text>已参与夺宝：</text><text class="frequency">2530人次</text></view>
					<view class="left_participation"><text>夺宝进度：</text><text class="frequency">23%</text></view>
				</view>
				<!-- 夺宝券 -->
				<view class="lottery_ticket"><text>夺宝券：</text><text class="sheet">35张</text></view>
				<view class="lottery_ticket_frequency">1张夺宝券可增加1人次，使用的越多夺宝几率越大</view>
				<view class="lottery_ticket_num">
					<view class="less">-</view>
					<view class="less_num_add"><input type="number"  /></view>
					<view class="less">+</view>
				</view>
				<view class="participate_treasure_hunt">参与夺宝</view>
			</view>
		</view>
		
		<!-- 夺宝商品 -->
		<view class="event_goods">
			<image src="../../static/images/shop/hot.png" mode=""></image>
			<text class="active_text">夺宝商品</text>
			<image src="../../static/images/shop/hot.png" mode=""></image>
		</view>
		<!-- 列表 -->
		<view class="treasure_bdi">
			
			<view class="wrap_list_content" @click="goProductDetails">
				<view class="left_img_src">
					<image class="statr_oss" src="http://xlzx.oss-cn-shenzhen.aliyuncs.com/user/20200808164252707_statr.png" mode=""></image>
				</view>
				<view class="right_title_schedule">
					<view class="product_title">日式米饭碗 复古陶瓷碗汤面碗4.5寸 创意日系小碗盘 日式米饭碗 复古陶瓷碗汤面碗4.5寸 创意日系小碗盘</view>
					<view class="worth">价值：999.00</view>
					<view class="worth">数量：2</view>
					<view class="worth"><text>夺宝进度：</text><text class="percentage">23%</text></view>
					<view class="schedule">
						<view class="topline" :style="{width:width + '%'}"></view>
					</view>
					<view class="treasure_icon" @click="openConsumptionRule">
						<image src="../../static/images/shop/treasure.png" mode=""></image>
					</view>
				</view>
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
				page:0,//页码
				status:'noMore',//请求切换
				total: 0,
				voucherRule: false,
				consumptionRule: false, // 消费夺宝
			}
		},
		components:{goodsList},
		onLoad() {
			this.navListFun();
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
		methods: {
			goProductDetails() {
				uni.navigateTo({
					url:'/treasure/productDetails/index'
				})
			},
			// 消费夺宝
			openConsumptionRule() {
				this.consumptionRule = true;
			},
			goMyTreasure() {
				uni.navigateTo({
					url:'/treasure/myTreasure/index'
				})
			},
			navListFun() {
				this.$fly.get(`/app/mall/list?size=10&page=${this.page}&sortType=sort_time&searchType=draw&sort=createDate,desc`).then(res=>{
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
					box-shadow:0px 1px 6px 0px rgba(209,209,209,1);
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
