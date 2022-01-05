/*
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-03 22:46:51
 * @LastEditTime: 2022-01-05 11:10:32
 * @LastEditors: RyangXie
 * @Reference: 
 */

// 平台属性管理模块
import request from '@/utils/request'

// 获取一级分类数据
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })

// 获取二级分类数据
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 获取三级分类数据
export const reqCategory3List = (category2Id) => request({url: `/admin/product/getCategory3/${category2Id}`, method: 'get'})