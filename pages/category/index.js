// pages/category/index.js
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
    currentIndex:0,//当前选择左侧菜单的索引
    scrollTop:0,//设置竖向滚动条的位置
    leftMenuList: [], //左侧菜单数据
    rightContent: [], //右侧商品数据
  },
  // 所有商品类别数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      baseUrl: getBaseUrl()
    })
    this.getCates();
  },
  // 获取商品分类数据
  async getCates() {
    let res = await requestUtil({
      url: '/bigType/findCategories',
      method: 'GET'
    });
    this.Cates = res.message;
    let leftMenuList = this.Cates.map(v => v.name);
    let rightContent = this.Cates[0].smallTypeList;

    this.setData({
      leftMenuList,
      rightContent
    })
  },
    // 获取商品分类数据(从首页跳转过来的)
  async getCates2(index) {
    let res = await requestUtil({
      url: '/bigType/findCategories',
      method: 'GET'
    });
    this.Cates = res.message;
    let leftMenuList = this.Cates.map(v => v.name);
    let rightContent = this.Cates[index].smallTypeList;

    this.setData({
      leftMenuList,
      rightContent,
      currentIndex:index,
      scrollTop:0,
      baseUrl:getBaseUrl()
    })
  },

  // 左侧菜单点击切换事件
  handleMenuItemChange(e){
    // console.log(e);
    const {index} = e.currentTarget.dataset;
    console.log("index="+index);
    let rightContent = this.Cates[index].smallTypeList;
    this.setData({
      currentIndex:index,
      rightContent,
      // 每次点击都给竖向滚动条位置设置为0
      scrollTop:0
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
    const app = getApp();
    const {index}= app.globalData;//从全局中取出index
    console.log("从全局中取出index为："+index);
    if(index!=-1){ //说明是从首页跳转过来的
      this.getCates2(index);
      app.globalData.index=-1;//重置index
    }
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