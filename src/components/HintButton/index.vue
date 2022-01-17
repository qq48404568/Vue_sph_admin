<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-09 16:05:59
 * @LastEditTime: 2022-01-09 16:08:04
 * @LastEditors: RyangXie
 * @Reference: 
-->

<template>
  <a :title="title"
     style="margin:10px">
    <el-button v-bind="$attrs"
               v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
}
</script>

<style>
</style>