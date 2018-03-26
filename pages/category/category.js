import Switcher from '../../modules/switcher'
const app = getApp()

app.Page({
  onLoad() {
    Switcher.init(this, 'catbar', app._data.category, e => {
      this.switchCategory(e.currentTarget.dataset.index)
    })
  },
  onShow() {
    this.switchCategory(app.globalData.category.current)
  },
  switchCategory(current) {
    current !== this.data.catbar.current && app.switchCategory(current, () => {
      this.$switcherSwitch(current)
    })
  }
})
