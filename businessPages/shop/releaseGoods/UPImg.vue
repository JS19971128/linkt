<template>
	<view class="upImg">
		<image :src="zImg" class="upImgZ"></image>
		<image src="../../../static/images/common/close.png" v-if="releaseImg.length!=0" @click="deleteImg" class="delete-img"></image>
		<scroll-view class="upImg-scroll" enable-flex scroll-x :scroll-into-view="scrollIntoView" scroll-with-animation>
			<view class="scroll-item" :key="index" :class="{'active': index === currentIndex}" v-for="(ele, index) in releaseImg" @click="clickTabItem(index)"
			 :id="'index'+index">
				<image class="scroll-item-img" :src="ele"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		computed:{
			releaseImg(){ //添加商品图片
				return this.$store.state.goods.releaseImg;
			},
		},
		data(){
			return {
				currentIndex: 0,
				scrollIntoView: 'index0',
				zImg:''
			}
		},
		methods:{
			clickTabItem(index) {
				this.currentIndex = index;
				this.zImg = this.releaseImg[index];
			},
			deleteImg(){
				let {releaseImg} = this;
				releaseImg.splice(this.currentIndex, 1)
				this.$store.commit('SETReleaseImg',releaseImg);
				this.zImg = this.releaseImg[0] || '';
				this.currentIndex = 0;
			}
		},
		onShow(){
			this.zImg = this.releaseImg[this.currentIndex];
		}
	}
</script>

<style lang="scss" scoped>
	.upImg{
		width: 100%;
		min-height: 100vh;
		background: #292929;
		padding:20rpx 0;
		position: relative;
		box-sizing: border-box;
		.upImgZ{
			width: 100%;
			height: 750rpx;
		}
		.delete-img{
			width: 50rpx;
			height: 50rpx;
			position: absolute;
			right: 40rpx;
			top: 60rpx;
		}
		.upImg-scroll{
			display: flex;
			padding: 20rpx;
			box-sizing: border-box;
			height: 200rpx;
			.scroll-item{
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				&.active{
					.scroll-item-img{
						width: 150rpx;
						height: 150rpx;
					}
				}
				.scroll-item-img{
					width: 140rpx;
					height: 140rpx;
				}
			}
		}
	}
</style>
