<template>
	<view class="coin_purse">
		<view class="wrap_nuxt">
			<view class="my_coin" >
				<view class="left_num" @click="goBankCardList">
					<view class="my_coin_text">
						<view class="arrive"><text>到账银行卡</text><image class="wallet_icon" src="../../static/images/common/bank.png" mode=""></image></view>
					</view>
					<view class="number_withdraw flex_between">
						<view class="wrap_out">
							<view class="bank"><text class="name">建设银行</text><text class="account">对公账户</text></view>
							<view class="card_number">**** **** **** 4322</view>
						</view>
						<image class="image_common" src="../../static/images/common/more_gray.png" mode=""></image>
					</view>
				</view>
				<view class="right_detail">
					<view class="withdraw_title">提现金额</view>
					<view class="number_amount">
						<text class="icon_character">￥</text><input type="number" placeholder="请输入金额"/>
					</view>
					<view class="coin_withdraw margin_top">
						<text class="left_text">零钱可提现余额￥400000.00，</text><text class="all_withdraw">全部提现</text>
					</view>
					<view class="coin_withdraw">
						<text class="left_text">提现手续费: 1.00元</text>
					</view>
					<view class="withdraw_bnt">
						提现
					</view>
				</view>
			</view>
			<view class="today_coin">提现记录</view>
		</view>
		
		<!-- 零钱明细列表 -->
		<view class="coin_list">
			
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
			goBankCardList() {
				uni.navigateTo({
					url:'/userPages/bankCardList/index'
				})
			}
		}
	}
</script>

<style  lang="scss" scoped>
   .coin_purse {
	   min-height: 100vh;
	   background-color: #EEEEEE;
	   padding-top: 680rpx;
	   box-sizing: border-box;
	   padding-bottom: 20rpx;
	   .wrap_nuxt {
		   position: fixed;
		   top:0;
		   left: 0;
		   right: 0;
		   z-index: 10;
		   height: 680rpx;
		   padding: 20rpx 20rpx 0 20rpx;
		   background-color: #EEEEEE;
		   box-sizing: border-box;
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
			   height: 570rpx;
			   background-color: #FFFFFF;
			   box-shadow:0px 2px 6px 0px rgba(0, 0, 0, 0.15);
			   .left_num {
				   height: 130rpx;
				   background:rgba(247,242,236,1);
				   padding: 0 20rpx;
				   display: flex;
				   .my_coin_text {
					   flex: 0 0 200rpx;
					   margin-right: 14rpx;
					   padding-top: 20rpx;
					   vertical-align: top;
					   .arrive {
						   font-size:28rpx;
						   font-family:PingFang SC;
						   font-weight:500;
						   color:rgba(51,51,51,1);
						   .wallet_icon {
							   width: 32rpx;
							   height: 26rpx;
							   margin-left: 28rpx;
						   }
					   }
				   }
				   .number_withdraw {
					   flex: 1;
					   vertical-align: top;
					   .wrap_out {
						   .bank {
							   .name {
								   font-size:28rpx;
								   font-family:PingFang SC;
								   font-weight:500;
								   color:rgba(51,51,51,1);
								   margin-right: 20rpx;
							   }
							   .account {
								   font-size:24rpx;
								   font-family:PingFang SC;
								   font-weight:500;
								   color:rgba(153,153,153,1);
							   }
						   }
						   .card_number {
							   margin-top: 20rpx;
							   font-size:28rpx;
							   font-family:PingFang SC;
							   font-weight:500;
							   color:rgba(51,51,51,1);
						   }
					   }
					   .image_common {
						   width: 12px;
						   height: 12px;
					   }
				   }
			   }
			   .right_detail {
				   padding: 0 20rpx;
				   .withdraw_title {
					   margin-top: 30rpx;
					   font-size:28rpx;
					   font-family:PingFang SC;
					   font-weight:500;
					   color:rgba(51,51,51,1);
				   }
				   .number_amount {
					   height: 110rpx;
					   box-sizing: border-box;
					   border-bottom: 1px solid #DDDDDD;
					   display: flex;
					   font-size:56rpx;
					   font-family:PingFang SC;
					   font-weight:bold;
					   color:rgba(51,51,51,1);
					   .icon_character {
						   width: 60rpx;
						   flex: 0 0 60rpx;
						   line-height: 110rpx;
						   vertical-align: middle;
					   }
					   input {
						   flex: 1;
						   padding: 0 30rpx;
						   height: 100%;
						   vertical-align: middle;
					   }
				   }
				   .margin_top {
					   margin-top: 43rpx;
				   }
				   .coin_withdraw {
					   .left_text {
						   font-size:24rpx;
						   font-family:PingFang SC;
						   font-weight:500;
						   color:rgba(153,153,153,1);
					   }
					   .all_withdraw {
						   font-size:24rpx;
						   font-family:PingFang SC;
						   font-weight:500;
						   color:rgba(255,151,51,1);
						   margin-left: 13rpx;
					   }
				   }
				   .withdraw_bnt {
					   height:74rpx;
					   background:rgba(255,157,17,1);
					   border-radius:37rpx;
					   line-height: 74rpx;
					   text-align: center;
					   font-size:32rpx;
					   font-family:PingFang SC;
					   font-weight:500;
					   color:rgba(255,255,255,1);
					   margin-top: 43rpx;
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
