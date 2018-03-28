const app = getApp()
var cPage = 0;
var ctype = "NO";
var types = ["NO", "WAITPAY", "WAITSEND", "WAITRECEIVE", "FINISH"];
Page({
  data: {
    tab: 0,
    orders: [],
  },
  onLoad: function (options) {
    var index = parseInt(options.item);
    if (index) {
      this.setData({
        tab: index
      });
      this.getOrderLists(types[index], 0);
    } else {
      this.getOrderLists(types[0], 0);
    }
  },
  tabClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var types = ["NO", "WAITPAY", "WAITSEND", "WAITRECEIVE", "FINISH"]
    var classs = ["text-normal", "text-normal", "text-normal", "text-normal", "text-normal", "text-normal"]
    classs[index] = "text-select"
    this.setData({ tabClasss: classs, tab: index })
    cPage = 0;
    ctype = types[index];
    console.info('index:' + index);
    console.info('table:' + this.data.table);
    console.info('cPage:' + cPage);
    this.data.orders = [];
    this.getOrderLists(types[index], cPage);
  },
  pay: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var app = getApp();
    app.globalData.order = order
    wx.navigateTo({
      url: '/pages/payment/payment?order_id=' + 1
    });
  },
  cancel: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    console.log('order:', order);
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var user_id = getApp().globalData.userInfo.user_id
          app.server.getJSON('/User/cancelOrder/user_id/' + user_id + "/order_id/" + order['order_id'], function (res) {
            wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
            cPage = 0;
            that.data.orders = [];
            that.getOrderLists(ctype, 0);
          });
        }
      }
    })
  },
  confirm: function (e) {
    var index = e.currentTarget.dataset.index;
    var order = this.data.orders[index];
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: true,
      content: '确定已收货吗？',
      success: function (res) {
        if (res.confirm) {
          var user_id = getApp().globalData.userInfo.user_id
          app.server.getJSON('/User/orderConfirm/user_id/' + user_id + "/order_id/" + order['order_id'], function (res) {
            wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
            cPage = 0;
            that.data.orders = [];
            that.getOrderLists(ctype, 0);
          });

        }
      }
    })
  },
  details: function (e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.orders[index];
    wx.navigateTo({
      url: '../details/index?order_id=' + goods['order_id']
    });
  },
  toGoodsDetail: function (e) {
    var order = e.currentTarget.dataset.order;
    var index = e.currentTarget.dataset.index;
    var goodsId = this.data.orders[order].goods_list[index].goods_id;
    wx.navigateTo({
      url: '/pages/goods_detail/goods_detail?goods_id=' + goodsId
    });
  },
  comment: function (e) {
    wx.navigateTo({
      url: '../../member/evaluate/evaluate'
    });
  },
  onReachBottom: function () {
    this.getOrderLists(ctype, ++cPage);
  },
  onPullDownRefresh: function () {
    cPage = 0;
    this.data.orders = [];
    this.getOrderLists(ctype, 0);
  },
  getOrderLists: function (ctype, page) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id
    app.server.getJSON('/User/getOrderList/user_id/' + user_id + "/type/" + ctype + "/page/" + page, function (res) {
      var datas = res.data.result;
      var ms = that.data.orders
      for (var i in datas) {
        ms.push(datas[i]);
      }
      wx.stopPullDownRefresh();
      that.setData({
        orders: ms
      });
    });
  },
  clickToReturn: function (e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../return/return?id=' + id,
    });
  },
});
