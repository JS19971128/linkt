<template>
	<view class="bg">
		<view class="info fz-14">
			<view class="title">法人信息</view>
			<view class="main">
				<!-- 法人姓名 -->
				<view class="item flex_center">
					<view class="item-name">法人姓名</view>
					<view class="item-content">
						<input type="text" v-model="legalName" placeholder="请输入法人姓名" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件号码 -->
				<view class="item flex_center">
					<view class="item-name">身份证号</view>
					<view class="item-content">
						<input type="text" v-model="idCard" placeholder="请输入18位身份证号码" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 证件照 -->
				<view class="item album flex_center">
					<view class="item-name">身份证照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 正面 -->
							<view class="uploadPic flex_center" v-if="positive" @click="upload('positive')">
								<image :src="positive" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('positive')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>正面</view>
						</view>
						<!-- 反面 -->
						<view class="upload flex_center">
							<view class="uploadPic flex_center" v-if="opposite" @click="upload('opposite')">
								<image :src="opposite" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('opposite')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>反面</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="info fz-14">
			<view class="title">商家信息</view>
			<view class="main">
				<!-- 商家名称 -->
				<view class="item flex_center">
					<view class="item-name">商家名称</view>
					<view class="item-content">
						<input type="text" v-model="shopName" placeholder="必须与营业执照上的名称一致" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 商家简称 -->
				<view class="item flex_center">
					<view class="item-name">商家简称</view>
					<view class="item-content">
						<input type="text" v-model="shopNickName" placeholder="请输入10个字以内的简称" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
					</view>
				</view>
				<!-- 所属行业 -->
				<view class="item flex_center">
					<view class="item-name">所属行业</view>
					<view class="item-content ">
						<!-- 所属行业选择 -->
						<picker mode="selector" :range="industryList" :range-key="'name'" @change="bindChange">
							<view class="flex_between">
								<view>
								<input type="text" v-model="current" disabled placeholder="请选择所属行业" placeholder-style="color:#CBCBCB;font-size:28rpx"/>
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
								<input type="number" v-model="rate" placeholder="请输入5%-30%范围内的让利比率" placeholder-style="color:#CBCBCB;font-size:28rpx" @input="checkRate"/>
							</view>
							<view>%</view>
						</view>
					</view>
				</view>
				<!-- 经营资质 -->
				<view class="item album flex_center">
					<view class="item-name">经营资质</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center" v-show="is_business_license">
							<!-- 营业执照 -->
							<view class="uploadPic flex_center" v-if="business_license" @click="upload('business_license')">
								<image :src="business_license" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('business_license')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>营业执照</view>
						</view>
						<view class="upload flex_center" v-show="is_tobacco_license">
							<!-- 烟草许可证 -->
							<view class="uploadPic flex_center" v-if="tobacco_license" @click="upload('tobacco_license')">
								<image :src="tobacco_license" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('tobacco_license')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>烟草许可证</view>
						</view>
						<!-- 食品许可证 -->
						<view class="upload flex_center" v-show="is_food_license">
							<view class="uploadPic flex_center" v-if="food_license" @click="upload('food_license')">
								<image :src="food_license" mode="aspectFit"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('food_license')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
							<view>食品许可证</view>
						</view>
					</view>
				</view>
				<!-- 联系电话 -->
				<view class="item flex_center">
					<view class="item-name">联系电话</view>
					<view class="item-content flex_center">
						<input type="number" pattern="[0-9]*" v-model="mobile" placeholder="请输入座机号或手机号码" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
					</view>
				</view>
				<!-- 所在地区 -->
				<view class="item flex_center" @click="show=true">
					<view class="item-name">所在地区</view>
					<view class="item-content flex_center">
						<input type="text" placeholder="请选择您的地区"  v-model="area" disabled="true" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/>
						<!-- <input type="text" v-model="area" placeholder="选择地址后自动录入省市区" placeholder-style="color:#CBCBCB;font-size:14px;line-height:14px"/> -->
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
								<view class="flex_between" :class="{date:start=='开始时间',active:start!=='开始时间'}">{{start}}</view>
							</picker>
						</view>
						<view class="line">—</view>
						<view class="">
							<!-- 营业时间选择 -->
							<picker mode="time" @change="stopDateChange">
								<view class="flex_between" :class="{date:stop=='结束时间',active:stop!=='结束时间'}">{{stop}}</view>
							</picker>
						</view>
					</view>
				</view>
				<!-- 门头照 -->
				<view class="item album flex_center">
					<view class="item-name">门头照</view>
					<view class="item-content flex_center fz-12">
						<view class="upload flex_center">
							<!-- 门头照 -->
							<view class="uploadPic flex_center" v-if="door_photo" @click="upload('door_photo')">
								<image :src="door_photo" mode="aspectFill"></image>
							</view>
							<view class="frame flex_center" v-else @click="upload('door_photo')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 商家相册 -->
				<view class="item album flex_center">
					<view class="item-name">商家相册</view>
					<view class="item-content flex_center fz-12">
						<!-- 商家相册 -->
						<view class="upload_list flex_center">
							<view class="pic_list flex_center" v-for="(item,i) in picList" :key="i" @click="previewImg(item)">
								<image :src="item" mode="aspectFill"></image>
								<view class="delete-img flex_center" @click.stop="deleteImg(i)">
									<uni-icons class="flex_center" type="clear" color="#FF1919" :size="18"></uni-icons>
								</view>
							</view>
							<view class="frame flex_center" @click="upload('picList')">
								<uni-icons class="flex_center" type="plusempty" :size="24" color="#CBCBCB"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn fz-14 flex_center" @click="checkForm">提交审核</view>
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
				defaultRegion:["北京市","北京市","东城区"], //默认显示
				industryList:[],
				current: '', //行业类型
				currentId: '', // 行业id
				legalName: '', // 法人姓名
				idCard: '', // 身份证号
				positive:'', // 正面
				opposite:'', // 反面
				shopName: '', // 商家名称
				shopNickName: '', // 商家简称
				rate: '', // 让利比率
				business_license: '', // 营业执照
				tobacco_license: '', // 烟草许可证
				food_license: '', // 食品许可证
				mobile: '', // 联系电话
				area:'', //所在地区
				provinceCode:'-1',
				cityCode:'-1',
				regionCode:'-1',
				latitude:'',
				longitude:'',
				address:'', //详细地址
				start:'开始时间', //营业开始时间
				stop:'结束时间',  //营业结束时间
				door_photo: '', // 门头照
				picList:[],  //商家相册
				is_business_license: true,
				is_tobacco_license: false,
				is_food_license: false,
				id: '',
				show:false
			}
		},
		methods:{
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
											if(type=='picList'){
												this.picList.push(url.replace('http','https'));
											}else{
												this[type] = url.replace('http','https');
											}
										}
									})
								}
							}
						})
					}
				})
			},
			goMap(){ //导航
				uni.chooseLocation({
					success:res=>{
						console.log(res)
						this.address = res.address;
						this.latitude = res.latitude;
						this.longitude = res.longitude;
						// this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${this.$store.state.mapKey}`)
						// .then(res=>{
						// 	console.log(res)
						// 	let adcode = res.result.ad_info.adcode;
						// 	let data = res.result.address_component;
						// 	this.provinceCode = adcode.substring(0,2);
						// 	this.cityCode = adcode.substring(0,4);
						// 	let district = data.district;
						// 	if(adcode.substring(4,6) == '00'){
						// 		this.regionCode = res.result.address_reference.town.id;
						// 		district = res.result.address_reference.town.title
						// 	}else{
						// 		this.regionCode = adcode;
						// 	}
							
						// 	this.area = data.province + ' ' + data.city + ' ' + district;
						// 	this.defaultRegion = this.area.split(' ');
						// })
					}
				})
			},
			onConfirm($event){ //省市区选择
				console.log($event)
				this.area = $event.obj.province.label + ' ' + $event.obj.city.label + ' ' + $event.obj.area.label;
				// this.provinceCode = $event.value[0];
				// this.cityCode = $event.value[1];
				// this.regionCode = $event.value[2];
				let adcode = $event.value[2];
				this.provinceCode = adcode.substring(0,2);
				this.cityCode = adcode.substring(0,4);
				this.regionCode = adcode;
			},
			onCancel(){
				this.show = false;
			},
			getBusinessList(){  //获取行业列表
				this.$fly.get('/ShopBusiness/list')
				.then(res=>{
					if(res.code == 0){
						this.industryList = res.data.content;
					}
				})
			},
			// 选择行业类型
			bindChange($event){
				// console.log($event)
				this.current = this.industryList[$event.detail.value]['name'];
				this.currentId = this.industryList[$event.detail.value]['id'];
				this.is_business_license = this.industryList[$event.detail.value]['isLicense'];
				this.is_tobacco_license = this.industryList[$event.detail.value]['isTobacco'];
				this.is_food_license = this.industryList[$event.detail.value]['isFoodstuff'];
			},
			checkRate(){ //检查让利比率
				let reg = /^[1-9]\d*|0$/;
				if(this.rate){
					if(!reg.test(this.rate)){
						uni.showToast({
							title:'请输入有效数字'
						})
						this.rate = '';
					}else if(this.rate < 5 || this.rate > 30){
						uni.showToast({
							title:'请输入5%-30%范围内的让利比率'
						})
					}
				}
			},
			// 选择起始日期
			startDateChange($event){
				this.start = $event.detail.value;
			},
			// 选择结束日期
			stopDateChange($event){
				this.stop = $event.detail.value;
			},
			deleteImg(index){ //删除商家相册照片
				this.picList.splice(index,1);
			},
			previewImg(img){  //商家相册图片预览
				uni.previewImage({
					loop:true,
					current:img,
					urls: this.picList,
					success:res=>{
						console.log(res)
					}
				})
			},
			checkForm(){ //确认信息填写完整
				if( !this.legalName || !this.idCard || !this.positive || !this.opposite || !this.shopName || !this.shopNickName || !this.currentId || !this.rate || !this.mobile || !this.address || !this.start || !this.stop || !this.door_photo || !this.picList){
					uni.showToast({
						title:'请填写完整所有信息',
						icon: 'none'
					})
				}else if( this.is_business_license && !this.business_license){
					uni.showToast({
						title:'请上传营业执照',
						icon: 'none'
					})
				}else if( this.is_tobacco_license && !this.tobacco_license){
					uni.showToast({
						title:'请上传烟草许可证',
						icon: 'none'
					})
				}else if( this.is_food_license && !this.food_license){
					uni.showToast({
						title:'请上传食品许可证',
						icon: 'none'
					})
				}else if(this.rate < 5 || this.rate > 30){
					uni.showToast({
						title:'请输入5%-30%范围内的让利比率',
						icon: 'none'
					})
				}else{
					this.submit();
				}
			},
			submit(){ // 提交审核
				let params = {
					area: this.area,
					areaCode: this.provinceCode,
					areaCodeAreas: this.regionCode,
					areaCodeCity: this.cityCode,
					contactAddress: this.address,
					businessLicenseUrl: this.business_license,
					foodbusinessLicenseUrl: this.food_license, //食品许可证
					id: this.id, //商户id 修改时候再传
					idCardFrontUrl: this.positive, //身份证正面照片
					idCardNumber: this.idCard, //身份证号码
					idCardReverseUrl: this.opposite, //身份证反面照片
					tobaccoBusinessLicenseUrl: this.tobacco_license, //烟草许可证
					latitude: this.latitude, //纬度
					longitude: this.longitude, //经度
					legalName: this.legalName, //法人姓名
					phone: this.mobile, //电话
					profits: this.rate, //让利比例 
					shopBusinessId: this.currentId, //行业id
					shopBusinessName: this.current, //行业名称
					shopImageUrl: this.picList.toString(), //商家相册最大20
					shopName: this.shopName,
					shopNickName: this.shopNickName, //商家简称
					shopStartTime: this.start, //开始时间
					shopStopTime: this.stop, //结束时间
					shopUrl: this.door_photo, //门头照
					userId: this.$store.state.userInfo.id,
					page: 'pages/payAbout/payIndex/payIndex',
					width: 800
				}
				uni.showLoading({
					title:'加载中',
				})
				this.$fly.post('/merchant/completionInfo',params)
				.then(res=>{
					setTimeout(()=>{uni.hideLoading()},2000);
					if(res.code == 0){
						uni.redirectTo({
							url:`/businessPages/review/index?status=1`
						})
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
				.catch(err=>{
					uni.hideLoading();
				})
			}
		},
		onLoad:function(){
			this.getBusinessList();
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #eee;
		min-height: 100vh;
		padding-bottom: 30px;
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
				padding: 0 20rpx;
				height: 50px;
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
					.address{
						margin-left: 10rpx;
					}
					.rate{
						width: 90%;
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
					.upload_list{
						justify-content: flex-start;
						color: #CBCBCB;
						line-height: 24rpx;
						flex-wrap: wrap;
						.pic_list{
							margin-right: 20rpx;
							margin-bottom: 10rpx;
							position: relative;
							image{
								width: 120rpx;
								height: 120rpx;
								display: block;
							}
							.delete-img{
								width: 18px;
								height: 18px;
								border-radius: 50%;
								background: #fff;
								position: absolute;
								top: -8px;
								right: -8px;
							}
						}
						.frame{
							width: 120rpx;
							height: 120rpx;
							border: 2rpx dashed #CBCBCB;
							margin-bottom: 10rpx;
						}
					}
				}
			}
			.album{
				height: unset;
				padding: 15px 20rpx;
			}
		}
	}
	.btn{
		width: 670rpx;
		height: 38px;
		border-radius: 19px;
		background: #FF9D11;
		color: #fff;
		margin: 0 auto;
		margin-top: 30px;
	}
</style>
