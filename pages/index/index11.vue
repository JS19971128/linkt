<template>
	<view class="bg">
		<view class="top flex_between">
			<view class="location flex_center" @click="choosePosition">
				<image src="../../static/images/common/location.png" mode="widthFix"></image>
				<text class="fz-14">{{location}}</text>
			</view>
			<view class="search flex_center">
				<image src="../../static/images/common/search.png" mode="widthFix"></image>
				<input type="text" placeholder="请输入要搜索的内容" confirm-type="search" placeholder-style="color:#CBCBCB;font-size:28rpx" v-model="keyword" @confirm="search"/>
			</view>
		</view>
		<!-- banner -->
		<my-banner :adverts="adverts" :articles="articles"></my-banner>
		<!-- 分类 -->
		<business-category :statistics="statistics" :localFans="localFans" :category="category"></business-category>
		<!-- 推荐 -->
		<recommend :recommend="recommend"></recommend>
		<!-- 排行榜 -->
		<business-list></business-list>
	</view>
</template>

<script>
	import myBanner from '@/my-component/banner/index.vue'
	import businessCategory from '@/my-component/businessCategory/index.vue'
	import recommend from '@/my-component/recommend/index.vue'
	import businessList from '@/my-component/businessList/index.vue'
	export default {
		components:{
			myBanner, //banner
			businessCategory, //分类
			recommend, //推荐
			businessList //排行榜
		},
		data() {
			return {
				location: '位置获取中...',
				longitude:'',
				latitude:'',
				keyword:'',
				statistics:{},  //全国商家粉丝数
				localFans:'', //本地粉丝
				category:[],
				adverts:[], //banner
				articles: [], //公告
				recommend:[], //推荐商家
			}
		},
		methods: {
			getLocationAuth(){ //微信获取位置
				uni.getSetting({
					success: (res) => {
						// console.log(res)
						if(res.authSetting && res.authSetting['scope.userLocation'] == false){
							uni.showModal({
								title:'提示',
								content:'“链客通智慧商圈”需要获取你的地理位置，是否允许？',
								success: (res) => {
									if(res.confirm){
										uni.openSetting({
											success: (res) => {
												// if(res.authSetting['scope.userLocation']==true){
												// 	this.getLocation();
												// }
												this.getLocation();
											}
										})
									}else{
										this.getLocation();
									}
								}
							})
						}else{
							this.getLocation();
						}
					}
				})
			},
			getLocation(){
				uni.getLocation({ //支付宝获取位置
					success: res=>{
						// console.log(res)
						// this.location = '当前位置';
						// this.getCity(res.longitude,res.latitude);
						this.$store.state.latitude = res.latitude;
						this.$store.state.longitude = res.longitude;
						this.getData(res.longitude,res.latitude);
						this.getLocalFans(res.longitude,res.latitude);
						this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${this.$store.state.mapKey}`)
						.then(res=>{
							this.location = res.result.address_component.district;
						})
					},
					fail: (err) => {
						// console.log(err)
						this.getData();
						// this.location = '全部';
					}
				})
			},
			getData(longitude,latitude){ //首页数据
				this.$fly.get(`/home/index?longitude=${longitude || ''}&latitude=${latitude || ''}`)
				.then(res=>{
					// console.log(res)
					if(res.code == 0){
						let data = res.data;
						this.articles = data.articles;
						this.adverts = data.adverts;
						this.statistics = data.statistics;
						this.category = data.shopBusinesses;
						this.recommend = data.merchants;
					}
					uni.stopPullDownRefresh();
				})
			},
			getLocalFans(longitude,latitude){ //获取本地粉丝
				this.$fly.get(`/home/getLocalFans?latitude=${latitude}&longitude=${longitude}`)
				.then(res=>{
					if(res.code == 0){
						this.localFans = res.data;
					}
				})
			},
			search(){ //顶部搜索框
				uni.navigateTo({
					url:`/pages/shopList/index?type=category&searchKey=${this.keyword}`
				})
			},
			choosePosition(){ //顶部选择定位地点
				uni.chooseLocation({
					success: (res) => {
						// console.log(res)
						this.$store.state.latitude = res.latitude;
						this.$store.state.longitude = res.longitude;
						this.getData(res.longitude,res.latitude);
						this.getLocalFans(res.longitude,res.latitude);
						this.$fly.get(`https://apis.map.qq.com/ws/geocoder/v1/?location=${res.latitude},${res.longitude}&key=${this.$store.state.mapKey}`)
						.then(res=>{
							this.location = res.result.address_component.district || res.result.address_component.city;
						})
					},
					fail: (err) => {
						// console.log(err)
						this.getData();
						// this.location = '全部';·
					}
				})
			}
		},
		onLoad: function(){
			// #ifdef MP-ALIPAY
			this.getLocation();
			// #endif
			// #ifdef MP-WEIXIN
			this.getLocationAuth();
			// #endif

		},
		onShow:function() {
			// #ifdef MP-WEIXIN
				if(!this.$store.state.userInfo.uid){
					this.$wxLogin();
				}
			// #endif
			
			// #ifdef MP-ALIPAY
				if(!this.$store.state.userInfo.uid){
					this.$aliLogin();
				}
			// #endif
		},
		onPullDownRefresh: function(){
			// 下拉刷新
			// #ifdef MP-ALIPAY
			this.getLocation();
			// #endif
			// #ifdef MP-WEIXIN
			this.getLocationAuth();
			// #endif
		},
		onShareAppMessage(){
			return {
				path: 'pages/index/index',
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		// padding-top: 100rpx;
		background: #EEEEEE;
		.top{
			width: 100%;
			height: 100rpx;
			padding: 0 20rpx;
			border-top: 2rpx solid #DDDDDD;
			box-sizing: border-box;
			background: #fff;
			// position: fixed;
			// top: 0;
			// left: 0;
			// z-index: 500;
			.location{
				image{
					width: 44rpx;
					display: block;
					margin-right: 10rpx;
				}
			}
			.search{
				width: 474rpx;
				height: 60rpx;
				border-radius: 30rpx;
				background: #EDEDED;
				justify-content: flex-start;
				input{
					background: #EDEDED;
					width: 350rpx;
					font-size: 28rpx;
					height: 40rpx;
				}
				image{
					width: 28rpx;
					display: block;
					margin: 0 20rpx;
				}
			}
		}
		::-webkit-scrollbar{                    
				opacity: 0;
		}
	}
</style>
