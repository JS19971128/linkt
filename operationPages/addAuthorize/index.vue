<template>
	<view class="container">
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
		<view class="btn fz-14 flex_center">添加</view>
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
	.info{
		line-height: 28rpx;
		padding-top: 20rpx;
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
