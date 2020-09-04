<template>
	<view class="bg">
		<goods-list :list="list"></goods-list>
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
					commodityStatus:'online'
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
		min-height: 100vh;
		background: #efefef;
		padding-top: 20rpx;
	}
</style>
