<template>
	<view class="container">
		<view class="top flex_between">
			<view class="card flex_center">
				<view class="flex_center">
					<view class="">
						<image src="../../static/images/my/avatar.png" mode="aspectFill"></image>
					</view>
					<view class="fz-12">
						<view class="card-item flex_center">
							<view>姓名</view>
							<view>王大锤</view>
						</view>
						<view class="card-item flex_center">
							<view>手机号码</view>
							<view>13655558888</view>
						</view>
						<view class="card-item flex_center">
							<view>身份证号</view>
							<view>441414455885566985</view>
						</view>
						<view class="card-item flex_center">
							<view>有效期至</view>
							<view>2021-06-04</view>
						</view>
					</view>
				</view>
			</view>
			<view class="auth fz-14 flex_center">
				<view>授权书</view>
				<image src="../../static/images/operation/more.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="info fz-14">
			<view class="main">
				<!-- 昵称 -->
				<view class="item flex_center">
					<view class="item-name">昵称</view>
					<view class="item-content">
						<input type="text" placeholder="请输入昵称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 手机号 -->
				<view class="item flex_center">
					<view class="item-name">手机号</view>
					<view class="item-content">
						<input type="text" placeholder="请输入手机号" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 姓名 -->
				<view class="item flex_center">
					<view class="item-name">姓名</view>
					<view class="item-content">
						<input type="text" placeholder="请输入真实姓名" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 身份证 -->
				<view class="item flex_center">
					<view class="item-name">身份证</view>
					<view class="item-content">
						<input type="text" placeholder="请输入有效的身份证号码" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 身份证生效日期 -->
				<view class="item flex_center">
					<view class="item-name">生效日期</view>
					<view class="item-content flex_center">
						<!-- 生效日期选择 -->
						<picker mode="date" @change="startDateChange">
							<view class="flex_between" :class="{date:start=='开始时间',active:start!=='开始时间'}">{{start}}</view>
						</picker>
					</view>
				</view>
				<!-- 身份证到期日期 -->
				<view class="item flex_center">
					<view class="item-name">到期日期</view>
					<view class="item-content flex_center">
						<!-- 到期日期选择 -->
						<picker mode="date" @change="stopDateChange">
							<view class="flex_between" :class="{date:start=='开始时间',active:start!=='开始时间'}">{{start}}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center">保存</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				industries:['餐饮','零售批发','网上综合商城'],
				current:'',
				start:'开始时间',
				stop:'结束时间',
			}
		},
		methods:{
			// 选择起始日期
			startDateChange($event){
				this.start = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.stop = $event.detail.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 30rpx 20rpx;
		.card{
			width: 609rpx;
			height: 248rpx;
			background: url(../../static/images/operation/card_bg.png) no-repeat;
			background-size: 100% 100%;
			line-height: 50rpx;
			color: #7B521A;
			justify-content: flex-start;
			>view{
				justify-content: flex-start;
				align-items: flex-start;
				image{
					width: 120rpx;
					height: 120rpx;
					display: block;
					margin-left: 20rpx;
				}
				.fz-12{
					margin-left: 20rpx;
					.card-item{
						justify-content: flex-start;
						>view{
							&:first-child{
								color: rgba(123, 82, 26, .5);
								width: 120rpx;
							}
						}
					}
				}
			}
		}
		.auth{
			flex-direction: column;
			color: #FF9D12;
			line-height: 50rpx;
			image{
				width: 30rpx;
				display: block;
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
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						line-height: 28rpx;
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
