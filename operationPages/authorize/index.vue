<template>
	<view class="container">
		<view class="main">
			<scroll-view class="scroll-area" scroll-x="true" scroll-with-animation="true" v-for="(item,i) in list" :key="item.id">
				<view class="scroll-item">
					<view class="item flex_center">
						<view class="item-left flex_center">
							<view><image src="../../static/images/my/avatar.png" mode="widthFix"></image></view>
						</view>
						<view class="item-right ">
							<view class="flex_between info">
								<view class="fz-14">奶油副总裁</view>
								<view class="fz-12">有效期剩余0天</view>
							</view>
							<view class="flex_between">
								<view class="fz-12">13612365478</view>
								<view class="fz-12 level">生效中</view>
							</view>
						</view>
					</view>
				</view>
				<view class="delete scroll-item">
					<image src="../../static/images/operation/delete.png" mode="widthFix"></image>
				</view>
			</scroll-view>
		</view>
		<view class="btn fz-14 flex_center">新建运营人员</view>
		<!-- 根据手机号查询弹框 -->
		<view class="pop_wrap" v-if="showPhone">
			<view class="pop_content">
				<view class="close flex_center" @click="showPhone=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="fz-16 flex_center">根据手机号查询</view>
					<view class="frame flex_center"><input type="text" placeholder="请输入对方的手机号码" placeholder-style="color:#CBCBCB;font-size:28rpx" v-model="phone" /></view>
					<view class="fz-14 pop_btn flex_center">查询</view>
				</view>
			</view>
		</view>
		<!-- 删除弹框 -->
		<view class="pop_wrap" v-if="showDelete">
			<view class="pop_content">
				<view class="box">
					<view class="fz-16 flex_center">确认删除</view>
					<view class="confirm flex_center fz-16">确认要删除此电子授权牌吗？</view>
					<view class="fz-14 pop_btn flex_between">
						<view class="flex_center">取消</view>
						<view class="flex_center">确认</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showPhone: false,
				showDelete: false,
				list:[
					{distance:0,id:1},
					{distance:0,id:2},
					{distance:0,id:3},
				]
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		.scroll-area{
			white-space: nowrap;
		}
		.scroll-item{
			display: inline-block;
		}
		.item{
			width: 710rpx;
			background: #fff;
			border-radius: 8rpx;
			margin-left: 20rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			.item-left{
				image{
					width: 90rpx;
					display: block;
					border-radius: 45rpx;
				}
			}
			.item-right{
				flex: 1;
				color: #999999;
				margin-left: 20rpx;
				line-height: 40rpx;
				image{
					width: 26rpx;
					display: block;
				}
				.info{
					.fz-14{
						color: #333;
					}
					.fz-12{
						color: #999999;
					}
				}
				.level{
					color: #FF9D12;
				}
			}
		}
		.delete{
			padding: 0 30rpx;
			image{
				width: 74rpx;
				display: block;
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
	.pop_content{
		width: 590rpx;
		padding: 0 30rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-top: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			padding-top: 50rpx;
			.confirm{
				color: #999999;
				margin-top: 50rpx;
			}
			.pop_btn{
				width: 100%;
				margin: 50rpx 0;
				>view{
					width: 265rpx;
					height: 72rpx;
					border-radius: 36rpx;
					&:first-child{
						color: #999999;
						border: 2rpx solid #999;
					}
					&:last-child{
						color: #fff;
						background: #FF9D29;
						border: 2rpx solid #FF9D29;
					}
				}
			}
		}
	}
</style>
