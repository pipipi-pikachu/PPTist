'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var RopeSequence = require('rope-sequence');

var prosemirrorTransform = require('prosemirror-transform');

var prosemirrorState = require('prosemirror-state');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var RopeSequence__default = _interopDefaultLegacy(RopeSequence);

var max_empty_items = 500;

var Branch = function () {
  function Branch(items, eventCount) {
    _classCallCheck(this, Branch);

    this.items = items;
    this.eventCount = eventCount;
  }

  _createClass(Branch, [{
    key: "popEvent",
    value: function popEvent(state, preserveItems) {
      var _this = this;

      if (this.eventCount == 0) return null;
      var end = this.items.length;

      for (;; end--) {
        var next = this.items.get(end - 1);

        if (next.selection) {
          --end;
          break;
        }
      }

      var remap, mapFrom;

      if (preserveItems) {
        remap = this.remapping(end, this.items.length);
        mapFrom = remap.maps.length;
      }

      var transform = state.tr;
      var selection, remaining;
      var addAfter = [],
          addBefore = [];
      this.items.forEach(function (item, i) {
        if (!item.step) {
          if (!remap) {
            remap = _this.remapping(end, i + 1);
            mapFrom = remap.maps.length;
          }

          mapFrom--;
          addBefore.push(item);
          return;
        }

        if (remap) {
          addBefore.push(new Item(item.map));
          var step = item.step.map(remap.slice(mapFrom)),
              map;

          if (step && transform.maybeStep(step).doc) {
            map = transform.mapping.maps[transform.mapping.maps.length - 1];
            addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length));
          }

          mapFrom--;
          if (map) remap.appendMap(map, mapFrom);
        } else {
          transform.maybeStep(item.step);
        }

        if (item.selection) {
          selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
          remaining = new Branch(_this.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), _this.eventCount - 1);
          return false;
        }
      }, this.items.length, 0);
      return {
        remaining: remaining,
        transform: transform,
        selection: selection
      };
    }
  }, {
    key: "addTransform",
    value: function addTransform(transform, selection, histOptions, preserveItems) {
      var newItems = [],
          eventCount = this.eventCount;
      var oldItems = this.items,
          lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;

      for (var i = 0; i < transform.steps.length; i++) {
        var step = transform.steps[i].invert(transform.docs[i]);
        var item = new Item(transform.mapping.maps[i], step, selection),
            merged = void 0;

        if (merged = lastItem && lastItem.merge(item)) {
          item = merged;
          if (i) newItems.pop();else oldItems = oldItems.slice(0, oldItems.length - 1);
        }

        newItems.push(item);

        if (selection) {
          eventCount++;
          selection = undefined;
        }

        if (!preserveItems) lastItem = item;
      }

      var overflow = eventCount - histOptions.depth;

      if (overflow > DEPTH_OVERFLOW) {
        oldItems = cutOffEvents(oldItems, overflow);
        eventCount -= overflow;
      }

      return new Branch(oldItems.append(newItems), eventCount);
    }
  }, {
    key: "remapping",
    value: function remapping(from, to) {
      var maps = new prosemirrorTransform.Mapping();
      this.items.forEach(function (item, i) {
        var mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from ? maps.maps.length - item.mirrorOffset : undefined;
        maps.appendMap(item.map, mirrorPos);
      }, from, to);
      return maps;
    }
  }, {
    key: "addMaps",
    value: function addMaps(array) {
      if (this.eventCount == 0) return this;
      return new Branch(this.items.append(array.map(function (map) {
        return new Item(map);
      })), this.eventCount);
    }
  }, {
    key: "rebased",
    value: function rebased(rebasedTransform, rebasedCount) {
      if (!this.eventCount) return this;
      var rebasedItems = [],
          start = Math.max(0, this.items.length - rebasedCount);
      var mapping = rebasedTransform.mapping;
      var newUntil = rebasedTransform.steps.length;
      var eventCount = this.eventCount;
      this.items.forEach(function (item) {
        if (item.selection) eventCount--;
      }, start);
      var iRebased = rebasedCount;
      this.items.forEach(function (item) {
        var pos = mapping.getMirror(--iRebased);
        if (pos == null) return;
        newUntil = Math.min(newUntil, pos);
        var map = mapping.maps[pos];

        if (item.step) {
          var step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
          var selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
          if (selection) eventCount++;
          rebasedItems.push(new Item(map, step, selection));
        } else {
          rebasedItems.push(new Item(map));
        }
      }, start);
      var newMaps = [];

      for (var i = rebasedCount; i < newUntil; i++) {
        newMaps.push(new Item(mapping.maps[i]));
      }

      var items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
      var branch = new Branch(items, eventCount);
      if (branch.emptyItemCount() > max_empty_items) branch = branch.compress(this.items.length - rebasedItems.length);
      return branch;
    }
  }, {
    key: "emptyItemCount",
    value: function emptyItemCount() {
      var count = 0;
      this.items.forEach(function (item) {
        if (!item.step) count++;
      });
      return count;
    }
  }, {
    key: "compress",
    value: function compress() {
      var upto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.items.length;
      var remap = this.remapping(0, upto),
          mapFrom = remap.maps.length;
      var items = [],
          events = 0;
      this.items.forEach(function (item, i) {
        if (i >= upto) {
          items.push(item);
          if (item.selection) events++;
        } else if (item.step) {
          var step = item.step.map(remap.slice(mapFrom)),
              map = step && step.getMap();
          mapFrom--;
          if (map) remap.appendMap(map, mapFrom);

          if (step) {
            var selection = item.selection && item.selection.map(remap.slice(mapFrom));
            if (selection) events++;
            var newItem = new Item(map.invert(), step, selection),
                merged,
                last = items.length - 1;
            if (merged = items.length && items[last].merge(newItem)) items[last] = merged;else items.push(newItem);
          }
        } else if (item.map) {
          mapFrom--;
        }
      }, this.items.length, 0);
      return new Branch(RopeSequence__default["default"].from(items.reverse()), events);
    }
  }]);

  return Branch;
}();

Branch.empty = new Branch(RopeSequence__default["default"].empty, 0);

function cutOffEvents(items, n) {
  var cutPoint;
  items.forEach(function (item, i) {
    if (item.selection && n-- == 0) {
      cutPoint = i;
      return false;
    }
  });
  return items.slice(cutPoint);
}

var Item = function () {
  function Item(map, step, selection, mirrorOffset) {
    _classCallCheck(this, Item);

    this.map = map;
    this.step = step;
    this.selection = selection;
    this.mirrorOffset = mirrorOffset;
  }

  _createClass(Item, [{
    key: "merge",
    value: function merge(other) {
      if (this.step && other.step && !other.selection) {
        var step = other.step.merge(this.step);
        if (step) return new Item(step.getMap().invert(), step, this.selection);
      }
    }
  }]);

  return Item;
}();

var HistoryState = _createClass(function HistoryState(done, undone, prevRanges, prevTime, prevComposition) {
  _classCallCheck(this, HistoryState);

  this.done = done;
  this.undone = undone;
  this.prevRanges = prevRanges;
  this.prevTime = prevTime;
  this.prevComposition = prevComposition;
});

var DEPTH_OVERFLOW = 20;

function applyTransaction(history, state, tr, options) {
  var historyTr = tr.getMeta(historyKey),
      rebased;
  if (historyTr) return historyTr.historyState;
  if (tr.getMeta(closeHistoryKey)) history = new HistoryState(history.done, history.undone, null, 0, -1);
  var appended = tr.getMeta("appendedTransaction");

  if (tr.steps.length == 0) {
    return history;
  } else if (appended && appended.getMeta(historyKey)) {
    if (appended.getMeta(historyKey).redo) return new HistoryState(history.done.addTransform(tr, undefined, options, mustPreserveItems(state)), history.undone, rangesFor(tr.mapping.maps[tr.steps.length - 1]), history.prevTime, history.prevComposition);else return new HistoryState(history.done, history.undone.addTransform(tr, undefined, options, mustPreserveItems(state)), null, history.prevTime, history.prevComposition);
  } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
    var composition = tr.getMeta("composition");
    var newGroup = history.prevTime == 0 || !appended && history.prevComposition != composition && (history.prevTime < (tr.time || 0) - options.newGroupDelay || !isAdjacentTo(tr, history.prevRanges));
    var prevRanges = appended ? mapRanges(history.prevRanges, tr.mapping) : rangesFor(tr.mapping.maps[tr.steps.length - 1]);
    return new HistoryState(history.done.addTransform(tr, newGroup ? state.selection.getBookmark() : undefined, options, mustPreserveItems(state)), Branch.empty, prevRanges, tr.time, composition == null ? history.prevComposition : composition);
  } else if (rebased = tr.getMeta("rebased")) {
    return new HistoryState(history.done.rebased(tr, rebased), history.undone.rebased(tr, rebased), mapRanges(history.prevRanges, tr.mapping), history.prevTime, history.prevComposition);
  } else {
    return new HistoryState(history.done.addMaps(tr.mapping.maps), history.undone.addMaps(tr.mapping.maps), mapRanges(history.prevRanges, tr.mapping), history.prevTime, history.prevComposition);
  }
}

function isAdjacentTo(transform, prevRanges) {
  if (!prevRanges) return false;
  if (!transform.docChanged) return true;
  var adjacent = false;
  transform.mapping.maps[0].forEach(function (start, end) {
    for (var i = 0; i < prevRanges.length; i += 2) {
      if (start <= prevRanges[i + 1] && end >= prevRanges[i]) adjacent = true;
    }
  });
  return adjacent;
}

function rangesFor(map) {
  var result = [];
  map.forEach(function (_from, _to, from, to) {
    return result.push(from, to);
  });
  return result;
}

function mapRanges(ranges, mapping) {
  if (!ranges) return null;
  var result = [];

  for (var i = 0; i < ranges.length; i += 2) {
    var from = mapping.map(ranges[i], 1),
        to = mapping.map(ranges[i + 1], -1);
    if (from <= to) result.push(from, to);
  }

  return result;
}

function histTransaction(history, state, dispatch, redo) {
  var preserveItems = mustPreserveItems(state);
  var histOptions = historyKey.get(state).spec.config;
  var pop = (redo ? history.undone : history.done).popEvent(state, preserveItems);
  if (!pop) return;
  var selection = pop.selection.resolve(pop.transform.doc);
  var added = (redo ? history.done : history.undone).addTransform(pop.transform, state.selection.getBookmark(), histOptions, preserveItems);
  var newHist = new HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0, -1);
  dispatch(pop.transform.setSelection(selection).setMeta(historyKey, {
    redo: redo,
    historyState: newHist
  }).scrollIntoView());
}

var cachedPreserveItems = false,
    cachedPreserveItemsPlugins = null;

function mustPreserveItems(state) {
  var plugins = state.plugins;

  if (cachedPreserveItemsPlugins != plugins) {
    cachedPreserveItems = false;
    cachedPreserveItemsPlugins = plugins;

    for (var i = 0; i < plugins.length; i++) {
      if (plugins[i].spec.historyPreserveItems) {
        cachedPreserveItems = true;
        break;
      }
    }
  }

  return cachedPreserveItems;
}

function closeHistory(tr) {
  return tr.setMeta(closeHistoryKey, true);
}

var historyKey = new prosemirrorState.PluginKey("history");
var closeHistoryKey = new prosemirrorState.PluginKey("closeHistory");

function history() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  config = {
    depth: config.depth || 100,
    newGroupDelay: config.newGroupDelay || 500
  };
  return new prosemirrorState.Plugin({
    key: historyKey,
    state: {
      init: function init() {
        return new HistoryState(Branch.empty, Branch.empty, null, 0, -1);
      },
      apply: function apply(tr, hist, state) {
        return applyTransaction(hist, state, tr, config);
      }
    },
    config: config,
    props: {
      handleDOMEvents: {
        beforeinput: function beforeinput(view, e) {
          var inputType = e.inputType;
          var command = inputType == "historyUndo" ? undo : inputType == "historyRedo" ? redo : null;
          if (!command) return false;
          e.preventDefault();
          return command(view.state, view.dispatch);
        }
      }
    }
  });
}

var undo = function undo(state, dispatch) {
  var hist = historyKey.getState(state);
  if (!hist || hist.done.eventCount == 0) return false;
  if (dispatch) histTransaction(hist, state, dispatch, false);
  return true;
};

var redo = function redo(state, dispatch) {
  var hist = historyKey.getState(state);
  if (!hist || hist.undone.eventCount == 0) return false;
  if (dispatch) histTransaction(hist, state, dispatch, true);
  return true;
};

function undoDepth(state) {
  var hist = historyKey.getState(state);
  return hist ? hist.done.eventCount : 0;
}

function redoDepth(state) {
  var hist = historyKey.getState(state);
  return hist ? hist.undone.eventCount : 0;
}

exports.closeHistory = closeHistory;
exports.history = history;
exports.redo = redo;
exports.redoDepth = redoDepth;
exports.undo = undo;
exports.undoDepth = undoDepth;
