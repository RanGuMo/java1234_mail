// pages/product_detail/index.js
// 导入requestUtil
import {
  getBaseUrl,
  requestUtil
} from "../../utils/requestUtil.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: '',
    productObj: {},
    activeIndex: 0,
  },
  productInfo: {}, //存储加入购物车的商品

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      baseUrl: getBaseUrl()
    })
    this.getProductDetail(options.id);
  },
  // 加入购物车 的点击事件
  handleCardAdd() {
    this.setCartAdd();

    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      mask: true
    })
  },
  // 加入购物车
  setCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    console.log("cart=" + cart);
    let index = cart.findIndex(v => v.id === this.productInfo.id);
    if (index === -1) { //购物车里面不存在当前商品
      this.productInfo.num = 1;
      this.productInfo.checked = true;
      cart.push(this.productInfo);
    } else { //已经存在当前商品
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart); //把购物车添加到缓存中
  },
  // 立即购买商品
  handleBuy(){
    this.setCartAdd();
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },



  // 商品介绍和规格参数 直接的样式切换
  handleActive(e) {
    const {
      index
    } = e.currentTarget.dataset;
    console.log(index);
    this.setData({
      activeIndex: index
    })
  },


  // 根据id 获取商品详情
  async getProductDetail(id) {
    let res = await requestUtil({
      url: '/product/detail',
      data: {
        id: id
      },
      method: 'GET'
    });
    this.productInfo = res.message;
    this.setData({
      productObj: res.message
    })
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