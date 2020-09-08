<template>
	<view class="detail_details">
		<view class="info_show">
			<view class="top_avatar">
				<image class="src_image_avatar" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现' || findOne.remark == '提现退款'" src="../../static/images/common/balance.png" mode="aspectFill"></image>
				<image class="src_image_avatar" v-else :src="findOne.merImg" mode="aspectFill"></image>
				<view class="title_name" v-if="findOne.remark == '余额提现'  || findOne.remark == '零钱提现' || findOne.remark == '提现退款'">{{findOne.remark}}</view>
				<view class="title_name" v-else>{{findOne.merName}}</view>
				
				<view class="title_price_withdraw" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现'">-{{findOne.amount}}</view>
				<view class="title_price" v-else>+{{findOne.amount}}</view>
			</view>
			<view class="type_order">
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">类型</view> <view class="date_time">{{findOne.remark}}</view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现' || findOne.remark == '提现退款'">
					<view class="type_split_account">提现状态</view> <view class="date_time"><text v-if="findOne.orderStatus == 'SUCCESS'">提现成功</text><text v-if="findOne.orderStatus == 'FAIL'">提现失败</text><text v-if="!findOne.orderStatus">提现中</text></view>
				</view>
				<view class="wrap_flex_nuxt">
					<view class="type_split_account">交易单号</view> <view class="date_time">{{findOne.orderId}}</view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark != '余额提现' && findOne.remark != '零钱提现' && findOne.remark != '提现退款'">
					<view class="type_split_account">订单金额</view> <view class="date_time">{{findOne.orderAmount || 0}}</view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark != '余额提现' && findOne.remark != '零钱提现' && findOne.remark != '提现退款'">
					<view class="type_split_account">抵扣金额</view> <view class="date_time">{{findOne.discountAmount || 0}}</view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark != '余额提现' && findOne.remark != '零钱提现' && findOne.remark != '提现退款'">
					<view class="type_split_account">支付时间</view> <view class="date_time">{{findOne.createDate}}</view>
				</view>
				
				<view class="wrap_flex_nuxt" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现' || findOne.remark == '提现退款'">
					<view class="type_split_account">手续费</view> <view class="date_time"><text v-if="userType == 'NORMALUSER'">1.00</text><text v-else>0.00</text></view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现' || findOne.remark == '提现退款'">
					<view class="type_split_account">提现时间</view> <view class="date_time">{{findOne.createDate}}</view>
				</view>
				<view class="wrap_flex_nuxt" v-if="findOne.remark == '余额提现' || findOne.remark == '零钱提现' || findOne.remark == '提现退款'">
					<view class="type_split_account">备注</view> <view class="date_time">{{findOne.reason || ''}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				findOne: '',
				payDetailsData: '',
				userType: '',
				reason: '',
				orderStatus: ''
			}
		},
		methods: {
			getDetailsData(id) {
			    this.$fly.get(`/transfer/queryTransfer?id=` + id)
				   .then(res=>{
					if(res.code == 0){
						this.findOne = res.data;
						if (this.userType == 'MERCHANT') {
							this.findOne.remark = '余额提现';
						}
						// this.findOne.updateDate = this.$util.formatTime(this.findOne.updateDate,'yyyy-MM-dd');
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						});
					}
				   })
			},
			getDetailsDataUser(id) {
				this.$fly.post(`/transfer/findOne?id=` + id)
				   .then(res=>{
					if(res.code == 0){
						this.findOne = res.data;
						if (this.userType == 'MERCHANT') {
							this.findOne.remark = '余额提现';
						}
						this.findOne.createDate = this.$util.formatTime(this.findOne.createDate,'yyyy-MM-dd');
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
		onLoad(option) {
			let id = option.id;		// 获取明细数据
			if (option.userType == 'MERCHANT') {
				this.getDetailsData(id);
			} else {
				this.getDetailsDataUser(id);
			}
			
			if (option.reason) {
				this.reason = option.reason || '';
				this.orderStatus = option.orderStatus;
				this.userType = option.userType;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail_details {
		min-height: 100vh;
		background-color: #EEEEEE;
		padding: 20rpx;
		box-sizing: border-box;
		.info_show {
			width:710rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			margin: 0 auto;
			padding: 50rpx 30rpx;
			box-sizing: border-box;
			.top_avatar {
				border-bottom: 2rpx dotted #DBDBDB;
				padding-bottom: 50rpx;
				text-align: center;
				.src_image_avatar {
					width:100rpx;
					height:100rpx;
					border-radius:6rpx;
					margin: 0 auto;
				}
				.title_name {
					font-size:30rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					margin-top: 6rpx;
					text-align: center;
				}
				.title_price {
					font-size:36rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(255,151,51,1);
					margin-top: 18rpx;
					text-align: center;
				}
				.title_price_withdraw {
					font-size:36rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(52,52,52,1);
					margin-top: 6rpx;
				}
			}
			.type_order {
				margin-top: 48rpx;
				.wrap_flex_nuxt {
					margin-bottom: 18rpx;
					font-size:24rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					.type_split_account {
						display: inline-block;
						width: 150rpx;
						font-size:24rpx;
						font-family:PingFang SC;
						font-weight:400;
						color:rgba(153,153,153,1);
					}
					.date_time {
						display: inline-block;
					}
				}
			}
		}
	}
</style>
