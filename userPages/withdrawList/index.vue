<template>
	<view class="coin_purse">
		<view class="wrap_nuxt">
			<view class="my_coin" >
				<view class="left_num" @click="goBankCardList">
					<view class="my_coin_text">
						<view class="arrive"><text>到账银行卡</text><image v-if="list" class="wallet_icon" src="../../static/images/common/bank.png" mode="aspectFill"></image></view>
					</view>
					<view class="number_withdraw flex_between">
						<view class="wrap_out" v-if="list">
							<view class="bank"><text class="name">{{list.bankName}}</text><text class="account">{{bankType(list.settleBankType).status}}</text></view>
							<view class="card_number">{{bankNmberShow(list.accountNo)}}</view>
						</view>
						<view class="add_bank" v-else>
							<text class="icon_bg">+</text> <text class="add_text_bank">添加银行卡</text>
						</view>
						<image class="image_common" src="../../static/images/common/more_gray.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="right_detail">
					<view class="withdraw_title">提现金额</view>
					<view class="number_amount">
						<text class="icon_character">￥</text><input type="digit" v-model="withdrawAmount" placeholder="请输入金额"/>
					</view>
					<view class="coin_withdraw margin_top">
						<text class="left_text">零钱可提现余额￥{{balanceData || 0}} </text> <text class="all_withdraw" @click="allWithdraw"> 全部提现</text>
					</view>
					<view class="coin_withdraw text_nuxt_name">
						<text class="left_text">提现手续费: 1.00元</text>
					</view>
					<view class="coin_withdraw text_nuxt_name">
						<text class="left_text">备注: 晚上11点后提现，隔天早上8点到账</text>
					</view>
					<view v-if="withdrawAmount&&timer" class="withdraw_bnt active_bg" @click="withdraw">
						提现
					</view>
					<view v-else class="withdraw_bnt">
						提现
					</view>
				</view>
			</view>
			<view class="today_coin">提现记录</view>
		</view>
		
		<!-- 零钱明细列表 -->
		<view class="coin_list" v-if="transferlList.length > 0">
			
			<view class="amount_withdraw" v-for="(item,index) in transferlList" @click="goDetailsInfo(item)">
				<view class="flex_between">
					<view class="left_list_img">
						<view class="detail_icon">
							<image class="balance_img" src="../../static/images/common/balance.png" mode="aspectFill"></image>
						</view>
						<view class="flex">
							<view class="flex_name">余额提现</view>
							<view class="flex_date">{{item.createDate}}</view>
						</view>
					</view>
					<view class="right_amount">
						<!-- <text class="add_amount">+ 320</text> -->
						<text class="cut_back">- {{item.amount}}</text>
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
				<view class="fz-12">您还没有提现过喔~</view>
			</view>
		</view>
	</view>
</template>

<script>
	import code from '@/common/util/bank_number.js'
	export default {
		data() {
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list: '',
				page: 0,
				total: 0,
				withdrawAmount: null, //提现
				transferlList: [],
				balanceData: '',
				timer:true
			}
		},
		watch: {
			withdrawAmount(newVal,oldVal) {
				var a=/^[0-9]*(\.[0-9]{1,2})?$/;
				if(!a.test(this.withdrawAmount)) {
					console.log('格式不du正确zhidao');
					this.timer = false;
					return false;
				} else {
					this.timer = true;
				}
				
				if (newVal.length == 2) {
					if (newVal.substr(1,1) != '.' && newVal.substr(0,1) == 0) {
						if (newVal.substr(1,1) == 0) {
							this.withdrawAmount = '0';
						} else {
							this.withdrawAmount = newVal.substr(1,1);
						}
					}
				}
			}
		},
		methods: {
			goDetailsInfo(item) {
				uni.navigateTo({
					url:'/userPages/detailedDetails/index?id=' + item.id + '&reason=' + item.reason + '&orderStatus=' + item.orderStatus + '&userType=' + item.userType
				})
			},
			bankNmberShow(num) {
				var num1 = num.replace(/(.{4})/g, "$1 ");
				return num1;
			},
			// 全部提现
			allWithdraw() {
				if (this.balanceData) {
					this.withdrawAmount = Math.floor((this.balanceData * 1000)/10) / 100;
				} else {
					this.withdrawAmount = '0';
				}
			},
			bankType(status) {
				switch (status) {
					case "B2B":
						return {
							status: "对公账户"
						};
					case "B2C":
						return {
							status: "个人账户"
						};
					default:
						return "";
				}
			},
			goBankCardList() {
				uni.navigateTo({
					url:'/userPages/bankCardList/index'
				})
			},
			getBankInfo() {
				this.$fly.post(`/transfer/findBank?userId=` + this.$store.state.userInfo.id)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							if (res.data.length > 0) {
								this.list = res.data[0];
							}
							
						} else {
							uni.showToast({
							    title: res.message,
								icon: 'none',
							    duration: 2000
							});
						}
					})
			},
			// 提现
			withdraw() {
				var _this = this;
				if (this.list == '') {
					uni.showToast({
					    title: '请添加银行卡哦',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				
				if (!this.withdrawAmount) {
					uni.showToast({
					    title: '请输入提现金额',
						icon:'none',
					    duration: 2000
					});
					return false;
				}

				if (this.withdrawAmount > this.balanceData) {
					uni.showToast({
					    title: '提现金额不能大于零钱可提现金额哦',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				
				if (this.withdrawAmount <= 0) {
					uni.showToast({
					    title: '提现金额不足，无法提现哦',
						icon:'none',
					    duration: 2000
					});
					return false;
				}
				
				
				uni.showModal({
				    title: '提示',
				    content: '确认提现?',
				    success: function (res) {
				        if (res.confirm) {
				            _this.confirmWithdraw();
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 确认提现
			confirmWithdraw() {
				if(this.timer){
					this.timer = false;
					setTimeout(()=>{
						this.timer = true;
					},3000)
				}else{
					return;
				}
				
				var bankCode = '';
				for (var i = 0;i < code.length; i ++) {
					if (code[i].name == this.list.bankName) {
						bankCode = code[i].code;
					}
				}
				let param = {
					amount: this.withdrawAmount,
					bankAccountName: this.list.accountName,
					bankAccountNo: this.list.accountNo,
					bankCode,
					bankUnionCode: this.list.bankCode,
					biz: this.list.settleBankType,
					urgency: false,
					userType: 'NORMALUSER',
                    userId: this.$store.state.userInfo.id
				}
	
				this.$fly.post(`/transfer/pay`, param)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							uni.showToast({
							    title: '提现成功！',
								icon: 'success',
							    duration: 2000
							});
							uni.navigateBack({
							    delta: 1
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
			transferList() {
			    this.$fly.post(`/transfer/list?userId=` + this.$store.state.userInfo.id + '&userType=NORMALUSER' + '&page=' + this.page + '&size=20&sort=createDate,desc')
				.then(res => {
					uni.hideLoading();
					if (res.code == 0) {
						let data = res.data;
						this.total = data.totalElements;
						if(this.page === 0){
							this.transferlList = []
						}
						this.transferlList = this.transferlList.concat(data.content);
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
			},
			getBalanceSmall() {
				this.$fly.post(`/transfer/findBalanceByUserId?userId=${this.$store.state.userInfo.id}&userType=NORMALUSER`)
				.then(res=>{
					if(res.code == 0){
						let balance = res.data.balance - res.data.todayBalance;
						let amount = Math.floor(balance * 1000) / 1000;
						this.balanceData = (amount*1000 - 1000)/1000;
						if (this.balanceData < 0) {
						    this.balanceData = 0;
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			}
		},
		onLoad() {
			// 默认获取银行卡信息
			this.getBankInfo();
		},
		onReachBottom: function() { //触底加载
			if (this.status == 'noMore') {
				return
			}
			this.transferList();
		},
		onShow() {
			this.page = 0;
			
			// 获取提现记录列表
			this.transferList();
			// 获取零钱可提现余额
			this.getBalanceSmall();
			
			let bankInfo = this.$store.state.bankInfo;
			if (bankInfo) {
				this.list = bankInfo;
			}
			
		}
	}
</script>

<style  lang="scss" scoped>
   .coin_purse {
	   min-height: 100vh;
	   background-color: #EEEEEE;
	   padding-top: 720rpx;
	   box-sizing: border-box;
	   padding-bottom: 20rpx;
	   .wrap_nuxt {
		   position: fixed;
		   top:0;
		   left: 0;
		   right: 0;
		   z-index: 10;
		   height: 720rpx;
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
			   height: 610rpx;
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
					   .add_bank {
						   display: flex;
						   justify-content: flex-start;
						   align-items: center;
						   .icon_bg {
							   width:50rpx;
							   height:50rpx;
							   background:rgba(255,185,85,1);
							   border-radius:50%;
							   display: flex;
							   justify-content: center;
							   align-items: center;
							   margin-right: 15rpx;
							   color: #FFFFFF;
						   }
						   .add_text_bank {
							   font-size:32rpx;
							   font-family:PingFang SC;
							   font-weight:500;
							   color:rgba(51,51,51,1);
						   }
					   }
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
					   line-height: 30rpx;
					   margin-top: 30rpx;
					   font-size:28rpx;
					   font-family:PingFang SC;
					   font-weight:500;
					   color:rgba(51,51,51,1);
				   }
				   .number_amount {
					   height: 106rpx;
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
				   .text_nuxt_name {
					   margin-top: 16rpx;
				   }
				   .coin_withdraw {
					   line-height: 24rpx;
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
					   background-color: #CCCCCC;
					   border-radius:37rpx;
					   line-height: 74rpx;
					   text-align: center;
					   font-size:32rpx;
					   font-family:PingFang SC;
					   font-weight:500;
					   color:rgba(255,255,255,1);
					   margin-top: 40rpx;
				   }
				   .active_bg {
					   background:rgba(255,157,17,1)!important;
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
	   	top: 80%;
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
