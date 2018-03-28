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
    address: { address_id: 0 },
    hiddenLoading: false,
    viewshow: true,
  },
  addressSelect: function () {
    wx.navigateTo({
      url: '../../address/select/index'
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
    this.setData({ totalPrice: totalObj });
    this.useCoupon();
  },

  onLoad: function (optiond) {
    var app = getApp();
    var type = optiond.type;
    var goods_id = optiond.goods_id;
    var user_id = getApp().globalData.userInfo.user_id;
    var car_type = optiond.car_type ? optiond.car_type : 0;
    var teamid = optiond.teamid ? optiond.teamid : 0;
    var heads = optiond.heads ? optiond.heads : 0;

    this._loadData(goods_id);
    this.setData({
      teamid: teamid,
      car_type: car_type,
      type: type,
      heads: heads,
    });
  },

  _loadData: function (id) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id;

    // 商品信息
    app.server.getJSON('/group/goodsInfo/id/' + id + '/type/1', function (res) {
      var goods = res.data.result;
      goods.goods.dispatchprice = goods.goods.dispatchprice ? goods.goods.dispatchprice : 0;
      goods.goods.headsmoney = goods.goods.headsmoney ? goods.goods.headsmoney : 0;
      that.setData({
        goods: goods,
        goods_id: id,

      })
    });
  },

  onShow: function () {
    var user_id = getApp().globalData.userInfo.user_id;
    var that = this;
    var app = getApp();
    var cartIds = app.globalData.cartIds;
    var amount = app.globalData.amount;
    this.setData({ cartIds: cartIds, amount: amount });

    // 地址信息
    app.server.getJSON('/Group/address/user_id/' + user_id, function (res) {
      var address = res.data.result.addressList
      if (address != null) {
        var address_id = address.address_id
      }

      that.setData({
        address: address,
        hiddenLoading: true,
        viewshow: false,
      })
    })
    // 页面初始化 options为页面跳转所带来的参数

  },
  initData: function () {
    var app = getApp();
    pay_points = app.globalData.userInfo.pay_points;
    var user_money = app.globalData.userInfo.user_money;
    this.setData({ freemoney: user_money, pay_points: pay_points });
  },
  formSubmit: function (e) {
    var address_id = this.data.address.address_id ? this.data.address.address_id : 0;
    var teamid = this.data.teamid
    var heads = this.data.heads;
    var formId = e.detail.formId;


    if (address_id == 0) {
      wx.showToast({
        title: '请完善收件人信息',
        image: '/images/error.png',
        duration: 2000
      });
      return false;
    }
    var user_id = getApp().globalData.userInfo.user_id
    var goods_id = this.data.goods_id
    var type = this.data.type

    app.server.getJSON('/Group/submit_order/user_id/' + user_id + "/teamid/" + teamid + "/address_id/" + address_id + '/id/' + goods_id + '/type/' + type + '/heads/' + heads, function (res) {
      if (res.data.status != '200') {
        wx.showToast({
          title: res.data.msg,
          image: '/images/error.png',
          duration: 2000
        });
        return;
      }

      var result = res.data.result

      if (res.data.status == '200') {
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/order_ordercheckout/order_ordercheckout?orderid=' + result.orderid
          });
        }, 500);

      }

    });
    this.saveid(user_id, formId);
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
  },

  saveid: function (user_id, formid) {
    //保存表单id
    app.server.getJSON("/Redbag/savegroupid/user_id/" + user_id + '/formid/' + formid, function (res) {

    })
  },
})