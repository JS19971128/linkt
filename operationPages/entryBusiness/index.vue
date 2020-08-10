<template>
	<view class="container">
		<view class="top flex_between">
			<view class="search flex_center">
				<view><image src="../../static/images/common/search.png" mode="widthFix"></image></view>
				<view><input type="text" placeholder="请输入要搜索的内容" placeholder-style="color:#CBCBCB;font-size:28rpx"/></view>
			</view>
			<view><text class="fz-12">商家总数</text><text class="fz-24">965</text></view>
		</view>
		<view class="flex_center status">
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">已通过</view>
			</view>
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">已驳回</view>
			</view>
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">待审核</view>
			</view>
			<view>
				<view class="fz-14">9999</view>
				<view class="fz-12">已完成</view>
			</view>
		</view>
		<view class="tab flex_center fz-14">
			<view class="item flex_center" :class="{active:current == item.value}" v-for="item in tab" :key="item.id" @click="changeTab(item.value)">{{item.text}}</view>
		</view>
		<view class="list">
			<view class="item flex_between">
				<view class="info flex_center">
					<image class="merchant_pic" src="../../static/images/my/avatar.png" mode="widthFix"></image>
					<view class="">
						<view class="fz-14">麻辣小龙虾前海分店</view>
						<view class="fz-12">2020-05-23</view>
					</view>
				</view>
				<view class="fz-12">待审核</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				current:'NEARBY',
				tab:[
					{id:1,text:'全部',value:'NEARBY'},
					{id:2,text:'已通过',value:'PEOPLE_LIKES'},
					{id:3,text:'已驳回',value:'LASTEST'},
					{id:4,text:'待审核',value:'MOST_FAVORABLE'},
					{id:5,text:'已完成',value:'MOST_FAVORABLE'},
				],
			}
		},
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		height: 100rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background: #fff;
		.search{
			width: 50%;
			height: 60rpx;
			border-radius: 30rpx;
			background: #E6E6E6;
			padding: 0 10rpx;
			input{
				width: 80%;
				background: #E6E6E6;
			}
			image{
				width: 26rpx;
				display: block;
				margin-right: 10rpx;
			}
		}
		.fz-12{
			line-height: 24rpx;
			color: #CBCBCB;
		}
		.fz-24{
			line-height: 48rpx;
			color: #FF9D12;
			margin-left: 10rpx;
		}
	}
	.status{
		color: #333;
		line-height: 40rpx;
		padding: 10rpx 0;
		border-top: 2rpx solid #D3D3D3;
		background: #fff;
		>view{
			flex: 1;
			text-align: center;
			border-right: 2rpx solid #DEDEDE;
			&:nth-child(4){
				border: 0;
			}
			.fz-12{
				color: #999999;
			}
		}
	}
	.tab{
		background: #EEEEEE;
		color: #999999;
		height: 85rpx;
		.item{
			flex: 1;
		}
		.active{
			color: #FF9733;
			position: relative;
			&::after{
				display: block;
				content: '';
				color: #FF9733;
				width: 20rpx;
				height: 10rpx;
				background: url(../../static/images/home/tab_icon.png) no-repeat;
				background-size: 100% 100%;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 40rpx;
			}
		}
	}
	.list{
		padding: 0 20rpx;
		.item{
			padding: 20rpx;
			line-height: 40rpx;
			background: #fff;
			border-radius: 8rpx;
			box-shadow: 0 0 20rpx 2rpx rgba(0,0,0,.1);
			margin-bottom: 20rpx;
			.merchant_pic{
				width: 90rpx;
				height: 90rpx;
				display: block;
				margin-right: 20rpx;
			}
		}
	}
	.no_data{
		flex-direction: column;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		text-align: center;
		image{
			width: 180rpx;
			display: block;
		}
		.tip{
			line-height: 40rpx;
			margin-top: 40rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
</style>
