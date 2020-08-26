<template>
	<view class="container">
		<!-- 已提交审核 -->
		<view class="" v-if="status">
			<view class="main flex_center">
				<image src="../../static/images/business/review.png" mode="widthFix"></image>
				<view class="tip">
					<view class="fz-14">已提交审核</view>
					<view class="fz-12">工作人员会在1-3个工作日内完成审核，请耐心等待</view>
				</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<view class="ali_sign">
				<view class="sign_btn fz-14 flex_center" @click="goSign">自主签约分账功能</view>
				<view class="fz-12 notice">商家完成签约服务后，才可以入驻链客平台，参与分账系统哦~</view>
			</view>
			<!-- #endif -->
			<!-- <view class="btn fz-14 flex_center" @click="goEditshopInfo">修改店铺资料</view> -->
			<!-- <view class="notice fz-12">如果店铺资料填错了，可以点击按钮修改</view> -->
			<view class="btn rz fz-14 flex_center" v-if="!signStatus" @click="copy()">复制签约链接</view>
			<view class="notice fz-12" v-if="!signStatus">请将签约地址复制至手机浏览器打开，即可完成签约</view>
			
			<view class="btn nrz fz-14 flex_center" v-else>已完成签约</view>
		</view>
		<!-- 审核未通过 -->
		<view class="" v-else>
			<view class="main flex_center">
				<image src="../../static/images/business/unpass.png" mode="widthFix"></image>
				<view class="tip">
					<view class="fz-14">审核未通过</view>
					<view class="fz-12">{{note}}</view>
				</view>
			</view>
			<view class="btn fz-14 flex_center" @click="goApply">重新提交资料</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				status:1,
				note: '',
				signStatus:false,
				CopyUrl:''
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id || 22222234;
			},
		},
		methods:{
			goApply(){
				// #ifdef MP-ALIPAY
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyOne/index'
				})
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url:'/businessPages/businessApplyOne/index'
				})
				// #endif
			},
			clicURl(){
				uni.navigateTo({
					url:'/businessPages/wxBusinessApply/autograph'
				})
				
				
			},
			goEditshopInfo(){
				// #ifdef MP-ALIPAY
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyThree/index'
				})
				// #endif
			},
			goSign(){
				uni.navigateTo({
					url:'/businessPages/aliSign/index'
				})
			},
			init(){
				uni.showLoading({
					title:'加载中'
				})
				try{
					this.$fly.post('/entry/findMerchantEntryByUserId?userId='+this.userId).then(res=>{
						this.signStatus = res.data.signStatus;
						let data = res.data;
						let prams = {
							email:data.email,
							phone:data.linkPhone,
							legalPerson:data.legalPerson,
							legalPersonID:data.legalPersonID,
							signName:data.signName,
							address:data.address
						}
						let url = `?email=${prams.email}&phone=${prams.phone}&legalPerson=${prams.legalPerson}&legalPersonID=${prams.legalPersonID}&signName=${prams.signName}&address=${prams.address}&`
						// this.$store.commit('SETSTATUSDATA',statusData);
						return this.$fly.post('/entry/signContract'+url);
					}).then(res=>{
						this.CopyUrl = res.data.data;
						uni.hideLoading();
					})
				}catch(e){
					uni.showToast({
						title: '拉去信息失败！',
						icon: 'none'
					})
				}
			},
			// 复制
			copy(){
				uni.setClipboardData({
					data:this.CopyUrl,
					success: () => {
						uni.showToast({
							title:'复制成功！'
						})
					},
					fail: (err) => {
						// console.log('copy',err)
					}
				})
			},
		},
		onShow() {
			this.init();
		},
		onLoad:function(query){
			this.status = query.status;
			this.note = query.note;
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		flex-direction: column;
		line-height: 40rpx;
		text-align: center;
		padding-top: 200rpx;
		image{
			width: 170rpx;
			display: block;
		}
		.tip{
			margin-top: 30rpx;
			.fz-14{
				color: #999999;
			}
			.fz-12{
				color: #CBCBCB;
			}
		}
	}
	.ali_sign{
		margin: 100rpx auto;
		.sign_btn{
			width: 670rpx;
			height: 38px;
			border-radius: 19px;
			background: #FF9D11;
			color: #fff;
			margin: 0 auto;
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		border: 2rpx solid #FF9D11;
		color: #FF9D11;
		background: #fff;
		margin: 0 auto;
		margin-top: 100rpx;
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
	.notice{
		color: #ccc;
		margin-top: 20rpx;
		text-align: center;
	}
</style>
