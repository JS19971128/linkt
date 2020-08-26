<template>
	<view class="bank_card_list">
	   <view class="china_bank" v-for="(item,index) in list" :class="{'bg_color': oddEven(index) == false}" @click="pickBank(item)">
	   	  <view class="build">
	   	  	<text class="name">{{item.bankName}}</text> <text class="account">{{bankType(item.settleBankType).status}}</text>
	   	  </view>
		  <view class="card_number">
		  	{{item.accountNo}}
		  </view>
		  <image class="card_logo" src="../../static/images/common/card_logo.png" mode=""></image>
	   </view>
	   
	   <!-- 添加银行卡 -->
	   <view class="add_bank_card" @click="goAddBankCard">
	   	 +  添加银行卡
	   </view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				list: null
			}
		},
		methods: {
			// 选择银行卡号
			pickBank(item) {
			    console.log(item);
				this.$store.state.bankInfo = item;
				uni.navigateBack({
				    delta: 1
				});
			},
			goAddBankCard() {
				uni.navigateTo({
					url:'/userPages/addBankCard/index'
				})
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
			// 获取银行卡列表
			getBankList() {
				this.$fly.post(`/transfer/findBank?userId=` + this.$store.state.userInfo.id)
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
			},
			oddEven(index) {
				if (index%2 == 0) {
					return true;
				} else {
					return false;
				}
			}
		},
		onShow() {
			this.getBankList();
		}
	}
</script>

<style lang="scss" scoped>
	.bank_card_list {
		min-height: 100vh;
		background-color: #f2f2f2;
		padding: 30rpx 20rpx 0 20rpx;
		box-sizing: border-box;
		.bg_color {
			background:rgba(255,151,51,1)!important;
		}
		.china_bank {
			position: relative;
			height:203rpx;
			background:rgba(117,185,255,1);
			box-shadow:0px 1px 6px 0px rgba(0, 0, 0, 0.15);
			border-radius:8rpx;
			padding-left: 20rpx;
			padding-top: 43rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;
			.build {
				.name {
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
					margin-right: 30rpx;
				}
				.account {
					font-size:26rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
				}
			}
			.card_number {
				font-size:42rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				margin-top: 38rpx;
			}
			.card_logo {
				position: absolute;
                width: 140rpx;
				height: 121rpx;
				right: 0;
				bottom: 0;
			}
		}
		.add_bank_card {
			height:140rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height: 140rpx;
			padding-left: 40rpx;
		}
	}
</style>
