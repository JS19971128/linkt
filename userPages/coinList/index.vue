<template>
	<view class="coin_purse">
		<!-- 选择日期 -->
		<view v-if="visible" class="picker_date_list">
			<view @click="visibleShow" class="visibleShowOptions"></view>
			<view class="wrap_cancel_confirm">
				<view class="cancel_bnt">
					<text @click="visibleShow">取消</text>
					<text class="confirm" @click="confirm_bnt_list">确认</text>
				</view>
				<picker-view  :indicator-style="indicatorStyle" :value="value" @change="bindChange">
					<picker-view-column>
						<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
					</picker-view-column>
					<!-- <picker-view-column>
						<view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
					</picker-view-column> -->
				</picker-view>
			</view>
		</view>
		<!-- 零钱明细列表 -->
		<view class="coin_list">
			<view v-if="userType == 'MERCHANT'" class="all_details" :style="{height: allDetails}">
				<view class="date_image" @click="visibleShow">
					<text class="date_text">{{year}}年{{month}}月</text><image src="../../static/images/shop/more-up.png" mode="aspectFit"></image>
				</view>
				<view class="income">收入￥ {{totalAmount}}</view>
			</view>
			<view v-else class="all_details" :style="{height: allDetails}">
				全部明细
			</view>
			
			<view v-if="list.length>0" :style='{paddingTop: allDetails}'>
				<view class="amount_withdraw" v-for="(item,index) in list" @click="goDetailsInfo(item)" :key="index" >
					<view class="flex_between">
						<view class="left_list_img">
							<view class="detail_icon">
								<image v-if="item.remark == '提现退款' || item.remark == '余额提现' || item.remark == '零钱提现'" class="balance_img" src="../../static/images/common/balance.png" mode="aspectFill"></image>
								<image v-else class="balance_img" :src="item.merImg" mode="aspectFill"></image>
							</view>
							<view class="flex">
								<view class="flex_name" v-if="item.remark == '提现退款' || item.remark == '余额提现' || item.remark == '零钱提现'">{{item.remark}}</view>
								<view class="flex_name" v-else>{{item.merName}} <text v-if="userType == 'NORMALUSER'">({{item.remark}})</text></view>
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
			
			<!-- 无数据时 -->
			<view class="flex_center no_data" v-else :style='{paddingTop: allDetails}'>
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
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()
			for (let i = 1990; i <= date.getFullYear(); i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			for (let i = 1; i <= 31; i++) {
				days.push(i)
			}
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: [],
				page: 0,
				total: 0,
				userType: 'NORMALUSER',
				allDetails: '80rpx',
				title: 'picker-view',
				years,
				year,
				months,
				month,
				days,
				day,
				value: [30, month - 1, day - 1],
				visible: false,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`,
				cookiesYear: '',
				cookiesMonth: '',
				totalAmount: '',
				yearIndex: 30
			}
		},
		methods: {
			// 确定选择月份
			confirm_bnt_list() {
				if (this.cookiesYear == '' || this.cookiesMonth == '') {
					this.visible = false;
					return false;
				}
				this.year = this.cookiesYear;
				this.month = this.cookiesMonth;
				this.value[0] = this.yearIndex; // 年
				this.value[1] = this.month - 1; // 月
				this.page = 0;
				this.totalAmount = 0;
				this.visible = false;
				this.transferList();
				this.getIncome();
			},
			visibleShow() {
				console.log(this.value)
				this.visible = !this.visible;
			},
			bindChange: function (e) {
				const val = e.detail.value
				this.yearIndex = val[0];
				this.cookiesYear = this.years[val[0]];
				this.cookiesMonth = this.months[val[1]];
			},
			goDetailsInfo(item) {
				uni.navigateTo({
					url:'/userPages/detailedDetails/index?id=' + item.id + '&reason=' + item.reason + '&orderStatus=' + item.orderStatus + '&userType=' + ''
				})
			},
			getIncome() {
				this.$fly.get(`/transfer/totalAmount?userId=` + this.$store.state.userInfo.id + '&userType=' + this.userType + '&queryMonth=' + this.year + '-' + this.month)
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						let data = res.data;
						this.totalAmount = data.totalAmount;
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
						
					}
				})
			},
		    transferList() {
				let queryMonth = this.year + '-' + this.month;
			    this.$fly.post(`/transfer/queryList?userId=` + this.$store.state.userInfo.id + '&queryMonth=' + queryMonth + '&userType=' + this.userType + '&page=' + this.page + '&size=20&sort=createDate,desc')
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
			this.transferList();
		},
		onLoad(option) {
			if (option.type == 'MERCHANT') {
				wx.setNavigationBarTitle({
				  title: '余额明细'
				})
				this.userType = 'MERCHANT'
				this.allDetails = '110rpx';
			}	
			this.transferList();
			// 获取收入
			this.getIncome();
		}
	}
</script>

<style  lang="scss" scoped>
	picker-view {
		width: 100%;
		height: 600rpx;
	}
	.item {
		line-height: 100rpx;
		text-align: center;
	}
		
   .coin_purse {
	   min-height: 100vh;
	   background-color: #EEEEEE;
	   .picker_date_list {
		   position: fixed;
		   top: 0;
		   left: 0;
		   right: 0;
		   bottom: 0;
		   z-index: 110;
		   background: rgba(0,0,0, 0.4);
		   .visibleShowOptions {
			   position: absolute;
			   top: 0;
			   left: 0;
			   right: 0;
			   bottom: 716rpx;
		   }
		   .wrap_cancel_confirm {
			   position: absolute;
			   bottom: 0;
			   left: 0;
			   right: 0;
			   background-color: #FFFFFF;
			   .cancel_bnt {
				    height: 116rpx;
					width: 100%;
					border-bottom: 1px solid #ececec;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 40rpx;
					font-size: 36rpx;
					color: #707070;
					box-sizing: border-box;
					.confirm {
						color: #0177F4;
					}
				}
			}
	   }
	   .coin_list {
		   padding: 0 20rpx;
		   .all_details {
			   position: fixed;
			   top: 0;
			   left: 0;
			   right: 0;
			   z-index: 100;
			   background-color: #EEEEEE;
			   padding: 20rpx;
			   font-size:28rpx;
			   font-family:PingFang SC;
			   font-weight:500;
			   color:rgba(51,51,51,1);
			   box-sizing: border-box;
			   .date_image {
				   image {
					   margin-left: 10rpx;
					   width: 40rpx;
					   height: 40rpx;
					   vertical-align: middle;
				   }
				   .date_text {
					   vertical-align: middle;
				   }
			   }
			   .income {
				   font-size: 26rpx;
				   font-family: PingFang SC;
				   font-weight: 500;
				   color: #9A9A9A;
				   line-height: 1.1;
			   }
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
