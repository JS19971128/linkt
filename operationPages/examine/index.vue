<template>
	<view class="shop">
		<view class="shop-item">
			<view class="shop-item-list" :class="{'active':i===shopTitleIndex}" v-for="(item,i) in shopTitle" @click="clickq(i)">
				{{item.title}}
			</view>
		</view>
		<view class="shop-goods">
			<shop-list  
			type="examine" @goodsGo="goodsGo" @goodsNo="goodsNo" @goodsDelete="goodsDelete"
			:list='navList'></shop-list>
		</view>
		<popup :goods="goods" @addStock="addStock"></popup>
	</view>
</template>

<script>
	import shopList from '@/my-component/goodsList/shopGoods'
	import popup from '@/my-component/popup/index'
	export default{
		data(){
			return{
				page:0,
				navList:[],
				shopTitle:[{title:'待审核',key:'audit'},{title:'全部',key:''},{title:'已通过',key:'success'},{title:'未通过',key:'failure'}],
				shopTitleIndex:0,
				goods:{},
				stockStatus:'audit',
				GoodsIndex:0
			}
		},
		components:{shopList,popup},
		computed:{
			merchantId(){ //商家id
				return this.$store.state.goods.merchantId;
			},
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		methods:{
			init(){
				this.navListFun();
				// this.stockStatusCountFun()
			},
			addStock(res){
				this.page = 0;
				this.navListFun();
				// this.stockStatusCountFun()
			},
			goodsGo(res){
				this.ajaxNoAudit(res,'success');
			},
			goodsNo(res){
				this.ajaxNoAudit(res,'failure');
			},
			ajaxNoAudit(res,auditStatus){
				let that = this;
				let param = {
				  auditStatus,
				  "commodityId": res.id,
				  "userId": this.userInfo.id
				}
				let txt = '通过';
				if(auditStatus == 'failure'){
					txt = '不通过'
				}
				uni.showModal({
				    title: '提示',
				    content: `是否审核${txt}此商品？`,
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.$fly.post('/web/commodity/audit',param).then(res=>{
								uni.showToast({
								    title: res.message,
								    duration: 2000
								});
								if(res.code == 0){
									this.addStock()
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			//删除
			goodsDelete(row){
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '是否删除此商品？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.Ajax(`/web/commodity/${row.id}`,'delete',{},row.id);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			async Ajax(url,type='get',param={},id){
				try{
					let ajax = '';
					let {navList} = this;
					uni.showLoading({
						title:'加载中'
					})
					if(type=='get'){
						ajax = await this.$fly.get(url,param);
					}else{
						ajax = await this.$fly.delete(url,param);
					}
					uni.hideLoading();
					uni.showToast({
					    title: ajax.message,
					    duration: 2000
					});
					if(ajax.code!=0){
						return false;
					}
					// this.navList = navList.filter((v)=>v.id!=id);
					this.addStock();
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '操作失败！！',
					    duration: 2000
					});
					console.error(e)
				}
			},
			//切换
			clickq(i){
				this.shopTitleIndex = i;
				this.stockStatus = this.shopTitle[i].key;
				this.page = 0;
				this.init();
			},
			//获取列表
			async navListFun(){
				try{
					let {page,merchantId,stockStatus} = this;
					let param = {
						size:10,
						page,
						auditStatus:stockStatus,
						sortType: 'sort_time_desc',
						userId:this.userInfo.id
					};
					uni.showLoading({
						title:'加载中'
					})
					let list = await this.$fly.get(`/web/commodity/merchantAudit`,param);
					uni.hideLoading();
					uni.stopPullDownRefresh();
					if(list.code!=0){
						uni.showToast({
						    title: list.message,
						    duration: 2000,
							icon:'none'
						});
						return false;
					}
					let data = list.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.navList = []
					}
					
					this.navList = this.navList.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				}catch(e){
					//TODO handle the exception
					uni.showToast({
					    title: '拉取商品列表失败！',
					    duration: 2000
					});
					console.error(e)
				}
			},
			//获取商品详情
			goodsDetails(id) {
				this.$fly.get(`/web/commodity/${id}`).then(res => {
					let {
						data
					} = res;
					this.goods = data;
				})
			},
			// 查询商品库存状态分类对应数量
			async stockStatusCountFun(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let {shopTitle,merchantId} = this;
					let stockStatusCount = await this.$fly.get('/web/commodity/stockStatusCount',{merchantId});
					let stockStatus = stockStatusCount.data;
					
					for(let i of shopTitle){
						let count = stockStatus.filter((v)=>v.stockStatusName==i.key);
						i.num = count[0].count
					}
					this.shopTitle = shopTitle;
				}catch(e){
					uni.showToast({
					    title: '拉取商品数量失败！',
					    duration: 2000
					});
					console.error(e)
				}finally{
					uni.hideLoading();
				}
			}
		},
		onLoad(res) {
			// this.init()
			this.GoodsIndex = res.index
		},
		onShow() {
			// this.init()
			this.clickq(Number(this.GoodsIndex)||0)
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.navListFun();
		},
		onPullDownRefresh(){
			this.page = 0;
			this.navListFun();
		},
	}
</script>

<style lang="scss" scoped>
	.shop{
		width: 100%;
		min-height: 100vh;
		background: #efefef;
		padding-top: 20rpx;
		box-sizing: border-box;
		&-item {
			box-sizing: border-box;
			width: 100%;
			margin: 20rpx 0;
			padding:0 20rpx 15rpx;
			display: flex;
			height: 40rpx;

			&-list {
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				line-height: 1;
				flex: 1;
				color: #999999;
				&.active{
					color: #FF9834;
					position: relative;
					&::after{
						display: block;
						content: '';
						color: #FF9733;
						width: 20rpx;
						height: 10rpx;
						background: url(../../static/images/home/tab_icon.png) no-repeat;
						background-size: 100% 100%;
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						bottom: -15rpx;
					}
				}
			}
		}
		&-goods{
			background: #fff;
			padding-top: 20rpx;
			height: calc(100vh - 120rpx);

		}
	}
</style>
