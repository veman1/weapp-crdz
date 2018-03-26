function getObj(key, val) {
  let obj = {}
  obj[key] = val
  return obj
}

export default {
  init(_this, name, array, tap) {
    _this.setData(getObj(name, {
      name,
      array: array || [],
      current: 0
    }))
    _this.$switcherSwitch = current => {
      _this.setData(getObj(`${name}.current`, current))
    }
    _this.$switcherTap = e => {
      tap(e)
      let current = e.currentTarget.dataset.index
      _this.$switcherSwitch(current)
    }
  }
}