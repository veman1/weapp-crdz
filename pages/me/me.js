
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
        text: '我的订单',
        url: '/pages/order_list/order_list',
        open_type: 'navigate'
      },
      {
        text: '我的拼团',
        url: '/pages/group_my/group_my',
        open_type: 'navigate'
      },
      {
        text: '我的收藏',
        url: '/pages/collect/collect',
        open_type: 'navigate'
      },
      {
        text: '地址管理',
        url: '/pages/address_list/address_list',
        open_type: 'navigate'
      }
    ],
  },
  onShow: function () {
    !this.data.userInfo && wx.getUserInfo({
      success: ({ userInfo }) => this.setData({ userInfo })
    });
  }
})



