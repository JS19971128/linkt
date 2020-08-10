<template>
	<view class="bg">
		<view class="top flex_center">
			<image src="../../static/images/operation/bg-top.png" mode="widthFix"></image>
		</view>
		<view class="main">
			<view class="title fz-14 flex_center"><text class="line">XXXXXX</text>先生/女士</view>
			<view class="fz-12 content">为我公司在<text class="line">XXXX</text>地区运营中心，将负责我公司的品牌项目（链客智慧商圈联盟）的宣传、拓展商家，和后期商家服务等工作，以及相关的业务经营及推广事宜。</view>
			<view class="fz-12">特此授权</view>
			<view class="date fz-12 flex_center">授权期限自<text>XXXXX</text>至<text>XXXXX</text>止。</view>
		</view>
		<view class="bottom">
			<view class="flex_between company">
				<view class="fz-12">
					<image src="../../static/images/operation/code.png" mode="aspectFit"></image>
					<view>企业资质查询</view>
				</view>
				<view class="fz-12">海南看客科技有限公司授权</view>
			</view>
			<view class="remark fz-10">
				<view>备注：本授权书以正本为有效文本，不得影印、涂改、转让。</view>
				<view>海南看客科技有限公司拥有此授权书的最终解释。</view>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		height: 100vh;
		background: url(../../static/images/operation/bg.png) no-repeat;
		background-size: 100% 100%;
		.top{
			padding-top: 76rpx;
			image{
				width: 592rpx;
				display: block;
			}
		}
		.main{
			width: 600rpx;
			margin: 0 auto;
			color: #385975;
			padding: 20rpx 0;
			>view{
				padding: 20rpx 0;
			}
			text{
				padding: 0 20rpx;
				font-weight: bold;
			}
			.line{
				border-bottom: 2rpx solid #385975;
			}
			.content{
				line-height: 40rpx;
			}
			.date{
				color: #A92027;
			}
		}
	}
	.bottom{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 5vh;
		.company{
			padding: 0 100rpx;
			color: #385975;
			font-weight: bold;
			line-height: 36rpx;
			image{
				width: 140rpx;
				height: 140rpx;
				display: block;
			}
		}
		.remark{
			padding: 0 80rpx;
			color: #999999;
			line-height: 24rpx;
			margin-top: 20rpx;
		}
	}
</style>
