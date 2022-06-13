/*
 * @Description: 
 * @Author: RyangXie
 * @Date: 2022-01-21 22:54:39
 * @LastEditTime: 2022-01-22 16:57:27
 * @LastEditors: RyangXie
 * @Reference: 
 */
const data = require('./data.json');
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data
      }
    }
  }
]
