<template>
	<view class="container">
		<view class="top" >
			<view class="user_info flex_between" @click="goWhereWithReg('/userPages/userInfo/index')">
				<view class="info-left flex_center">
					<!-- #ifdef MP-WEIXIN -->
					<view class="avatar">
						<open-data type="userAvatarUrl"></open-data>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<view class="avatar" v-if="userInfo.aliAvatar">
						<image class="avatar" :src="userInfo.aliAvatar" mode="widthFix" />
					</view>
					<view v-else>
						<image class="avatar" src="../../static/images/my/avatar.png" mode="widthFix" />
					</view>
					<!-- #endif -->
					<view class="nickname">
						<view class="level flex_center">
							<!-- #ifdef MP-WEIXIN -->
							<view class="fz-14">
								<open-data type="userNickName"></open-data>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-ALIPAY -->
							<view class="fz-14">{{userInfo.aliNickName || '链客通'}}</view>
							<!-- #endif -->
							<image :src="levelImg" mode="widthFix"></image>
						</view>
						<view class="flex_center">
							<view class="fz-14">UID:{{userInfo.uid || ''}}</view>
							<view class="fz-12 copy flex_center" @click.stop="copy">复制</view>
						</view>
					</view>
				</view>
				<view class="more flex_center"><image src="../../static/images/common/more.png" mode="widthFix"></image></view>
			</view>
			
			<view class="coupon_buddy">
				<view class="number_text" @click="goWhere('/pages/coupon/index')">
					<view class="number" v-if="balanceValue">{{balanceValue.couponsCount}}</view>
					<view class="number" v-else>***</view>
					<view class="text">优惠券</view>
				</view>
				<view class="number_text" @click="goWhere('/userPages/friends/index')">
					<view class="number" v-if="balanceValue">{{balanceValue.friendsCount}}</view>
					<view class="number" v-else>***</view>
					<view class="text">我的好友</view>
				</view>
				<view class="number_text"  @click="goWhereWithReg('/userPages/coinPurse/index')">
					<view class="number" v-if="balanceData">{{balanceData.balance || 0}}</view>
					<view class="number" v-else>***</view>
					<view class="text">零钱包</view>
				</view>
			</view>
		</view>
		<view class="main mart_top">
			<view class="fz-14">
				<!-- 我的订单 -->
				<view class="item flex_between" @click="goWhereWithReg('/userPages/orderRecording/index')">
					<view class="title flex_center">
						<image src="../../static/images/my/my_order.png" mode="widthFix"></image>
						<text>我的订单</text>
					</view>
					<view class="more flex_center">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 运营中心 -->
				<view class="item flex_between" v-if="isOperator" @click="goWhere(`/operationPages/operationCenter/index`)">
					<view class="title flex_center">
						<image src="../../static/images/my/operator.png" mode="widthFix"></image>
						<text>运营中心</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="bar fz-14">
				<!-- 我的推广码 -->
				<view class="item flex_between" @click="goWhereWithReg('/userPages/inviteCode/index')">
					<view class="title flex_center">
						<image src="../../static/images/my/extend.png" mode="widthFix"></image>
						<text>我的推广码</text>
					</view>
					<view class="more flex_center">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 我的好友 -->
				<!-- <view class="item flex_between" @click="goWhere('/userPages/friends/index')">
					<view class="title flex_center">
						<image src="../../static/images/my/friends.png" mode="widthFix"></image>
						<text>我的好友</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view> -->
			</view>
			<view class="bar fz-14">
				<!-- 商家入驻 -->
				<!-- && merchantEntry!=='商家入驻' -->
				<view class="item flex_between" @click="businessApply" v-if="!isOperator">
					<view class="title flex_center">
						<image src="../../static/images/my/business.png" mode="widthFix"></image>
						<text>{{merchantEntry}}</text>
					</view>
					<view class="more flex_center">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 联系我们 -->
				<view class="item flex_between" @click="contactUs">
					<view class="title flex_center">
						<image src="../../static/images/my/contact.png" mode="widthFix"></image>
						<text>联系我们</text>
					</view>
					<view class="more flex_center">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 服务协议 -->
				<view class="item flex_between" @click="goWhere('/userPages/agreement/index')">
					<view class="title flex_center">
						<image src="../../static/images/my/service.png" mode="widthFix"></image>
						<text>服务协议</text>
					</view>
					<view class="more flex_center">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 清除缓存 -->
				<!-- <view class="item flex_between">
					<view class="title flex_center">
						<image src="../../static/images/my/cache.png" mode="widthFix"></image>
						<text>清除缓存</text>
					</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view> -->
			</view>
			<view class="bar fz-14">
				<!-- 手机号码 -->
				<view class="item flex_between" @click="goMobile">
					<view class="title flex_center">
						<image src="../../static/images/my/renz.png" mode="widthFix"></image>
						<text>同步手机</text>
					</view>
					<view class="more flex_center">
						<uni-icons v-if="userName" class="flex_center" type="checkbox-filled" color="#47D347" :size="20"></uni-icons>
						<text v-else class="fz-12 notice">未同步手机号</text>
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<view class="bar fz-14">
				<!-- 实名信息 -->
				<view class="item flex_between" @click="goAuth">
					<view class="title flex_center">
						<image src="../../static/images/my/renz.png" mode="widthFix"></image>
						<text>实名信息</text>
					</view>
					<view class="more flex_center">
						<uni-icons v-if="isRealName" class="flex_center" type="checkbox-filled" color="#47D347" :size="20"></uni-icons>
						<text v-else class="fz-12 notice">请填写真实姓名</text>
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 联系我们弹框 -->
		<uni-popup type="bottom" ref="popup">
			<view class="pop_content fz-14">
				<view class="tel">
					<view class="phone item flex_center">{{phone}}</view>
					<view class="call item flex_center" @click="makePhoneCall">呼叫</view>
				</view>
				<view class="cancel flex_center" @click="$refs.popup.close()">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				balanceValue: '', // 优惠券，好友数量
				balanceData: '', // 余额
				phone:'0898-65324520', //联系电话
				levelImg:'../../static/images/my/star.png',
				merchantEntry: '商家入驻',
				url:'',  //商家中心、商家入驻、商家审核状态
				isOperator:false, //是否运营人员
				operatorType:'',  //运营人员类型
				isRealName:false,  //是否实名
				Trurl:'',
				TRstatus:''
			}
		},
		computed:{
			userInfo(){  
				return this.$store.state.userInfo;
			},
			userName(){
				return this.$store.state.userInfo.username;
			}
		},
		watch:{
			userInfo(val){
				// console.log(val)
				if(val){
					// 设置等级图标
					if(val.starExplain == '一星拓展员'){
						this.levelImg = '../../static/images/my/star.png';
					}else if(val.starExplain == '二星拓展员'){
						this.levelImg = '../../static/images/my/moon.png';
					}else if(val.starExplain == '三星拓展员'){
						this.levelImg = '../../static/images/my/sun.png';
					}else{
						this.levelImg = '../../static/images/my/star.png';
					}
					// 判断是否实名
					if(val.aliRealName){
						this.isRealName = true;
					}else{
						this.isRealName = false;
					}
					// 登录后获取到用户信息则请求数据（用户id）
					this.getBussinessStatus();
					this.getOperator();
				}
			}
		},
		methods:{
			goWhereWithReg(url){ // 需要注册才能进入的页面
				console.log(this.userInfo);
				if(this.userInfo && this.userInfo.inviteCode){
					uni.navigateTo({
						url
					})
				}else{
					uni.navigateTo({
						url: '/pages/login/sign'
					})
				}
			},
			goWhere(url){ // 不需要注册就能进入的页面
				uni.navigateTo({
					url
				})
			},
			goAuth(){  // 去实名
				uni.navigateTo({
					url:'/userPages/realname/index'
				})
			},
			goMobile(){  // 填写手机号
				uni.navigateTo({
					url:'/userPages/mobile/index'
				})
			},
			getJInjian(){
				this.$fly.post('/entry/findMerchantEntryByUserId?userId='+this.userInfo.id).then(res=>{
					if(res.code == 0){
						if(res.data && (res.data.status === 'AUDITED' || res.data.status === 'PASS' || res.data.status === 'FINISH')){
							this.Trurl = `/businessPages/review/index`;
						}
					}
				})
			},
			getBussinessStatus(){  //获取商户状态
				this.$fly.get(`/merchant/getMerchantByUserId/${this.userInfo.id}`)
				.then(res=>{
					// console.log('商家信息',res)
					if(res.code == 0){
						if(res.data){
							if(res.data.merchant.status == 'normal'){
								this.merchantEntry = '商家中心';
								this.url = '/businessPages/businessCenter/index';
								this.TRstatus = 'normal'
							}else{
								if(res.data.merchant.status == 'audit'){
									var status = 1;
								}else{
									var status = 0;
								}
								this.url = `/businessPages/review/index?status=${status}&note={res.data.note}`;
							}
						}else{
							// #ifdef MP-ALIPAY
							this.url = '/businessPages/aliBusinessApplyOne/index'
							// #endif
							// #ifdef MP-WEIXIN
							// this.url = '/businessPages/businessApplyOne/index';
							this.url = '/businessPages/wxBusinessApply/index';
							// #endif
						}
					}
				})
			},
			getOperator(){ //查询是否运营人员
				this.$fly.get(`/operation/findByid?userId=${this.userInfo.id}`)
				.then(res=>{
					if(res.code == 0){
						if(res.data){
							this.$store.state.operatorData = res.data;
							this.isOperator = true;
						}else{
							this.isOperator = false;
						}
					}else{
						this.isOperator = false;
					}
				})
			},
			getUserData() {
				this.$fly.get(`/user/getUserData?userId=${this.userInfo.id}`)
				.then(res=>{
					if(res.code == 0){
						this.balanceValue = res.data;
					}else{
						
					}
				})
			},
			// 获取余额
			getBalance() {
				this.$fly.post(`/transfer/findBalanceByUserId?userId=${this.userInfo.id}&userType=NORMALUSER`)
				.then(res=>{
					if(res.code == 0){
						this.balanceData = res.data;
					}else{
						
					}
				})
			},
			businessApply(){ //商户入驻
				if(this.userInfo.inviteCode){
					let url = this.url;
					if(this.Trurl && this.TRstatus !=='normal'){
						url = this.Trurl
					}
					uni.navigateTo({
						url
					})
				}else{
					uni.navigateTo({
						url: '/pages/login/sign'
					})
				}
				
				// 测试
				// this.url = '/businessPages/businessCenter/index';
				// this.TRstatus = 'normal'
				// uni.navigateTo({
				// 	url: this.url
				// })
			},
			
			// 复制
			copy(){
				uni.setClipboardData({
					data:this.userInfo.uid.toString(),
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
			// 联系我们弹框
			contactUs(){
				this.$refs.popup.open();
			},
			// 拨打电话
			makePhoneCall(){
				uni.makePhoneCall({
					phoneNumber:this.phone
				})
			}
		},
		onShow:function(){
			// 微信登录
			// #ifdef MP-WEIXIN
			if(!this.$store.state.userInfo.uid){
				this.$wxLogin();
			}
			// #endif
			// 支付宝登录
			// #ifdef MP-ALIPAY
			if(!this.$store.state.userInfo.uid){
				this.$aliLogin();
			}
			// #endif
			if(this.userInfo.id){
				// 更新运营人员类型，商家状态，是否实名
				this.getOperator();
				this.getBussinessStatus();
				this.getJInjian()
				this.getUserData();
				// 获取余额
				this.getBalance();
				if(this.userInfo.aliRealName){
					this.isRealName = true;
				}else{
					this.isRealName = false;
				}
			}
		},
		onShareAppMessage(){
			return {
				path: 'pages/my/index',
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		width: 100%;
		height: 280rpx;
		background: url('../../static/images/my/bg_min.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		box-sizing: border-box;
		position: relative;
		.coupon_buddy {
			position: absolute;
			width:710rpx;
			height:180rpx;
			background:rgba(255,255,255,1);
			box-shadow:0px 2px 6px 0px rgba(0, 0, 0, 0.15);
			border-radius:10rpx;
			position: absolute;
			left: 20rpx;
			bottom: -90rpx;
			padding: 30rpx 0;
			box-sizing: border-box;
			display: flex;
			.number_text {
				flex: 1;
				text-align: center;
				&:nth-child(2) {
					border-left: 1px solid #DEDEDE;
					border-right: 1px solid #DEDEDE;
				}
				.number {
					font-size:42rpx;
					font-family:'PingFang SC';
					font-weight:bold;
					color:rgba(255,152,52,1);
					margin-top: 10rpx;
					margin-bottom: 10rpx;
				}
				.text {
					font-size:26rpx;
					font-family:'PingFang SC';
					font-weight:400;
					color:rgba(153,153,153,1);
				}
			}
		}
		.user_info{
			width: 90%;
			height: 60px;
			.avatar{
				width: 60px;
				height: 60px;
				border-radius: 50%;
				overflow: hidden;
			}
			.nickname{
				margin-left: 20rpx;
				color: white;
				line-height: 40rpx;
				>view{
					justify-content: flex-start;
				}
				.level{
					justify-content: flex-start;
					image{
						width: 26rpx;
						margin-left: 10rpx;
						display: block;
					}
				}
				.copy{
					margin-left: 10rpx;
					width: 70rpx;
					height: 16px;
					border: 2rpx solid #fff;
					border-radius: 8px;
				}
			}
		}
	}
	.more{
		image{
			width: 12px;
			margin-left: 20rpx;
		}
		.notice{
			color: #F04242;
			line-height: 24rpx;
		}
	}
	.mart_top {
		margin-top: 120rpx;
	}
	.main{
		color: #333333;
		.bar{
			margin-top: 20rpx;
		}
		.item{
			padding: 0 30rpx;
			height: 50px;
			background: white;
			border-bottom: 2rpx solid #D3D3D3;
			.title{
				image{
					width: 48rpx;
					// background: #DCF8FF;
				}
				text{
					margin-left: 20rpx;
				}
			}
		}
	}
	// 联系我们
	.pop_content{
		padding: 20rpx;
		color: #333;
		.tel{
			border-radius: 8rpx;
			.item{
				width: 100%;
				height: 100rpx;
				background: #fff;
			}
			.call{
				border-bottom-right-radius: 8rpx;
				border-bottom-left-radius: 8rpx;
			}
			.phone{
				border-top-left-radius: 8rpx;
				border-top-right-radius: 8rpx;
				border-bottom: 2rpx solid #D3D3D3;
				color: #999999;
			}
		}
		.cancel{
			width: 100%;
			height: 100rpx;
			background: #fff;
			border-radius: 8rpx;
			margin-top: 20rpx;
		}
	}
</style>
