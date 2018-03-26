const app = getApp()

app.Page({
  data: {
    front: '/images/test/try_front.png'
  },
  onLoad(o) {
    wx.getStorage({
      key: 'try_background',
      success: ({data}) => {
        this.setData({
          background: data
        })
      },
    })
  },
  chooseImg() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        let background = res.tempFilePaths[0]
        this.setData({
          background
        })
        wx.setStorage({
          key: 'try_background',
          data: background,
        })
      },
    })
  }
})