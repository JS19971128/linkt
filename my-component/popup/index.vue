<template>
	<view class="pop_wrap" v-if="popup">
		<view class="pop_content">
			<view class="close flex_center" @click="close">
				<image src="../../static/images/common/close.png" mode="widthFix"></image>
			</view>
			<view class="box">
				<view class="box-item flex_center">
					<view class="item-goods">
						<image :src="goods.listUrl" class="item-goods-img"></image>
						<view class="item-goods-detail">
							<view class="detail-title">{{goods.commodityName}}</view>
							<view class="detail-price"><text class="detail-price-f">￥</text>{{goods.priceSale}}</view>
						</view>
					</view>
					<view class="item-goods-specs">
						<view class="specs-list" v-for="(item,index) in goods.commoditySpecList" :key="item.id">
							<view class="specs-list-txt">
								<view class="specs-name txt_overflow_hidden">{{item.name}}</view>
								<view class="specs-stock">库存{{item.stock || 0}}</view>
							</view>
							<input type="number" class="specs-list-input" :value="item.stock" @blur="inputChange($event,index)"  placeholder="补充库存数" />
						</view>
					</view>
				</view>
				<view class="fz-14 btn flex_center" @click="addStock()">增加库存</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		computed:{
			popup(){
				return this.$store.state.goods.popup;
			}
		},
		props:{
			goods:{
				type:Object,
				default:()=>{}
			}
		},
		methods:{
			close(){
				this.$store.commit('SHOWPOPUP',false);
			},
			async addStock(){
				try{
					uni.showLoading({
						title:'加载中'
					})
					let add = await this.$fly.post(`/web/commodity/updateStock`,this.goods.commoditySpecList);
					uni.hideLoading();
					uni.showToast({
					    title: add.message,
					    duration: 2000
					});
					if(add.code!=0){
						return false;
					}
					this.$emit('addStock',add)
					this.close();
				}catch(e){
					uni.showToast({
					    title: '修改失败！！',
					    duration: 2000
					});
					console.error(e)
				}
				// this.$emit('addStock',)
				console.log(this.goods)
			},
			inputChange(e,index){
				let val = e.detail.value;
				let commoditySpecList = this.goods.commoditySpecList;
				this.$set(commoditySpecList[index],'stock',val);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pop_content{
		width: 590rpx;
		padding: 0 30rpx;
		border-radius: 8rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		.close{
			justify-content: flex-end;
			margin-top: 20rpx;
			image{
				width: 40rpx;
			}
		}
		.box{
			.box-item{
				padding: 20rpx;
				width: 100%;
				box-sizing: border-box;
				flex-direction: column;
				.item-goods{
					width: 100%;
					display: flex;
					align-items: center;
					border-bottom:1px solid #aaa ;
					padding-bottom: 20rpx;
					box-sizing: border-box;
					&-img{
						width: 140rpx;
						height: 140rpx;
						margin-right: 20rpx;
					}
					&-detail{
						display: flex;
						flex-direction: column;
						flex: 1;
						.detail-title{
							font-size: 28rpx;
							line-height: 38rpx;
							overflow : hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.detail-price{
							font-size: 38rpx;
							color: #FF9834;
							&-f{
								font-size: 18rpx;
							}
						}
					}
				}
				.item-goods-specs{
					display: flex;
					flex-direction: column;
					padding-top: 20rpx;
					width: 100%;
					.specs-list{
						margin-bottom: 20rpx;
						display: flex;
						align-items:center;
						justify-content: space-between;
						&-txt{
							font-size: 28rpx;
							color: #333;
							display: flex;
							align-items: center;
							flex: 1;
							.specs-name{
								width: 170rpx;
								margin-right: 10rpx;
							}
							.specs-stock{
								font-size: 26rpx;
							}
						}
						&-input{
							width: 200rpx;
							height: 40rpx;
							border-radius: 8rpx;
							color:#333;
							border:1px solid #AAAAAA;
							font-size: 26rpx;
							padding-left: 10rpx;
						}
					}
				}
			}
			.btn{
				width: 100%;
				height: 74rpx;
				background: #FF9D29;
				border-radius: 37rpx;
				color: #fff;
				margin: 50rpx 0;
			}
		}
	}
</style>
