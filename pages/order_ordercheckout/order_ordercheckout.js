const app = getApp()

Page({

  data: {
    hiddenLoading: false,
    viewshow: true,
  },

  onLoad: function (options) {
    var orderid = options.orderid;
    this._loadData(orderid);
  },

  //获取订单信息
  _loadData: function (orderid) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id;
    // var user_id = 17;
    app.server.getJSON('/Cart/orderInfo/user_id/' + user_id + "/order_id/" + orderid, function (res) {
      var loadData = res.data.result
      if (res.data.status == '-1') {
        wx.showToast({
          title: res.data.msg,
          image: '/images/error.png',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({})
        }, 500);
        return false;
      }
      that.setData({
        loadData: res.data.result,
        hiddenLoading: true,
        viewshow: false,
      })
    });
  },

  // ！ 点击微信支付
  clickWechatPay: function () {
    var loadData = this.data.loadData;
    var wxdata = loadData.data.wdata;
    var timeStamp = wxdata.timeStamp + "";
    var nonceStr = wxdata.nonceStr + "";
    var package1 = wxdata.package
    var sign = wxdata.sign;

    var loadData = this.data.loadData;
    var orderid = loadData.order.id;
    var teamid = loadData.order.teamid

    wx.requestPayment({
      'nonceStr': nonceStr,
      'package': package1,
      'signType': 'MD5',
      'timeStamp': timeStamp,
      'paySign': sign,
      'success': function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });

        setTimeout(function () {
          if (teamid == '' || teamid == '0') {
            wx.redirectTo({
              url: '/pages/member/myGroup/myGroup'
            })
          } else {
            wx.redirectTo({
              url: '/pages/group_order_detail/group_order_detail?order_id=' + orderid + '&id=' + teamid,
            })
          }

        }, 200)
      },
      'fail': function (res) {
        console.log('支付失败');
      }
    });
  },

  // ！ 点击余额支付
  clickBalancePay: function () {
    var loadData = this.data.loadData;
    if (loadData.user_money < loadData.money) {
      wx.showToast({
        title: '余额不足',
        image: '/images/error.png',
        duration: 2000
      });
      return false;
    }
    this.pay(1);
  },

  pay: function (type) {
    var that = this;
    var user_id = getApp().globalData.userInfo.user_id;
    // var user_id = 17;
    var loadData = this.data.loadData;
    var orderid = loadData.order.id;
    //1.余额 2.微信支付
    app.server.getJSON('/Group/pay/user_id/' + user_id + "/order_id/" + orderid + '/type/' + type, function (res) {
      if (res.data.status == '-1') {
        wx.showToast({
          title: res.data.msg,
          image: '/images/error.png',
          duration: 2000
        });
        return false;
      }
      wx.showToast({
        title: res.data.msg,
        icon: 'success',
        duration: 1000
      });
      setTimeout(function () {
        if (res.data.result == '0' || res.data.result == '') {
          wx.redirectTo({
            url: '/pages/member/myGroup/myGroup'
          })
        } else {
          wx.redirectTo({
            url: '/pages/group_order_detail/group_order_detail?order_id=' + orderid + '&id=' + res.data.result,
          })
        }

      }, 200)
    });
  },

});