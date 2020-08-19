<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 所属行业 -->
			<view class="item flex_center">
				<view class="item-name">所属行业</view>
				<view class="item-content">{{form.shopBusinessName}}</view>
			</view>
			<!-- 让利比率 -->
			<view class="item flex_center">
				<view class="item-name">让利比率</view>
				<view class="item-content">{{form.profits||0}}%</view>
			</view>
			<!-- 店铺地址 -->
			<view class="item flex_center">
				<view class="item-name">店铺地址</view>
				<view class="item-content">{{form.area}}</view>
			</view>
			<!-- 详细地址 -->
			<view class="item flex_center">
				<view class="item-name">详细地址</view>
				<view class="item-content">{{form.address}}</view>
			</view>
			<!-- 营业时间 -->
			<view class="item flex_center">
				<view class="item-name">营业时间</view>
				<view class="item-content">{{form.shopStartTime}}-{{form.shopStopTime}}</view>
			</view>
			<!-- 门头照 -->
			<view class="item flex_center">
				<view class="item-name">门头照</view>
				<view class="item-content flex_center fz-12">
					<view class="upload flex_center" v-for="(item,index) in imgArr" :key="index">
						<!-- 正面 -->
						<view class="uploadPic flex_center" v-if="item.credentialUrl" @click="upload(index,'credentialUrl')">
							<image :src="item.credentialUrl" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="upload(index,'credentialUrl')">
							<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<!-- 室内照 -->
			<view class="item flex_center">
				<view class="item-name">室内照</view>
				<view class="item-content flex_center fz-12">
					<view class="upload" v-for="(item,index) in imgArrt" :key="index">
						<!-- 正面 -->
						<view class="uploadPic flex_center" v-if="item.credentialUrl" @click="uploadt(index,'credentialUrl')">
							<image :src="item.credentialUrl" mode="aspectFit"></image>
						</view>
						<view class="frame flex_center" v-else @click="uploadt(index,'credentialUrl')">
							<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
						</view>
						<view class="flex_center">请上传1张门店室内照，才可通过审核喔~</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'bankInfo',
		props:["show"],
		data() {
			return {
				form:{},
			}
		},
		computed:{
			ifShow(){
				return this.show;
			},
			imgArr(){
				let arr = [];
				let obj = {
					SIGN_BOARD:true,
				};
				console.log(this.form)
				if(JSON.stringify(this.form) == "{}"){
					return;
				}
				for(let i of this.form.merchantCredential){
					if(obj[i.credentialType]){
						arr.push(i)
					}
				}
				return arr;
			},
			imgArrt(){
				let arr = [];
				let obj = {
					INTERIOR_PHOTO:true,
				};
				console.log(this.form)
				if(JSON.stringify(this.form) == "{}"){
					return;
				}
				for(let i of this.form.merchantCredential){
					if(obj[i.credentialType]){
						arr.push(i)
					}
				}
				return arr;
			},
		},
		methods:{
			init(form){
				this.form = form	
			},
			upload(index,type){
				this.uploadIndex(index,type,'imgArr')
			},
			uploadt(index,type){
				this.uploadIndex(index,type,'imgArrt')
			},
			uploadIndex(index,type,name){
				uni.chooseImage({
					count:1,
					success: res => {
						// console.log(res)
						let file = res.tempFilePaths[0];
						uni.getFileInfo({
							filePath:file,
							success: (res) => {
								if(res.size < 5000){
									uni.showToast({
										title:'请上传不小于5KB的图片'
									})
								}else{
									uni.uploadFile({
										url: `${this.$store.state.baseUrl}/upload/?serviceType=user`,
										filePath: file,
										fileType: 'image',
										name:' file',
										success:res=>{
											let url = JSON.parse(res.data).data;
											this[name][index][type] = url.replace('http','https');
										}
									})
								}
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.info{
		line-height: 28rpx;
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
					.frame{
						width: 90%;
					}
					.more{
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
					.upload{
						flex-direction: column;
						color: #CBCBCB;
						margin-right: 30rpx;
						line-height: 24rpx;
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							margin-bottom: 10rpx;
						}
						.uploadPic{
							width: 120rpx;
							height: 120rpx;
							margin-bottom: 10rpx;
							.pic{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
						}
					}
				}
			}
		}
	}
</style>
