function e(e, n, t, o) {
  return new (t || (t = Promise))(function(r, a) {
    function i(e) {
      try {
        c(o.next(e))
      } catch (e) {
        a(e)
      }
    }
    function s(e) {
      try {
        c(o.throw(e))
      } catch (e) {
        a(e)
      }
    }
    function c(e) {
      var n
      e.done
        ? r(e.value)
        : ((n = e.value),
          n instanceof t
            ? n
            : new t(function(e) {
                e(n)
              })).then(i, s)
    }
    c((o = o.apply(e, n || [])).next())
  })
}
function n(e, n) {
  var t,
    o,
    r,
    a,
    i = {
      label: 0,
      sent: function() {
        if (1 & r[0]) throw r[1]
        return r[1]
      },
      trys: [],
      ops: []
    }
  return (
    (a = { next: s(0), throw: s(1), return: s(2) }),
    'function' == typeof Symbol &&
      (a[Symbol.iterator] = function() {
        return this
      }),
    a
  )
  function s(a) {
    return function(s) {
      return (function(a) {
        if (t) throw new TypeError('Generator is already executing.')
        for (; i; )
          try {
            if (
              ((t = 1),
              o &&
                (r =
                  2 & a[0]
                    ? o.return
                    : a[0]
                    ? o.throw || ((r = o.return) && r.call(o), 0)
                    : o.next) &&
                !(r = r.call(o, a[1])).done)
            )
              return r
            switch (((o = 0), r && (a = [2 & a[0], r.value]), a[0])) {
              case 0:
              case 1:
                r = a
                break
              case 4:
                return i.label++, { value: a[1], done: !1 }
              case 5:
                i.label++, (o = a[1]), (a = [0])
                continue
              case 7:
                ;(a = i.ops.pop()), i.trys.pop()
                continue
              default:
                if (
                  !((r = i.trys),
                  (r = r.length > 0 && r[r.length - 1]) ||
                    (6 !== a[0] && 2 !== a[0]))
                ) {
                  i = 0
                  continue
                }
                if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                  i.label = a[1]
                  break
                }
                if (6 === a[0] && i.label < r[1]) {
                  ;(i.label = r[1]), (r = a)
                  break
                }
                if (r && i.label < r[2]) {
                  ;(i.label = r[2]), i.ops.push(a)
                  break
                }
                r[2] && i.ops.pop(), i.trys.pop()
                continue
            }
            a = n.call(e, i)
          } catch (e) {
            ;(a = [6, e]), (o = 0)
          } finally {
            t = r = 0
          }
        if (5 & a[0]) throw a[1]
        return { value: a[0] ? a[1] : void 0, done: !0 }
      })([a, s])
    }
  }
}
var t = '[EPNS_SDK_EMBED]',
  o = 'https://ethereum-push-notification-service.github.io/embed-dapp',
  r = 'https://backend-prod.epns.io/apis/feeds/get_feeds',
  a = 'EPNS_SDK_EMBED_VIEW_ROOT',
  i = 'EPNS_SDK_EMBED_STYLE_TAG_ID_',
  s = 'EPNS_SDK_EMBED_IFRAME_ID',
  c = 2147483638,
  d = 'EPNS_SDK_EMBED_CHANNEL',
  l = 'EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_LOADED',
  p = 'EPNS_SDK_EMBED_CHANNEL_TOPIC_IFRAME_APP_CLOSED',
  u = 'EPNS_SDK_EMBED_CHANNEL_TOPIC_SDK_CONFIG_INIT',
  f = 'EPNS_SDK_EMBED_LOCAL_STORAGE_'
function m(e) {
  return e.appName
    ? a + '_' + (void 0 === (n = e.appName) && (n = ''), n.toUpperCase())
    : a + '_DEFAULT_APPNAME'
  var n
}
var h = {
  getLocalStorage: function(o) {
    return e(this, void 0, void 0, function() {
      var e, r
      return n(this, function(n) {
        ;(e = '' + f + o), (r = window.localStorage.getItem(e))
        try {
          return [2, JSON.parse(r)]
        } catch (e) {
          return console.warn(t + ' - Local Storage READ issue'), [2, '']
        }
        return [2]
      })
    })
  },
  setLocalStorage: function(e, n) {
    var t = '' + f + e
    window.localStorage.setItem(t, JSON.stringify(n))
  }
}
var v = {
    isInitialized: !1,
    targetID: '',
    appName: '',
    user: '',
    headerText: 'Notifications',
    viewOptions: {
      type: 'sidebar',
      showUnreadIndicator: !0,
      unreadIndicatorColor: '#cc1919',
      unreadIndicatorPosition: 'top-right',
      theme: 'light'
    }
  },
  b = {}
function y() {
  var e,
    n = m(b),
    t = document.querySelectorAll('#' + n)
  if (t.length > 0)
    for (var o = 0; o < t.length; o++)
      null === (e = document.querySelector('body')) ||
        void 0 === e ||
        e.removeChild(t[o])
  document.querySelector('body').style.overflow = 'visible'
}
function g() {
  var e = this,
    n = m(b)
  y.call(e)
  var t = document.createElement('div')
  ;(t.id = n),
    t.classList.add('epns-sdk-embed-modal', 'epns-sdk-embed-modal-open'),
    (t.innerHTML =
      '\n        <div class="epns-sdk-embed-modal-overlay">\n            <div class="epns-sdk-embed-modal-content">\n                <iframe id="' +
      s +
      '" src="' +
      o +
      '"></iframe>\n            </div>\n        </div>\n    '),
    document.querySelector('body').appendChild(t),
    (document.querySelector('body').style.overflow = 'hidden'),
    P.call(e)
  var r = '#' + n + ' .epns-sdk-embed-modal-overlay'
  document.querySelector(r).onclick = function(n) {
    n.preventDefault(), n.stopPropagation(), y.call(e)
  }
}
function S() {
  var e = this,
    n = document.querySelector('#' + b.targetID)
  n && n.id === b.targetID
    ? (console.info(t + ' - click handler attached to #' + b.targetID),
      n.addEventListener('click', function(n) {
        n.preventDefault(), n.stopPropagation(), g.call(e)
      }))
    : console.error(t + ' - No trigger element ' + b.targetID + ' found!')
}
function w() {
  var e = document.querySelector('#' + b.targetID)
  e && e.id === b.targetID && e.replaceWith(e.cloneNode(!0))
}
function I(e) {
  var n = document.querySelector('iframe#' + s)
  try {
    n.contentWindow.postMessage(JSON.stringify(e), '*')
  } catch (e) {
    console.error(t + " - APP to IFRAME publish error'", e)
  }
}
function E(e) {
  try {
    if ('string' != typeof e.data) return null
    if (!!!e.data.match(d)) return null
    var n = JSON.parse(e.data)
    if (n.channel === d) {
      var o = b.onOpen,
        r = b.onClose,
        a = (function(e, n) {
          var t = {}
          for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) &&
              n.indexOf(o) < 0 &&
              (t[o] = e[o])
          if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
            var r = 0
            for (o = Object.getOwnPropertySymbols(e); r < o.length; r++)
              n.indexOf(o[r]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(e, o[r]) &&
                (t[o[r]] = e[o[r]])
          }
          return t
        })(b, ['onOpen', 'onClose'])
      if (
        (console.info(t + ' - Received communication from the IFRAME: ', n),
        n.topic === l)
      ) {
        var i = { msg: a, channel: d, topic: u }
        I.call(this, i), 'function' == typeof o && o()
      }
      n.topic === p && (y.call(this), 'function' == typeof r && r())
    }
  } catch (e) {
    console.error(t + ' - IFRAME TO APP msg receiving error', e)
  }
}
function D() {
  var e = this
  'complete' === document.readyState
    ? S.call(e)
    : window.addEventListener('load', function() {
        S.call(e)
      }),
    window.addEventListener('message', E.bind(e), !1)
}
function _() {
  var e = m(b),
    n = '' + i + e,
    t = document.querySelector('style#' + n)
  if (!t) {
    var o = document.createElement('style')
    ;(o.id = '' + n), (t = o)
  }
  ;(t.innerHTML = (function(e) {
    e.viewOptions.theme
    var n = e.viewOptions.type || 'sidebar',
      t = m(e)
    return (
      '\n        #' +
      t +
      '.epns-sdk-embed-modal {\n          display: none; /* Hidden by default */\n          transition: display 0.5s ease-in-out;\n        }\n\n        #' +
      t +
      '.epns-sdk-embed-modal.epns-sdk-embed-modal-open {\n          display: block;\n          position: fixed;\n          left: 0;\n          top: 0;\n          right: 0;\n          bottom: 0;\n          z-index: ' +
      (c - 2) +
      ';\n        }\n\n        #' +
      t +
      ' .epns-sdk-embed-modal-overlay {\n          position: absolute;\n          top: 0;\n          right: 0;\n          left: 0;\n          bottom: 0;\n          background-color: #000000bf;\n          z-index: ' +
      (c - 2) +
      ';\n        }\n\n        #' +
      t +
      ' .epns-sdk-embed-modal-content {\n          position: relative;\n          width: 100%;\n          height: 100%;\n          z-index: ' +
      c +
      ';\n        }\n\n        #' +
      t +
      ' .epns-sdk-embed-modal-content iframe#' +
      s +
      ' {\n          ' +
      ('sidebar' === n ? 'width: 450px;' : 'width: 100%;') +
      '\n          height: 100%;\n          border-radius: 8px;\n          overflow: hidden;\n          border: none;\n          position: absolute;\n          right: 0;\n          top: 0;\n          bottom: 0;\n        }  \n\n        #' +
      e.targetID +
      ' {\n            position: relative;\n        }\n\n\n        /* UNREAD INDICATOR STYLES  */\n        #' +
      e.targetID +
      ' .epns-sdk-unread-indicator.epns-sdk-appname-' +
      e.appName +
      ' {\n            position: absolute;\n            display: block;\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            background: ' +
      e.viewOptions.unreadIndicatorColor +
      ';\n            box-shadow: 0 0 0 ' +
      e.viewOptions.unreadIndicatorColor +
      ';\n            animation: epnsSdkPulse-' +
      e.appName +
      ' 2s infinite;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 10px;\n            color: #fff;\n          }\n  \n          #' +
      e.targetID +
      ' .epns-sdk-unread-indicator.epns-sdk-appname-' +
      e.appName +
      '.top-right {\n            right: -10px;\n            top: -10px;\n          }\n  \n          #' +
      e.targetID +
      ' .epns-sdk-unread-indicator.epns-sdk-appname-' +
      e.appName +
      '.top-left {\n            left: -10px;\n            top: -10px;\n          }\n  \n          #' +
      e.targetID +
      ' .epns-sdk-unread-indicator.epns-sdk-appname-' +
      e.appName +
      '.bottom-left {\n            bottom: -10px;\n            left: -10px;\n          }\n          #' +
      e.targetID +
      ' .epns-sdk-unread-indicator.epns-sdk-appname-' +
      e.appName +
      '.bottom-right {\n            bottom: -10px;\n            right: -10px;\n          }\n  \n          @-webkit-keyframes epnsSdkPulse-' +
      e.appName +
      ' {\n            0% {\n              -webkit-box-shadow: 0 0 0 0 ' +
      e.viewOptions.unreadIndicatorColor +
      ';\n            }\n            70% {\n                -webkit-box-shadow: 0 0 0 10px #0000;\n            }\n            100% {\n                -webkit-box-shadow: 0 0 0 0 #0000;\n            }\n          }\n          @keyframes epnsSdkPulse-' +
      e.appName +
      ' {\n            0% {\n              -moz-box-shadow: 0 0 0 0 ' +
      e.viewOptions.unreadIndicatorColor +
      ';\n              box-shadow: 0 0 0 0 ' +
      e.viewOptions.unreadIndicatorColor +
      ';\n            }\n            70% {\n                -moz-box-shadow: 0 0 0 10px #0000;\n                box-shadow: 0 0 0 10px #0000;\n            }\n            100% {\n                -moz-box-shadow: 0 0 0 0 #0000;\n                box-shadow: 0 0 0 0 #0000;\n            }\n          }\n    '
    )
  })(b)),
    document.querySelector('head').appendChild(t)
}
function k() {
  b.viewOptions.showUnreadIndicator ? N.call(this) : P.call(this)
}
function N() {
  return e(this, void 0, void 0, function() {
    var e, t, o, r, a, i, s, c
    return n(this, function(n) {
      switch (n.label) {
        case 0:
          return (
            (e = this),
            (t = 0),
            m(b),
            (o = 'LAST_NOTIFICATIONS'),
            [4, h.getLocalStorage(o)]
          )
        case 1:
          return (r = n.sent()), [4, O.call(e)]
        case 2:
          return (
            (a = (a = n.sent()).map(function(e) {
              return e.payload_id
            })),
            (d = r),
            (i = Array.isArray(d) ? d[0] : null)
              ? -1 !== (s = a.indexOf(i)) &&
                ((c = a.slice(0, s)), (t = c.length))
              : (t = a.length),
            h.setLocalStorage(o, a),
            t > 0 ? x.call(e, t > 9 ? '9+' : t) : P.call(e),
            [2]
          )
      }
      var d
    })
  })
}
function O() {
  return e(this, void 0, void 0, function() {
    var e, o
    return n(this, function(n) {
      switch (n.label) {
        case 0:
          n.label = 1
        case 1:
          return (
            n.trys.push([1, 6, , 7]),
            [
              4,
              fetch(r, {
                method: 'POST',
                body: JSON.stringify({
                  user: b.user,
                  page: 1,
                  pageSize: 10,
                  op: 'read'
                }),
                headers: { 'Content-type': 'application/json; charset=UTF-8' }
              })
            ]
          )
        case 2:
          return (e = n.sent()).ok ? [4, e.json()] : [3, 4]
        case 3:
          return [2, n.sent().results || []]
        case 4:
          return [2, []]
        case 5:
          return [3, 7]
        case 6:
          return (
            (o = n.sent()), console.error(t + ' - API Error ' + r, o), [2, []]
          )
        case 7:
          return [2]
      }
    })
  })
}
function x(e) {
  P.call(this)
  var n = document.createElement('div')
  n.classList.add(
    'epns-sdk-unread-indicator',
    'epns-sdk-appname-' + b.appName,
    b.viewOptions.unreadIndicatorPosition
  ),
    (n.innerText = e),
    document.querySelector('#' + b.targetID) &&
      document.querySelector('#' + b.targetID).appendChild(n)
}
function P() {
  document.querySelector('#' + b.targetID) &&
    document
      .querySelector('#' + b.targetID)
      .querySelector(
        '.epns-sdk-unread-indicator.epns-sdk-appname-' + b.appName
      ) &&
    document
      .querySelector('#' + b.targetID)
      .removeChild(
        document
          .querySelector('#' + b.targetID)
          .querySelector(
            '.epns-sdk-unread-indicator.epns-sdk-appname-' + b.appName
          )
      )
}
var A = {
  init: function(e) {
    var n,
      o = this
    if (!b.isInitialized) {
      if (
        !((n = e).user
          ? n.targetID
            ? n.appName ||
              (console.error(t + ' - config.appName not passed!'), 0)
            : (console.error(t + ' - config.targetID not passed!'), 0)
          : (console.error(t + ' - config.user not passed!'), 0))
      )
        return !1
      ;(b = (function(e) {
        var n = {},
          t = Object.assign({}, v.viewOptions, e.viewOptions)
        return ((n = Object.assign({}, v, e)).viewOptions = t), n
      })(e)),
        (b.isInitialized = !0),
        D.call(o),
        _.call(o),
        k.call(o),
        console.info(t + ' - CONFIG set', b)
    }
  },
  cleanup: function() {
    var e = this
    b.isInitialized &&
      (y.call(e),
      w.call(e),
      window.removeEventListener('message', E.bind(e), !1)),
      (b = {}),
      console.info(t + ' - cleanup called')
  }
}
export default A
