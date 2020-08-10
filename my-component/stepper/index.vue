<template>
	<view class="stepper">
		<view class="reduce" :class="{'disabled':num<2}" @click.stop="reduce">
			-
		</view>
		<input class="input" maxlength="2" type="number" :value="num" @click.stop="" @input.stop="bindInput" />
		<view class="increase" :class="{'disabled':num>99}" @click.stop="increase">
			+
		</view>
	</view>
</template>

<script>
	/*
	* fIndex  父index，
	* cIndex  子index
	* goodsId      商品id
	* */
	export default {
		data() {
			return {
				num:0
			}
		},
		props: {
			number: {
				type: Number,
				default: 1
			},
			fIndex:{
				type: String,
				default: ''
			},
			cIndex:{
				type: String,
				default: ''
			},
			goodsId:{
				type: String,
				default: ''
			}
		},
		watch: {
			number(num) {
				this.num = num
			},
		},
		created() {
			this.num = this.number
		},
		methods: {
			bindInput(e) {
				let num = e.detail.value;
				if (num) num = parseInt(num);
				if (num < 1) num = 1;
				if (num > 100) num = 100;
				this.update(num);
			},
			increase() {
				this.update(++this.num);
			},
			reduce() {
				this.update(--this.num);
			},
			update(num) {
				let {fIndex,cIndex,goodsId} = this;
				this.$emit('update', {num,fIndex,cIndex,goodsId})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.stepper {
		display: flex;
		align-items: center;
		width: 175rpx;
	}

	.reduce,
	.increase {
		width: 40rpx;
		height: 40rpx;
		text-align: center;
		border:2rpx solid rgba(255, 185, 85, 1);
		box-sizing: border-box;
		font-size: 37rpx;
		line-height: 36rpx;
	}

	.reduce {
		// border-radius: 50rpx 0 0 50rpx;
		
	}

	.increase {
		// border-radius: 0 50rpx 50rpx 0;
	}

	.disabled {
		/* color: rgba(0, 0, 0, 0.35); */
		pointer-events: none;
	}
	.stepper input {
		border:2rpx solid rgba(220, 220, 220, 1);
		box-sizing: border-box;
		margin: 0 10rpx;
		flex:1;
		height: 40rpx;
		text-align: center;
		font-size: 30rpx;
		min-height: 44rpx;
	}
</style>
