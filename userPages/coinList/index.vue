<template>
	<view class="coin_purse">
		
		<!-- 零钱明细列表 -->
		<view class="coin_list">
			<view class="all_details">
				全部明细
			</view>
			
			<view v-if="list.length>0">
				<view class="amount_withdraw" v-for="(item,index) in list">
					<view class="flex_between">
						<view class="left_list_img">
							<view class="detail_icon">
								<!-- <image class="balance_img" src="../../static/images/common/balance.png" mode=""></image> -->
								<image class="balance_img" :src="item.mainUrl" mode=""></image>
							</view>
							<view class="flex">
								<view class="flex_name">{{item.title}}</view>
								<view class="flex_date">{{item.createDate}}</view>
							</view>
						</view>
						<view class="right_amount">
							<!-- <text class="add_amount">+ 320</text> -->
							<text class="cut_back">- 500</text>
						</view>
					</view>
				</view>
				<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
			</view>
			
			<!-- 无数据时 -->
			<view class="flex_center no_data" v-else>
				<view>
					<image src="../../static/images/order/order_none.png" mode="widthFix"></image>
				</view>
				<view class="tip">
					<view class="fz-14">暂无明细</view>
					<!-- <view class="fz-12">您还没有夺宝过喔~</view> -->
				</view>
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
			}
		},
		methods: {
		    transferList() {
			    this.$fly.post(`/transfer/queryList?userId=` + this.$store.state.userInfo.id + '&page=0&size=20&sort=createDate,desc')
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						this.list = res.data;
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
			this.transferList();
		},
		onLoad() {
			this.transferList();
		}
	}
</script>

<style  lang="scss" scoped>
   .coin_purse {
	   min-height: 100vh;
	   background-color: #EEEEEE;
	   .coin_list {
		   padding: 0 20rpx;
		   .all_details {
			   padding: 20rpx 0;
			   font-size:28rpx;
			   font-family:PingFang SC;
			   font-weight:500;
			   color:rgba(51,51,51,1);
		   }
		   .amount_withdraw {
			   height:140rpx;
			   background:rgba(255,255,255,1);
			   border-radius:8px;
			   padding: 20rpx;
			   box-sizing: border-box;
			   margin-bottom: 20rpx;
			   .flex_between {
			   		.left_list_img {
					   .detail_icon {
						   display: inline-block;
						   height: 100rpx;
						   width: 100rpx;
						   border-radius: 6rpx;
						   margin-right: 18rpx;
						   vertical-align: top;
						   .balance_img {
							   height: 100rpx;
							   width: 100rpx;
						   }
					   }
					   .flex {
						   display: inline-block;
						   height: 100rpx;
						   vertical-align: top;
						   .flex_name {
							   font-size:30rpx;
							   font-family:PingFang SC;
							   font-weight:500;
							   color:rgba(51,51,51,1);
							   width: 55vw;
							   overflow: hidden;
							   text-overflow: ellipsis;
							   display: -webkit-box;
							   -webkit-line-clamp: 1;
							   -webkit-box-orient: vertical;
						   }
						   .flex_date {
							   font-size:24rpx;
							   font-family:PingFang SC;
							   font-weight:500;
							   color:rgba(153,153,153,1);
							   margin-top: 18rpx;
						   }
					   }
			   		}
			   		.right_amount {
					   .add_amount {
						   font-size:36rpx;
						   font-family:PingFang SC;
						   font-weight:800;
						   color:rgba(255,151,51,1);
						}
						.cut_back {
						   font-size:36rpx;
						   font-family:PingFang SC;
						   font-weight:800;
						   color:rgba(71,211,71,1);
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
   }
</style>
