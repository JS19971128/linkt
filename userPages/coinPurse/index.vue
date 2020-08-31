<template>
	<view class="coin_purse">
		<view class="wrap_nuxt">
			<view class="my_coin flex_between" >
				<view class="left_num" @click="goWithdrawList">
					<view class="my_coin_text">我的零钱</view>
					<view class="number_withdraw"><text class="amount">{{balanceData.balance || 0}}</text><text class="withdraw">提现</text></view>
				</view>
				<view class="right_detail" @click="goCoinList">
					<text class="text_more">零钱明细</text><image class="image_common" src="../../static/images/common/more_gray.png" mode=""></image>
				</view>
			</view>
			<view class="today_coin">今日零钱明细</view>	
		</view>
		
		<!-- 零钱明细列表 -->
		<view class="coin_list" v-if="list.length > 0">
			
			<view class="amount_withdraw" v-for="(item,index) in list" @click="goDetailsInfo(item.id)">
				<view class="flex_between">
					<view class="left_list_img">
						<view class="detail_icon">
							<image v-if="item.remark == '提现退款' || item.remark == '余额提现' || item.remark == '零钱提现'" class="balance_img" src="../../static/images/common/balance.png" mode=""></image>
							<image v-else class="balance_img" :src="item.merImg" mode=""></image>
						</view>
						<view class="flex">
							<view class="flex_name" v-if="item.remark == '提现退款' || item.remark == '余额提现' || item.remark == '零钱提现'">{{item.remark}}</view>
							<view class="flex_name" v-else>{{item.merName}} ({{item.remark}})</view>
							<view class="flex_date">{{item.createDate}}</view>
						</view>
					</view>
					<view class="right_amount">
						<text class="cut_back" v-if="item.remark == '余额提现' || item.remark == '零钱提现'">- {{item.amount}}</text>
						<text class="add_amount" v-else>+ {{item.amount}}</text>			
					</view>
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
				<!-- <view class="fz-12">您还没有提现过喔~</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balanceData: '',
				list: [],
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				page: 0,
				total: 0
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.userInfo;
			}
		},
		methods: {
			goDetailsInfo(id) {
				uni.navigateTo({
					url:'/userPages/detailedDetails/index?id=' + id
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
			},
			// 获取余额
			getBalance() {
				this.$fly.post(`/transfer/findBalanceByUserId?userId=${this.userInfo.id}&userType=NORMALUSER`)
				.then(res=>{
					if(res.code == 0){
						this.balanceData = res.data;
					}else{
						
					}
				})
			},
			getQueryList() {
				var Today = new Date();
				var date = Today.getFullYear()+ "-" + (Today.getMonth()+1) + "-" + Today.getDate();
			    this.$fly.post(`/transfer/queryList?userId=` + this.$store.state.userInfo.id + '&userType=NORMALUSER' + '&beginDate=' + date + '&endDate=' + date + '&page=' + this.page + '&size=20&sort=createDate,desc')
			    .then(res => {
			    	uni.hideLoading();
			    	if (res.code == 0) {
						let data = res.data;
						data.content.forEach(item=>{
							item.createDate = this.$util.formatTime(item.createDate,'yyyy-MM-dd');
						})
						this.total = data.totalElements;
						if(this.page === 0){
							this.list = []
						}
						this.list = this.list.concat(data.content);
						this.page++;
						if(this.page > data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
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
			this.getQueryList();
		},
		onLoad() {
			// 获取余额
			this.getBalance();
			// 获取零钱列表记录
			this.getQueryList();
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
	   
	   .no_data {
			flex-direction: column;
			position: absolute;
			top: 58%;
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
