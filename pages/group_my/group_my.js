const app = getApp()

var data = {//初始数据
  tab: 'waitpay',
};

Page({
  data: data,
  onLoad: function (options) {
    var tab = this.data.tab
    //查询待付款
    if (tab == 'waitpay') {
      this.noPay();
    } else {
      this._loadData();
    }
  },
  _loadData: function () {//获取拼团信息
    var user_id = getApp().globalData.userInfo.user_id
    var that = this;
    var tab = this.data.tab
    app.server.getJSON('/Group/myGroup/user_id/' + user_id + '/success/' + tab, function (res) {
      that.setData({
        loadData: res.data.result
      });
    });
  },
  clickTab: function (e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      tab: tab,
    });
    //查询待付款
    if (tab == 'waitpay') {
      this.noPay();
    } else {
      this._loadData();
    }
  },
  clickDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var order_id = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/group_order_detail/group_order_detail?order_id=' + order_id + '&id=' + id,
    });
  },
  noPay: function () {
    var user_id = getApp().globalData.userInfo.user_id
    var that = this;
    var tab = this.data.tab

    app.server.getJSON('/Group/noPay/user_id/' + user_id, function (res) {
      that.setData({
        loadData: res.data.result
      });
    });
  },
  clickPay: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order_ordercheckout/order_ordercheckout?orderid=' + id,
    })
  },
  //确认收货
  sendok: function (e) {
    var that = this;
    var data = {};
    var user_id = getApp().globalData.userInfo.user_id
    var order = e.currentTarget.dataset.order;
    data.id = order;
    data.user_id = user_id
    wx.showModal({
      title: '是确认收款？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) { // 用户点击确认
          app.server.postJSON('/Group/sendok', { data: data }, function (res) {
            if (res.data.status == '200') {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
              that.setData({
                tab: 2
              })
              that._loadData();
            } else {
              wx.showToast({
                title: res.data.msg,
                image: '/images/error.png',
                duration: 2000
              })
            }
          });
        }
      },
    });
  }


});