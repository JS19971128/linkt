<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 账户类型 -->
			<view class="item flex_center">
				<view class="item-name">账户类型</view>
				<view class="item-content">{{form.settleBankType|settleBankType}}</view>
			</view>
			<!-- 开户银行 -->
			<view class="item flex_center">
				<view class="item-name">开户银行</view>
				<view class="item-content">{{form.bankName}}</view>
			</view>
			<!-- 联行号 -->
			<view class="item flex_center">
				<view class="item-name">联行号</view>
				<view class="item-content">{{form.bankCode}}</view>
			</view>
			<!-- 账户卡号 -->
			<view class="item flex_center">
				<view class="item-name">账户卡号</view>
				<view class="item-content">{{form.accountNo}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'bankInfo',
		props:["show"],
		data() {
			return {
				form:{}
			}
		},
		computed:{
			ifShow(){
				return this.show;
			}
		},
		methods:{
			init(form){
				this.form = form;
			}
		},
		filters:{
			// 账户类型
			settleBankType(data){
				let obj = {
					TOPUBLIC:'对公账户',
					TOPRIVATE:'个人账户'
				}
				return obj[data];
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		line-height: 28rpx;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 30rpx 20rpx;
				// height: 100rpx;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 20%;
				}
				.item-content{
					justify-content: flex-start;
					color: #333;
					width: 80%;
					.frame{
						width: 90%;
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
					}
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
