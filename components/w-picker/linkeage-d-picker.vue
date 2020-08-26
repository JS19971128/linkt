<template>
	<view class="w-picker-view">
		<picker-view class="d-picker-view" indicator-style="height: 50px" :value="multiIndex" @change="columnchange">
			<picker-view-column v-for="(group,gIndex) in multiArray" :key="gIndex">
				<view class="w-picker-item" v-for="(item,index) in group" :key="index">{{item}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				multiArray: [], // 三维数组数据
				multiIndex: [0, 0, 0], // 默认的下标
				step: 0, // 默认显示请选择
				currnetProvinceKey:'',
				currnetCityKey:'',
				addressName:'',
				provinceArr:[],
				provinceList:[],
				cityList:[],
				cityArr:[],
				storeList:[],
				storeArr:[],
				index:[]
			};
		},
		props:{
			itemHeight:{
				type:String,
				default:"34px"
			},
		},

		methods:{
			initData(){
				this.getProvince()
			},
			getProvince() { // 获取省
				this.$fly.get('/entry/getRegionCodeList',{level:'省'}).then((data) => {
					var provinceList = [...data] // 放在一个数组里面
					var provinceArr = data.map((item) => {
						return item.name
					}) // 获取数据里面的value值，就是只用数据的名称 
					this.multiArray = [provinceArr, [],[]];
					this.provinceList = provinceList;
					this.provinceArr = provinceArr;
					var defaultCode = this.provinceList[0].id // 使用第一项当作参数获取市级数据
					if (defaultCode) {
						this.currnetProvinceKey = defaultCode // 保存在当前的省级key
						this.getCity(defaultCode) // 获取市级数据
					}
				})
			},
			getCity(code) { // 获取市级数据
				this.currnetProvinceKey = code;
				this.$fly.get(`/entry/getRegionCodeList?pid=${code}`).then((data) => {
					var cityArr = data.map((item) => {
						return item.name
					})
					var cityList = [...data]
					this.multiArray = [this.provinceArr, cityArr, []];
					this.cityList = cityList;
					this.cityArr = cityArr;
					var defaultCode = this.cityList[0].id // 用第一个获取门店数据
					if (defaultCode) {
						this.currnetCityKey = defaultCode;// 存下当前选择的城市key
						this.getStore(defaultCode) // 获取门店数据
					}
				})
			},
			getStore(code) {
				this.currnetCityKey = code;// 更新当前选择的市级key
				this.$fly.get(`/entry/getRegionCodeList?pid=${code}`).then((data) => {
					var storeList = [...data]
					var storeArr = data.map((item) => {
						return item.name
					})
					
					this.multiArray = [this.provinceArr, this.cityArr, storeArr] // 重新赋值三级数组 此时的数组大概是这样 [['江苏省', '福建省'], ['徐州市'], ['徐州第一门店','徐州第二门店']]
					this.storeList = storeList; // 保存下门店原始数据
					this.storeArr = storeArr;// 保存下门店名称，可以不保存
				})
			},
			columnchange(e) { // 滚动选择器 触发的事件
				console.log(e,'滚动去')
				var column = e.detail.value // 当前改变的列
				var data = {
					multiIndex: JSON.parse(JSON.stringify(this.multiIndex)),
					multiArray: JSON.parse(JSON.stringify(this.multiArray))
				}
				console.log(column)
				data.multiIndex = column; // 第几列改变了就是对应multiIndex的第几个，更新它
				if(column[0]!=this.index[0]){
					var currentProvinceKey = this.provinceList[column[0]].id
					if (currentProvinceKey != this.currnetProvinceKey) { // 判断当前的key是不是真正的更新了
						this.getCity(currentProvinceKey) // 获取当前key下面的市级数据
					}
					data.multiIndex[1] = 0 // 将市默认选择第一个
					
				}else if(column[1]!=this.index[1]){
					var currentCitykey = this.cityList[column[1]].id
					if (currentCitykey != this.currnetCityKey) { // 同样判断
						this.getStore(currentCitykey) // 获取门店
					}
					data.multiIndex[2] = 0 // 门店默认为第一个
					
				}
				this.index = column;
				console.log(data.multiInde)
				this.multiIndex = data.multiIndex;
				this.multiArray = data.multiArray;
				this.$emit('change',{multiIndex:this.multiIndex,multiArray:this.multiArray,storeList:this.storeList})
				// 更新数据
			},
			pickchange(e) {
				this.step = 1;// 更新，用来选择用户选中的门店
				this.multiIndex = e.detail.value;// 更新下标字段
				let {multiArray,multiIndex} = this;
				this.addressName = multiArray[0][multiIndex[0]]+' '+multiArray[1][multiIndex[1]]+' '+multiArray[2][multiIndex[2]];
				console.log(this.addressName)
				this.submit()
			},
			
			submit() { // 保存的时候 获取当前选择门店的key 丢给后端开发即可
				var storeCode = this.storeList[this.multiIndex.length - 1].id
				this.$emit("regionCodeFun",{regionCode:storeCode,addressName:this.addressName})
			}
		}
	}
</script>

<style lang="scss">
	@import "./w-picker.css";	
</style>

