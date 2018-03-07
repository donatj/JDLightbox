"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var JDLightbox = (function () {
    function JDLightbox(options) {
        var _this = this;
        this.bg = document.createElement('div');
        this.fig = document.createElement('figure');
        this.options = {
            selector: 'a[data-jdlightbox=jdlightbox]',
            lbAttr: "href",
            fadeDuration: 400,
            rootListener: document.querySelector('html'),
            rootLevelElement: document.querySelector('html'),
            bgClassName: 'jdlightbox_modal_bg',
            iframeWidth: 800,
            iframeHeight: 600
        };
        this.options = __assign({}, this.options, options);
        this.bg.classList.add(this.options.bgClassName);
        this.hide();
        this.bg.style.transition = this.options.fadeDuration + 'ms';
        this.bg.appendChild(this.fig);
        this.options.rootLevelElement.appendChild(this.bg);
        var that = this;
        that.bg.addEventListener('click', function () {
            _this.hide();
        });
        this.options.rootListener.addEventListener('click', function (e) {
            if (e.metaKey) {
                return;
            }
            for (var target = e.target; target && target != this; target = target.parentElement) {
                if (target.matches(that.options.selector)) {
                    e.preventDefault();
                    that.show(target);
                    break;
                }
            }
        });
    }
    JDLightbox.prototype.hide = function () {
        this.bg.style.display = 'none';
    };
    JDLightbox.prototype.show = function (target) {
        var _this = this;
        this.fig.innerHTML = '';
        this.bg.style.display = '';
        this.bg.style.opacity = '0';
        if (target.hasAttribute('data-jdlightbox-iframe')) {
            var iframe = document.createElement('iframe');
            iframe.src = target.getAttribute(this.options.lbAttr) || '';
            iframe.width = "" + this.options.iframeWidth;
            iframe.height = "" + this.options.iframeHeight;
        }
        else {
            var img = document.createElement('img');
            img.src = target.getAttribute(this.options.lbAttr) || '';
            this.fig.appendChild(img);
            var caption = document.createElement('figcaption');
            caption.innerText = target.title;
            this.fig.appendChild(caption);
        }
        setTimeout(function () { _this.bg.style.opacity = '1'; }, 1);
    };
    return JDLightbox;
}());
