// pages/cart/index.js
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
    address: {},
    cart: [], //购物车的数据
    allChecked: false, // 全选
    totalPrice: 0, //总价
    totalNum: 0 //商品总数
  },
  handleChooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        console.log(res);
        wx.setStorageSync('address', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      baseUrl: getBaseUrl()
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
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address,
    })
    this.setCart(cart);
  },

  handleItemChange(e) {
     let {id} = e.currentTarget.dataset;
     console.log(id);
     let {cart} = this.data;
     let index = cart.findIndex(v=>v.id===id);
     console.log(index);
     cart[index].checked = !cart[index].checked;
     //重新计算
     this.setCart(cart);
  },
  //商品全选按钮点击事件
  handleItemAllChange(){
    // 获取data中的数据
    let {cart,allChecked} = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品修改状态
    cart.forEach(v=>v.checked = allChecked);
    // 修改后的值 填充回data以及缓存中
    this.setCart(cart);
  },
  // 商品数量的 加减 功能
  handleItemNumEdit(e){
    let {id,operation} = e.currentTarget.dataset;
    let {cart} = this.data;
    let index = cart.findIndex(v=>v.id===id);
   if(cart[index].num===1 && operation===-1){
       wx.showModal({
         title: '系统提示',
         content: '您是否要删除？',
         cancelColor:'#ff0000', //取消按钮为红色
         complete: (res) => {
           if (res.cancel) {
             
           }
           if (res.confirm) {
            cart.splice(index,1);
            this.setCart(cart);
           }
         }
       })
   }else{
    cart[index].num += operation;
    this.setCart(cart);
   }

  
  },

  // 设置购物车状态 同时 重新计算 底部工具栏数据： 全选 总价格 总数量 以及 重新设置缓存
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    // cart设置到缓存中
    wx.setStorageSync('cart', cart);
  },

  // 点击结算
  handlePay(){
    let {address,totalNum} = this.data;
    if(!address){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:'none'
      })
      return;
    }

    if(totalNum===0){
      wx.showToast({
        title: '您还没有选购商品',
        icon:'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
   


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