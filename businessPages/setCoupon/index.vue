<template>
	<view class="container">
		<!-- 设置文字 -->
		<view class="set_area" v-if="setType=='text'">
			<view class="item flex_center">
				<view class="left flex_center">
					<view class="fz-24">商家简称+专用券</view>
					<view class="fz-14">{{introduction}}</view>
					<!-- <view class="fz-10 tip">*使用优惠券，微信会收取0.2%交易手续费</view> -->
				</view>
				<view class="right flex_center">
					<view class="flex_center price">
						<text class="fz-12">¥</text><text class="fz-24">50</text>
					</view>
					<view class="fz-12 gift flex_center">赠送</view>
					<view class="fz-12 tip">30天后过期</view>
				</view>
			</view>
		</view>
		<!-- 设置图片 -->
		<view class="set_area" v-else>
			<view class="item flex_center">
				<view class="flex_center pic_text">
					<view v-if="couponImg" class="coupon-img">
						<image :src="couponImg" mode="aspectFill" ></image>
					</view>
					<view class="fz-14" v-else>{{pic_text}}</view>
				</view>
				<view class="right flex_center">
					<view class="flex_center price">
						<text class="fz-12">¥</text><text class="fz-24">50</text>
					</view>
					<view class="fz-12 gift flex_center">赠送</view>
					<view class="fz-12 tip">30天后过期</view>
				</view>
			</view>
		</view>
		<!-- 商家回流 -->
		<view class="business flex_between">
			<view class="fz-14">商家回流数量</view>
			<view class="fz-14 flex_center">
				<view class="box fz-16 flex_center" :class="{box_minus:quantity>0}" @click="reduceBusiness">-</view>
				<view class="box box-num flex_center">{{quantity}}</view>
				<view class="box fz-16 flex_center" :class="{box_plus:quantity<1}" @click="increaseBusiness">+</view>
			</view>
		</view>
		<view class="notice fz-12">默认回流0张商家券，最高可设置为1张</view>
		<view class="tab fz-14 flex_center">
			<view :class="{active:setType=='text'}" @click="changeType('text')">文字</view>
			<view :class="{active:setType=='picture'}" @click="changeType('picture')">图片</view>
		</view>
		<!-- 设置介绍 -->
		<view class="intro flex_center" v-if="setType=='text'">
			<view class="fz-14 desc">介绍</view>
			<view class="">
				<textarea :maxlength="24" v-model="userIntro" placeholder="请输入24字以内的介绍" placeholder-style="font-size:28rpx;color:#CCCCCC;" style="width:550rpx;height:200rpx;font-size:28rpx"/>
			</view>
		</view>
		<!-- 上传图片 -->
		<view v-else>
			<view class="upload flex_center" @click="upload">上传</view>
			<view class="tip fz-12">建议上传486x194比例的图片</view>
		</view>
		<view class="btn fz-16 flex_center" @click="submit">保存</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				userIntro:'', //用户输入介绍
				pic_text:'图片显示位置',
				setType:'text', //text picture
				quantity:0,
				couponImg:'',
				merchantId:'',
			}
		},
		computed:{
			introduction(){ //页面优惠券显示介绍
				if(this.userIntro){
					return this.userIntro
				}
				return '优惠券介绍（24字以内）'
			}
		},
		methods:{
			// 修改商家回流数量
			reduceBusiness(){
				if(this.quantity==0){
					return
				}
				this.quantity--;
			},
			increaseBusiness(){
				if(this.quantity==1){
					return
				}
				this.quantity++;
			},
			changeType(type){ //改变设置类型
				this.setType = type;
			},
			upload(){ //上传图片
				uni.chooseImage({
					count:1,
					success: res => {
						// console.log(res)
						let file = res.tempFilePaths[0];
						uni.getFileInfo({
							filePath:file,
							success:res=>{
								if(res.size < 5000){
									uni.showToast({
										title:'请上传不小于5KB的图片',
										icon: 'none'
									})
								}else{
									uni.uploadFile({
										url: `${this.$store.state.baseUrl}/upload/?serviceType=user`,
										filePath: file,
										fileType: 'image',
										name:' file',
										success:res=>{
											let url = JSON.parse(res.data).data;
											console.log('tupian',url);
											this.couponImg = url.replace('http','https');
										}
									})
								}
							}
						})
					}
				})
			},
			submit(){ //保存
				if(this.setType == 'text' && !this.userIntro){
					uni.showToast({
						title:'请输入24字以内的介绍',
						icon: 'none'
					})
					return
				}
				if(this.setType == 'picture' && !this.couponImg){
					uni.showToast({
						title:'请上传图片',
						icon: 'none'
					})
					return
				}
				// 只能设置一种类型，去掉未选中类型数据
				if(this.setType == 'text'){
					this.couponImg = '';
				}else{
					this.userIntro = '';
				}
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/merchant/setCouponImg?id=${this.merchantId}&imageUrl=${this.couponImg}&lockCount=${this.quantity}&introduction=${this.userIntro}&isRefreshAll=true`)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.setStorageSync('quantity',this.quantity);
						uni.setStorageSync('introduction',this.userIntro);
						uni.setStorageSync('couponImg',this.couponImg);
						uni.setStorageSync('setType',this.setType);
						uni.navigateBack({
							url:'/businessPages/businessCenter/index'
						})
					}else{
						uni.showToast({
							title:res.message,
							icon: 'none'
						})
					}
				})
			}
		},
		onLoad:function(query){
			this.merchantId = query.id;
			this.setType = uni.getStorageSync('setType') || 'text';
			this.quantity = uni.getStorageSync('quantity') || 0;
			this.userIntro = uni.getStorageSync('introduction') || '';
			this.couponImg = uni.getStorageSync('couponImg') || '';
		}
	}
</script>

<style lang="scss" scoped>
	.set_area{
		padding: 50rpx 0;
		.item{
				width: 710rpx;
				height: 96px;
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
						padding: 0 40rpx;
					}
					.fz-24{
						color: #fff;
						line-height: 48rpx;
					}
					.fz-14{
						line-height: 30rpx;
					}
					.tip{
						white-space: nowrap;
						color: #BBBBBB;
					}
				}
				.pic_text{
					width: 486rpx;
					height: 96px;
					color: #fff;
					display: flex;
					flex-direction: column;
					.coupon-img{
						width: 486rpx;
						flex: 1;
						image{
							width: 486rpx;
							height: 100%;
							display: block;
						}
					}
				}
				.brand{
					width: 486rpx;
					height: 100%;
					position: relative;
					.title{
						width: 100%;
						position: absolute;
						top: 0;
						left: 0;
						text-align: center;
						padding: 8rpx 0;
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
	.business{
		padding: 25rpx 20rpx;
		background: #fff;
		.box{
			width: 50rpx;
			height: 50rpx;
			background: #E3E3E3;
			margin-left: 30rpx;
			color: #fff;
			line-height: 50rpx;
		}
		.box-num{
			color: #333;
		}
		.box_minus{
			background: #FF9D12;
		}
		.box_plus{
			background: #FF9D12;
		}
	}
	.notice{
		padding: 20rpx;
		line-height: 24rpx;
		color: #CCCCCC;
	}
	.tab{
		padding: 20rpx 0;
		view{
			flex: 1;
			text-align: center;
			color: #999999;
		}
		.active{
			color: #FF9834;
			position: relative;
			&::after{
				display: block;
				content: '';
				color: #FF9834;
				width: 20rpx;
				height: 10rpx;
				background: url(../../static/images/home/tab_icon.png) no-repeat;
				background-size: 100% 100%;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 40rpx;
			}
		}
	}
	.upload{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		color: #FF9D12;
		border: 2rpx solid #FF9D12;
		margin: 0 auto;
		margin-top: 120rpx;
		background: #fff;
	}
	.tip{
		color: #CCCCCC;
		text-align: center;
		line-height: 24rpx;
		padding: 20rpx 0;
	}
	.intro{
		align-items: flex-start;
		justify-content: flex-start;
		background: #fff;
		padding: 30rpx 20rpx;
		margin-top: 20rpx;
		.desc{
			color: #999;
			margin-right: 50rpx;
			width: 100rpx;
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		color: #fff;
		background: #FF9D12;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 60rpx;
	}
</style>
