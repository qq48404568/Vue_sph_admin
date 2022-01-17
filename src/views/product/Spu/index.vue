<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-03 21:02:33
 * @LastEditTime: 2022-01-16 23:01:23
 * @LastEditors: RyangXie
 * @Reference: 
-->

<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 三级联动 -->
      <CategorySelect @getCategoryId="getCategoryId"
                      :show="scene!=0" />
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!category3Id"
                   @click="addSpu">添加spu</el-button>
        <el-table border
                  :data="records">
          <el-table-column label="序号"
                           type="index"
                           align="center"
                           width="80"></el-table-column>
          <el-table-column label="spu名称"
                           prop="spuName"></el-table-column>
          <el-table-column label="spu描述"
                           prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <hint-button type="success"
                           icon="el-icon-plus"
                           size="mini"
                           title="添加sku"
                           @click="addSku(row)">
              </hint-button>
              <hint-button type="warning"
                           icon="el-icon-edit"
                           size="mini"
                           title="修改spu"
                           @click="updateSpu(row)">
              </hint-button>
              <hint-button type="info"
                           icon="el-icon-info"
                           size="mini"
                           title="查看当前spu全部sku列表"
                           @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？"
                             @onConfirm="deleteSpu(row)">
                <hint-button type="danger"
                             icon="el-icon-delete"
                             size="mini"
                             slot="reference"
                             title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :total="total"
                       style="text-align:center;"
                       :current-page="page"
                       :page-size="limit"
                       :page-sizes="[3,5,10]"
                       @current-change="getSpuList"
                       @size-change="handleSizeChange"
                       layout="prev, pager, next, jumper,->,sizes,total"></el-pagination>
      </div>
      <SpuForm v-show="scene==1"
               @changeScene="changeScene"
               ref="spu" />
      <SkuForm v-show="scene==2"
               ref="sku"
               @changeScenes=changeScenes />
    </el-card>
    <el-dialog :title="`${spu.spuName}的列表`"
               :visible.sync="dialogTableVisible"
               :before-close="close">
      <el-table :data="skuList"
                border
                v-loading="loading">
        <el-table-column prop="skuName"
                         label="名称"
                         width="150"></el-table-column>
        <el-table-column prop="price"
                         label="价格"
                         width="200"></el-table-column>
        <el-table-column prop="weight"
                         label="重置"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg"
                 style="width:100px;height:100px"
                 alt="">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm, SkuForm
  },
  data () {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      // spu列表数据
      records: [],
      // 总条数
      total: 0,
      // 展示spu列表数据  1添加spu|修改spu 2添加sku
      scene: 0,
      // 对话框显示隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件
    getCategoryId ({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取品牌属性
        this.getSpuList()
      }
    },
    // 获取spu数据
    async getSpuList (pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      console.log(result);
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当分页器展示条数变化
    handleSizeChange (limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮
    addSpu () {
      this.scene = 1
      // 通知子组件spuForm发请求---两个
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu (row) {
      this.scene = 1
      console.log();
      // 获取子组件spuform
      this.$refs.spu.initSpuData(row)
    },
    // supform自定义事件
    changeScene ({ scene, flag }) {
      // flag为了区别保存或添加按钮
      console.log(scene);
      // 切换结构
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }

    },
    // 删除spu按钮
    async deleteSpu (row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message.success('删除成功')
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮
    addSku (row) {
      this.scene = 2
      // 父组件调用子组件，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuform通知父组件修改场景
    changeScenes (scene) {
      this.scene = scene
    },
    // 查看sku按钮
    async handler (spu) {
      this.dialogTableVisible = true
      this.spu = spu
      let result = await this.$API.spu.reqSkuList(spu.id)
      console.log(result);
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框
    close (done) {
      this.loading = true
      this.skuList = []
      // 关闭对话框
      done()
    }
  },
}
</script>

<style>
</style>
