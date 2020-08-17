<template>
	<view class="container">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index2')">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index3')">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item flex_center" @click="clickURl('/businessPages/wxBusinessApply/index4')">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">法人信息</view>
			<view class="main">
				<!-- 法人姓名 -->
				<view class="item flex_center">
					<view class="item-name">法人姓名</view>
					<view class="item-content">
						<input type="text" v-model="legalPersonFrom.legalPerson" placeholder="请输入法人姓名" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件号码 -->
				<view class="item flex_center">
					<view class="item-name">身份证号</view>
					<view class="item-content">
						<input type="text" v-model="legalPersonFrom.legalPersonID" placeholder="请输入法人18位身份证号码" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件照 -->
				<view class="item flex_center">
					<view class="item-name">身份证照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center" v-for="(item,index) in imgArr" :key="index">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="item.credentialUrl" @click="upload(index,'credentialUrl')">
								<image :src="item.credentialUrl" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload(index,'credentialUrl')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 有效期 -->
				<view class="item flex_center">
					<view class="item-name">有效期</view>
					<view class="item-content flex_center">
						<view class="">
							<!-- 有效期选择 -->
							<picker mode="date" @change="startDateChange">
								<view class="flex_between" :class="{date:legalPersonFrom.idCardStartDate=='yyyymmdd',active:legalPersonFrom.idCardStartDate!=='yyyymmdd'}">{{legalPersonFrom.idCardStartDate}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 有效期选择 -->
							<picker mode="date" @change="stopDateChange">
								<view class="flex_between" :class="{date:legalPersonFrom.idCardEndDate=='yyyymmdd',active:legalPersonFrom.idCardEndDate!=='yyyymmdd'}">{{legalPersonFrom.idCardEndDate}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 联系电话 -->
				<view class="item flex_center">
					<view class="item-name">联系电话</view>
					<view class="item-content">
						<input type="number" v-model="legalPersonFrom.linkPhone" placeholder="请输入联系电话" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 联系邮箱 -->
				<view class="item flex_center">
					<view class="item-name">联系邮箱</view>
					<view class="item-content">
						<input type="text" v-model="legalPersonFrom.email" placeholder="请输入联系邮箱" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="next">保存并下一步</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {				
				
			}
		},
		computed:{
			imgArr(){
				let arr = [];
				let obj = {
					FRONT_OF_ID_CARD:true,
					BACK_OF_ID_CARD:true,
				};
				for(let i of this.$store.state.shop.merchantCredential){
					if(obj[i.credentialType]){
						arr.push(i)
					}
				}
				return arr;
			},
			merchantCredential(){
				return this.$store.state.shop.merchantCredential
			},
			legalPersonFrom(){
				return this.$store.state.shop.legalPerson
			},
			userinfo(){
				return this.$store.state.userInfo
			}
		},
		methods:{ 
			// 上传证件照
			upload(index,type){
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
											this.imgArr[index][type] = url.replace('http','https');
										}
									})
								}
							}
						})
					}
				})
			},
			// 选择起始日期
			startDateChange($event){
				this.legalPersonFrom.idCardStartDate = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.legalPersonFrom.idCardEndDate = $event.detail.value;
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
			},
			next(){
				let {legalPersonFrom,imgArr,merchantCredential} = this;
				let data = {
					...legalPersonFrom,
					linkman:legalPersonFrom.legalPerson,
					servicePhone:legalPersonFrom.linkPhone,
					idType:'IDCARD',
					accountName:legalPersonFrom.legalPerson,
					bindMobile:legalPersonFrom.linkPhone,
					linkManId:legalPersonFrom.legalPersonID,
				}
				uni.showLoading({
					title:'加载中'
				})
				for(let i in data){
					if(!data[i]){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				for(let i of imgArr){
					if(!i.credentialUrl){
						wx.showToast({
						  title:'请填写完整所有信息',
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				
				for(let i of imgArr){
					for(let j of merchantCredential){
						if(i.credentialType===j.credentialType){
							j.credentialUrl = i.credentialUrl;
						}
					}
				}
				
				console.log(merchantCredential,data)
				this.$store.commit('SETLEGALPERSON',data);
				this.$store.commit('SETMERCHANTCREDENTIAL',merchantCredential);
				
				uni.redirectTo({
					url:"/businessPages/wxBusinessApply/index2"
				})
			}
		},
		onLoad() {
			// legalPersonFrom
			if(!this.legalPersonFrom.linkPhone){
				this.legalPersonFrom.linkPhone = this.userinfo.username
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding-bottom: 100rpx;
		box-sizing: border-box;
	}
	.top{
		padding: 50rpx 0;
		background: #fff;
		border-top: 2rpx solid #D3D3D3;
	}
	.step{
		width: 590rpx;
		margin: 0 auto;
		justify-content: flex-start;
		line-height: 50rpx;
		color: #999999;
		.line{
			height: 90rpx;
			vertical-align: center;
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
					input{
						width: 90%;
						padding: 0;
						font-size: 28rpx;
						line-height: 28rpx;
						color: #333;
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
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30rpx;
		z-index: 99;
	}
</style>
