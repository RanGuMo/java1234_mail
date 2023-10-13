// 导入request请求工具类
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
    baseUrl: '',
    cart: [],
    address: {},
    totalPrice: 0,
    totalNum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
  },
  //去付款按钮
  async handleOrderPay() {
    // wx.login({
    //   success: (res) => {
    //     console.log(res.code)
    //   },
    // });

    // wx.getUserProfile({
    //   desc: '获取用户信息',
    //   success:(res)=>{
    //     console.log(res);
    //   }
    // });
    // 1.同时调用  getWxLogin() 和getUserProfile() 会报错{"errMsg":"getUserProfile:fail can only be invoked by user TAP gesture."}
    // let res = await getWxLogin();
    // console.log(res.code);
    // let res2 = await getUserProfile();
    // console.log(res2);
    // 2. 使用Promise.all 解决
    // 先获取用户是否登录
    const token = wx.getStorageSync('token');
    if (!token) {
      Promise.all([getWxLogin(), getUserProfile()]).then(res => {
        console.log(res[0].code);
        console.log(res[1].userInfo.nickName, res[1].userInfo.avatarUrl);
        let loginParam = {
          code: res[0].code,
          nickName: res[1].userInfo.nickName,
          avatarUrl: res[1].userInfo.avatarUrl
        }
        this.wxlogin(loginParam);
      })
    } else {
      console.log("token存在" + token);
      console.log("支付继续走，创建订单");
      this.createOrder();
    }

  },
  async wxlogin(loginParam) {
    const result = await requestUtil({
      url: "/user/wxlogin",
      data: loginParam,
      method: "post"
    });
    console.log(result);
    const token = result.token;
    if (result.code === 0) {
      // 存储token 到本地缓存中
      wx.setStorageSync('token', token);
      // 支付继续走，创建订单
      console.log("支付继续走，创建订单");
      this.createOrder();
    }
  },

  // 创建 订单
  async createOrder() {
   try {
    const {
      totalPrice,
      address,
      cart
    } = this.data;
    // 请求体，收货地址
    let address2 = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    // 请求体 收货人
    const consignee = address.userName;
    // 请求体 联系电话
    const telNumber = address.telNumber;
    let goods = [];
    let cart2 = cart.filter(v => v.checked);
    cart2.forEach(v => goods.push({
      goodsId: v.id,
      goodsNumber: v.num,
      goodsPrice: v.price,
      goodsName: v.name,
      goodsPic: v.proPic
    }))
    const orderParam = {
      totalPrice,
      address: address2,
      consignee,
      telNumber,
      goods,
    };
    const res = await requestUtil({
      url: "/my/order/create",
      method: "POST",
      data: orderParam
    });
    console.log(res.orderNo); //获取返回的订单号
    let orderNo = res.orderNo;
    // 调用统一下单，预支付
    const preparePayRes = await requestUtil({
      url: "/my/order/preparePay",
      method: "POST",
      data: orderNo
    });
    // 发起支付
    let payRes = await requestPay(preparePayRes);

    // 删除缓存中的 已经支付的商品
    let newCart = wx.getStorageSync('cart');
    newCart = newCart.filter(v => !v.checked);
    wx.setStorageSync('cart', newCart);
    wx.showToast({
      title: '支付成功',
      icon: 'none'
    })
    wx.navigateTo({
      url: '/pages/order/index?type=0'
    })
   } catch (error) {
     console.log(error);
     wx.showToast({
       title: '支付失败，请稍后重试',
     })
   }


  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    // 选中的商品显示
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      address,
      totalNum,
      totalPrice
    })
  },
})