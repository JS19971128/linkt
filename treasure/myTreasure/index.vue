<template>
	<view class="my_treasure">
		<view class="treasure_table">
			<view class="table_title" :class="{'active': index === 0}" @click="tabItem(0)">夺宝中 23</view>
			<view class="table_title" :class="{'active': index === 1}" @click="tabItem(1)">已中奖 2</view>
			<view class="table_title" :class="{'active': index === 2}" @click="tabItem(2)">已结束 25</view>
		</view>
		<view class="list_bdi_wrap">
			
			<view class="treasure_list">
				<view class="image_title_status">
					<view class="left_image">
						<image src="http://xlzx.oss-cn-shenzhen.aliyuncs.com/user/20200808164252707_statr.png" mode=""></image>
					</view>
					<view class="right_info_name">
						<view class="name">日式米饭碗 复古陶瓷碗汤面碗4.5寸 创意日系小碗盘</view>
						<view class="worth">价值：999.00</view>
						<view class="worth">数量：1</view>
						<view class="worth">已参与：8张券</view>
						<view class="worth" v-if="index == 1">中奖编号：DB5588996655887744</view>
						<view class="flex_between progress_bar" v-if="index == 0">
							<view class="left_progress"><view class="bar" :style="{width:width + '%'}"></view></view>
							<view class="percentage">23%</view>
						</view>
						<view class="treasure_status"><text class="active_status">进行中</text><image src="../../static/images/common/more_gray.png" mode=""></image></view>
					</view>
				</view>
				<!-- 继续夺宝--确认订单 -->
				<view class="Keep_winning" v-if="index == 1 || index == 0">
					<view class="winning"><view class="winning_text">继续夺宝</view></view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index: 0,
				width: 23,
			}
		},
		methods: {
			tabItem(index) {
				this.index = index
			}
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
							line-height:42rpx;
						}
					}
				}
			}
		}
	}
</style>
