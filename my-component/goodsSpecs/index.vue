<template>
	<!-- 商品购买选择规格 -->
	<view class="commodiy-bg" :class="{'active':isSpecs}" v-show="isSpecs">
		<view class="commodiy-mack" @click="isSpecsStatus"></view>
		<view class="commodiy-specs">
			<view class="commodiy-info">
				<image :src="goods.listUrl" class="info-img"></image>
				<view class="info-detail">
					<view class="info-title">{{specification.name}}</view>
					<view class="info-stock">库存{{(specification.stock==0 || specification.stock)? specification.stock||0:goods.stockNum ||0}}件</view>
					<view class="info-price">￥{{specification.priceSale}}</view>
				</view>
			</view>
			<view class="specs">
				<view class="specs-max">
					<view class="" v-for="(item,index) in commodityAttributeList">
						<view class="specs-title">{{item.attributeName}}:</view>
						<view class="specs-item">
							<view class="specs-item-list" @click="onSpecs(index,item.id)" v-for="(item,i) in item.commodityAttributeValueList"
							 :class="{'active':item.id === selectedSpecIds[index]}">{{item.value}}</view>
						</view>
					</view>
				</view>
				<view class="stepper">
					<view class="stepper-title">购买数量:</view>
					<stepper :number="buyNumber" @update="update"></stepper>
				</view>
			</view>
			<view class="commodiy-btn" :class="{'active':isSpecs}">
				<button type="default" class="btn-go" @click="onGoBtn">确认</button>
			</view>
		</view>
	</view>
	<!-- 商品购买选择规格 -->
</template>

<script>
	import stepper from '../stepper/index.vue'
	export default {
		data() {
			return {
				buyNumber:1,
				selectedSpecIds:[],
				specification:{},
				commodityAttributeList:[]
			}
		},
		props:['goods'],
		components: {
			stepper
		},
		computed:{
			isSpecs(){
				return this.$store.state.isSpecs;
			}
		},
		methods: {
			// 切换规格
			onSpecs(index, id) {
				let selectedSpecIds = this.selectedSpecIds;
				selectedSpecIds[index] = id;
				this.selectedSpecIds = [...selectedSpecIds]
				this.getinfo()
			},
			getinfo() {
				let [selectedSpecIds,commoditySpecList] = [this.selectedSpecIds,this.goods.commoditySpecList];
				if (selectedSpecIds.some(item => !item)) return false;
				for (let i = 0, len = commoditySpecList.length; i < len; i++) {
					if (commoditySpecList[i].value === selectedSpecIds.join('-')) {
						let specification = {
							name: '已选 ' + commoditySpecList[i].name,
							priceOriginal: commoditySpecList[i].priceOriginal,
							priceSale: commoditySpecList[i].priceSale,
							id: commoditySpecList[i].id,
							stock: commoditySpecList[i].stock,
						}
						this.specification = {...specification};
					}
				}
			},
			//获取数量
			update(e) {
				this.buyNumber = e.num;
			},
			//确认提交返回数据
			onGoBtn(){
				this.$emit('onGoBtn',{
					buyNumber:this.buyNumber,
					specification:this.specification
				})
			},
			//弹出框状态
			isSpecsStatus(){
				this.$store.commit('SETISSPECS',false);
			},
			//初始化选中的规格
			Init(arr,num){
				let goods = this.goods;
				this.selectedSpecIds = arr || Array.from(Array(goods.commodityAttributeList && goods.commodityAttributeList.length))
				this.specification = {
					name:goods.commodityName,
					priceSale:goods.priceSale,
					priceOriginal:goods.priceOriginal,
					stock: goods.stock,
				}
				this.buyNumber = num || 1;
				this.commodityAttributeList = goods.commodityAttributeList;
				this.getinfo()
			}
		},
		components: {},
	}
</script>

<style lang="scss" scoped>
	.commodiy-bg {
		position: fixed;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		&.active {
			.commodiy-mack {
				display: block;
			}
	
			.commodiy-specs {
				bottom: 0;
			}
		}
	
		.commodiy-mack {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, .5);
			display: none;
		}
	
		.commodiy-specs {
			position: absolute;
			width: 100%;
			background: #fff;
			bottom: -900rpx;
			z-index: 99;
			padding: 35rpx;
			transition: 1s;
			border-radius: 10rpx 10rpx 0 0;
			box-sizing: border-box;
	
			.commodiy-info {
				display: flex;
				align-items: center;
	
				.info-img {
					width: 180rpx;
					height: 160rpx;
				}
	
				.info-detail {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					margin-left: 35rpx;
					height: 160rpx;
	
					.info-title {
						font-size: 30rpx;
						color: #282828;
					}
	
					.info-price {
						color: #ff9f12;
					}
				}
			}
	
			.specs {
				display: flex;
				flex-direction: column;
				margin-top: 40rpx;
				
				&-max{
					max-height: 500rpx;
					overflow-y: auto;
				}
	
				&-title {
					font-size: 26rpx;
					color: #aaa;
					margin-bottom: 35rpx;
				}
	
				&-item {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					max-height: 500rpx;
					overflow-y: auto;
	
					&-list {
						width: 180rpx;
						margin-right: 40rpx;
						height: 56rpx;
						border-radius: 50rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #f7f7f7;
						color: #282828;
						border: 1px solid #f7f7f7;
						box-sizing: border-box;
						margin-bottom: 20rpx;
						font-size: 28rpx;
						line-height: 1;
	
						&.active {
							color: #ff9d12;
							border: 1px solid #ff9d12;
						}
					}
				}
			}
	
			.stepper {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 40rpx 0;
	
				&-title {
					font-size: 26rpx;
					color: #aaa;
				}
			}
		}
	
		.commodiy-btn {
			height: 100rpx;
			width: 100%;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: none;
			.btn-go {
				height: 75rpx;
				background: #ff9d12;
				border-radius: 52rpx;
				flex: 1;
				margin: 0 20rpx;
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #fff;
				justify-content: center;
				width: 500rpx;
			}
		}
	}

</style>
