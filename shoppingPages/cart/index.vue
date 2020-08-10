<template>
	<view class="cart">
		<!-- 我是购物车页面 -->
		<!-- 店铺循环 -->
		<view class="cart-shop" v-for="(item,index) in cartArr" :key="item.merchantId">
			<view class="shop-title">
				<view class="shop-title-check checkbox" :class="{'active':item.isActive}" @click="txtParentActive(index)"></view>
				<view class="shop-title-txt" @click="clickShop(item.merchantId)">{{item.merchantShopName}}</view>
				<image class="shop-title-img" src="../../static/images/shop/more-right.png" mode="widthFix"></image>
			</view>
			<view class="shop-goods">
				<!-- 产品循环 -->
				<view class="shop-goods-list" v-for="(goods,i) in item.cartList" :key="i">
					<view class="shop-goods-list-item" :style="{left:goods.scrollW+'px'}" 
					@touchstart="touchS($event, index,i)" @touchmove="touchM($event, index,i)" @touchend="touchE($event, index,i)">
						<view class="shop-title-check checkbox" :class="{'active':goods.isActive}" 
						@click.stop="txtActive(index,i)" v-if="goods.stockStatus=='onSale' && goods.commodityDeleteFlag == 0 && goods.specName"></view>
						<view class="shop-s" v-else>失效</view>
						<view class="goods-detail">
							<view class="goods-img" @click="goCommodity(goods)">
								<image :src="goods.listUrl" class="goods-img-img"></image>
								<view class="goods-img-txt" v-if="goods.isDraw">消费夺宝</view>
							</view>
							<view class="goods-detail-home">
								<view class="goods-detail-title">{{goods.commodityName}}</view>
								<view class="goods-detail-specs" v-if="goods.specName && goods.stockStatus == 'onSale' && goods.commodityDeleteFlag == 0">
									<view class="goods-detail-specs-info" @click.stop="onClickSpec(goods.id,goods.commodityId,goods.specId,goods.commodityNum)">
										<text class="specs-name">{{goods.specName}}</text>
										<image class="specs-more" src="../../static/images/shop/more-up.png" mode="widthFix"></image>
									</view>
									<view class="goods-detail-specs-zw"></view>
								</view>
								<view class="goods-detail-info" v-if="goods.specNam && goods.stockStatus == 'onSale' && goods.commodityDeleteFlag == 0">
									<view class="info-price">
										<text class="info-price-f">￥</text>
										{{goods.priceSale}}
									</view>
									<view class="info-num">
										<stepper :goodsId="goods.id" :fIndex="index" :cIndex="i" :number="goods.commodityNum" @update="update"></stepper>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="delete flex_center" @click="deleteGoods(goods.id)">
						<image src="../../static/images/operation/delete.png" mode="widthFix"></image>
					</view>
				</view>
				<!-- 产品循环end -->
			</view>
		</view>
		<!-- 店铺循环end -->
		<view class="cart-fixed">
			<view class="cart-totle">
				合计<text class="totle-price">￥{{totalPrice}}</text>
			</view>
			<button type="default" class="cart-btn" v-if="totalNum!=0" @click="settlement">结算（{{totalNum}}）</button>
			<button type="default" class="cart-btn" style="background: #D3D3D3;" v-else>结算（{{totalNum}}）</button>
		</view>
		
		<!-- 商品购买选择规格 -->
		<goods-specs :goods="goods" @onGoBtn="onGoBtn" ref="goods"></goods-specs>
		<!-- 商品购买选择规格 -->
	</view>
</template>

<script>
	import stepper from '@/my-component/stepper/index'
	import goodsSpecs from '@/my-component/goodsSpecs/index'
	export default{
		data(){
			return{
				page:0,
				cartArr:[],
				totalPrice:0,//总价
				totalNum:0,//总数
				goods:{},
				delBtnW: 65, // 删除按钮宽度
				cartID:''
			}
		},
		components:{stepper,goodsSpecs},
		computed:{
			userId(){
				return this.$store.state.userInfo.id || 22222228;
			}
		},
		methods:{
			//跳转到店铺页面
			clickShop(id){
				uni.navigateTo({
					url:`/shoppingPages/shop/index?merchantId=${id}`
				})
			},
			touchS(e,parentI,i){ // 触摸开始
				let {cartArr} = this;
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					// this.startX = e.touches[0].clientX;

					this.$set(cartArr[parentI].cartList[i],'startX',e.touches[0].clientX);
					
				}
			},
			touchM(e,parentI,i){ // 滑动中
				let {cartArr} = this;
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = cartArr[parentI].cartList[i].startX - moveX;
					var delBtnW = this.delBtnW;
					if (disX <= 0) { 
						// this.scrollW = 0;
						this.$set(cartArr[parentI].cartList[i],'scrollW',0);
					}else if (disX > 0 && disX < delBtnW){ // 移动距离大于0并且小于删除按钮宽度，left值等于手指移动距离
						// this.scrollW = disX * (-1);
						let scrollW = disX * (-1);
						this.$set(cartArr[parentI].cartList[i],'scrollW',scrollW);
					}else{
						//控制手指移动距离最大值为删除按钮的宽度
						// this.scrollW = -65;
						this.$set(cartArr[parentI].cartList[i],'scrollW',-65);
					}
				}
			},
			touchE(e,parentI,i){ // 手指离开
				let {cartArr} = this;
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = cartArr[parentI].cartList[i].startX - endX;
					var delBtnW = this.delBtnW;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					// this.scrollW = disX > delBtnW / 2 ? -65 : 0;
					let scrollW = disX > delBtnW / 2 ? -65 : 0;
					this.$set(cartArr[parentI].cartList[i],'scrollW',scrollW);
				}
			},
			async deleteGoods(id){ //删除产品
				try{
					let del = await this.$fly.delete(`/app/cart/del?ids=${id}`);
					this.page = 0;
					this.cartList()
				}catch(e){
					//TODO handle the exception
					wx.showToast({
					  title: '删除产品失败！',
					  icon: 'none',
					  duration: 2500
					})
				}
				
			},
			//跳转商品
			goCommodity(res){
				if(res.commodityDeleteFlag === 1 || !goods.specName){
					return;
				}
				let id = res.commodityId;
				let str = `?id=${id}`;
				uni.navigateTo({
					url:`/shoppingPages/commodity/index${str}`
				})
			},
			//点击切换规格
			async onClickSpec(cartID,goodsID,specId,commodityNum){
				let goods = await this.goodsDetails(goodsID);
				this.goods = goods;
				let commoditySpecList = goods.commoditySpecList;
				let arr = [],speas = [];
				for(let i of commoditySpecList){
					if(specId===i.id){
						arr = i.value.split('-')
					}
				}
				for(let i in arr){
					speas.push(Number(arr[i]))
				}
				this.$nextTick(()=>{
					this.$store.commit('SETISSPECS',true);
					this.$refs.goods.Init(speas,commodityNum);
					this.cartID = cartID;
				})
			},
			//点击选择规格确认回调
			async onGoBtn(e){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let data = {
						num:e.buyNumber,
						newSpecId:e.specification.id,
						id:this.cartID
					}
					let updateSpec = await this.$fly.get(`/app/cart/updateSpec`,data);
					uni.hideLoading();
					if(updateSpec.code!=0){
						uni.showToast({
							title: updateSpec.message,
							duration: 2000
						});
						return false;
					}
					this.$store.commit('SETISSPECS',false);
					let cartArr = this.cartArr;
					for(let i in cartArr){
						if(cartArr[i].merchantId === updateSpec.data.merchantId){
							this.$set(cartArr,i,updateSpec.data)
						}
					}
				}catch(e){
					//TODO handle the exception
					wx.showToast({
					  title: '修改失败',
					  icon: 'none',
					  duration: 2500
					})
					console.error(e)
				}
			},
			//获取商品详情
			async goodsDetails(id) {
				try{
					let goods = await this.$fly.get(`/web/commodity/${id}`);
					return goods.data;
					
				}catch(e){
					wx.showToast({
					  title: '拉取购物车列表失败',
					  icon: 'none',
					  duration: 2500
					})
					console.error(e);
					return false
				}
			},
			//改变商品数量
			update(res){
				let {cartArr} = this;
				let {num,fIndex,cIndex,goodsId} = res;
				
				if(!this.updateNumPost(goodsId,num)) return;
				
				cartArr[fIndex].cartList[cIndex].commodityNum = num;
				let totalPrice = 0;

				for(let j of cartArr[fIndex].cartList){
					if(j.isActive&&j.stockStatus==='onSale'){
						totalPrice += (j.priceSale*100) * j.commodityNum;
					}
				}
				this.totalPrice = totalPrice/100;
				
				// this.updateNumPost(goodsId,num);
			},
			//请求改变商品数量请求接口
			async updateNumPost(id,num){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let updateNum = await this.$fly.get(`/app/cart/updateNum/${id}`,{num});
					uni.hideLoading();
					return true;
				}catch(e){
					//TODO handle the exception
					wx.showToast({
					  title: '修改失败',
					  icon: 'none',
					  duration: 2500
					})
					console.error(e)
					return false;
				}
				
			},
			//渲染子集
			txtActive(parentI,i){
				let {cartArr} = this;
				let isActive = !cartArr[parentI].cartList[i].isActive;
				let isSelectAll = true;
				let totalPrice = 0;
				let totalNum = 0;

				this.cartArrNo1(parentI);
				
				this.$set(cartArr[parentI].cartList[i],'isActive',isActive);

				for(let j of cartArr[parentI].cartList){
					if(!j.isActive){
						isSelectAll = false;
					}else{
						totalNum++
						totalPrice += (j.priceSale*100) * j.commodityNum;
					}
				}
				
				this.totalNum = totalNum;
				this.totalPrice = totalPrice/100;
				
				//判断是否为全选
				if(isSelectAll){
					this.$set(cartArr[parentI],'isActive',true);
				}else{
					this.$set(cartArr[parentI],'isActive',false);
				}
			},
			//全选反选
			txtParentActive(i){
				let {cartArr} = this;
				let isActive = !cartArr[i].isActive;
				let totalPrice = 0;
				let totalNum = 0;
				this.cartArrNo1(i);
				this.$set(cartArr[i],'isActive',isActive);
				for(let j of cartArr[i].cartList){
					if(j.stockStatus==='onSale'){
						this.$set(j,'isActive',isActive);
						if(isActive){
							totalNum++
							totalPrice += (j.priceSale*100) * j.commodityNum;
						}
					}					
				}
				this.totalNum = totalNum;
				this.totalPrice = totalPrice/100;
			},
			//重置掉父选择的
			cartArrNo1(i){
				let {cartArr} = this;
				cartArr.forEach((v,k)=>{
					if(k!=i){
						v.isActive = false
						for(let j of v.cartList){
							j.isActive = false
						}
					}
				})
			},
			async cartList(){
				try{
					let {userId,page} = this;
					let param = {
						userId,
						page,
						size:10,
						sort:'createDate,asc'
					}
					uni.showLoading({
						title:'加载中'
					})
					let cartApp = await this.$fly.get(`/app/cart/app`,param);
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if(cartApp.code!=0) {
						wx.showToast({
						  title: cartApp.message,
						  icon: 'none',
						  duration: 2500
						})
						return
					};
					let data = cartApp.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.cartArr = []
					}
					this.cartArr = this.cartArr.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				}catch(e){
					//TODO handle the exception
					wx.showToast({
					  title: '拉取购物车列表失败',
					  icon: 'none',
					  duration: 2500
					})
					console.error(e)
					uni.stopPullDownRefresh();
					uni.hideLoading();
				}
				
			},
			//购物车提交订单
			settlement(){
				let {cartArr,userId} = this;
				let cartIds = [];
				let merchantId = '';
				for(let i of cartArr){
					for(let j of i.cartList){
						if(j.isActive){
							cartIds.push(j.id)
							merchantId = i.merchantId
						}
					}
				}
				let data = {
					cartIds,
					userId
				}
				this.$fly.post(`/app/cart/needPay`,data).then(res => {
					uni.hideLoading();
					if(res.code!=0){
						wx.showToast({
						  title: res.message,
						  icon: 'none',
						  duration: 2500
						})
						return
					};
					uni.setStorageSync('needPay',res.data);
					data.cartIds = [];
					for(let i of res.data.cartRespDtoList){
						data.cartIds.push(i.id)
					}					
					this.$store.commit('SETBUYCOMMODITYINFO',data); //存储订单信息
					this.$store.commit('SETORDERMERCHANTID',merchantId); //存储merchantId
					uni.navigateTo({
						url: `/shoppingPages/order/index`
					})
				})
				
			},
			//购物车初始化
			init(){
				this.page = 0;
				this.totalPrice = 0;
				this.totalNum = 0
				this.cartList()
			}
		},
		onLoad() {
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh(){
			this.init();
		},
	}
</script>

<style lang="scss" scoped>
	.cart{
		width: 100%;
		min-height: 100vh;
		box-sizing: border-box;
		background: #efefef;
		padding: 20rpx 20rpx 110rpx;
		&-shop{
			width: 100%;
			background:#fff;
			border-radius:8rpx;
			margin-bottom: 20rpx;
			.shop-title{
				height:74rpx;
				box-shadow:0px 1px 0px 0px rgba(222,222,222,1);
				width: 100%;
				display: flex;
				align-items: center;
				&-check{
					margin:0 20rpx;
				}
				&-txt{
					font-size:32rpx;
					font-weight:bold;
					color:#333;
					margin-right: 20rpx;
				}
				&-img{
					width: 20rpx;
					height: 20rpx;
				}
			}
			.shop-goods{
				&-list{
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					position: relative;
					height: 240rpx;
					overflow: hidden;
					.shop-goods-list-item{
						position: absolute;
						width: 100%;
						z-index: 200;
						top: 20rpx;
						left: 0;
						box-sizing: border-box;
						padding-right:20rpx;
						background: #fff;
						display: flex;
						align-items: center;
						.shop-s{
							font-size: 24rpx;
							color: #D3D3D3;
							padding: 0 20rpx;
						}
					}
					.delete{
						width: 65px;
						height: 65px;
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%);
						z-index: 100;
						image{
							width: 37px;
							display: block;
						}
					}	
					&:last-child{
						.goods-detail{
							box-shadow:none;
						}
					}
					.goods-detail{
						padding-right: 20rpx;
						flex: 1;
						height: 100%;
						padding-bottom: 20rpx;
						box-shadow:0px 1px 0px 0px rgba(222,222,222,1);
						display: flex;
						.goods-detail-home{
							flex: 1;
						}
						.goods-img{
							width: 180rpx;
							height: 180rpx;
							position: relative;
							margin-right: 20rpx;
							&-img{
								width: 100%;
								height: 100%;
								border-radius: 8rpx;
							}
							&-txt{
								position: absolute;
								top: 0;
								left: 0;
								width:88rpx;
								height:33rpx;
								background:rgba(255,41,41,1);
								border-radius:8rpx 0 8rpx 0;
								color: #fff;
								font-size:18rpx;
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
						&-title{
							font-size:28rpx;
							color:#000;
							line-height:38rpx;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							margin-bottom: 20rpx;
						}
						&-specs{
							display: flex;
							margin-bottom: 20rpx;
							&-info{
								display: flex;
								align-items: center;
								padding: 8rpx 10rpx;
								border-radius:4rpx;
								background: #E3E3E3;
								justify-content: flex-start;
								font-size: 24rpx;
								line-height: 1;
								.specs-more{
									width: 20rpx;
									height: 12rpx;
									margin-left: 20rpx;
								}
							}
							&-zw{
								flex:1
							}
						}
						&-info{
							display: flex;
							justify-content: space-between;
							.info-price{
								line-height: 1;
								font-size:38rpx;
								color: #FFB955;
								&-f{
									font-size: 18rpx;
								}
							}
						}
					}
				}
			}
		}
		.cart-fixed{
			position: fixed;
			z-index: 998;
			bottom: 0;
			height: 110rpx;
			width: 100%;
			left: 0;
			box-sizing: border-box;
			// padding-left: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			.cart-totle{
				display: flex;
				padding-left: 20rpx;
				align-items: center;
				font-size: 36rpx;
				color: #333333;
				.totle-price{
					color: #FF9834;
					font-size: 46rpx;
					margin-left: 20rpx;
				}
			}
			.cart-btn{
				height: 100%;
				width: 240rpx;
				background: #FF9834;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				border-radius: 0;
				margin: 0;
				box-sizing: border-box;
				padding: 0;
			}
		}
	}
	
	.checkbox{
		width:32rpx;
		height:32rpx;
		border:2rpx solid rgba(204, 204, 204, 1);
		border-radius:50%;
		&.active{
			background: #FFAD5D;
			position: relative;
			border-color:#FFAD5D ;
			&::before{
				content: "";
				position: absolute;
				background: url(../../static/images/shop/check.png) no-repeat;
				background-size: 16rpx 16rpx;
				width: 16rpx;
				height: 16rpx;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}
</style>
