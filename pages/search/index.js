// pages/search/index.js
// 导入requestUtil
import {
  getBaseUrl,
  getWxLogin,
  requestPay,
  getUserProfile,
  requestUtil
} from "../../utils/requestUtil.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFocus: false, // 取消 按钮 是否显示
    inputValue: "",// 输入框的值
    productList:[]
  },
  TimeoutId: 1,
  // 取消按钮
  handleCancel(){
    this.setData({
      inputValue: "",
      productList:[]
    })
  },
  // 输入框值改变事件
  handleInput(e) {
    const {
      value
    } = e.detail;
    console.log(value)
    if (!value.trim()) {
      this.setData({
        isFocus: false,
        productList:[]
      })
      return;
    }
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeoutId);
   this.TimeoutId =  setTimeout(() => {
      this.search(value);
    }, 1000);
    
  },

  /**
   * 请求后端 商品搜索
   */
  async search(q) {
    const result = await requestUtil({
      url: '/product/search',
      data: {
        q
      }
    });
    this.setData({
      productList: result.productList
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})