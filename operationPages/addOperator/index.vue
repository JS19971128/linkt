<template>
	<view class="container">
		<view class="info fz-14">
			<view class="main">
				<!-- 昵称 -->
				<view class="item flex_center">
					<view class="item-name">昵称</view>
					<view class="item-content">
						<input type="text" v-model="info.nickname" disabled/>
					</view>
				</view>
				<!-- 手机号 -->
				<view class="item flex_center">
					<view class="item-name">手机号</view>
					<view class="item-content">
						<input type="text" v-model="info.phone" disabled/>
					</view>
				</view>
				<!-- 头衔 -->
				<view class="item flex_center">
					<view class="item-name">头衔</view>
					<view class="item-content ">
						<!-- 头衔选择 -->
						<picker mode="selector" :range="industries" @change="bindChange">
							<view class="flex_between">
								<view>
								<input type="text" v-model="current" disabled placeholder="请选择头衔" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 分润让利 -->
				<view class="item flex_center">
					<view class="item-name">分润让利</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">
								<input type="number" pattern="[0-9]*" v-model="rate" placeholder="分润比例最高为15%" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="submit">添加</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				industries:['副总裁','助理','讲师','主持人'],
				current:'',
				rate:'',
				info:{},
			}
		},
		methods:{
			bindChange($event){
				this.current = this.industries[$event.detail.value];
			},
			submit(){ // 添加运营人员
				if(!this.current){
					uni.showToast({
						title:'请选择头衔',
						icon: 'none'
					})
					return
				}
				if(!this.rate){
					uni.showToast({
						title:'请输入分润比例',
						icon: 'none'
					})
					return
				}
				if(this.rate > 15){
					uni.showToast({
						title:'分润比例最高为15%',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				let params = {
					id: this.info.id || '',
					name: this.info.nickname,
					phone: this.info.phone,
					profits: this.rate,
					title: this.current,
					userId: this.$store.state.userInfo.id
				}
				this.$fly.post('/operation/add',params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.navigateTo({
							url:'/operationPages/operator/index'
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
			this.info = query;
			this.rate = query.profit || '';
			this.current = query.title || '';
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		line-height: 28rpx;
		padding-top: 20rpx;
		.title{
			color: #999999;
			padding: 20rpx;
		}
		.main{
			.item{
				justify-content: flex-start;
				background: #fff;
				padding: 30rpx 20rpx;
				// height: 100rpx;
				border-bottom: 2rpx solid #D3D3D3;
				.item-name{
					color: #999999;
					width: 20%;
				}
				.item-content{
					justify-content: flex-start;
					color: #333;
					width: 80%;
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						line-height: 28rpx;
						color: #333;
						font-size: 28rpx;
					}
					image{
						width: 24rpx;
						display: block;
					}
					.line{
						color:#999 ;
						margin: 0 10rpx;
					}
					.date{
						color: #CBCBCB;
					}
					.active{
						color: #333;
					}
				}
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
	}
</style>
