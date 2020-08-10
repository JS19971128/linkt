<template>
	<view class="container">
		<view class="main fz-14">
			<view class="item flex_between">
				<view class="title">头像</view>
				<view class="content">
					<view class="avatar">
						<!-- #ifdef MP-ALIPAY -->
						<image :src="userInfo.aliAvatar" mode="widthFix" v-if="userInfo.aliAvatar"></image>
						<image src="../../static/images/my/avatar.png" mode="widthFix" v-else></image>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<open-data type="userAvatarUrl"></open-data>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<view class="item flex_between">
				<view class="title">昵称</view>
				<!-- #ifdef MP-ALIPAY -->
				<view class="content">{{userInfo.aliNickName || '链客通'}}</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<open-data type="userNickName"></open-data>
				<!-- #endif -->
			</view>
			<view class="item flex_between">
				<view class="title">性别</view>
				<view class="content">{{userInfo.gender == 'FEMALE' ? '女' : '男'}}</view>
			</view>
			<view class="item flex_between">
				<view class="title">地区</view>
				<view class="content flex_center">
					<view class="">{{area}}</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="item flex_between">
				<view class="title">我的手机号</view>
				<view class="content flex_center">
					<view class="">{{phone}}</view>
					<view class="more">
						<image src="../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 修改手机号弹框 -->
		<view class="pop_wrap" v-if="showPop">
			<view class="pop_content">
				<view class="close flex_center" @click="showPop=false">
					<image src="../../static/images/common/close.png" mode="widthFix"></image>
				</view>
				<view class="box">
					<view class="flex_center box-item">
						<view class="fz-14 item-left flex_center">手机号码</view>
						<view class="item-right"><input type="text" placeholder="请输入手机号" placeholder-style="color:#CBCBCB;font-size:28rpx" v-model="phone" /></view>
					</view>
					<view class="fz-14 btn flex_center">保存</view>
				</view>
			</view>
		</view>
		<!-- 地区选择 -->
		<w-picker 
			class="address"
			mode="region" 
			:visible.sync="show" 
			:value="defaultRegion"
			default-type="label"
			@confirm="onConfirm($event,'region')" 
			@cancel="onCancel" 
			ref="region" 
		></w-picker>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				show:false,
				defaultRegion:["浙江省","杭州市","滨江区"],
				showPop:false,
				area:'',
				phone: ''
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods:{
			changeAddr(){
				this.show = true;
			},
			onConfirm($event){
				
			},
			onCancel(){
				this.show = false;
			},
			getUserInfo(){
				this.area = this.userInfo.addressInfo;
				this.defaultRegion = this.userInfo.addressInfo.split(' ');
				this.phone = this.userInfo.username;
			}
		},
		onLoad:function(){
			this.getUserInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding: 20rpx 0;
		line-height: 28rpx;
		.item{
			padding: 30rpx 20rpx;
			background: #fff;
			border-bottom: 2rpx solid #D3D3D3;
			.title{
				color: #999999;
			}
			.content{
				color: #333333;
				.avatar{
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					overflow: hidden;
					image{
						width: 160rpx;
						height: 160rpx;
						display: block;
						border-radius: 50%;
					}
				}
				.more{
					margin-left: 10rpx;
					image{
						width: 24rpx;
						display: block;
					}
				}
			}
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
				.item-left{
					width: 30%;
					border-right: 2rpx solid #DBDBDB;
					color: #999999;
				}
				.item-right{
					width: 70%;
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
	}
</style>
