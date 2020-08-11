<template>
	<view class="bg">
		<view class="fz-12 top">
			<view class="step flex_center">
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index')">
					<view class="num flex_center">1</view>
					<view class="">法人信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index2')">
					<view class="num flex_center">2</view>
					<view class="">企业信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center">
					<view class="num flex_center">3</view>
					<view class="">银行信息</view>
				</view>
				<view class="line">----</view>
				<view class="step-item active flex_center" @click="clickURl('/businessPages/wxBusinessApply/index4')">
					<view class="num flex_center">
						<uni-icons class="flex_center" type="checkmarkempty" :size="24" color="#999999"></uni-icons>
					</view>
					<view class="">店铺设置</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content ">
						<!-- 所属行业类型选择 -->
						<picker mode="selector" :range="industryList" range-key="name" @change="bindChange">
							<view class="flex_between">
								<view>
									<input type="text" v-model="shopBusinessName" disabled placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
								</view>
								<view>
									<image src="../../static/images/common/xiala.png" mode="widthFix"></image>
								</view>
							</view>
						</picker>
					</view>
				</view>
				<!-- 让利比率 -->
				<view class="item flex_center">
					<view class="item-name">让利比率</view>
					<view class="item-content">
						<view class="flex_between">
							<view class="rate">
								<input v-model="profits" type="text" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">所在地区</view>
					<view class="item-content">
						<input type="text" v-model="area" disabled placeholder="请选择" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 详细地址 -->
				<view class="item flex_center" @click="goMap">
					<view class="item-name">详细地址</view>
					<view class="item-content flex_center">
						<image class="location" src="../../static/images/common/location.png" mode="widthFix"></image>
						<view class="address" v-if="address">{{address}}</view>
						<view class="flex_center" v-else>
							<input type="text" :disabled="true" placeholder="点击前往地图选择" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
						</view>
					</view>
				</view>
				<!-- 营业时间 -->
				<view class="item flex_center">
					<view class="item-name">营业时间</view>
					<view class="item-content flex_center">
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="startDateChange">
								<view class="flex_between" :class="{date:shopStartTime=='开始时间',active:shopStartTime!=='开始时间'}">{{shopStartTime}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="stopDateChange">
								<view class="flex_between" :class="{date:shopStopTime=='结束时间',active:shopStopTime!=='结束时间'}">{{shopStopTime}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 门头照 -->
				<view class="item flex_center">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="positive">
								<image :src="positive" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item flex_center">
					<view class="item-name">室内照</view>
					<view class="item-content flex_center fz-12">
						<!-- 反面 -->
						<view class="upload" style="flex-direction: column;display: flex;">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="piclist">
								<image :src="piclist" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('piclist')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view class="flex_center">请上传1张门店内景照，才可通过审核喔~</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="submit">提交审核</view>
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
				industryList:[],
				shopBusinessId:'',
				shopBusinessName:'',
				
				shopStartTime:'开始时间',
				shopStopTime:'结束时间',
				
				profits:'',
				areaCode:'',
				areaCodeCity:'',
				areaCodeAreas:'',
				area:'',
				address:'',
				positive:'', //门头照
				piclist:'', //内景照
				show:false,
				defaultRegion:["浙江省","杭州市","滨江区"],
				contactAddress:'',
				latitude:'',
				longitude:''
			}
		},
		computed:{
			legalPerson(){
				return this.$store.state.shop.legalPerson;
			},
			enterprise(){
				return this.$store.state.shop.enterprise;
			},
			bank(){
				return this.$store.state.shop.bank;
			},
			merchantCredential(){
				return this.$store.state.shop.merchantCredential;
			},
			userId(){
				return this.$store.state.userInfo.id || 22222234;
			}
		},
		methods:{ 
			onConfirm($event){ //省市区选择
				console.log($event)
				this.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				let adcode = $event.value[2];
				this.areaCode = adcode.substring(0,2);
				this.areaCodeCity = adcode.substring(0,4);
				this.areaCodeAreas = adcode;
			},
			onCancel(){
				this.show = false;
			},
			goMap(){ //导航
				uni.chooseLocation({
					success:res=>{
						console.log(res)
						this.address = res.address;
						this.latitude = res.latitude;
						this.longitude = res.longitude;
					}
				})
			},
			getBusinessList(){  //获取行业列表
				this.$fly.get('/ShopBusiness/list')
				.then(res=>{
					if(res.code == 0){
						this.industryList = res.data.content;
					}
				})
			},
			// 选择证件类型
			bindChange($event){
				this.shopBusinessName = this.industryList[$event.detail.value].name
				this.shopBusinessId = this.industryList[$event.detail.value].id
			},
			clickURl(url){
				uni.redirectTo({
					url
				})
			},
			// 上传证件照
			upload(type){
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
											this[type] = url.replace('http','https');
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
				this.shopStartTime = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.shopStopTime = $event.detail.value;
			},
			submit(){
				
				const {shopBusinessId,shopBusinessName,shopStartTime,shopStopTime,profits,areaCode,areaCodeCity,areaCodeAreas,positive,piclist,area,address} = this;
				let data = {
					shopBusinessId,
					shopBusinessName,
					shopStartTime,
					shopStopTime,
					profits,
					areaCode,
					areaCodeCity,
					areaCodeAreas,
					regionCode:areaCodeAreas,
					positive,
					piclist,
					area,
					contactAddress:address
				}
				
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
				if(this.profits < 5 || this.profits > 30){
					uni.showToast({
						title:'请输入5%-30%范围内的让利比率',
						icon: 'none'
					})
					return ;
				}
				let {legalPerson,enterprise,bank,merchantCredential,userId,longitude,latitude} = this;
				
				if(JSON.stringify(legalPerson)=="{}"){
					wx.showToast({
					  title:'请完善法人信息',
					  icon: 'none',
					  duration: 2500
					})
					return ;
				}
				if(JSON.stringify(enterprise)=="{}"){
					wx.showToast({
					  title:'请完善企业信息',
					  icon: 'none',
					  duration: 2500
					})
					return ;
				}
				if(JSON.stringify(bank)=="{}"){
					wx.showToast({
					  title:'请完善银行卡信息',
					  icon: 'none',
					  duration: 2500
					})
					return ;
				}
				merchantCredential.push({
					credentialType:'SIGN_BOARD',
					credentialUrl:positive,
				});
				merchantCredential.push({
					credentialType:'INTERIOR_PHOTO',
					credentialUrl:piclist,
				});
				console.log(data)
				let prams = {
					...data,
					...legalPerson,
					...enterprise,
					...bank,
					userId,
					appPayType:'WXPAY',
					merchantCredential,
					longitude,
					latitude
				}
				
				this.stm(prams);
			},
			async stm(prams){
				try{
					let doEntry = await this.$fly.post('/entry/doEntry',prams);
					
				}catch(e){
					
				}finally{
					
				}
			}
		},
		onLoad() {
			this.getBusinessList()
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		padding-bottom: 30rpx;
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
					.rate{
						width: 90%;
					}
					input{
						width: 90%;
						color: #333;
						height: 28rpx;
						line-height: 28rpx;
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
						// flex-direction: column;
						justify-content: flex-start;
						color: #CBCBCB;
						// margin-right: 30rpx;
						line-height: 24rpx;
						flex-wrap: wrap;
						.pic_list{
							margin-right: 20rpx;
							margin-bottom: 10rpx;
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
						}
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							// margin-bottom: 10rpx;
						}
						.uploadPic{
							width: 120rpx;
							height: 120rpx;
							// margin-bottom: 10rpx;
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
		margin: 0 auto;
		margin-top: 30rpx;
	}
</style>
