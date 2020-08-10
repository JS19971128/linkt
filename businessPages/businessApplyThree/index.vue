<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line active">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line active">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center">
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
				<!-- 开户银行 -->
				<view class="item flex_center">
					<view class="item-name">开户银行</view>
					<view class="item-content">
						<input type="text" placeholder="请选择对公账户开户银行" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 银行全称 -->
				<view class="item flex_center">
					<view class="item-name">银行全称</view>
					<view class="item-content">
						<input type="text" placeholder="请输入开户银行全称（含支行）" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 银行地址 -->
				<view class="item flex_center">
					<view class="item-name">银行地址</view>
					<view class="item-content">
						<input type="text" placeholder="请选择开户银行所在省" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 对公账户 -->
				<view class="item flex_center">
					<view class="item-name">对公账户</view>
					<view class="item-content">
						<input type="text" placeholder="请输入对公账户号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">下一步</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				industries:['餐饮','零售批发','网上综合商城'],
				current:'',
				positive:'',
				opposite:'',
				handHold:'',
			}
		},
		methods:{ 
			// 选择证件类型
			bindChange($event){
				this.current = this.industries[$event.detail.value]
			},
			// 上传证件照
			upload(type){
				uni.chooseImage({
					count:1,
					success: res => {
						console.log(res)
						this[type] = res.tempFilePaths[0];
					}
				})
			},
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
