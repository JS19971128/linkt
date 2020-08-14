<template>
	<view class="coin_purse">
		<view class="wrap_nuxt">
			<view class="my_coin flex_between" >
				<view class="left_num" @click="goWithdrawList">
					<view class="my_coin_text">我的零钱</view>
					<view class="number_withdraw"><text class="amount">{{userInfo.balance}}</text><text class="withdraw">提现</text></view>
				</view>
				<view class="right_detail" @click="goCoinList">
					<text class="text_more">零钱明细</text><image class="image_common" src="../../static/images/common/more_gray.png" mode=""></image>
				</view>
			</view>
			<view class="today_coin">今日零钱明细</view>
		</view>
		
		<!-- 零钱明细列表 -->
		<view class="coin_list">
			
			<view class="amount_withdraw" @click="goDetailsInfo">
				<view class="flex_between">
					<view class="left_list_img">
						<view class="detail_icon">
							<image class="balance_img" src="../../static/images/common/balance.png" mode=""></image>
						</view>
						<view class="flex">
							<view class="flex_name">太兴茶餐厅（商家回馈）</view>
							<view class="flex_date">2020-05-23 12:45:14</view>
						</view>
					</view>
					<view class="right_amount">
						<!-- <text class="add_amount">+ 320</text> -->
						<text class="cut_back">- 500</text>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		methods: {
			goDetailsInfo() {
				uni.navigateTo({
					url:'/userPages/detailedDetails/index'
				})
			},
			// 零钱明细
			goCoinList() {
				uni.navigateTo({
					url:'/userPages/coinList/index'
				})
			},
			// 提现
			goWithdrawList() {
				uni.navigateTo({
					url:'/userPages/withdrawList/index'
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style  lang="scss" scoped>
   .coin_purse {
	   min-height: 100vh;
	   padding-top: 265rpx;
	   background-color: #EEEEEE;
	   box-sizing: border-box;
	   padding-bottom: 20rpx;
	   .wrap_nuxt {
		   position: fixed;
		   top:0;
		   left: 0;
		   right: 0;
		   z-index: 10;
		   height: 265rpx;
		   .today_coin {
			   height: 80rpx;
			   background-color: #EEEEEE;
			   font-size:28rpx;
			   font-family:PingFang SC;
			   font-weight:500;
			   color:rgba(51,51,51,1);
			   padding: 0 20rpx;
			   line-height: 80rpx;
		   }
		   .my_coin {
			   height: 185rpx;
			   background-color: #FFFFFF;
			   box-shadow:0px 2px 6px 0px rgba(0, 0, 0, 0.15);
			   padding: 0 20rpx;
			   .left_num {
				   .my_coin_text {
					   font-size:28rpx;
					   font-family:'PingFang SC';
					   font-weight:500;
					   color:rgba(51,51,51,1);
				   }
				   .number_withdraw {
					   margin-top: 25rpx;
					   .amount {
						   width: 410rpx;
						   font-size: 56rpx;
						   margin-right: 20rpx;
						   vertical-align: bottom;
						   display: inline-block;
					   }
					   .withdraw {
						   font-size:26rpx;
						   font-family:PingFang SC;
						   font-weight:500;
						   color:rgba(255,151,51,1);  
						   vertical-align: bottom;
					   }
					}
			   }
			   .right_detail {
				   font-size:26rpx;
				   font-family:PingFang SC;
				   font-weight:500;
				   color:rgba(153,153,153,1);
				   .text_more {
					   vertical-align: middle;
				   }
				   .image_common {
					   width: 12px;
					   height: 12px;
					   margin-left: 11rpx;
					   vertical-align: middle;
				   }
			   }
		   }
	   }
	   .coin_list {
		   
		   padding: 0 20rpx;
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
	   }
   }
</style>
