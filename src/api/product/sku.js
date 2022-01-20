/*
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-03 22:46:58
 * @LastEditTime: 2022-01-17 19:20:00
 * @LastEditors: RyangXie
 * @Reference: 
 */

//sku模块
import request from '@/utils/request';
//sku列表的接口
///admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

//上架
///admin/product/onSale/{skuId}
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });

//下架
///admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

//获取SKU详情的接口
///admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });
