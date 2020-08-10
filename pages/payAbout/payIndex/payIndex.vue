<template>
	<view class="container">
		<view class="main">
			<view class="business flex_center">
				<view><image :src="info.shopUrl" mode="aspectFill"></image></view>
				<view class="fz-16">{{info.shopName}}</view>
			</view>
			<view class="money flex_center fz-40">
				<view class="left fz-21">¥</view>
				<view class="right" :class="{active:money !== '消费金额'}">{{money}}</view>
			</view>
		</view>
		<!-- 数字键盘 -->
		<view class="keyboard flex_center">
			<view class="left">
				<!-- 1-9数字 -->
				<view class="number">
					<view class="num-item flex_center" v-for="(item,i) in numberList" :key="i">
						<view class="flex_center num-last fz-21" v-for="num in item" :key="num" @click="inputNum(num)">{{num}}</view>
					</view>
				</view>
				<view class="flex_center fz-21">
					<view class="zero flex_center" @click="inputNum('0')">0</view>
					<view class="point flex_center" @click="inputNum('.')">.</view>
				</view>
			</view>
			<view class="right fz-16">
				<view class="delete flex_center" @click="deleteNum">
					<image src="/static/images/order/delete.png" mode="widthFix"></image>
				</view>
				<view class="next flex_center" @click="next">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				numberList:[
					[1,2,3],
					[4,5,6],
					[7,8,9]
				],
				inputArr:[],
				info:{},
				query:''
			}
		},
		computed:{
			money(){
				if(this.inputArr.length>0){
					return this.inputArr.join('');
				}
				return '';
			},
			merchantId(){
				return this.$store.state.scanCodeQuery;
			}
		},
		watch:{
			merchantId(val){
				if(val){
					this.getMerchant(val);
				}
			}
		},
		methods:{
			inputNum(value){ //输入金额
				this.inputArr.push(value);
			},
			deleteNum(){ //删除输入金额
				let length = this.inputArr.length;
				this.inputArr.splice(length-1,1);
			},
			getMerchant(id){ //获取商户信息
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/merchant/get?id=${id}`)
				.then(res=>{
					// console.log('商户信息',res)
					if(res.code == 0){
						uni.hideLoading();
						this.info = res.data;
					}
				})
				.catch(err=>{})
			},
			next(){ //进入支付页面
				const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
				if(!this.money){
					uni.showToast({
						title:'请输入消费金额',
						icon: 'none'
					})
					return
				}
				if(this.money <= 0){
					uni.showToast({
						title:'金额必须大于0',
						icon: 'none'
					})
					return
				}
				if(!reg.test(this.money)){
					uni.showToast({
						title:'金额格式不正确',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url:`/pages/payment/index?merchantId=${this.info.id}&payCommission=${this.info.payCommission}&profits=${this.info.profits}&money=${this.money}`
				})
			}
		},
		onLoad:function(query){
			// console.log(query)
			// 微信登录
			this.query = query;
			
		},
		onShow:function() {
			let query = this.query;
			// #ifdef MP-WEIXIN
			if(query.merchantId){
				this.getMerchant(query.merchantId);
			}else{
				var scene = decodeURIComponent(query.q).split('=')[1];
				this.getMerchant(scene);
			}
			this.$wxLogin();
			// #endif
			// 支付宝登录
			// #ifdef MP-ALIPAY
			if(this.$store.state.scanCodeQuery){
				this.getMerchant(this.$store.state.scanCodeQuery);
			}else{
				this.getMerchant(query.merchantId);
			}
			this.$aliLogin();
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding-top: 100rpx;
		.business{
			line-height: 100rpx;
			text-align: center;
			flex-direction: column;
			color: #333;
			image{
				width: 140rpx;
				height: 140rpx;
				border-radius: 8rpx;
				display: block;
			}
		}
		.money{
			width: 710rpx;
			height: 140rpx;
			background: #fff;
			border-radius: 8rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			.left{
				width: 80rpx;
				text-align: center;
				border-right: 2rpx solid #DDDDDD;
				color: #333;
			}
			.right{
				width: 610rpx;
				padding-left: 30rpx;
				box-sizing: border-box;
				color: #999;
				font-weight: bold;
			}
			.active{
				color: #333;
			}
		}
	}
	.keyboard{
		flex-wrap: nowrap;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		.left{
			width: 562rpx;
			.number{
				.num-item{
					flex-wrap: nowrap;
					view{
						width: 186rpx;
						height: 120rpx;
						background: #fff;
						border-right: 2rpx solid #DDDDDD;
						border-bottom: 2rpx solid #DDDDDD;
						line-height: 28rpx;
						color: #333;
						font-weight: 1000;
					}
					.num-last:nth-child(3){
						border-right: 0;
					}
				}
			}
			.zero{
				width: 374rpx;
				height: 120rpx;
				background: #fff;
				border-right: 2rpx solid #DDDDDD;
				color: #333;
				font-weight: 1000;
			}
			.point{
				width: 186rpx;
				height: 120rpx;
				background: #fff;
				color: #333;
				font-weight: 1000;

			}
		}
		.right{
			width: 188rpx;
			.delete{
				width: 186rpx;
				height: 122rpx;
				background: #fff;
				border-left: 2rpx solid #DDDDDD;
				image{
					width: 48rpx;
					height: 32rpx;
					display: block;
				}
			}
			.next{
				width: 100%;
				height: 364rpx;
				background: #51C648;
				color: #fff;
			}
		}
	}
</style>
