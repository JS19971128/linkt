<template>
	<view class="bg">
		<view class="consume">
			<view class="title">
				<view class="fz-12">消费金额</view>
				<view class="money"><text class="fz-12">¥</text><text class="fz-20">{{money}}</text></view>
			</view>
			<view class="discount fz-12">最多可抵扣{{maxDiscount}}元</view>
		</view>
		<view class="coupon-txt">温馨提示：优惠券支持拆零使用，可转赠，可叠加，可全国全网通用。</view>
		<view class="fz-14 coupon"><view>可使用优惠券（{{total}})</view><view class="coupon-title">使用优惠券请勾选</view></view>
		<!-- 优惠券列表 -->
		<view class="main" v-if="list.length>0">
			<scroll-view scroll-y="true" style="height:500px" @scrolltolower="getMoreCoupon">
				<view v-for="(item,i) in list" :key="item.id">
					<!-- 商家优惠券 -->
					<view class="item flex_center" v-if="item.couponShowType=='IMAGE'&&item.couponType=='MERCHANT'" @click="chooseCoupon(i)">
						<view class="brand">
							<image class="brand-bg" src="../../static/images/coupon/juxing.png"></image>							
							<image class="shop_pic" :src="item.imageUrl" mode="aspectFill"></image>
							<view class="fz-18 title right">{{item.title}}</view>
							<!-- <view class="tip fz-10">*使用优惠券，微信/支付宝会收取0.2%-0.6%交易手续费</view> -->
						</view>
						<view class="right flex_center">
							<view class="flex_center price">
								<text class="fz-12">¥</text><text class="fz-24">{{item.amount}}</text>
							</view>
							<view class="fz-12 tip">{{item.day}}天后过期</view>
						</view>
						<image class="rightDefe" src="../../static/images/coupon/right.png" mode="widthFix"></image>
						<view class="choose" v-show="chooseList[i]['choosed']"><image src="../../static/images/coupon/choosed.png" mode="widthFix"></image></view>
					</view>
					<!-- 普通优惠券 -->
					<view class="item flex_center" v-else @click="chooseCoupon(i)">
						<view class="left flex_center">
							<view class="fz-24">{{item.title}}</view>
							<view class="fz-14">{{item.introduction || '通用券可以全国通用，可跨商家叠加使用，还可以赠送给好友使用。'}}</view>
							<!-- <view class="fz-14">通用券可以全国通用，可垮商家叠加使用，还可用赠送给好友使用</view> -->
							<!-- <view class="fz-10 tip">*使用优惠券，微信/支付宝会收取0.2%-0.6%交易手续费</view> -->
						</view>
						<view class="right flex_center">
							<view class="flex_center price">
								<text class="fz-12">¥</text><text class="fz-24">{{item.amount}}</text>
							</view>
							<view class="fz-12 tip">{{item.day}}天后过期</view>
						</view>
						<image class="rightDefe" src="../../static/images/coupon/right.png" mode="widthFix"></image>
						<view class="choose" v-show="chooseList[i]['choosed']"><image src="../../static/images/coupon/choosed.png" mode="widthFix"></image></view>
					</view>
				</view>
				<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
			</scroll-view>
		</view>
		<!-- 缺省 -->
		<view class="no_data" v-else>
			<view class="">
				<image src="../../static/images/coupon/coupon_none.png" mode="widthFix"></image>
			</view>
			<view class="fz-14">您还没有优惠券喔</view>
		</view>
		<!-- 支付 -->
		<view class="payment flex_center">
			<view class="num flex_center"><text class="fz-14">需支付</text><text class="fz-20">￥{{needPay}}</text></view>
			<view class="fz-16 btn flex_center" @click="payment">支付</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				chooseList:[], //{choosed:false}
				list:[], //优惠券列表
				total: 0,
				page: 0,
				maxDiscount:0,  //最多可抵扣
				couponIds:[],   //选择的优惠券id集
				couponAmount:0,  //优惠券抵扣金
				needPay:0,  //需支付
				money:0,
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			},
			buyCommodityInfo(){ //购物车id等
				return this.$store.state.order.buyCommodityInfo;
			},
			orderMerchantId(){ //店铺id
				return this.$store.state.order.orderMerchantId;
			},
			consumerInfo(){ //地址栏
				return this.$store.state.order.consumerInfo;
			},
			payCommission(){ //店铺手续费
				return this.$store.state.order.payCommission;
			},
			shareUserId(){  // 商品分享者id
				return this.$store.state.shareUserId;
			},
		},
		methods:{
			init(){ //初始化
				try{
					let needPayList = uni.getStorageSync('needPay');
					this.goods = needPayList.cartRespDtoList;
					this.needPay = needPayList.priceTotal; //赋值总金额
					this.money = needPayList.priceTotal; //赋值付款
					this.maxDiscountFun(needPayList.priceTotal); //计算最多抵扣金额
				}catch(e){
					uni.showToast({
						title:'初始化失败！',
						duration:2000,
						icon: 'none'
					});
				}
			},
			//计算最多抵扣金额
			maxDiscountFun(priceTotal){ //priceTotal 总价
				let {goods,payCommission} = this; //payCommission 商家手续费
				let discountMoney = goods.reduce((v,i)=>{ //可抵扣金额 商品列表循环 priceSale:价格 commodityNum:数量 profits:让利比
					
					let consumeMoney = Math.floor((i.priceSale*100) * i.commodityNum)/100;
					let rate = i.profits; //让利比例
					let db = this.profitClass(rate);  //夺宝比例
					//让利金额
					let  principal = ((consumeMoney * 1000) * ((100 - rate) * 10))/1000000;
					principal =  Math.floor(principal * 100) / 100;
					let discountMoney = Math.floor((consumeMoney*100) - (principal*100)) / 100;
					//夺宝
					let dbPrice = ((consumeMoney * 1000) * (db * 10))/1000000;
					dbPrice = fee = Math.floor(dbPrice * 1000) / 1000;
					discountMoney = Math.floor((discountMoney*1000) - (dbPrice*1000)) / 1000;
					//让利金额end
					let price = Math.floor((v*1000) + (discountMoney*1000)) / 1000;
					return price;
				},0);
				//手续费等于 总价*商家手续费
				let fee = ((priceTotal * 100000) * (payCommission * 100000))/10000000000;
				fee = this.round2(fee,2);
				if(fee<0.01){
					fee = 0.01;
				}
				//手续费end
				
				let maxDiscount = (((discountMoney*1000) * (70 * 10)) - (fee * 1000000))/1000000;
				this.maxDiscount = Math.floor(maxDiscount * 100) / 100;
				
			},
			round2(number,fractionDigits){
			    return Math.round(number * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits);
			},
			profitClass(number = 5){
				let num = Number(number);
				let profits = 0;
				if(num>=6 && num<=11){  //商家让利6%-11%之间，消费10元拿出1%送0.1元夺宝券，剩下的5-10%用于分润和抵扣优惠券
					profits = 1
				}else if(num>=12 && num<=17){ //商家让利12%-17%之间，消费10元拿出2%送0.2元夺宝券，剩下的10-15%用于分润；
					profits = 2
				}else if(num>=18 && num<=23){  //商家让利18%-23%之间，消费10元拿出3%送0.3元夺宝券，剩下的15-20%用于分润；
					profits = 3
				}else if(num>=24 && num<=29){ //商家让利24%-29%之间，消费10元拿出4%送0.4元夺宝券，剩下的20-25%用于分润；
					profits = 4
				}else if(num===30){ //商家让利30%，消费10元拿出5%送0.5元夺宝券，，剩下的25%用于分润；
					profits = 5
				}
				return profits;
			},
			getMoreCoupon(){
				if(this.status == 'noMore'){ 
					return 
				}else{
					this.getCoupon();
				}
			},
			getCoupon(){ //获取优惠券列表
				this.status = 'loading';
				let {userId,page,orderMerchantId} = this;
				let data = {
					userId,page,
					lockMerchantId:orderMerchantId,
					status:'AVAILABLE'
				};
				this.$fly.get(`/coupon/list`,data).then(res=>{
					// console.log(res)
					if(res.code == 0){
						this.total = res.data.totalElements;
						let data = res.data.content;
						data.forEach(item=>{
							item.day = parseInt((item.expireDate - new Date().getTime()) / (3600 * 24 * 1000));
							this.chooseList.push({
								choosed:true,
								id:item.id,
								amount:item.amount
							});
						})
						this.list = this.list.concat(data);
						this.page++;
						if(this.page > res.data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}
				})
			},
			changeNeedPay(){ //需支付金额
				let sum = this.money, //消费金额
				discountMoney = this.maxDiscount, //可抵扣金额
				list = this.chooseList
				this.couponAmount = 0;
				this.couponIds = [];
				list.map(item => {
					if (item.choosed) {
						this.couponIds.push(item.id)
						this.couponAmount = ((this.couponAmount * 1000) + (item.amount * 1000))/1000
						// console.log(this.couponAmount)
						// return item
					}
				})
				this.couponAmount = (parseInt(this.couponAmount * 100) / 100).toFixed(2);
				//优惠券抵扣金额大于可抵扣金额
				// console.log(this.couponAmount,discountMoney)
				if((this.couponAmount * 1000) >= (discountMoney * 1000)){
					this.needPay = ((sum * 1000) - (discountMoney * 1000))/1000;
					// mustMount = (parseInt(mustMount * 100)/100).toFixed(2);
					// console.log('>=',sum,this.needPay,discountMoney)
				}else{
					//没有选择优惠券
					if(this.couponAmount == 0){
						this.needPay = sum;
					}else{
						this.needPay = ((sum * 1000) - (this.couponAmount * 1000))/1000;
						// mustMount = (parseInt(mustMount * 100)/100).toFixed(2);
						// console.log('<',this.needPay)
					}
				}
				if(this.needPay > sum){
					this.needPay = sum
				}
			},
			getMoreCoupon(){
				if(this.status == 'noMore'){ 
					return 
				}else{
					this.getCoupon();
				}
			},
			chooseCoupon(index){ //选择优惠券
				this.chooseList[index]['choosed'] = !this.chooseList[index]['choosed'];
				this.changeNeedPay();
			},
			async payment(){//支付
				try{
					if(!this.userId || !this.orderMerchantId){
						uni.showToast({
							title:'支付失败，请再次点击支付',
							duration:2000,
							icon: 'none'
						})
						return
					}
		
					let openId = this.$store.state.userInfo.openId;
					let data = {
						couponIds:this.couponIds.toString(),
						freight:0,
						ip:'127.0.0.1',
						// merchantId: 71412,
						merchantId: this.orderMerchantId,
						registType:'WECHAT',
						userId:this.userId,
						consumerInfo:this.consumerInfo,
						buyCommodityInfo:{...this.buyCommodityInfo,pricePaid:this.needPay},
						// payType:'APPLET',
						// bizType:'AppPayApplet',
						openId: openId,
						shareUserId: this.shareUserId,
						payMode:'H5_WXJSAPI',
						terminalDevice:4,
					}
					// #ifdef MP-ALIPAY
					// data.bizType = 'AppPayApplet';
					// data.payType = 'APPLET';
					data.payMode = 'H5_ZFBJSAPI';
					data.registType = 'ALIPAY';
					data.openId = this.$store.state.userInfo.alipayUserId
					// #endif
					uni.showLoading({
						title:'加载中'
					})
					let res = await this.$fly.post('/jufupay/prePay',data);
					// console.log(this.shareUserId,'55555555')
					// uni.hideLoading();
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						if(res.data.errorcode!='0000'){
							wx.showToast({
							  title: res.data.errormessage,
							  icon: 'none',
							  duration: 2500
							})
							return;
						}
						console.log(res.data.pay_url)
						let url = res.data.pay_url;
						let obj = {}
						console.log(url.split('&'))
						let arr = url.split('&');
						for(let i of arr){
							console.log(i.split('='))
							let dArr = i.split('=');
							let str = dArr[1];
							for(let j=2;j<dArr.length;j++){
								
								str+='='+dArr[j]
								
							}
							// debugger
							obj[dArr[0]] = str;
							
							
						}
						// #ifdef MP-WEIXIN
						this.wechatPay(obj);
						// #endif
						// #ifdef MP-ALIPAY
						this.aliPay(url);
						// #endif
					}else{
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
					// if(order.data.code!=200){
					// 	wx.showToast({
					// 	  title: order.data.msg,
					// 	  icon: 'none',
					// 	  duration: 2500
					// 	})
					// 	return
					// };
					
					// let tradeNo = JSON.parse(order.data.data.rt10_payInfo);
					// console.log(tradeNo)
					// // #ifdef MP-WEIXIN
					// this.wechatPay(tradeNo);
					// // #endif
					// // #ifdef MP-ALIPAY
					// this.aliPay(tradeNo.tradeNO);
					// // #endif
				}catch(e){
					//TODO handle the exception
					uni.hideLoading();
					console.error(e)
					wx.showToast({
					  title: '提交订单失败！',
					  icon: 'none',
					  duration: 2500
					})
				}
				
				
			},
			aliPay(tradeNo){ //调起支付宝支付
				uni.requestPayment({
					provider:"alipay",
					orderInfo:tradeNo,
					success: (res) => {
						// console.log('chenggong',res)
						if(res.resultCode == '9000'){
							uni.reLaunch({
								url:'/pages/coupon/index'
							})
						}else{
							this.checkOrderStatus(tradeNo); //支付失败时查询订单状态
						}
					},
					fail: (err) => {
						// console.log('shibai',err)
						uni.redirectTo({
							url:'/pages/payFailed/index'
						})
					}
				})
			},
			checkOrderStatus(tradeNo){  //查询订单状态
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.post(`/order/pay/alipay/tradeQuery?orderNo=${tradeNo}`)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.redirectTo({
							url:'/pages/coupon/index'
						})
					}else{
						uni.redirectTo({
							url:'/pages/payFailed/index'
						})
					}
				})
				.catch(err=>{})
			},
			wechatPay(payInfo) {  //微信支付
			// debugger
				uni.requestPayment({
					appId: payInfo.appId,
					timeStamp: payInfo.timeStamp,
					nonceStr: payInfo.nonceStr,
					package:payInfo.package.replace("prepay_id%3D","prepay_id="),
					signType: payInfo.signType,
					paySign: payInfo.paySign,
					success: (res) => {
						uni.reLaunch({
							url:'/pages/coupon/index'
						})
					},
					fail: (res) => {
						console.log(res)
						uni.navigateTo({
							url:'/pages/payFailed/index'
						})
					}
				});
			}
		},
		onLoad:function(query){
			this.getCoupon();
			this.init()
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		min-height: 100vh;
		background: #eee;
	}
	.consume{
		padding: 0 20rpx;
		background: #fff;
		.title{
			line-height: 50rpx;
			padding: 20rpx 0;
			border-bottom: 2rpx solid #D3D3D3;
			color: #999999;
			.money{
				color: #333;
				.fz-20{
					margin-left: 10rpx;
				}
			}
		}
		.discount{
			color: #FF1B1C;
			padding: 30rpx 0;
			line-height: 24rpx;
		}
	}
	.coupon{
		padding: 30rpx 20rpx 0;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #999;
	}
	.main{
		margin-top: 10rpx;
		padding-bottom: 100rpx;
		.item{
			width: 710rpx;
			height: 193rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			background: url('../../static/images/coupon/bg.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			.rightDefe{
				width: 64rpx;
				height: 60rpx;
				position: absolute;
				right: 2rpx;
				top: 2rpx;
				z-index: 8;
			}
			.choose{
				position: absolute;
				right: 6rpx;
				top: -3rpx;
				z-index: 9;
				image{
					width: 22rpx;
					height: 15rpx;
				}
			}
			.left{
				width: 486rpx;
				height: 100%;
				padding: 20rpx 0;
				box-sizing: border-box;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-start;
				color: #fff;
				view{
					padding: 0 30rpx;
				}
				.fz-24{
					color: #fff;
					line-height: 48rpx;
				}
				.fz-14{
					line-height: 30rpx;
				}
				.tip{
					word-break: break-all;
					color: #BBBBBB;
				}
			}
			.brand{
				width: 486rpx;
				height: 100%;
				position: relative;
				color: #fff;
				text-shadow: 0 5rpx 5rpx rgba(0,0,0,.1);
				// font-weight: bold;
				display: flex;
				flex-direction: column;
				.brand-bg{
					position: absolute;
					width: 100%;
					height: 111rpx;
				}
				.shop_pic{
					width: 486rpx;
					height: 100%;
					display: block;
				}
				.title{
					width: 100%;
					position: absolute;
					top: 0;
					left: 0;
					text-align: center;
					padding: 8rpx 0;
					font-weight: 1000;
					letter-spacing: 3rpx;
					&.right{
						text-align: left;
						left: 8rpx;
						font-size: 34rpx;
						text-shadow:0px 1px 2px rgba(0, 0, 0, 1);
						color: #fff;
					}
				}
				.tip{
					width: 100%;
					position: absolute;
					bottom: 0;
					left: 0;
					text-align: center;
					padding: 4rpx 0;
					background:radial-gradient(24rpx at right bottom,transparent 50%,rgba(0,0,0,.2) 50%);
				}
			}
			.right{
				width: 223rpx;
				height: 100%;
				padding: 20rpx 0;
				box-sizing: border-box;
				flex-direction: column;
				justify-content: space-around;
				align-items: flex-end;
				color: #fff;
				
				view{
					margin-right: 30rpx;
				}
				.price{
					align-items: flex-end;
					text{
						display: block;
					}
					.fz-24{
						line-height: 48rpx;
						margin-left: 16rpx;
					}
				}
				.gift{
					width: 80rpx;
					height: 40rpx;
					background: #4CB927;
					color: #fff;
					border-radius: 20rpx;
				}
				.tip{
					color: #fff;
				}
			}
		}
	}
	.no_data{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		color: #999;
		image{
			width: 210rpx;
		}
	}
	.payment{
		width: 100%;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 10;
		.num{
			width: 530rpx;
			height: 110rpx;
			color: #333;
			line-height: 32rpx;
			justify-content: flex-start;
			.fz-14{
				text-indent: 1em;
			}
			.fz-20{
				color: #FF9733;
				line-height: 40rpx;
			}
		}
		.btn{
			width: 220rpx;
			height: 110rpx;
			line-height: 32rpx;
			background: #FF9733;
			color: #fff;
		}
	}
	.coupon-txt{
		font-size: 28rpx;
		padding: 10rpx 30rpx 0;
	}
</style>
