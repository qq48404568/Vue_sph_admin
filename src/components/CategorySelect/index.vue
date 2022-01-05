<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-05 10:49:43
 * @LastEditTime: 2022-01-05 10:59:12
 * @LastEditors: RyangXie
 * @Reference: 
-->

<template>
  <div>
    <el-form :inline="true"
             class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" value="">
          <el-option label="区域一"
                     value="shanghai"></el-option>
          <el-option label="区域二"
                     value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" value="">
          <el-option label="区域一"
                     value="shanghai"></el-option>
          <el-option label="区域二"
                     value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" value="">
          <el-option label="区域一"
                     value="shanghai"></el-option>
          <el-option label="区域二"
                     value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect'
}
</script>

<style>
</style>