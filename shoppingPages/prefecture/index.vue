<template>
	<view class="bg">
		<block v-if="list.length > 0">
			<goods-list :list="list"></goods-list>
		</block>
		
		<view class="no_data" v-if="searchType==='dailyHot'">
			<view class="wrap_image_src">
				<image src="../../static/images/shop/underConstruction.png" mode="widthFix"></image>
			</view>
			<view class="tip">
				<view class="fz-14">即将开放</view>
				<view class="fz-12">开发小哥哥们正在全力开发中</view>
			</view>
		</view>
		
		<!-- 购物车按钮组件 -->
		<cart-btn></cart-btn>
	</view>
</template>

<script>
	import goodsList from '@/my-component/goodsList/index'
	import cartBtn from '@/my-component/cart/cartBtn'
	export default{
		components:{goodsList,cartBtn},
		data(){
			return{
				list:[],
				searchType:'',
				page:0,
			}
		},
		computed:{
			userId(){
				return this.$store.state.userInfo.id;
			}
		},
		methods:{
			init(){
				this.goodsList()
			},
			goodsList(){
				let {userId,searchType,page} = this;
				let param = {
					size:10,
					page,
					sort:'createDate,asc',
					userId:userId||'',
					searchType,
					commodityStatus:'online',
					auditStatus:'success'
				};
				
				uni.showLoading({
					title:'加载中'
				})
				this.$fly.get(`/app/mall/list`,param).then(res=>{
					uni.hideLoading();
					if(res.code!=0){
						uni.showToast({
						    title: res.message,
						    duration: 2000
						});
						return false;
					}
					let data = res.data;
					this.total = data.totalElements;
					if(this.page === 0){
						this.list = []
					}
					this.list = this.list.concat(data.content);
					this.page++;
					if(this.page > data.totalPages - 1){
						this.status = 'noMore';
					}else{
						this.status = 'more';
					}
				}).catch(res=>{
					uni.hideLoading();
					uni.showToast({
					    title: res.message,
					    duration: 2000
					});
				})
			}
		},
		onReachBottom(){
			if(this.status == 'noMore'){
				return
			}
			this.goodsList();
		},
		onPullDownRefresh(){
			this.page = 0;
			this.goodsList();
		},
		onLoad(row) {
			uni.setNavigationBarTitle({
			　　title:row.title
			})
			this.searchType = row.searchType;
			this.init();
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		min-height: calc(100vh - 20rpx);
		background: #efefef;
		padding-top: 20rpx;
	}
	
	.no_data {
		flex-direction: column;
		position: absolute;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
	
		image {
			width: 115rpx;
			display: block;
			margin: 0 auto;
		}
	
		.tip {
			margin-top: 22rpx;
			text-align: center;
			line-height: 40rpx;
	
			.fz-14 {
				color: #999999;
			}
	
			.fz-12 {
				color: #CBCBCB;
			}
		}
	}
</style>
