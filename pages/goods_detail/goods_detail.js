const app = getApp()
var wxParse = require('../../utils/wxParse/wxParse.js')

app.Page({
  data: {
    popup_show: false,
    goods: {},
    avtive: [],
    goods_num: 1,
    collected: false,
  },
  onLoad(o) {
    var goods_id = o.goods_id;
    this.getGoodsById(goods_id);
  },
  getGoodsById(goodsId) {
    var that = this;
    app.server.getJSON('/Goods/goodsInfo/id/' + goodsId, function (res) {
      var goodsInfo = res.data.result;
      var active = goodsInfo.goods.active;
      var comment = goodsInfo.comment;
      var comment_sum = goodsInfo.comment_sum;
      that.setData({
        "comment_sum": comment_sum,
        'active': active,
        'comment': comment,
        'goods': goodsInfo
      });
      wxParse.wxParse('detail', 'html', goodsInfo.goods.goods_content, that, 5);
      that.checkPrice();
    });
  },
  propClick: function (e) {
    var pos = e.currentTarget.dataset.pos;
    var index = e.currentTarget.dataset.index;
    var goods = this.data.goods
    for (var i = 0; i < goods.goods.goods_spec_list[index].length; i++) {
      if (i == pos)
        goods.goods.goods_spec_list[index][pos].isClick = 1;
      else
        goods.goods.goods_spec_list[index][i].isClick = 0;
    }
    this.setData({ goods: goods });
    this.checkPrice();
  },
  addCollect: function (e) {
    var goods_id = e.currentTarget.dataset.id;
    var user_id = getApp().globalData.userInfo.user_id
    var ctype = 0;
    var that = this;
    app.server.getJSON('/Goods/collectGoods/user_id/' + user_id + "/goods_id/" + goods_id + "/type/" + ctype, function (res) {
      // 如果成功返回，就转换图标
      if (res.data.status == 1) {
        that.setData({ collected: true });
      }
      wx.showToast({ title: res.data.msg, icon: 'success', duration: 2000 })
    });
  },
  bindMinus: function (e) {
    var num = this.data.goods_num;
    if (num > 1) {
      num--;
    }
    this.setData({ goods_num: num });
  },
  bindManual: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var num = e.detail.value;
    this.setData({ goods_num: num });
  },
  bindPlus: function (e) {
    var num = this.data.goods_num;
    num++;
    this.setData({ goods_num: num });
  },
  checkPrice: function () {
    var goods = this.data.goods;
    var spec = ""
    var price = goods.goods.shop_price;
    this.setData({ 'price': price });
    if (!goods.goods.goods_spec_list) return false;
    for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
      for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
        if (goods.goods.goods_spec_list[i][j].isClick == 1) {
          if (spec == "")
            spec = goods.goods.goods_spec_list[i][j].item_id
          else
            spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
        }
      }
    }
    var specs = spec.split("_");
    for (var i = 0; i < specs.length; i++) {
      specs[i] = parseInt(specs[i])
    }
    specs.sort(function (a, b) { return a - b });
    spec = ""
    for (var i = 0; i < specs.length; i++) {
      if (spec == "")
        spec = specs[i]
      else
        spec = spec + "_" + specs[i]
    }
    var price = goods['spec_goods_price'][spec].price;
    if (goods.prom_type == 1) {
      var price = goods.active.price;
    }
    this.setData({ price: price });
  },
  buy: function () {
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid
    var goods_num = that.data.goods_num;
    if (app.globalData.login)
      var user_id = app.globalData.userInfo.user_id;
    wx.showToast({
      title: '请稍候',
      icon: 'loading',
      duration: 10000
    });
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      console.log('res:', res);
      if (res.data.status == 1) {
        app.server.getJSON('/Cart/updateAllSelect/open_id/' + session_id + "/selected/" + false, function (res) {
          app.server.getJSON('/Cart/cartList/session_id/' + session_id, { user_id: user_id }, function (res) {
            var carts = res.data;
            var id = carts[carts.length - 1].id;
            app.server.getJSON('/Cart/updateSelect/id/' + id + "/selected/1", function (res) {
              wx.hideToast();
              wx.switchTab({
                url: '/pages/cart/cart',
              });
            });
          });
        });
      }
      else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 2000
        });
    });
    return;
  },
  toTopTap: function () {
    wx.pageScrollTo({ scrollTop: 0 });
  },
  clickCommentImg: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
    });
  },
  clickCollect: function () {
    this.setData({ isCollect: !this.data.isCollect });
  },
  clickToCart: function () {
    wx.showModal({
      title: '是否跳到购物车？',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        }
      }
    })
  },
  clickBottomAddCart: function () {
    this.setData({ popup_show: true });
  },
  clickBottomBuy: function () {
    this.setData({ popup_show: true });
  },
  clickPopupAddCart: function () {
    this.setData({
      popup_show: false
    });
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var app = getApp()
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid
    var goods_num = that.data.goods_num;
    var user_id = "0"
    if (app.globalData.login)
      user_id = app.globalData.userInfo.user_id
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      if (res.data.status == 1)
        wx.showToast({
          title: '已加入购物车',
          duration: 1000
        });
      else
        wx.showToast({
          title: res.data.msg,
          image: '/images/public_error.png',
          duration: 1000
        });
    });
  },
  clickPopupBuy: function () {
    var goods = this.data.goods;
    var spec = ""
    if (goods.goods.goods_spec_list != null)
      for (var i = 0; i < goods.goods.goods_spec_list.length; i++) {
        for (var j = 0; j < goods.goods.goods_spec_list[i].length; j++) {
          if (goods.goods.goods_spec_list[i][j].isClick == 1) {
            if (spec == "")
              spec = goods.goods.goods_spec_list[i][j].item_id
            else
              spec = spec + "_" + goods.goods.goods_spec_list[i][j].item_id
          }
        }
      }
    var app = getApp()
    var that = this;
    var goods_id = that.data.goods.goods.goods_id;
    var goods_spec = spec;
    var session_id = app.globalData.openid
    var goods_num = that.data.goods_num;
    var user_id = "0"
    if (app.globalData.login)
      user_id = app.globalData.userInfo.user_id
    app.server.getJSON('/Cart/addCart', {
      goods_id: goods_id, goods_spec: goods_spec, session_id: session_id, goods_num: goods_num,
      user_id: user_id
    }, function (res) {
      if (res.data.status == 1) {
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../../cart/cart'
        });
      }
      else
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 2000
        });
    });
    return;
    this.setData({
      popup_show: false
    });
  },
  clickMask: function () {
    this.setData({ popup_show: false });
  },
  clickSelectedBar: function () {
    this.setData({ popup_show: true });
  },
  clickPopupClose: function () {
    this.setData({ popup_show: false });
  },
  clickMoreComments: function () {
    var goods_id = this.data.goods.goods.goods_id;
    wx.navigateTo({
      url: '../detail_comment/detail_comment?objectId=' + goods_id,
    });
  },
  clickToGroup: function () {
    wx.navigateTo({
      url: '/',
    });
  },
});