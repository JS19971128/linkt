<template>
	<view class="container">
		<view class="main flex_center">
			<view class="tip">
				<view class="fz-14">请输入爆品的取件码</view>
			</view>
			<view class="code">
				<view class="code-list" v-for="item in code" @click="codeClick">{{item}}</view>
			</view>
			<input class="op0" :focus="focus" maxlength="4" @input="codeInput" @blur="bluerFalse" />
		</view>
		<view class="btn fz-14 flex_center rz" @click="goStm">核销</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				code:['','','',''],
				focus:false
			}
		},
		methods:{
			goStm(){
				console.log(this.code)
				uni.navigateTo({
					url:'/businessPages/shop/explode/writeOff'
				})
			},
			codeInput(e){
				console.log(e.detail.value)
				let value = e.detail.value.split('');
				let code = [];
				for(let i=0;i<4;i++){
					code[i] = value[i] || '';
				}
				this.code = code;
			},
			codeClick(){
				this.focus = true;
			},
			bluerFalse(){
				this.focus = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.op0{
		opacity: 0;
	}
	.main{
		flex-direction: column;
		line-height: 40rpx;
		text-align: center;
		padding-top: 100rpx;
		image{
			width: 170rpx;
			display: block;
		}
		.tip{
			margin-top: 30rpx;
			.fz-14{
				color: #101010;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		border: 2rpx solid #FF9D11;
		color: #FF9D11;
		background: #fff;
		position: fixed;
		bottom: 30rpx;
		left: 40rpx;
		&.rz{
			background: #FF9D11;
			color: #fff;
		}
		&.nrz{
			background: #DDDDDD;
			border: 2rpx solid #DDDDDD;
			color: #fff;
		}
	}
	
	.code{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 500rpx;
		margin-top: 60rpx;
		.code-list{
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #aaa;
			font-size: 50rpx;
			padding: 10rpx;
			width: 80rpx;
			height: 80rpx;
			color: #000;
			background: #fff;
		}
	}
</style>
