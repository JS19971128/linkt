<template>
	<view class="releaseSpecs">
		<view class="main">
			<view class="item flex_between" v-for="(item,index) in releasePriceArr" :key="index">
				<view class="title">{{item.name}}</view>
				<view class="content flex_center">
					<input class="content-input" type="text" :value="item.priceSale" @blur="inputChange($event,index)" placeholder="请输入价格" />
				</view>
			</view>
		</view>
		<view class="release-btns flex_center">
			<view class="release-btns-release btn flex_center" @click="GOStm()">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			releaseSpecs(){ //添加商品规格
				return this.$store.state.goods.releaseSpecs;
			},
			releaseParamList(){ //添加商品价格
				return this.$store.state.goods.releaseParamList;
			},
		},
		data() {
			return {
				releasePriceArr:[]
			}
		},
		methods: {
			//保存
			GOStm(){
				this.$store.commit('SETReleaseParamList',this.releasePriceArr);
				uni.navigateBack();
			},
			init(){
				try{
					let releaseSpecs = this.releaseSpecs;
					for(let i of releaseSpecs){
						this.getData(i.values)
					}
				}catch(e){
					//TODO handle the exception
					console.log()
				}
			},
			getData(values){
				let {releasePriceArr} = this;
				if(releasePriceArr.length != 0){
					let arr = []
					for(let i of releasePriceArr){
						for(let k of values){
							arr.push({
								name:`${i.name}+${k.value}`,
								value:`${i.value}-${k.id}`,
								priceSale:0,
								priceOriginal:0
							})
						}
					}
					this.releasePriceArr = arr;
				}else{
					for(let i of values){
						releasePriceArr.push({
							name:i.value,
							value:i.id,
							priceSale:0,
							priceOriginal:0
						})
					}
					this.releasePriceArr = releasePriceArr;
				}
			},
			inputChange(e,index){
				let val = e.detail.value;
				let releasePriceArr = this.releasePriceArr;
				this.$set(releasePriceArr[index],'priceSale',val);
				this.$set(releasePriceArr[index],'priceOriginal',val);
			},
		},
		onShow() {
			if(this.releaseParamList.length!=0){
				this.releasePriceArr = this.releaseParamList
			}else{
				this.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.releaseSpecs {
		padding: 20rpx 0;
		width: 100%;
		min-height: 100vh;
		background: #efefef;
		padding-bottom: 100rpx;
		box-sizing: border-box;
		&-add {
			margin: 20rpx;
			height: 80rpx;
			color: #FF9D12;
			border: 1rpx solid #FF9D12;
			background: #fff;
			width: calc(100% - 40rpx);
			border-radius: 50rpx;
			font-size: 24rpx;
			box-sizing: border-box;
		}
	}

	.main {
		padding: 0rpx 0 20rpx;
		line-height: 28rpx;

		.item {
			padding: 30rpx 20rpx;
			background: #fff;
			border-bottom: 2rpx solid #D3D3D3;
			position: relative;

			&-textarea {
				height: 80rpx;
			}

			.title {
				color: #999999;
				display: flex;
				align-items: center;
			}

			.item-title-img {
				margin-right: 20rpx;
				width: 50rpx;
				height: 50rpx;
			}

			.content {
				color: #333333;

				&-input {
					text-align: right;
				}

				.txt9 {
					color: #999999;
				}

				.avatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 160rpx;
						height: 160rpx;
						display: block;
						border-radius: 50%;
					}
				}

				.more {
					margin-left: 10rpx;

					image {
						width: 24rpx;
						display: block;
					}
				}
			}
		}
	}

	.release-btns {
		position: fixed;
		height: 100rpx;
		width: 100%;
		background: #fff;
		box-shadow: 0px 0px 10px rgba(222, 222, 222, 1);
		bottom: 0;
		z-index: 999;
		padding: 16rpx 20rpx;
		box-sizing: border-box;

		.btn {
			flex: 1;
			background: #ff9d12;
			color: #fff;
			height: 80rpx;
			border-radius: 50rpx;
		}
	}
</style>
