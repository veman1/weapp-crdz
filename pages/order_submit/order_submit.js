const app = getApp()
var tp;
var pay_points;
var points_rate;
Page({
  data: {
    use_money: 0,
    use_point: 0,
    check: ['true', ''],
    "coupon": [], cv: '请选择优惠劵', cpos: -1, "couponCode": '',
    backmoeny: 0,
    kuaidi: '默认',
    shipping_arr: [],
    postShipping: [],
    showView: true,
    sindex: [],
    shippingdata: [],
    postFee: 0, //邮费
  },
  onShow: function () {
    var app = getApp();
    var cartIds = app.globalData.cartIds;
    var amount = app.globalData.amount;
    this.setData({ cartIds: cartIds || '', amount: amount || '' });
    this.getCarts(cartIds);
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    this.getCarts()
  },
  addressSelect: function () {
    wx.navigateTo({
      url: '/pages/address_select/address_select'
    });
  },
  bindChange: function (e) {
    var use_money = e.detail.value;

    this.setData({
      use_money: use_money,
    });
  },
  bindChangeOfcoupon: function (e) {
    var couponCode = e.detail.value;

    this.setData({
      couponCode: couponCode,
    });
  },
  bindChangeOfPoint: function (e) {
    var use_point = e.detail.value;
    this.setData({
      use_point: use_point,
    });
  },
  bindPickerChange: function (e) {
    var value = e.detail.value;
    var cv = this.data.coupon[value];

    this.setData({ cv: cv, cpos: value });
    console.info(this.data.coupon)
    this.useCoupon();
  },
  useCoupon: function () {
    if (this.data.cpos == -1)
      return;
    var money = this.data.couponList[this.data.cpos].money;
    var totalObj = this.data.totalPrice;

    totalObj.total_fee = totalObj.total_fee - money + parseInt(this.data.backmoeny)

    if (totalObj.total_fee < 0)
      totalObj.total_fee = 0;
    this.setData({
      totalPrice: totalObj,
      backmoeny: money
    });
  },
  use: function () {
    //totalPrice:
    var user_money = getApp().globalData.userInfo.user_money;
    var use_money = this.data.use_money;
    user_money = parseFloat(user_money)
    use_money = parseFloat(use_money)
    if (user_money < use_money) {
      var totalObj = this.data.totalPrice;

      var use_point = this.data.use_point;
      var use_point = parseInt(use_point)
      use_point = use_point - use_point % parseInt(points_rate);
      var m = tp - use_point / parseInt(points_rate)
      totalObj.total_fee = m
      totalObj.total_fee_initial = m
      this.setData({ totalPrice: totalObj });

      this.useCoupon();
      this.setData({ use_money: 0 });
      wx.showToast({
        title: '请输入小余当前余额',
        duration: 1000
      });
      return;
    }
    var use_point = this.data.use_point;
    var use_point = parseInt(use_point)
    use_point = use_point - use_point % parseInt(points_rate);
    var m = tp - use_point / parseInt(points_rate)

    var totalPrice = m - use_money;
    if (totalPrice < 0)
      totalPrice = 0;
    var totalObj = this.data.totalPrice;
    totalObj.total_fee = totalPrice
    totalObj.total_fee_initial = totalPrice
    this.setData({ totalPrice: totalObj });

    this.useCoupon();
  },
  use_point: function () {
    //totalPrice:
    var user_point = pay_points;
    var use_point = this.data.use_point;
    use_point = parseInt(use_point)
    use_point = use_point - use_point % parseInt(points_rate);
    if (parseInt(user_point) < use_point) {
      var totalObj = this.data.totalPrice;
      var m = tp - this.data.use_money
      totalObj.total_fee = m
      totalObj.total_fee_initial = m
      this.setData({ totalPrice: totalObj });

      this.setData({ use_point: 0 });
      this.useCoupon();
      wx.showToast({
        title: '请输入小余当前积分',
        duration: 1000
      });
      return;
    }
    var m = tp - this.data.use_money;
    var totalPrice = m - (use_point / parseInt(points_rate));
    if (totalPrice < 0)
      totalPrice = 0;
    var totalObj = this.data.totalPrice;
    totalObj.total_fee = totalPrice
    totalObj.total_fee_initial = totalPrice
    this.setData({ totalPrice: totalObj });
    this.useCoupon();
  },
  initData: function () {
    var app = getApp();
    pay_points = app.globalData.userInfo.pay_points;
    var user_money = app.globalData.userInfo.user_money;
    this.setData({ freemoney: user_money, pay_points: pay_points });
  },
  formSubmit: function (e) {
    // user 
    var address_id = this.data.address.address_id
    var user_id = getApp().globalData.userInfo.user_id
    var use_money = this.data.use_money
    var pay_points = this.data.use_point
    var that = this;
    var app = getApp();
    var couponTypeSelect = this.data.check[0] == "true" ? 1 : 2;
    var coupon_id = 0;
    var shippingdata = this.data.shippingdata;
    if (this.data.cpos != -1) {
      coupon_id = this.data.couponList[this.data.cpos].id;
    }
    var couponCode = this.data.couponCode;

    app.server.postJSON('/Cart/cart3/act/submit_order/user_id/' + user_id + "/address_id/" + address_id + "/user_money/" + use_money + "/pay_points/" + pay_points + "/couponTypeSelect/" + couponTypeSelect + "/coupon_id/" + coupon_id + "/couponCode/" + couponCode, { shipping: shippingdata }, function (res) {
      if (res.data.status != 1) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
        return;
      }

      var result = res.data.result

      app.globalData.wxdata = res.data.data
      app.globalData.order = res.data.order
      if (res.data.status == 1) {
        wx.showToast({
          title: '提交成功',
          duration: 2000
        });
        console.info('res.data.order.pay_status:' + res.data.order[0].pay_status);
        setTimeout(function () {
          if (res.data.order[0].pay_status == 1) {
            wx.switchTab({
              url: "../../member/index/index"
            });
            return;
          }

          wx.navigateTo({
            url: '../payment/payment?order_id=' + result
          });
        }, 2000);

      }

    });
  },

  getCarts: function (cartIds) {
    if (app.globalData.userInfo) {
      var user_id = app.globalData.userInfo.user_id
    } else return
    wx.showNavigationBarLoading()
    app.server.getJSON('/Cart/cart2/user_id/' + user_id, (res) => {
      wx.hideNavigationBarLoading()
      var user_data = app.globalData.userInfo;
      user_data.user_money = res.data.result.userInfo.user_money;
      user_data.pay_points = res.data.result.userInfo.pay_points;
      app.globalData.userInfo = user_data
      var address = res.data.result.addressList
      var cartList = res.data.result.cartList
      var userInfo = res.data.result.userInfo
      var totalPrice = res.data.result.totalPrice
      var shipping_arr = res.data.result.shipping_arr  // 配送地址
      var store_id_arr = res.data.result.store_id_arr  //商家id

      console.info(shipping_arr);
      tp = totalPrice.total_fee
      totalPrice.total_fee_initial = totalPrice.total_fee
      points_rate = res.data.result.points
      this.setData({ address: address, cartList: cartList, userInfo: userInfo, totalPrice: totalPrice });

      var couponList = res.data.result.couponList
      var ms = this.data.coupon
      console.info(couponList);
      console.info(shipping_arr);
      for (var i in couponList) {
        ms.push(couponList[i].name);
      }
      var temp = [];
      var tcode = [];
      for (var k in shipping_arr) {
        temp[k] = [];
        var temp_name = [];
        var temp_code = [];
        for (var j in shipping_arr[k]) {
          temp_name.push(shipping_arr[k][j].name);
          temp_code.push(shipping_arr[k][j].code)
        }
        temp[k] = temp_name;
        tcode[k] = temp_code;
      }
      console.info(temp);
      this.setData({ coupon: ms, couponList: couponList, shipping_arr: shipping_arr, temp: temp, tcode: tcode });
      this.initData();

      // 处理快递价格处理
      var sindex = this.data.sindex;
      var Shipping = this.data.postShipping;
      for (var h in store_id_arr) {
        sindex[store_id_arr[h]] = 0;
        if (this.data.tcode[store_id_arr[h]] == undefined) continue;
        Shipping[store_id_arr[h]] = this.data.tcode[store_id_arr[h]][0];
      }
      this.setData({
        sindex: sindex
      })
      var address_id = address.address_id
      var use_money = this.data.use_money
      var pay_points = this.data.use_point
      var couponTypeSelect = this.data.check[0] == "true" ? 1 : 2;
      var coupon_id = 0;
      var couponCode = this.data.couponCode;

      // 再次计算邮费
      app.server.postJSON('/Cart/cart3/user_id/' + user_id + "/address_id/" + address_id + "/user_money/" + use_money + "/pay_points/" + pay_points + "/couponTypeSelect/" + couponTypeSelect + "/coupon_id/" + coupon_id + "/couponCode/" + couponCode, { shipping: Shipping }, (res) => {
        this.data.totalPrice.total_fee = res.data.result.goodsFee //商品价格
        this.data.totalPrice.total_fee_initial = res.data.result.goodsFee //商品价格
        this.setData({
          postFee: res.data.result.postFee,
          shippingdata: Shipping
        })
      });

    })
  },

  // 计算邮费
  radioChange: function (e) {
    var address_id = this.data.address.address_id
    var user_id = getApp().globalData.userInfo.user_id
    var use_money = this.data.use_money
    var pay_points = this.data.use_point
    var app = getApp();
    var couponTypeSelect = this.data.check[0] == "true" ? 1 : 2;
    var coupon_id = 0;
    var shipping_code = e.detail.value;

    if (this.data.cpos != -1) {
      coupon_id = this.data.couponList[this.data.cpos].id;
    }
    var couponCode = this.data.couponCode;
    var Shipping = this.data.postShipping;
    Shipping[e.currentTarget.dataset.storeId] = this.data.tcode[e.currentTarget.dataset.storeId][e.detail.value];

    this.setData({
      postShipping: Shipping
    });
    console.info(Shipping);
    app.server.postJSON('/Cart/cart3/user_id/' + user_id + "/shipping_code/" + shipping_code + "/address_id/" + address_id + "/user_money/" + use_money + "/pay_points/" + pay_points + "/couponTypeSelect/" + couponTypeSelect + "/coupon_id/" + coupon_id + "/couponCode/" + couponCode, { shipping: Shipping }, (res) => {
      thal.data.totalPrice.total_fee = res.data.result.goodsFee //商品价格
      thal.data.totalPrice.total_fee_initial = res.data.result.goodsFee //商品价格
      res.data.result.payables //订单总额
      console.log(payables)
      thal.setData({
        postFee: res.data.result.postFee,
        shippingdata: Shipping
        //物流
      })
    });
    var sindex = this.data.sindex;
    sindex[e.currentTarget.dataset.storeId] = e.detail.value
    this.setData({
      sindex: sindex
    })
  },
  check1: function () {
    this.setData({ check: ['true', ''] });
  },
  check2: function () {
    this.setData({ check: ['', 'true'] });
  },
  onReady: function () {
    // 页面渲染完成
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})