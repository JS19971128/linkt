<template>
	<view class="container">
		<view class="top flex_center fz-14">
			<view class="top-left">
				<view class="">申请编号：<text>LK_asa74wf454548</text></view>
				<view class="">商户号：<text>LK_asa74wf454548</text></view>
			</view>
			<view class="top-right flex_between">待审核</view>
		</view>
		<view class="tab flex_center fz-14">
			<view class="item flex_center" :class="{active:current == item.value}" v-for="item in tab" :key="item.id" @click="changeTab(item.value)">{{item.text}}</view>
		</view>
		<!-- 法人信息 -->
		<legal-info :show="current == 'legal' ? true : false"></legal-info>
		<!-- 企业设置 -->
		<company-info :show="current == 'company' ? true : false"></company-info>
		<!-- 银行信息 -->
		<bank-info :show="current == 'bank' ? true : false"></bank-info>
	</view>
</template>

<script>
	import legalInfo from './legalInfo/index.vue';
	import companyInfo from './companyInfo/index.vue';
	import bankInfo from './bankInfo/index.vue';
	export default{
		components:{
			legalInfo,
			companyInfo,
			bankInfo
		},
		data() {
			return {
				current:'legal',
				tab:[
					{id:1,text:'法人信息',value:'legal'},
					{id:2,text:'企业设置',value:'company'},
					{id:3,text:'银行信息',value:'bank'},
				],
			}
		},
		methods:{
			changeTab(value){
				this.current = value;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding-top: 50rpx;
		min-height: 100vh;
		.top{
			width: 710rpx;
			height: 180rpx;
			background: #fff;
			margin: 0 auto;
			border-radius: 8rpx;
			box-shadow: 0 0 20rpx 2rpx rgba(0,0,0,.1);
			color: #999999;
			margin-bottom: 50rpx;
			.top-left{
				width: 530rpx;
				line-height: 50rpx;
				padding: 0 20rpx;
				text{
					color: #333;
				}
			}
			.top-right{
				width: 180rpx;
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
	}
</style>
