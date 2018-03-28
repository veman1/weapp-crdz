const app = getApp()
var timeout = null
var exit;
Page({
  data: {
    amount: 0,
    carts: [],
    addressList: [],
    addressIndex: 0,
    height: 0
  },
  addressObjects: [],
  doHandler: function () {
    if (app.globalData.login)
      wx.switchTab({
        url: '/pages/me/me'
      });
  },
  onShow: function () {
    if (exit) {
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
    //else exit = false;
  },
  onLoad: function (options) {
    //this.readCarts(options);
    //this.loadAddress();
    exit = false;
    var that = this
    var app = getApp();
    var cartIds = options.cartIds;
    var amount = options.amount;

    app.globalData.cartIds = cartIds;
    app.globalData.amount = amount;
    this.setData({ cartIds: cartIds, amount: amount });

    timeout = setTimeout(function doHandler() {
      if (!app.globalData.login) {
        exit = true;
        wx.switchTab({
          url: '/pages/me/me'
        });
      }
      else {
        var user_id = app.globalData.userInfo.user_id
        app.server.getJSON('/User/getAddressList/user_id/' + user_id, function (res) {
          var data = res.data
          exit = true;
          if (data.msg == "没有数据") {
            wx.redirectTo({
              url: '/pages/address_add/address_add?returnTo=1'
            });
          }
          else
          {
            wx.redirectTo({
              url: '/pages/order_submit/order_submit'
            });
          }
        });

      }
    }, 1000);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight })
      }
    })
  },
  readCarts: function (options) {
    // from carts
    // amount
    var amount = parseInt(options.amount);
    this.setData({
      amount: amount
    });

    // cartIds str
    var cartIds = options.cartIds;
    var cartIdArray = cartIds.split(',');
    // restore carts object
    var carts = [];
    for (var i = 0; i < cartIdArray.length; i++) {
      var query = new AV.Query('Cart');
      query.include('goods');
      query.get(cartIdArray[i]).then(function (cart) {
        carts.push(cart);
      }, function (error) {

      });
    }
    this.setData({
      carts: carts
    });
  },
})