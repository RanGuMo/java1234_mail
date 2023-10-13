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
    // 轮播图数组
    swiperList: [],
    baseUrl: '',
    bigTypeList:[],
    bigTypeList_row1:[],
    bigTypeList_row2:[],
    hotProductList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送异步请求，获取后端数据
    // wx.request({
    //   url:'http://localhost:8080/product/findSwiper',
    //   method:'GET',
    //   success:(res)=>{
    //     console.log(res);
    //     this.setData({
    //       swiperList:res.data.message
    //     })
    //   }
    // })

    this.setData({
      baseUrl: getBaseUrl()
    })
    this.getSwiperList();
    this.getBigTypeList();
    this.gethotProductList();

  },
  async getSwiperList() {
    // requestUtil({url:'/product/findSwiper',method:'GET'})
    // .then((res)=>{
    //   console.log(res);
    //    this.setData({
    //      swiperList:res.message
    //    })
    // })
    let res = await requestUtil({
      url: '/product/findSwiper',
      method: 'GET'
    });
    this.setData({
      swiperList: res.message
    })
  },
  async getBigTypeList(){
    let res = await requestUtil({
      url: '/bigType/findAll',
      method: 'GET'
    });
    console.log(res);
    const bigTypeList = res.message;
    const bigTypeList_row1=res.message.filter((item,index)=>{
      return index<5;
    })
    const bigTypeList_row2=res.message.filter((item,index)=>{
      return index>=5;
    })
    this.setData({
      bigTypeList,
      bigTypeList_row1,
      bigTypeList_row2
    })
  },
  // 获取热卖商品8个
  async gethotProductList(){
    let res = await requestUtil({
      url: '/product/findHot',
      method: 'GET'
    });
    this.setData({
      hotProductList:res.message
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
// 大类点击事件，跳转 到商品分类页面
handleTypeJump(e){
   const {index} = e.currentTarget.dataset;
   console.log("首页的index为"+index);
   const app = getApp();
   app.globalData.index=index; //更改全局的index
   wx.switchTab({
     url: '/pages/category/index',
   })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})