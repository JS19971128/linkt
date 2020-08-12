<template>
	<view class="coin_purse">
		
		<!-- 零钱明细列表 -->
		<view class="coin_list">
			<view class="all_details">
				全部明细
			</view>
			<view class="amount_withdraw">
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
		methods: {
		
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
	   }
   }
</style>
