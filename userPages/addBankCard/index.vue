<template>
	<view class="add_bank_card">
		<view class="bind_card">请绑定持卡人为本人的银行卡</view>
		<view class="account_list">
			<view class="wrap_type_list">
				<view class="left_text">账户类型</view>
				<view class="right_check">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{array[index]}}</view>
					</picker>
				</view>
			</view>
			<view class="wrap_type_list">
				<view class="left_text">开户银行</view>
				<view class="right_check">
					<picker @change="bindBankChange" :value="bank" :range="bankAccount">
						<view class="uni-input">{{bankAccount[bank]}}</view>
					</picker>
				</view>
			</view>
			<view class="wrap_type_list" v-if="index == 0">
				<view class="left_text">联行号</view>
				<view class="right_check">
					<input type="number" v-model="bankCode" placeholder="开户支行联行号，可与开户支行咨询" />
				</view>
			</view>
			<view class="wrap_type_list">
				<view class="left_text">持卡人</view>
				<view class="right_check">
					<input type="text" v-model="accountName" placeholder="请输入真实姓名/对公账户输入公司全称" />
				</view>
			</view>
			<view class="wrap_type_list">
				<view class="left_text">卡号</view>
				<view class="right_check">
					<input type="number" v-model="bankName" placeholder="请输入银行卡号" />
				</view>
			</view>
		</view>
		<view class="input_info">请输入真实有效的银行卡信息，否则会造成无法正常收款。</view>
		<view class="commit_add" @click="confirmAdd">
			确认添加
		</view>
	</view>
</template>

<script>
	import code from '@/common/util/bank_code.js'
	export default {
		data() {
			return {
				array: ['对公账户', '个人账户'],
				index: 0,
				bankAccount: [],
				bank: 0,
				bankCode: '', // 银联号
				accountName: '', // 持卡人
				bankName: '', // 银行卡号
			}
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			bindBankChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.bank = e.target.value
			},
			// 确认添加
			confirmAdd() {
				if (this.index == 0 && !this.bankCode) {
					uni.showToast({
					    title: '请输入支行银联号',
						icon: 'none',
					    duration: 2000
					});
					return false;
				}
				
				if (!this.accountName) {
					uni.showToast({
					    title: '请输入持卡人姓名',
						icon: 'none',
					    duration: 2000
					});
					return false;
				}
				
				if (!this.bankName) {
					uni.showToast({
					    title: '请输入银行卡号',
						icon: 'none',
					    duration: 2000
					});
					return false;
				}

				var settleBankType = '';
				if (this.index == 0) {
					settleBankType = 'B2B'
				} else {
					settleBankType = 'B2C'
				}

				let params = {
				   accountName: this.accountName,
				   accountNo: this.bankName,
				   bankName: this.bankAccount[this.bank],
				   settleBankType: settleBankType,
				   userId: this.$store.state.userInfo.id
				}
				if (this.index == 0) {
					params.bankCode = this.bankCode;
				}
				this.addbank(params);
			},
			addbank(params) {
				this.$fly.post(`/transfer/addbank`, params)
					.then(res => {
						uni.hideLoading();
						if (res.code == 0) {
							uni.showToast({
							    title: '添加成功！',
								icon: 'none',
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
			}
		},
		onLoad() {
			this.bankAccount = code;
		}
	}
</script>

<style lang="scss" scoped>
	.add_bank_card {
	    min-height: 100vh;
		background-color: #EEEEEE;
		padding-top: 100rpx;
		box-sizing: border-box;
		.bind_card {
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			text-align: center;
		}
		.account_list {
			margin-top: 50rpx;
			background-color: #FFFFFF;
			.wrap_type_list {
				height:100rpx;
				background:rgba(255,255,255,1);
				box-shadow:-1px -1px 0px 0px rgba(211,211,211,1);
				padding: 0 20rpx;
				display: flex;
				align-items: center;
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(153,153,153,1);
				.left_text {
					width: 138rpx;
					flex: 0 0 138rpx;
				}
				.right_check {
					flex: 1;
					color: #000000;
				}
			}
		}
		.input_info {
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(203,203,203,1);
			text-align: center;
			margin-top: 28rpx;
		}
		.commit_add {
			width:670rpx;
			height:74rpx;
			background:rgba(255,157,17,1);
			border-radius:37rpx;
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,1);
			text-align: center;
			line-height: 74rpx;
			position: fixed;
			bottom: 30rpx;
			left: 50%;
			margin-left: -335rpx;
		}
	}
</style>
