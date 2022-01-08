<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-03 21:03:12
 * @LastEditTime: 2022-01-08 11:05:03
 * @LastEditors: RyangXie
 * @Reference: 
-->

<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId"
                      :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!category3Id"
                   @click="addAttr">添加属性</el-button>
        <el-table :data="attrList"
                  border>
          <el-table-column label="序号"
                           type="index"
                           width="80"
                           align="center"></el-table-column>
          <el-table-column label="属性名称"
                           width="150"
                           prop="attrName">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{row}">
              <el-tag type="success"
                      v-for="(attrValue,index) in row.attrValueList"
                      :key="attrValue.id"
                      style="margin:0 20px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="150">
            <template slot-scope="{row}">
              <el-button type="warning"
                         icon="el-icon-edit"
                         size="mini"
                         @click="updateAttr(row)"></el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form label-width="80px"
                 :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"
                      v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   icon="el-icon-plus"
                   @click="addAttrValue"
                   :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border
                  :data="attrInfo.attrValueList"
                  style="margin:20px 0">
          <el-table-column label="序列号"
                           type="index"
                           align="center"
                           width="80"></el-table-column>
          <el-table-column label="属性值名称"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName"
                        placeholder="请输入属性值名称"
                        size="mini"
                        v-if="row.flag"
                        @blur="toLook(row)"
                        @keyup.native.enter="toLook(row)"
                        :ref="$index"></el-input>
              <span v-else
                    @click="toEdit(row,$index)"
                    style="display:block;">{{row.valueName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}`"
                             @onConfirm="deleteAttrValue($index)">
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary"
                   @click="addOrUpdateAttr"
                   :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入loadsh当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data () {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    }
  },
  methods: {
    // 自定义事件的回调
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
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    async getAttrList () {
      // 获取分类的ID
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      console.log(result);
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值的回调
    addAttrValue () {
      // 向属性值的数组里面添加元素
      // attrId：是属性id
      // valueName属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮
    addAttr () {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      }
    },
    // 修改某一个属性
    updateAttr (row) {
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row)
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item => {
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点的事件--切换查看模式
    toLook (row) {
      // row：形参是当前用户添加的最新属性值
      if (row.valueName.trim() == '') {
        this.$message.info('请你输入一个正常属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepat) return
      row.flag = false
    },
    // 点击span的回调，变为编辑模式
    toEdit (row, index) {
      row.flag = true
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框的按钮的回调
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async addOrUpdateAttr () {
      // 整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤非空属性值
        if (item.valueName != '') {
          // 删除flag属性
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message.success('保存成功')
        this.getAttrList()
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  },
}
</script>

<style>
</style>