<template>
	<view class="tab">
		<scroll-view class="tabCard" enable-flex scroll-x :scroll-into-view="scrollIntoView" scroll-with-animation>
			<view class="tab-item" :key="index" :class="{'active': index === currentIndex}" v-for="(ele, index) in tabNav" @click="clickTabItem(index)"
			 :id="'index'+index">
				{{ele.label}}
			</view>
		</scroll-view>
		<image class="tab-img" src="../../static/images/shop/gradients.png"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: 0,
				scrollIntoView: 'index0'
			}
		},
		props:{
			tabNav:{
				type:Array,
				default:()=>[]
			}
		},
		methods: {
			clickTabItem(index) {
				this.currentIndex = index;
				this.$emit('clickTabItem',index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabCard {
		box-sizing: border-box;
		width: 100%;
		height: 52rpx;
		display: flex;
		.tab-item {
			min-width: 110rpx;
			box-sizing: border-box;
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			line-height: 1;
			padding: 0 10rpx;
			color: #333;
			&.active{
				font-size: 32rpx;
				font-weight: bold;
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
					bottom: -1rpx;
				}
			}
		}
	}
	.tab{
		width: 100%;
		position: relative;
		&-img{
			width: 18rpx;
			height: 52rpx;
			position: absolute;
			right: 0;
			top: 0;
		}
	}
</style>
