<!--
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-09 17:38:14
 * @LastEditTime: 2022-01-17 15:45:57
 * @LastEditors: RyangXie
 * @Reference: 
-->

<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称"
                  v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)"
                  type="number"
                  v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"
                  v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea"
                  rows="4"
                  v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true"
                 label-width="80px">
          <el-form-item :label="attr.attrName"
                        v-for="(attr,index) in attrInfoList"
                        :key="attr.id">
            <el-select placeholder="请选择"
                       value=""
                       v-model="attr.attrIdAndValueId">
              <el-option :value="`${attr.id}:${attrValue.id}`"
                         :label="attrValue.valueName"
                         v-for="(attrValue,index) in attr.attrValueList"
                         :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true"
                 label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName"
                        v-for="(saleAttr,index) in spuSaleAttrList"
                        :key="saleAttr.id">
            <el-select placeholder="请选择"
                       value=""
                       v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName"
                         :value="`${saleAttr.id}:${saleAttrValue.id}`"
                         v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                         :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border
                  :data="spuImageList"
                  @selection-change="handleSelectionChange">
          <el-table-column label=""
                           type="selection"
                           width="80"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl"
                   style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column label="名称"
                           prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="primary"
                         v-if="row.isDefault==0"
                         @click="ChangeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary"
                   @click="save">添加</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data () {
    return {
      // 图片信息
      spuImageList: [],
      // 销售属性
      spuSaleAttrList: [],
      // 平台属性的数据
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],


      },
      spu: {},
      // 收集图片的数据
      imageList: []
    }
  },
  methods: {
    // 获取SkuForm数据
    async getData (category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code == 200) {
        let list = result.data
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }

      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }

      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      console.log(result2);
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    // table表格复选框按钮
    handleSelectionChange (params) {
      console.log(params);
      this.imageList = params
    },
    // 
    ChangeDefault (row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮
    cancel () {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    //保存按钮的事件
    async save () {
      //整理参数
      //整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      });
      //发请求
      let result = this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: 'success', message: '添加SKU成功' })
        this.$emit('changeScenes', 0);
      }
    }
  },
}
</script>

<style>
</style>