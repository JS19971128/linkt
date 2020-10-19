<template>
	<view class="bg">
		<view class="announcement flex_center">
			<view class="fz-14">公告：</view>
			<view class="content flex_center" @click="goNotice">
				<uni-notice-bar class="notice" speed="32" scrollable="true" :text="notice.title" background-color="transparent" color='#fff'></uni-notice-bar>
			</view>
		</view>
		<view class="coupon-txt">温馨提示：优惠券支持拆零使用，可转赠，可叠加，可全国全网通用。</view>
		<!-- 优惠券列表 -->
		<view class="main" v-if="list.length>0">
			<view v-for="item in list" :key="item.id">
				<!-- 商家优惠券 -->
				<view class="item flex_center" v-if="item.couponShowType=='IMAGE'&&item.couponType=='MERCHANT'">
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
						<view class="fz-12 gift flex_center" @click="showPop(item.id)">赠送</view>
						<view class="fz-12 tip">{{item.day}}天后过期</view>
					</view>
				</view>
				<!-- 普通优惠券 -->
				<view class="item flex_center" v-else>
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
						<view class="fz-12 gift flex_center" @click="showPop(item.id)">赠送</view>
						<view class="fz-12 tip">{{item.day}}天后过期</view>
					</view>
				</view>
			</view>
			<uni-load-more :iconSize="20" color="#999999" :status="status" :contentText="contentText"></uni-load-more>
		</view>
		<!-- 缺省 -->
		<view class="no_data" v-else>
			<view class="">
				<image src="../../static/images/coupon/coupon_none.png" mode="widthFix"></image>
			</view>
			<view class="fz-14">您还没有优惠券喔</view>
		</view>
		<!-- 赠送弹框 -->
		<view class="pop_wrap" v-if="show">
			<view class="pop_content">
				<view class="close flex_center" @click="show=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="flex_center box-item">
						<view class="fz-14 item-left flex_center">UID</view>
						<view class="item-right"><input type="number" pattern="[0-9]*" v-model="uid" placeholder="请输入对方的Uid号" placeholder-style="color:#CBCBCB;font-size:28rpx;line-height:28rpx"/></view>
					</view>
					<view class="fz-14 btn flex_center" @click="giveCoupon">赠送</view>
				</view>
			</view>
		</view>
		<!-- 同步手机号 -->
		<view class="pop_wrap" v-if="showMobile">
			<view class="pop_content mobile">
				<view class="close flex_center" @click="showMobile=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="flex_center mobile-box">
						<image class="mobile-box-img" src="../../static/images/coupon/tips.png"></image>
						<view class="pop-title">前往获取100元优惠券</view>
						<view class="pop-tips">同步手机号后，即可获得100元优惠券喔~</view>
					</view>
					<view class="btns">
						<view class="fz-14 btn flex_center" @click="showMobile=false">残忍拒绝</view>
						<view class="fz-14 btn flex_center" @click="goMobile">立即前往</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				notice: {},
				contentText: {
					contentdown: '向上滑动加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了',
				},
				status: 'noMore', //more,loading,noMore
				list:[], //优惠券列表
				show:false,  //赠送弹框显示与否
				page:0, //页码
				uid:'', 
				couponId:'',
				showMobile:false
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			},
		},
		// watch:{
		// 	userInfo(){ //登录后获取到用户信息则请求数据
		// 		this.getList();
		// 		this.init();
		// 	}
		// },
		methods:{
			init(){
				let userInfo = this.userInfo;
				
				this.getList()
				if(userInfo.username){
					this.showMobile = false;
				}else{
					this.showMobile = true;
				}
			},
			getNotice(){ //获取顶部公告
				this.$fly.get(`/notice/type/2`)
				.then(res=>{
					if(res.code == 0){
						this.notice = res.data;
					}
				})
			},
			goMobile(){  // 同步手机号
				uni.navigateTo({
					url:'/userPages/mobile/index'
				})
			},
			goNotice(){ //进入公告详情页面
				uni.navigateTo({
					url:`/userPages/announcement/index?id=${this.notice.id}`
				})
			},
			getList(){ //获取优惠券列表
				this.status = 'loading';
				this.$fly.get(`/coupon/list?userId=${this.userInfo.id}&page=${this.page}&status=AVAILABLE`)
				.then(res=>{
					uni.stopPullDownRefresh();
					if(res.code == 0){
						let data = res.data.content;
						data.forEach(item=>{
							item.day = parseInt((item.expireDate - new Date().getTime()) / (3600 * 24 * 1000));
						})
						if(this.page == 0){
							this.list = [];
						}
						this.list = this.list.concat(data);
						this.page++;
						if(this.page > res.data.totalPages - 1){
							this.status = 'noMore';
						}else{
							this.status = 'more';
						}
					}
				})
				.catch(err=>{
					
				})
			},
			showPop(id){ //显示赠送弹框
				this.couponId = id;
				this.show = true;
			},
			giveCoupon(){ //赠送优惠券
				if(!this.uid){
					uni.showToast({
						title:'请输入对方的Uid号'
					})
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/coupon/send?id=${this.couponId}&userId=${this.userInfo.id}&receiveUserId=${this.uid}`)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000)
					uni.showToast({
						title:res.message
					})
					if(res.code == 0){
						this.show = false;
						
						this.list = []
						this.page = 0;
						this.getList()
					}
				})
				.catch(err=>{
					console.log(err);
				})
			}
		},
		onLoad:function(){
			this.getNotice();
		},
		onShow: function(){
			// 微信登录
			// // #ifdef MP-WEIXIN
			// if(!this.$store.state.userInfo.uid){
			// 	this.$wxLogin();
			// }else{
			// 	if(this.list.length == 0){
			// 		this.getList();
			// 	}
			// }
			// // #endif
			// // 支付宝登录
			// // #ifdef MP-ALIPAY
			// if(!this.$store.state.userInfo.uid){
			// 	this.$aliLogin();
			// }else{
			// 	if(this.list.length == 0){
			// 		this.getList();
			// 	}
			// }
			// // #endif
			
			
			this.init();
		},
		onReachBottom: function(){  //触底加载
			if(this.status == 'noMore'){
				return
			}
			this.getList();
		},
		onPullDownRefresh:function(){
			this.page = 0;
			this.init();
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		min-height: 100vh;
		background: #eee;
	}
	.announcement{
		padding: 0 40rpx;
		// height: 60rpx;
		background: rgba(0,0,0,.4);
		color: #fff;
		justify-content: flex-start;
		.fz-14{
			width: 13%;
		}
		.content{
			width: 85%;
			justify-content: flex-start;
			/deep/ .notice{
				width: 100%;
			}
			/deep/ .uni-noticebar{
				width: 100%;
				margin-bottom: 0;
			}
		}
	}
	.main{
		margin-top: 10rpx;
		.item{
			width: 710rpx;
			height: 193rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			background: url('../../static/images/coupon/bg.png') no-repeat;
			background-size: 100% 100%;
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
	// 弹框
	.pop_content{
		width: 590rpx;
		padding: 0 30rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-top: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			.box-item{
				width: 100%;
				height: 74rpx;
				border: 2rpx solid #DBDBDB;
				border-radius: 37rpx;
				justify-content: flex-start;
				margin-top: 40rpx;
				input{
					font-size: 28rpx;
					color: #333;
					line-height: 28rpx;
				}
				.item-left{
					width: 20%;
					border-right: 2rpx solid #DBDBDB;
				}
				.item-right{
					width: 80%;
					padding-left: 30rpx;
					box-sizing: border-box;
				}
			}
			.btn{
				width: 100%;
				height: 74rpx;
				background: #FF9D29;
				border-radius: 37rpx;
				color: #fff;
				margin: 50rpx 0;
			}
		}
		&.mobile{
			.mobile-box{
				display: flex;
				flex-direction: column;
				.mobile-box-img{
					width: 223rpx;
					height: 118rpx;
				}
				.pop-title{
					font-size: 32rpx;
					margin-top: 54rpx;
					margin-bottom: 27rpx;
					line-height: 1.5;
					color: #333333;
					font-weight: bold;
				}
				.pop-tips{
					font-size: 24rpx;
					line-height: 1.5;
					color: #999;
				}
			}
			.btns{
				display: flex;
				align-items: center;
				justify-content: center;
				.btn{
					margin-right: 30rpx;
					height: 74rpx;
					border:1px solid #FF9D29;
					&:last-child{
						margin-right: 0;
					}
					&:first-child{
						background: #fff;
						border-color:#999999;
						color: #999999;
					}
				}
			}
		}
	}
	/deep/ .uni-load-more__text{
		font-size: 28rpx !important;
	}
	.coupon-txt{
		font-size: 28rpx;
		padding: 10rpx 40rpx;
	}
</style>
