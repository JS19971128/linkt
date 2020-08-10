<template>
	<view class="bg">
		<view class="class-choice">
			<view class="class-choice-list" :class="{'active':cIndex===index}" v-for="(item,index) in classt" :key="index" @click="classCheck(index)">
				{{item.label}}
			</view>
		</view>
		<view class="class-con">
			<view class="children" v-for="(item,index) in children" :key="index">
				<view class="children-title">{{item.label}}</view>
				<view class="children-item">
					<view class="children-item-list" v-for="(items,indexs) in item.children" :key="indexs" @click="clissClick(items)">
						<image :src="items.imageUrl" class="children-item-list-img"></image>
						<text class="children-item-list-txt">{{items.label}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classt:[],
				children:[],
				cIndex:0
			}
		},
		methods: {
			classCheck(index){
				this.cIndex = index;
				this.initChildren();
			},
			//初始化分类
			initChildren(){
				this.children = this.classt[this.cIndex].children || [];
				console.log(this.children)
			},
			init(){
				this.classFun();
			},
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
					this.initChildren();
				}catch(e){
					console.error(e)
					uni.showToast({
					    title: '拉取分类失败！！',
					    duration: 2000
					});
				}
			},
			clissClick(res){
				uni.navigateTo({
					url:`/shoppingPages/goodsList/index?cateId=${res.value}`
				})
			}
		},
		mounted() {
			this.init();
			
		},
		onLoad() {

		}

	}
</script>

<style lang="scss" scoped>
	.bg{
		background: #efeff1;
		width: 100%;
		min-height: 100vh;
		position: relative;
	}
	.class-choice{
		height: 100%;
		position: absolute;
		left: 0;
		width: 140rpx;
		background: #fff;
		overflow-y: auto;
		&-list{
			font-size:28rpx;
			color:#333;
			text-align: center;
			line-height: 80rpx;
			width: 100%;
			height: 80rpx;
			box-sizing: border-box;
			border-left: 4rpx solid #fff;
			overflow:hidden;
			white-space:nowrap; 
			text-overflow:ellipsis;
			padding: 0 10rpx;
			&.active{
				background:rgba(255,157,18,.15);
				border-color:#FF9D12;
			}
		}
	}
	.class-con{
		height: 100%;
		position: absolute;
		left: 140rpx;
		width: calc(750rpx - 140rpx);
		overflow-y: auto;
		padding:0 20rpx;
		box-sizing: border-box;
		padding-top: 20rpx;
		.children{
			margin-bottom: 20rpx;
			&-title{
				font-size:26rpx;
				font-weight:bold;
				color:#333;
				margin-bottom: 20rpx;
			}
			&-item{
				display: flex;
				flex-wrap: wrap;
				background: #fff;
				width: 100%;
				padding: 39rpx 47rpx 30rpx;
				border-radius: 8rpx;
				box-sizing: border-box;
				&-list{
					display: flex;
					flex-direction: column;
					margin-right: 83rpx;
					margin-bottom: 49rpx;
					width: 104rpx;
					align-items: center;
					justify-content: center;
					line-height: 1.1;
					text-align: center;
					&:nth-child(3n){
						margin-right: 0;
					}
					&-img{
						width: 70rpx;
						height: 82rpx;
						margin-bottom: 24rpx;
					}
					&-txt{
						font-size:26rpx;
						color:#333;
						overflow:hidden;
						white-space:nowrap; 
						text-overflow:ellipsis;
						width: 100%;
					}
				}
			}
		}
	}
</style>
