/*
 *  webui popover plugin  - v1.2.12
 *  A lightWeight popover plugin with jquery ,enchance the  popover plugin of bootstrap with some awesome new features. It works well with bootstrap ,but bootstrap is not necessary!
 *  https://github.com/sandywalker/webui-popover
 *
 *  Made by Sandy Duan
 *  Under MIT License
 */
! function(a, b, c) {
	"use strict";
	! function(b) {
			"function" == typeof define && define.amd ? define(["jquery"], b) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(a.jQuery)
	}(function(d) {
			function e(a, b) {
					this.$element = d(a), b && ("string" === d.type(b.delay) || "number" === d.type(b.delay)) && (b.delay = {
							show: b.delay,
							hide: b.delay
					}), this.options = d.extend({}, i, b), this._defaults = i, this._name = f, this._targetclick = !1, this.init(), k.push(this.$element)
			}
			var f = "webuiPopover",
					g = "webui-popover",
					h = "webui.popover",
					i = {
							placement: "auto",
							container: null,
							width: "auto",
							height: "auto",
							trigger: "click",
							style: "",
							delay: {
									show: null,
									hide: 300
							},
							async: {
									type: "GET",
									before: null,
									success: null,
									error: null
							},
							cache: !0,
							multi: !1,
							arrow: !0,
							title: "",
							content: "",
							closeable: !1,
							padding: !0,
							url: "",
							type: "html",
							direction: "",
							animation: null,
							template: '<div class="webui-popover"><div class="webui-arrow"></div><div class="webui-popover-inner"><a href="#" class="close"></a><h3 class="webui-popover-title"></h3><div class="webui-popover-content"><i class="icon-refresh"></i> <p>&nbsp;</p></div></div></div>',
							backdrop: !1,
							dismissible: !0,
							onShow: null,
							onHide: null,
							abortXHR: !0,
							autoHide: !1,
							offsetTop: 0,
							offsetLeft: 0,
							iframeOptions: {
									frameborder: "0",
									allowtransparency: "true",
									id: "",
									name: "",
									scrolling: "",
									onload: "",
									height: "",
									width: ""
							},
							hideEmpty: !1
					},
					j = g + "-rtl",
					k = [],
					l = d('<div class="webui-popover-backdrop"></div>'),
					m = 0,
					n = !1,
					o = -2e3,
					p = d(b),
					q = function(a, b) {
							return isNaN(a) ? b || 0 : Number(a)
					},
					r = function(a) {
							return a.data("plugin_" + f)
					},
					s = function() {
							for (var a = null, b = 0; b < k.length; b++) a = r(k[b]), a && a.hide(!0);
							p.trigger("hiddenAll." + h)
					},
					t = "ontouchstart" in b.documentElement && /Mobi/.test(navigator.userAgent),
					u = function(a) {
							var b = {
									x: 0,
									y: 0
							};
							if ("touchstart" === a.type || "touchmove" === a.type || "touchend" === a.type || "touchcancel" === a.type) {
									var c = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0];
									b.x = c.pageX, b.y = c.pageY
							} else("mousedown" === a.type || "mouseup" === a.type || "click" === a.type) && (b.x = a.pageX, b.y = a.pageY);
							return b
					};
			e.prototype = {
					init: function() {
							"manual" !== this.getTrigger() && ("click" === this.getTrigger() || t ? this.$element.off("click touchend").on("click touchend", d.proxy(this.toggle, this)) : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave click").on("mouseenter", d.proxy(this.mouseenterHandler, this)).on("mouseleave", d.proxy(this.mouseleaveHandler, this))), this._poped = !1, this._inited = !0, this._opened = !1, this._idSeed = m, this.options.container = d(this.options.container || b.body).first(), this.options.backdrop && l.appendTo(this.options.container).hide(), m++, "sticky" === this.getTrigger() && this.show()
					},
					destroy: function() {
							for (var a = -1, b = 0; b < k.length; b++)
									if (k[b] === this.$element) {
											a = b;
											break
									} k.splice(a, 1), this.hide(), this.$element.data("plugin_" + f, null), "click" === this.getTrigger() ? this.$element.off("click") : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave"), this.$target && this.$target.remove()
					},
					hide: function(a, b) {
							if ((a || "sticky" !== this.getTrigger()) && this._opened) {
									b && (b.preventDefault(), b.stopPropagation()), this.xhr && this.options.abortXHR === !0 && (this.xhr.abort(), this.xhr = null);
									var c = d.Event("hide." + h);
									if (this.$element.trigger(c, [this.$target]), this.$target) {
											this.$target.removeClass("in").addClass(this.getHideAnimation());
											var e = this;
											setTimeout(function() {
													e.$target.hide(), e.getCache() || e.$target.remove()
											}, e.getHideDelay())
									}
									this.options.backdrop && l.hide(), this._opened = !1, this.$element.trigger("hidden." + h, [this.$target]), this.options.onHide && this.options.onHide(this.$target)
							}
					},
					resetAutoHide: function() {
							var a = this,
									b = a.getAutoHide();
							b && (a.autoHideHandler && clearTimeout(a.autoHideHandler), a.autoHideHandler = setTimeout(function() {
									a.hide()
							}, b))
					},
					toggle: function(a) {
							a && (a.preventDefault(), a.stopPropagation()), this[this.getTarget().hasClass("in") ? "hide" : "show"]()
					},
					hideAll: function() {
							s()
					},
					show: function() {
							if (!this._opened) {
									var a = this.getTarget().removeClass().addClass(g).addClass(this._customTargetClass);
									if (this.options.multi || this.hideAll(), !this.getCache() || !this._poped || "" === this.content) {
											if (this.content = "", this.setTitle(this.getTitle()), this.options.closeable || a.find(".close").off("click").remove(), this.isAsync() ? this.setContentASync(this.options.content) : this.setContent(this.getContent()), this.canEmptyHide() && "" === this.content) return;
											a.show()
									}
									this.displayContent(), this.options.onShow && this.options.onShow(a), this.bindBodyEvents(), this.options.backdrop && l.show(), this._opened = !0, this.resetAutoHide()
							}
					},
					displayContent: function() {
							var a = this.getElementPosition(),
									b = this.getTarget().removeClass().addClass(g).addClass(this._customTargetClass),
									c = this.getContentElement(),
									e = b[0].offsetWidth,
									f = b[0].offsetHeight,
									i = "bottom",
									k = d.Event("show." + h);
							if (this.canEmptyHide()) {
									var l = c.children().html();
									if (null !== l && 0 === l.trim().length) return
							}
							this.$element.trigger(k, [b]);
							var m = this.$element.data("width") || this.options.width;
							"" === m && (m = this._defaults.width), "auto" !== m && b.width(m);
							var n = this.$element.data("height") || this.options.height;
							"" === n && (n = this._defaults.height), "auto" !== n && c.height(n), this.options.style && this.$target.addClass(g + "-" + this.options.style), "rtl" !== this.options.direction || c.hasClass(j) || c.addClass(j), this.options.arrow || b.find(".webui-arrow").remove(), b.detach().css({
									top: o,
									left: o,
									display: "block"
							}), this.getAnimation() && b.addClass(this.getAnimation()), b.appendTo(this.options.container), i = this.getPlacement(a), this.$element.trigger("added." + h), this.initTargetEvents(), this.options.padding || ("auto" !== this.options.height && c.css("height", c.outerHeight()), this.$target.addClass("webui-no-padding")), e = b[0].offsetWidth, f = b[0].offsetHeight;
							var p = this.getTargetPositin(a, i, e, f);
							if (this.$target.css(p.position).addClass(i).addClass("in"), "iframe" === this.options.type) {
									var q = b.find("iframe"),
											r = b.width(),
											s = q.parent().height();
									"" !== this.options.iframeOptions.width && "auto" !== this.options.iframeOptions.width && (r = this.options.iframeOptions.width), "" !== this.options.iframeOptions.height && "auto" !== this.options.iframeOptions.height && (s = this.options.iframeOptions.height), q.width(r).height(s)
							}
							if (this.options.arrow || this.$target.css({
											margin: 0
									}), this.options.arrow) {
									var t = this.$target.find(".webui-arrow");
									t.removeAttr("style"), "left" === i || "right" === i ? t.css({
											top: this.$target.height() / 2
									}) : ("top" === i || "bottom" === i) && t.css({
											left: this.$target.width() / 2
									}), p.arrowOffset && (-1 === p.arrowOffset.left || -1 === p.arrowOffset.top ? t.hide() : t.css(p.arrowOffset))
							}
							this._poped = !0, this.$element.trigger("shown." + h, [this.$target])
					},
					isTargetLoaded: function() {
							return 0 === this.getTarget().find("i.glyphicon-refresh").length
					},
					getTriggerElement: function() {
							return this.$element
					},
					getTarget: function() {
							if (!this.$target) {
									var a = f + this._idSeed;
									this.$target = d(this.options.template).attr("id", a).data("trigger-element", this.getTriggerElement()), this._customTargetClass = this.$target.attr("class") !== g ? this.$target.attr("class") : null, this.getTriggerElement().attr("data-target", a)
							}
							return this.$target
					},
					getTitleElement: function() {
							return this.getTarget().find("." + g + "-title")
					},
					getContentElement: function() {
							return this.$contentElement || (this.$contentElement = this.getTarget().find("." + g + "-content")), this.$contentElement
					},
					getTitle: function() {
							return this.$element.attr("data-title") || this.options.title || this.$element.attr("title")
					},
					getUrl: function() {
							return this.$element.attr("data-url") || this.options.url
					},
					getAutoHide: function() {
							return this.$element.attr("data-auto-hide") || this.options.autoHide
					},
					getOffsetTop: function() {
							return q(this.$element.attr("data-offset-top")) || this.options.offsetTop
					},
					getOffsetLeft: function() {
							return q(this.$element.attr("data-offset-left")) || this.options.offsetLeft
					},
					getCache: function() {
							var a = this.$element.attr("data-cache");
							if ("undefined" != typeof a) switch (a.toLowerCase()) {
									case "true":
									case "yes":
									case "1":
											return !0;
									case "false":
									case "no":
									case "0":
											return !1
							}
							return this.options.cache
					},
					getTrigger: function() {
							return this.$element.attr("data-trigger") || this.options.trigger
					},
					getDelayShow: function() {
							var a = this.$element.attr("data-delay-show");
							return "undefined" != typeof a ? a : 0 === this.options.delay.show ? 0 : this.options.delay.show || 100
					},
					getHideDelay: function() {
							var a = this.$element.attr("data-delay-hide");
							return "undefined" != typeof a ? a : 0 === this.options.delay.hide ? 0 : this.options.delay.hide || 100
					},
					getAnimation: function() {
							var a = this.$element.attr("data-animation");
							return a || this.options.animation
					},
					getHideAnimation: function() {
							var a = this.getAnimation();
							return a ? a + "-out" : "out"
					},
					setTitle: function(a) {
							var b = this.getTitleElement();
							a ? ("rtl" !== this.options.direction || b.hasClass(j) || b.addClass(j), b.html(a)) : b.remove()
					},
					hasContent: function() {
							return this.getContent()
					},
					canEmptyHide: function() {
							return this.options.hideEmpty && "html" === this.options.type
					},
					getIframe: function() {
							var a = d("<iframe></iframe>").attr("src", this.getUrl()),
									b = this;
							return d.each(this._defaults.iframeOptions, function(c) {
									"undefined" != typeof b.options.iframeOptions[c] && a.attr(c, b.options.iframeOptions[c])
							}), a
					},
					getContent: function() {
							if (this.getUrl()) switch (this.options.type) {
									case "iframe":
											this.content = this.getIframe();
											break;
									case "html":
											try {
													this.content = d(this.getUrl()), this.content.is(":visible") || this.content.show()
											} catch (a) {
													throw new Error("Unable to get popover content. Invalid selector specified.")
											}
							} else if (!this.content) {
									var b = "";
									if (b = d.isFunction(this.options.content) ? this.options.content.apply(this.$element[0], [this]) : this.options.content, this.content = this.$element.attr("data-content") || b, !this.content) {
											var c = this.$element.next();
											c && c.hasClass(g + "-content") && (this.content = c)
									}
							} return this.content
					},
					setContent: function(a) {
							var b = this.getTarget(),
									c = this.getContentElement();
							"string" == typeof a ? c.html(a) : a instanceof d && (c.html(""), this.options.cache ? a.removeClass(g + "-content").appendTo(c) : a.clone(!0, !0).removeClass(g + "-content").appendTo(c)), this.$target = b
					},
					isAsync: function() {
							return "async" === this.options.type
					},
					setContentASync: function(a) {
							var b = this;
							this.xhr || (this.xhr = d.ajax({
									url: this.getUrl(),
									type: this.options.async.type,
									cache: this.getCache(),
									beforeSend: function(a) {
											b.options.async.before && b.options.async.before(b, a)
									},
									success: function(c) {
											b.bindBodyEvents(), a && d.isFunction(a) ? b.content = a.apply(b.$element[0], [c]) : b.content = c, b.setContent(b.content);
											var e = b.getContentElement();
											e.removeAttr("style"), b.displayContent(), b.options.async.success && b.options.async.success(b, c)
									},
									complete: function() {
											b.xhr = null
									},
									error: function(a, c) {
											b.options.async.error && b.options.async.error(b, a, c)
									}
							}))
					},
					bindBodyEvents: function() {
							n || (this.options.dismissible && "click" === this.getTrigger() ? (p.off("keyup.webui-popover").on("keyup.webui-popover", d.proxy(this.escapeHandler, this)), p.off("click.webui-popover touchend.webui-popover").on("click.webui-popover touchend.webui-popover", d.proxy(this.bodyClickHandler, this))) : "hover" === this.getTrigger() && p.off("touchend.webui-popover").on("touchend.webui-popover", d.proxy(this.bodyClickHandler, this)))
					},
					mouseenterHandler: function() {
							var a = this;
							a._timeout && clearTimeout(a._timeout), a._enterTimeout = setTimeout(function() {
									a.getTarget().is(":visible") || a.show()
							}, this.getDelayShow())
					},
					mouseleaveHandler: function() {
							var a = this;
							clearTimeout(a._enterTimeout), a._timeout = setTimeout(function() {
									a.hide()
							}, this.getHideDelay())
					},
					escapeHandler: function(a) {
							27 === a.keyCode && this.hideAll()
					},
					bodyClickHandler: function(a) {
							n = !0;
							for (var b = !0, c = 0; c < k.length; c++) {
									var d = r(k[c]);
									if (d && d._opened) {
											var e = d.getTarget().offset(),
													f = e.left,
													g = e.top,
													h = e.left + d.getTarget().width(),
													i = e.top + d.getTarget().height(),
													j = u(a),
													l = j.x >= f && j.x <= h && j.y >= g && j.y <= i;
											if (l) {
													b = !1;
													break
											}
									}
							}
							b && s()
					},
					initTargetEvents: function() {
							"hover" === this.getTrigger() && this.$target.off("mouseenter mouseleave").on("mouseenter", d.proxy(this.mouseenterHandler, this)).on("mouseleave", d.proxy(this.mouseleaveHandler, this)), this.$target.find(".close").off("click").on("click", d.proxy(this.hide, this, !0))
					},
					getPlacement: function(a) {
							var b, c = this.options.container,
									d = c.innerWidth(),
									e = c.innerHeight(),
									f = c.scrollTop(),
									g = c.scrollLeft(),
									h = Math.max(0, a.left - g),
									i = Math.max(0, a.top - f);
							b = "function" == typeof this.options.placement ? this.options.placement.call(this, this.getTarget()[0], this.$element[0]) : this.$element.data("placement") || this.options.placement;
							var j = "horizontal" === b,
									k = "vertical" === b,
									l = "auto" === b || j || k;
							return l ? b = d / 3 > h ? e / 3 > i ? j ? "right-bottom" : "bottom-right" : 2 * e / 3 > i ? k ? e / 2 >= i ? "bottom-right" : "top-right" : "right" : j ? "right-top" : "top-right" : 2 * d / 3 > h ? e / 3 > i ? j ? d / 2 >= h ? "right-bottom" : "left-bottom" : "bottom" : 2 * e / 3 > i ? j ? d / 2 >= h ? "right" : "left" : e / 2 >= i ? "bottom" : "top" : j ? d / 2 >= h ? "right-top" : "left-top" : "top" : e / 3 > i ? j ? "left-bottom" : "bottom-left" : 2 * e / 3 > i ? k ? e / 2 >= i ? "bottom-left" : "top-left" : "left" : j ? "left-top" : "top-left" : "auto-top" === b ? b = d / 3 > h ? "top-right" : 2 * d / 3 > h ? "top" : "top-left" : "auto-bottom" === b ? b = d / 3 > h ? "bottom-right" : 2 * d / 3 > h ? "bottom" : "bottom-left" : "auto-left" === b ? b = e / 3 > i ? "left-top" : 2 * e / 3 > i ? "left" : "left-bottom" : "auto-right" === b && (b = e / 3 > i ? "right-top" : 2 * e / 3 > i ? "right" : "right-bottom"), b
					},
					getElementPosition: function() {
							var a = this.$element[0].getBoundingClientRect(),
									c = this.options.container,
									e = c.css("position");
							if (c.is(b.body) || "static" === e) return d.extend({}, this.$element.offset(), {
									width: this.$element[0].offsetWidth || a.width,
									height: this.$element[0].offsetHeight || a.height
							});
							if ("fixed" === e) {
									var f = c[0].getBoundingClientRect();
									return {
											top: a.top - f.top + c.scrollTop(),
											left: a.left - f.left + c.scrollLeft(),
											width: a.width,
											height: a.height
									}
							}
							return "relative" === e ? {
									top: this.$element.offset().top - c.offset().top,
									left: this.$element.offset().left - c.offset().left,
									width: this.$element[0].offsetWidth || a.width,
									height: this.$element[0].offsetHeight || a.height
							} : void 0
					},
					getTargetPositin: function(a, c, d, e) {
							var f = a,
									g = this.options.container,
									h = this.$element.outerWidth(),
									i = this.$element.outerHeight(),
									j = b.documentElement.scrollTop + g.scrollTop(),
									k = b.documentElement.scrollLeft + g.scrollLeft(),
									l = {},
									m = null,
									n = this.options.arrow ? 20 : 0,
									p = 10,
									q = n + p > h ? n : 0,
									r = n + p > i ? n : 0,
									s = 0,
									t = b.documentElement.clientHeight + j,
									u = b.documentElement.clientWidth + k,
									v = f.left + f.width / 2 - q > 0,
									w = f.left + f.width / 2 + q < u,
									x = f.top + f.height / 2 - r > 0,
									y = f.top + f.height / 2 + r < t;
							switch (c) {
									case "bottom":
											l = {
													top: f.top + f.height,
													left: f.left + f.width / 2 - d / 2
											};
											break;
									case "top":
											l = {
													top: f.top - e,
													left: f.left + f.width / 2 - d / 2
											};
											break;
									case "left":
											l = {
													top: f.top + f.height / 2 - e / 2,
													left: f.left - d
											};
											break;
									case "right":
											l = {
													top: f.top + f.height / 2 - e / 2,
													left: f.left + f.width
											};
											break;
									case "top-right":
											l = {
													top: f.top - e,
													left: v ? f.left - q : p
											}, m = {
													left: v ? Math.min(h, d) / 2 + q : o
											};
											break;
									case "top-left":
											s = w ? q : -p, l = {
													top: f.top - e,
													left: f.left - d + f.width + s
											}, m = {
													left: w ? d - Math.min(h, d) / 2 - q : o
											};
											break;
									case "bottom-right":
											l = {
													top: f.top + f.height,
													left: v ? f.left - q : p
											}, m = {
													left: v ? Math.min(h, d) / 2 + q : o
											};
											break;
									case "bottom-left":
											s = w ? q : -p, l = {
													top: f.top + f.height,
													left: f.left - d + f.width + s
											}, m = {
													left: w ? d - Math.min(h, d) / 2 - q : o
											};
											break;
									case "right-top":
											s = y ? r : -p, l = {
													top: f.top - e + f.height + s,
													left: f.left + f.width
											}, m = {
													top: y ? e - Math.min(i, e) / 2 - r : o
											};
											break;
									case "right-bottom":
											l = {
													top: x ? f.top - r : p,
													left: f.left + f.width
											}, m = {
													top: x ? Math.min(i, e) / 2 + r : o
											};
											break;
									case "left-top":
											s = y ? r : -p, l = {
													top: f.top - e + f.height + s,
													left: f.left - d
											}, m = {
													top: y ? e - Math.min(i, e) / 2 - r : o
											};
											break;
									case "left-bottom":
											l = {
													top: x ? f.top - r : p,
													left: f.left - d
											}, m = {
													top: x ? Math.min(i, e) / 2 + r : o
											}
							}
							return l.top += this.getOffsetTop(), l.left += this.getOffsetLeft(), {
									position: l,
									arrowOffset: m
							}
					}
			}, d.fn[f] = function(a, b) {
					var c = [],
							g = this.each(function() {
									var g = d.data(this, "plugin_" + f);
									g ? "destroy" === a ? g.destroy() : "string" == typeof a && c.push(g[a]()) : (a ? "string" == typeof a ? "destroy" !== a && (b || (g = new e(this, null), c.push(g[a]()))) : "object" == typeof a && (g = new e(this, a)) : g = new e(this, null), d.data(this, "plugin_" + f, g))
							});
					return c.length ? c : g
			};
			var v = function() {
					var a = function() {
									s()
							},
							b = function(a, b) {
									b = b || {}, d(a).webuiPopover(b)
							},
							e = function(a) {
									var b = !0;
									return d(a).each(function(a) {
											b = b && d(a).data("plugin_" + f) !== c
									}), b
							},
							g = function(a, b) {
									b ? d(a).webuiPopover(b).webuiPopover("show") : d(a).webuiPopover("show")
							},
							h = function(a) {
									d(a).webuiPopover("hide")
							};
					return {
							show: g,
							hide: h,
							create: b,
							isCreated: e,
							hideAll: a
					}
			}();
			a.WebuiPopovers = v
	})
}(window, document);