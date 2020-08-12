<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index')">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index2')">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index4')">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">银行信息</view>
			<view class="main">
				<!-- 账户类型 -->
				<view class="item flex_center">
					<view class="item-name">账户类型</view>
					<view class="item-content">
						<picker mode="selector" :range="zhlx" :value="bank.zhlxIndex" range-key="label" @change="bindTypeChange($event,'zhlx')">
							<view class="flex_between">
								<view>
								<input type="text" v-model="bank.zhlxLabel" disabled placeholder="请选择账户类型" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 开户银行 -->
				<view class="item flex_center">
					<view class="item-name">开户银行</view>
					<view class="item-content">
						<input type="text" v-model="bank.bankName" placeholder="请输入开户银行" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 联行号 -->
				<view class="item flex_center">
					<view class="item-name">联行号</view>
					<view class="item-content">
						<input type="text" v-model="bank.bankCode" placeholder="开户支行联行号，可与开户支行咨询" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 账户卡号 -->
				<view class="item flex_center">
					<view class="item-name">账户卡号</view>
					<view class="item-content">
						<input type="text" v-model="bank.accountNo" placeholder="请输入账户卡号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">下一步</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				zhlx:[{label:'对公账户',type:'TOPUBLIC'},{label:'个人账户',type:'TOPRIVATE'}],
				zhlxLabel:'',
				zhlxIndex:0,
				
				settleBankType:'',
				bankName:'',
				bankCode:'',
				accountNo:''
			}
		},
		computed:{
			bank(){
				return this.$store.state.shop.bank
			},
		},
		methods:{ 
			// 选择证件类型
			bindTypeChange($event,type){
				this.bank.zhlxLabel = this.zhlx[$event.detail.value].label;
				this.bank.settleBankType = this.zhlx[$event.detail.value].type;
				this.bank.zhlxIndex = $event.detail.value;
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
			},
			next(){
				const {bank} = this;
				let data = {...bank};
				console.log(data)
				for(let i in data){
					if(!data[i]){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				this.$store.commit('SETBANK',data);
				uni.navigateTo({
					url:"/businessPages/wxBusinessApply/index4"
				})
			}
		},
		created() {
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 50rpx 0;
		background: #fff;
		border-top: 2rpx solid #D3D3D3;
	}
	.step{
		width: 590rpx;
		margin: 0 auto;
		justify-content: flex-start;
		line-height: 50rpx;
		color: #999999;
		.line{
			height: 90rpx;
			vertical-align: center;
		}
		.step-item{
			flex-direction: column;
			.num{
				width: 90rpx;
				height: 90rpx;
				border: 2rpx solid #999999;
				border-radius: 50%;
				background: #fff;
			}
		}
		.active{
			color: #FF9D11;
			.num{
				border: 2rpx solid #FF9D11;
				background: #FF9D11;
				color: #fff;
			}
		}
	}
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
					input{
						width: 90%;
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
					}
					image{
						width: 24rpx;
						display: block;
					}
					.line{
						color:#999 ;
						margin: 0 10rpx;
					}
					.date{
						color: #CBCBCB;
					}
					.active{
						color: #333;
					}
					.upload{
						flex-direction: column;
						color: #CBCBCB;
						margin-right: 30rpx;
						line-height: 24rpx;
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							margin-bottom: 10rpx;
						}
						.uploadPic{
							width: 120rpx;
							height: 120rpx;
							margin-bottom: 10rpx;
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
						}
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
