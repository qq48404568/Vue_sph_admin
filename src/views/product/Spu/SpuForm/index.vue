<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-09 17:38:21
 * @LastEditTime: 2022-01-14 16:45:12
 * @LastEditors: RyangXie
 * @Reference: 
-->
<template>
  <div>
    <el-form label-width="80px"
             :model="spu">
      <el-form-item label="spu名称">
        <el-input placeholder="spu名称"
                  v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"
                   v-model="spu.tmId">
          <el-option :label="tm.tmName"
                     :value="tm.id"
                     v-for="(tm,index) in tradeMarkList"
                     :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input type="textarea"
                  rows="4"
                  placeholder="描述"
                  v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="spu图片">
        <el-upload action="/dev-api/admin/product/fileUpload"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :on-success="handlerSuccess"
                   :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`"
                   value=""
                   v-model="attrIdAndAttrName">
          <el-option :label="unselect.name"
                     :value="`${unselect.id}:${unselect.name}`"
                     v-for="(unselect,index) in unSelectSaleAttr"
                     :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled="!attrIdAndAttrName"
                   @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table border
                  :data="spu.spuSaleAttrList">
          <el-table-column label="序号"
                           width="80"
                           align="center"
                           type="index"></el-table-column>
          <el-table-column label="属性名"
                           prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表"
                           prop="">
            <template slot-scope="{row,$index}">
              <el-tag :key="tag.id"
                      v-for="(tag,index) in row.spuSaleAttrValueList"
                      closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           prop="">
            <template slot-scope="{row,$index}">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="mini"
                         @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌的信息
      tradeMarkList: [],
      // 存储spu图片
      spuImageList: [],
      // 销售属性
      saleAttrList: [],
      // 收集未选择的销售属性的id----
      attrIdAndAttrName: ''
    }
  },
  methods: {
    // 照片墙删除图片
    handleRemove (file, fileList) {
      // file参数：代表的是删除的那个图片
      // fileList：照片墙删除某一张图片以后，剩余的其他图片
      console.log(file, fileList);
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      // 显示对话框
      this.dialogVisible = true;
    },
    // 初始化spuform数据
    async initSpuData (spu) {
      // 获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpU(spu.id)
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      console.log(spuImageResult);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 照片墙图片上传成功
    handlerSuccess (response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList
    },
    //添加新的销售属性
    addSaleAttr () {
      //已经收集需要添加的销售属性的信息
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
    // 添加按钮
    addSaleAttrValue (row) {
      // 点击销售属性值当中添加按钮的时候，需要有button变为input
      // 挂载在销售属性身上的响应式数据inputVisible控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集新增销售属性值
      this.$set(row, 'inputValue', '')
    },
    //el-input失去焦点事件
    handleInputConfirm (row) {
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性值不能为空
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空')
        return
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      console.log(result);
      if (!result) return
      // 新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 保存按钮
    async addOrUpdateSpu () {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        // 提示
        this.$message.success('保存成功')
        // 通知父组件
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加spu按钮发请求
    async addSpuData (category3Id) {
      // 收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮
    cancle () {
      this.$emit('changeScene', { scene: 0, flag: '' })
      console.log(this.$options.data());
      // 清除数据
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr () {
      let result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>