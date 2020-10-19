<template>
	<view class="release">
		<view class="release-img">
			<image :src="releaseImg[0] || '../../../static/images/shop/img.png'" @click="clickUrl('/businessPages/shop/releaseGoods/UPImg')" class="item-img"></image>
			<view class="release-btn flex_center" @click="UpImg()">上传</view>
		</view>
		<view class="main">
			<view class="item flex_between">
				<textarea class="item-textarea" @input="clickVoluat($event,'commodityName')" :value="commodityName" auto-height="true" maxlength="20" placeholder="商品名称"></textarea>
			</view>
			<view class="item flex_between" @click="classTOn">
				<view class="title">分类</view>
				<view class="content flex_center">
					<view class="txt9">{{defaultRegion}}</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="item flex_between">
				<view class="title">让利比</view>
				<view class="content flex_center">
					<input class="content-input" @input="clickVoluat($event,'profits')" :value="profits" type="number" placeholder="请输入让利比">%
				</view>
			</view>
		</view>
		<view class="main">
			<view class="item flex_between" @click="clickUrl('/businessPages/shop/releaseGoods/specs')">
				<view class="title">规格</view>
				<view class="content flex_center">
					<view class="txt9" v-if="releaseSpecs.length==0">未设置</view>
					<view v-else>已设置</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="item flex_between" @click="clickUrl('/businessPages/shop/releaseGoods/price')">
				<view class="title">价格</view>
				<view class="content flex_center">
					<view class="txt9" v-if="!releaseParamList[0].priceSale">未设置</view>
					<view v-else>已设置</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<view class="item flex_between" @click="clickUrl('/businessPages/shop/releaseGoods/stock')">
				<view class="title">库存</view>
				<view class="content flex_center">
					<view class="txt9" v-if="!releaseParamList[0].stock">未设置</view>
					<view v-else>已设置</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- <view class="item flex_between">
				<view class="title">运费</view>
				<view class="content flex_center">
					<input class="content-input" @blur="clickVoluat($event,'freight')" :value="freight" type="text" placeholder="未输入或0时,为免运费">
				</view>
			</view> -->
			<!-- <view class="item flex_between">
				<view class="title">是否参与夺宝</view>
				<view class="content flex_center">
					<view class="txt9">是</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view> -->
		</view>
		<view class="main">
			<view class="item flex_between" @click="clickUrl('/businessPages/shop/releaseGoods/details')">
				<view class="title">商品描述</view>
				<view class="content flex_center">
					<view class="txt9" v-if="!releaseDetails">未设置</view>
					<view v-else>已设置</view>
					<view class="more">
						<image src="../../../static/images/common/more_gray.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="release-btns flex_center">
			<view class="release-btns-warehouse btn flex_center" @click="GOStm('no')">放入仓库</view>
			<view class="release-btns-release btn flex_center" @click="GOStm()">立即发布</view>
		</view>
		<w-picker
			mode="linkage" 
			:visible.sync="show" 
			:value="linkageValue"
			:options="classt"
			:default-props="props"
			:level="level"
			@confirm="onConfirm($event,'linkage')"
		></w-picker>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				defaultRegion:'',
				commodityName:'',//商品名称
				profits:'',//让利比
				cateId:'',//分类id
				commodityStatus:'online',//是否上架 online上架 ，offline下架 
				freight:0,//运费
				isSelfManage:false,//是否自营
				classt:[],
				show:false,
				props:{
					label:"label",
					value:"value",
					children:"children"
				},
				level:3,
				linkageValue:'',
				pageType:'add',
				GoodsId:''
			}
		},
		computed:{
			releaseImg(){ //添加商品图片
				return this.$store.state.goods.releaseImg;
			},
			releaseSpecs(){ //添加商品规格
				return this.$store.state.goods.releaseSpecs;
			},
			releaseParamList(){ //添加商品列表
				return this.$store.state.goods.releaseParamList;
			},
			releaseDetails(){ //添加商品详情
				return this.$store.state.goods.releaseDetails;
			},
			merchantId(){ //商家id
				return this.$store.state.goods.merchantId || 201;
			},
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			},
			goodsProfits(){
				return this.$store.state.goods.goodsProfits || 0;
			}
		},
		methods:{
			init(){
				this.classFun();
			},
			//分类选择
			classTOn(){
				this.show = true;
				console.log(this.classt)
			},
			onConfirm(e){
				this.cateId = e.value[2];
				this.defaultRegion = e.obj.col3.label
			},
			
			//跳转链接
			clickUrl(url){
				uni.navigateTo({
				    url
				});
			},
			// 给对应的name赋值
			clickVoluat(e,name){
				this[name] = e.detail.value;
			},
			// 拉取分类
			async classFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let classt = await this.$fly.get(`/commodity/categroy/tree/1`);
					uni.hideLoading();
					if(classt.code!=0){
						uni.showToast({
						    title: classt.message,
						    duration: 2000
						});
						return false;
					}
					this.classt = classt.data;
				}catch(e){
					console.error(e)
					uni.showToast({
					    title: '拉取分类失败！！',
					    duration: 2000
					});
				}
			},
			//上传图片
			UpImg(){
				uni.chooseImage({
					count:1,
					success: res => {
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
										url: `${this.$store.state.baseUrl}/upload/?serviceType=commodity`,
										filePath: file,
										fileType: 'image',
										name:' file',
										success:res=>{
											let url = JSON.parse(res.data).data;
											this.releaseImg.push(url.replace('http','https'));
											this.$nextTick(()=>{
												this.$store.commit('SETReleaseImg',this.releaseImg)
											})
										}
									})
								}
							}
						})
					}
				})
			},
			// 立即发布
			GOStm(type){
				let {commodityName,profits,merchantId,userId,cateId,isSelfManage,commodityStatus,freight,releaseImg,releaseSpecs,releaseParamList,releaseDetails} = this;
				let data = {
					commodityName,
					profits,
					cateId,
					commodityStatus,
					freight:freight||0,
					attributeParamList:releaseSpecs,
					description:releaseDetails,//商品详情
					isSelfManage,
					listUrl:releaseImg[0],
					mainUrl:releaseImg.join(';'),
					specificationParamList:releaseParamList,
					merchantId,
					userId
				};
				if(type){
					data.commodityStatus = 'offline';
				}
				let verificasObj = {
					releaseImg:{
						name:'图片不能为空！',
						imp:!releaseImg[0]
					},
					commodityName:{
						name:'商品名称不能为空！',
						imp:!commodityName
					},
					cateId:{
						name:'请选择分类',
						imp:!cateId
					},
					profits:{
						name:'让利比在5%和30%！',
						imp:(profits<5 || profits>30)
					},
					releaseSpecs:{
						name:'请设置商品规格！',
						imp:releaseSpecs.length==0
					},
					releaseParamListPriceSale:{
						name:'请设置商品价格！',
						imp:!(releaseParamList[0] && releaseParamList[0].priceSale!=0)
					},
					releaseParamListStock:{
						name:'请设置商品库存！',
						imp:!(releaseParamList[0] && releaseParamList[0].stock!=0)
					},
					releaseDetails:{
						name:'请设置商品详情！',
						imp:!releaseDetails
					},
				}
				for(let i in verificasObj){
					if(verificasObj[i].imp){
						wx.showToast({
						  title:verificasObj[i].name,
						  icon: 'none',
						  duration: 2500
						})
						return ;
					}
				}
				this.Ajax(data);
			},
			async Ajax(data){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let addGoods = ''
					if(this.pageType === 'add'){
						addGoods = await this.$fly.post(`/web/commodity/add`,data);
					}else{
						addGoods = await this.$fly.post(`/web/commodity/${this.GoodsId}`,data);
					}
					if(addGoods.code!=0){
						uni.showToast({
							title: addGoods.message,
							duration: 2000
						});
						return false;
					}
					this.$store.commit('SETGoodsProfits',data.profits)
					uni.navigateBack();
				}catch(e){
					//TODO handle the exception
					wx.showToast({
					  title: '添加产品失败！',
					  icon: 'none',
					  duration: 2500
					})
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			},
			//获取商品详情初始化修改页
			goodsDetails(id) {
				this.$fly.get(`/web/commodity/${id}`).then(res => {
					let {
						data
					} = res;
					// debugger
					this.GoodsId = data.id;
					this.pageType = 'edit';
					this.commodityName = data.commodityName;  //商品名称
					this.freight = data.freight; //商品运费
					this.profits = data.profits;//商品利润
					//规格初始化
					let specificationParamList = [];
					data.commodityAttributeList.forEach((val, idx) => {
					  const objs = val;
					  objs.values = data.commodityAttributeList[idx].commodityAttributeValueList;
					  specificationParamList.push(objs);
					});
					
					this.cateId = data.cateId; //分类id
					this.defaultRegion = data.cateName;//分类名称
					
					this.$store.commit('SETReleaseImg',data.mainUrl.split(';')) //商品图片
					this.$store.commit('SETReleaseSpecs',specificationParamList) //商品规格
					this.$store.commit('SETReleaseParamList',data.commoditySpecList)//商品库存和价格
					this.$store.commit('SETReleaseDetails',data.description)//商品详情
				})
			},
		},
		onLoad(res) {
			this.init()
			if(res.id){
				//有id就是修改内容
				this.goodsDetails(res.id);
			}else{
				this.profits = this.goodsProfits
			}
			
		},
		onUnload(){
			this.$store.commit('SETReleaseImg',[])
			this.$store.commit('SETReleaseSpecs',[])
			this.$store.commit('SETReleaseParamList',[])
			this.$store.commit('SETReleaseDetails','')
			this.$store.commit('SETIsSpecsModify',false)
		}
	}
</script>

<style lang="scss" scoped>
	.release {
		min-height: 100vh;
		width: 100%;
		background: #efefef;
		padding-bottom: 100rpx;
		box-sizing: border-box;
	}
	.release-btns{
		position: fixed;
		height: 100rpx;
		width: 100%;
		background: #fff;
		box-shadow:0px 0px 10px rgba(222,222,222,1);
		bottom: 0;
		z-index: 999;
		padding: 16rpx 20rpx;
		box-sizing: border-box;
		.btn{
			width: 50%;
			background: #ff9d12;
			color: #fff;
			height: 80rpx;
		}
		.release-btns-warehouse{
			background: #ffbb5a;
			border-radius: 50rpx 0 0 50rpx ;
		}
		.release-btns-release{
			border-radius: 0 50rpx 50rpx 0;
		}		
	}
	.release-img{
		width: 100%;
		position: relative;
		display: flex;
		.item-img{
			width: 100%;
			height: 400rpx;
		}
		.release-btn{
			position: absolute;
			z-index: 2;
			right: 30rpx;
			bottom: 30rpx;
			border-radius: 50%;
			width: 100rpx;
			height: 100rpx;
			color: #fff;
			font-size: 26rpx;
			background: #FF9834;
			line-height: 1.2;
			box-shadow:1rpx 1rpx 8rpx 0px rgba(0, 0, 0, 0.25);
		}
	}

	.main {
		padding: 0rpx 0 20rpx;
		line-height: 28rpx;

		.item {
			padding: 30rpx 20rpx;
			background: #fff;
			border-bottom: 2rpx solid #D3D3D3;
			position: relative;
			&-textarea{
				height: 80rpx;
			}
			.title {
				color: #999999;
			}

			.content {
				color: #333333;
				&-input {
					text-align: right;
				}
				.txt9{
					color: #999999;
				}
				.avatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
					overflow: hidden;

					image {
						width: 160rpx;
						height: 160rpx;
						display: block;
						border-radius: 50%;
					}
				}

				.more {
					margin-left: 10rpx;

					image {
						width: 24rpx;
						display: block;
					}
				}
			}
		}
	}
</style>
