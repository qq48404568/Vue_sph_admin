/*
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-22 16:10:22
 * @LastEditTime: 2022-01-22 16:56:46
 * @LastEditors: RyangXie
 * @Reference: 
 */
import mockRequest from '@/utils/mockRequest'
const state = {
  list: {}
};
const mutations = {
  GETDATA (state, list) {
    state.list = list;
  }
};
const actions = {
  //发请求获取首页的mock数据
  async getData ({ commit }) {
    let result = await mockRequest.get('/home/list');
    if (result.code == 20000) {
      commit("GETDATA", result.data);
    }
  }
};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters
}