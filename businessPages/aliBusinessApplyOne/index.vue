<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">联系信息</view>
				</view>
				<view class="line"></view>
				<view class="step-item flex_center">
					<view class="num flex_center">2</view>
					<view class="">资料补充</view>
				</view>
				<view class="line"></view>
				<view class="step-item flex_center">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info">
			<view class="title">联系信息</view>
			<view class="main">
				<!-- 支付宝账号 -->
				<view class="item flex_center">
					<view class="item-name">支付宝账号</view>
					<view class="item-content flex_center">
						<input type="text" v-model="aliAccount" placeholder="请输入支付宝账号" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 真实姓名 -->
				<view class="item flex_center">
					<view class="item-name">真实姓名</view>
					<view class="item-content flex_center">
						<input type="text" v-model="name" placeholder="请输入真实的联系人姓名" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 联系电话 -->
				<view class="item flex_center">
					<view class="item-name">联系电话</view>
					<view class="item-content flex_center">
						<input type="number" pattern="[0-9]*" v-model="mobile" placeholder="请输入联系电话" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 联系邮箱 -->
				<view class="item flex_center">
					<view class="item-name">联系邮箱</view>
					<view class="item-content flex_center">
						<input type="text" v-model="mailbox" placeholder="请输入真实的邮箱地址" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">下一步</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				aliAccount:'',
				name:'',
				mobile:'',
				mailbox:'',
			}
		},
		methods:{ 
			next(){
				const regPhone = /^((1[0-9]{2})+\d{8})$/;
				if( !this.aliAccount || !this.name || !this.mobile || !this.mailbox){
					uni.showToast({
						title:'请输入完整信息'
					})
					return
				}
				if(!regPhone.test(this.mobile)){
					uni.showToast({
						title:'手机号格式不正确'
					})
					return
				}
				this.$store.state.form.account = this.aliAccount;
				this.$store.state.form.contactName = this.name;
				this.$store.state.form.contactMobile = this.mobile;
				this.$store.state.form.contactEmail = this.mailbox;
				uni.navigateTo({
					url:'/businessPages/aliBusinessApplyTwo/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		padding: 50rpx 0;
		background: #fff;
		border-top: 2rpx solid #D3D3D3;
	}
	.step{
		width: 590rpx;
		margin: 0 auto;
		// justify-content: flex-start;
		align-items: flex-start;
		line-height: 50rpx;
		color: #999999;
		white-space: nowrap;
		.line{
			width: 200rpx;
			height: 2rpx;
			border-bottom: 2rpx dashed #999;
			margin-top: 45rpx;
		}
		.step-item{
			flex-direction: column;
			.num{
				width: 90rpx;
				height: 90rpx;
				border: 2rpx solid #999999;
				border-radius: 50%;
				background: #fff;
			}
		}
		.active{
			color: #FF9D11;
			.num{
				border: 2rpx solid #FF9D11;
				background: #FF9D11;
				color: #fff;
			}
		}
	}
	.info{
		font-size: 14px;
		line-height: 14px;
		.title{
			color: #999999;
			padding: 10px 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 0 20rpx;
				height: 50px;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 22%;
				}
				.item-content{
					justify-content: flex-start;
					color: #333;
					width: 78%;
					input{
						width: 90%;
						font-size: 14px;
						padding: 0;
						line-height: 14px;
					}
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 15px;
	}
</style>
