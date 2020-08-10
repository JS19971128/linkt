<template>
	<view class="releaseSpecs">
		<view class="main" v-for="(item,index) in specificationParamList" :key="index">
			<view class="item flex_between">
				<view class="title"><image class="item-title-img" @click="clickPerent(index)" src="../../../static/images/shop/reduce.png"
				 v-if="index !== 0"></image>规格{{item.id}}</view>
				<view class="content flex_center">
					<input class="content-input" type="text" :value="item.attributeName" @blur="inputChange($event,index)" placeholder="请输入规格名" />
				</view>
			</view>
			<view class="item flex_between" v-for="(val,idx) in item.values" :key="index">
				<view class="title">
					<image class="item-title-img" @click="clickPlus(index)" src="../../../static/images/shop/plus.png" v-if="idx === 0"></image>
					<image class="item-title-img" @click="clickReduce(index,idx)" src="../../../static/images/shop/reduce.png"
					 v-else-if="idx === item.values.length-1"></image>
					<view class="item-title-img" v-else></view>
					属性
				</view>
				<view class="content flex_center">
					<input type="text" :value="val.value" @blur="inputChange($event,index,idx)"  class="content-input" placeholder="请输入规格属性" />
				</view>
			</view>
		</view>
		<view class="releaseSpecs-add flex_center" @click="addSpecs">添加规格</view>
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
		},
		data() {
			return {
				specificationParamList: [{
					id: 1,
					attributeName: '',
					values: [],
					inputValue: '',
					priceSale: '',
				}],
				pageType:''
			}
		},
		methods: {
			//添加规格
			addSpecs() {
				let spece = this.specificationParamList;
				spece.push({
					id: spece[spece.length - 1].id + 1,
					attributeName: '',
					values: [],
					inputValue: '',
					priceSale: '',
				})
				this.specificationParamList = spece;
				this.clickPlus(spece.length - 1);
			},
			//添加属性
			clickPlus(index) {
				let spece = this.specificationParamList;
				spece[index].values.push({
					value: '',
					id: `_${spece[index].values.length}`,
				})
				// spece[index].inputValue = '';
				this.specificationParamList = spece;
			},
			inputChange(e,index,idx){
				let val = e.detail.value;
				let spece = this.specificationParamList;
				if(idx!=null){
					this.$set(spece[index].values[idx],'value',val);
				}else{
					this.$set(spece[index],'attributeName',val);
				}
			},
			//删除属性
			clickReduce(index, idx) {
				let spece = this.specificationParamList;
				spece[index].values.splice(idx, 1);
				this.specificationParamList = spece;
			},
			clickPerent(index){
				let spece = this.specificationParamList;
				spece.splice(index, 1);
				this.specificationParamList = spece;
			},
			//保存
			GOStm(){
				if(JSON.stringify(this.releaseSpecs) !== JSON.stringify(this.specificationParamList)){
					this.$store.commit('SETIsSpecsModify',true);
					this.$store.commit('SETReleaseParamList',[])
				}
				this.$store.commit('SETReleaseSpecs',this.specificationParamList)
				console.log(this.specificationParamList)
				uni.navigateBack();
			}
		},
		onShow() {
			if(this.releaseSpecs.length==0){
				this.clickPlus(0)
			}else{
				this.specificationParamList = JSON.parse(JSON.stringify(this.releaseSpecs));
			}
		},
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
