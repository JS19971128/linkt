<template>
	<view class="all">
		<view class="title fz-16">{{title}}</view>
		<view class="date fz-12">{{date}}</view>
		<view class="content fz-14">
			<jyf-parser :html="html" ref="article"></jyf-parser>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				title:'',
				date:'',
				content:'',
			}
		},
		methods:{
			getAncm(id,banner){
				let url = 'article';
				if(!banner){
					url="notice"
				}
				this.$fly.get(`/${url}/${id}`)
				.then(res=>{
					if(res.code == 0){
						this.title = res.data.title;
						this.date = this.$util.formatTime(res.data.createDate);
						this.content = res.data.content;
						this.$refs.article.setContent(this.content);
					}
				})
			}
		},
		onLoad:function(query){
			this.getAncm(query.id,query.banner);
		},
		onReady:function(){
			// this.$refs.article.setContent(this.content);
		}
	}
</script>

<style lang="scss" scoped>
	.all{
		padding: 20rpx;
		.title{
			line-height: 40rpx;
			color: #333;
			font-weight: bold;
		}
		.date{
			color: #CCCCCC;
			line-height: 24rpx;
			margin-top: 20rpx;
		}
		.content{
			color: #999999;
			line-height: 40rpx;
			margin-top: 20rpx;
		}
	}
	
</style>
