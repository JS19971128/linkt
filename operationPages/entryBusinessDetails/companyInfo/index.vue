<template>
	<view class="info fz-14" v-show="ifShow">
		<view class="main">
			<!-- 经营类型 -->
			<view class="item flex_center">
				<view class="item-name">经营类型</view>
				<view class="item-content">{{form.merchantType|merchantType}}</view>
			</view> 
			<!-- 经营类型 -->
			<view class="item flex_center">
				<view class="item-name">经营类目</view>
				<view class="item-content">{{form.merchantCategory|merchantCategory}}</view>
			</view> 
			<!-- 经营行业 -->
			<view class="item flex_center">
				<view class="item-name">经营行业</view>
				<view class="item-content">{{categoryObj.name}}</view>
			</view> 
			<!-- 经营地区 -->
			<view class="item flex_center">
				<view class="item-name">经营地区</view>
				<view class="item-content">{{registerAddress}}</view>
			</view> 
			<!-- 商家名称 -->
			<view class="item flex_center">
				<view class="item-name">商家名称</view>
				<view class="item-content">{{form.signName}}</view>
			</view>
			<!-- 商家简称 -->
			<view class="item flex_center">
				<view class="item-name">商家简称</view>
				<view class="item-content">{{form.showName}}</view>
			</view>
			<!-- 注册号 -->
			<view class="item flex_center">
				<view class="item-name">注册号</view>
				<view class="item-content">{{form.businessLicense}}</view>
			</view>
			<!-- 经营资质 -->
			<view class="item flex_center">
				<view class="item-name">经营资质</view>
				<view class="item-content flex_center fz-12">
					<view class="upload flex_center" v-for="(item,index) in imgArr" :key="index">
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
			<!-- 经营期限 -->
			<view class="item flex_center">
				<view class="item-name">经营期限</view>
				<view class="item-content">{{form.longTerm | longTerm}}</view>
			</view>
			<!-- 起始时间 -->
			<view class="item flex_center">
				<view class="item-name">起始时间</view>
				<view class="item-content">{{form.businessDateStart|dateTime}}</view>
			</view>
			<!-- 期限时间 -->
			<view class="item flex_center">
				<view class="item-name">期限时间</view>
				<view class="item-content">{{form.businessDateLimit|dateTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import jylm from "@/common/util/wx_jylm.js";
	export default{
		name:'companyInfo',
		props:["show"],
		data() {
			return {
				categoryObj:{},
				registerAddress:'',
				form:{}
			}
		},
		computed:{
			ifShow(){
				return this.show;
			},
			imgArr(){
				let arr = [];
				let obj = {
					BUSINESS_LICENSE:true,
					PERMIT_FOR_BANK_ACCOUNT:true,
				};
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
			async init(form){
				//初始化经营行业

				this.form = form;
				console.log(form)
				let category = await this.$fly.post(`/entry/getIndustryTypeCodeList?id=${form.industryTypeCode}`);
				for(let i of category){
					let name = i.name;
					let sl = name.slice(name.indexOf('-')+1);
					i.name = sl.slice(sl.indexOf('-')+1);
				}
				this.categoryObj = category[0];
				
				//初始化经营地区/entry/getRegionCodeList
				let area = await this.$fly.post(`/entry/getRegionCodeList?id=${form.regionCode}`);
				let city = await this.$fly.post(`/entry/getRegionCodeList?id=${area[0].pid}`);
				let province = await this.$fly.post(`/entry/getRegionCodeList?id=${city[0].pid}`);
				this.registerAddress = province[0].name +' '+ city[0].name +' '+ area[0].name;
			},
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
		},
		filters:{
			dateTime(time){
				return time && time.slice(0,4)+'-'+time.slice(4,6)+'-'+time.slice(6);
			},
			//经营类型
			merchantType(data){
				let obj = {
					INDIVIDUALBISS:'个体工商户',
					ENTERPRISE:'企业'
				}
				return obj[data];
			},
			//经营类目
			merchantCategory(data){
				for(let i of jylm){
					if(i.type === data){
						return i.label
					}
				}
			},
			//经营期限
			longTerm(data){
				return data?'长期':'短期';
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
						line-height: 28rpx;
						height: 28rpx;
						color: #333;
						font-size: 28rpx;
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
	.btn{
		width: 670rpx;
		height: 74rpx;
		border-radius: 37rpx;
		background: #FF9D11;
		color: #fff;
		margin: 30rpx auto;
		// margin-top: 30rpx 0;
	}
</style>
