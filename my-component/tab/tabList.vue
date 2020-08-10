<template>
	<view class="tab">
		<view class="tab-list" :class="{'active': index === currentIndex}" v-for="(item,index) in tabList" :key="index" @click="clickTabItem(index)">
			<view class="tab-list-title">{{item.title}}</view>
			<view class="tab-list-info">{{item.info}}</view>
		</view>
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
			tabList:{
				type:Array,
				default:()=>[]
			}
		},
		methods: {
			clickTabItem(index) {
				this.currentIndex = index;
				this.$emit('clickTabItem',index);
			}
		},
		components: {},
	}
</script>

<style lang="scss" scoped>
	.tab{
		width: 100%;
		display: flex;
		align-items: center;
		padding:0 20rpx;
		margin: 20rpx 0;
		box-sizing: border-box;
		&-list{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			box-shadow:-1px 0px 0px 0px rgba(222,222,222,1);
			box-sizing: border-box;
			align-items: center;
			&:first-child{
				box-shadow:none;
			}
			&.active{
				.tab-list-title{
					color: #FF9D12;
				}
				.tab-list-info{
					color: #fff;
					padding: 3rpx 6rpx;
					background: #FF9D12;
					border-radius: 4rpx;
				}
			}
			&-title{
				color: #333;
				font-size: 28rpx;
				font-weight: bold;
			}
			&-info{
				line-height: 1;
				color: #999;
				font-size: 20rpx;
			}
		}
	}
</style>
