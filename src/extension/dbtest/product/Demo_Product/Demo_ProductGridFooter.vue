<template>
  <div class="tabs">
    <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
      <el-tab-pane label="产品颜色" name="color">
        <product-color ref="color"></product-color>
      </el-tab-pane>
      <el-tab-pane label="产品尺寸" name="size">
        <product-size ref="size"></product-size>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProductColor from '@/views/dbtest/product/Demo_ProductColor';
import ProductSize from '@/views/dbtest/product/Demo_ProductSize';
export default {
  components: {
    'product-color': ProductColor,
    'product-size': ProductSize
  },
  data() {
    return {
      activeName: 'color'
    };
  },
  methods: {
    tabClick(params) {
      console.log('选项卡点击事件');
    },
    rowClick() {
      //主表(产品管理)点击行事件
     
      //操作步骤2：调用两张表明细表的查询方法
      
      //浮脉查询条件配置，见Demo_ProductColor.js、Demo_ProductSize.js文件
      this.$refs.color.$refs.grid.search();
      
      //加载尺寸明细表数据
      this.$refs.size.$refs.grid.search();
    }
  }
};
</script>
<style scoped>
.tabs {
  padding: 15px;
}
.tabs >>> .el-tabs {
  box-shadow: none;
}
.tabs >>> .el-tabs__content {
  padding: 0 !important;
  padding-bottom: 15px;
}
</style>
