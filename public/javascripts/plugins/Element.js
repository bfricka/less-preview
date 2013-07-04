Element.prototype.hasClosestEl = function(el) {
  var currentEl = this;
  while (currentEl.parentElement) {
    if (currentEl === el) return true;
    currentEl = currentEl.parentElement;
  }

  return false;
};