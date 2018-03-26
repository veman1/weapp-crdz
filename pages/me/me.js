
Page({
  data: {
    nav_list: [
      {
        text: '待支付',
        img: '/images/me_waitpay.png',
      },
      {
        text: '待发货',
        img: '/images/me_waitsend.png',
      },
      {
        text: '待收货',
        img: '/images/me_waitrcv.png',
      },
      {
        text: '已完成',
        img: '/images/me_finish.png',
      },
    ],
    menu_list: [
      {
        text: '我的钱包',
        url: '/pages/money/money',
        open_type: 'navigate'
      },
      {
        text: '我的积分',
        url: '/pages/points/points',
        open_type: 'navigate'
      },
      {
        text: '我的订单',
        url: '/pages/order/list/list',
        open_type: 'navigate'
      },
      {
        text: '我的拼团',
        url: '/pages/member/myGroup/myGroup',
        open_type: 'navigate'
      },
      {
        text: '我的砍价',
        url: '/pages/cutprice/my/my',
        open_type: 'navigate'
      },
      {
        text: '我的收藏',
        url: '/pages/member/collect/collect',
        open_type: 'navigate'
      },
      {
        text: '地址管理',
        url: '/pages/address/list/list',
        open_type: 'navigate'
      },
      {
        text: '分销中心',
        url: '/pages/member/distribution/index/index',
        open_type: 'navigate'
      },
      {
        text: '优惠卷',
        url: '/pages/member/coupon/index',
        open_type: 'navigate'
      },
      {
        text: '免费入驻',
        url: '/pages/seller/add',
        open_type: 'navigate'
      }
    ],
  },
  onShow: function () {
    wx.getUserInfo({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
        });
      }
    });
  },
})



