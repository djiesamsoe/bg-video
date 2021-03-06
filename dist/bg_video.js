
/*
 * BgVideo v0.0.8 - Fullscreen HTML5 background video
 * Author: Emil Löfquist @ Mynewsdesk
 * GitHub: https://github.com/mynewsdesk/bg-video
 */
var BgVideo, root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

$.supportsVideo = function() {
  return !!document.createElement("video").canPlayType;
};

BgVideo = (function() {
  var mimeTypes;

  mimeTypes = {
    'mp4': 'video/mp4',
    'm4v': 'video/mp4',
    'ogv': 'video/ogg',
    'webm': 'video/webm'
  };

  function BgVideo($elm, options, nativeAttributes) {
    this.$elm = $elm;
    this.$detachedElm = null;
    this.settings = {
      sources: [],
      cssPosition: 'absolute',
      alignment: 'top left',
      hideBodyScrollbars: true,
      resizeWithWindow: true,
      attachImmediately: true
    };
    this.attributes = {
      autoplay: true,
      controls: false,
      loop: true,
      muted: true,
      poster: null,
      preload: 'auto'
    };
    this.settings = $.extend(this.settings, options);
    this.attributes = $.extend(this.attributes, nativeAttributes);
    if (this.settings.hideBodyScrollbars) {
      $('body').css('overflow', 'hidden');
    }
    this.$video = this.createVideoTag();
    if (this.settings.attachImmediately) {
      $elm.append(this.$video);
    }
    if (this.settings.resizeWithWindow) {
      $(window).on('resize', (function(_this) {
        return function() {
          return _this.setVideoDimensions(_this.$video);
        };
      })(this));
    }
  }

  BgVideo.prototype.play = function() {
    return this.$video.get(0).play();
  };

  BgVideo.prototype.pause = function() {
    return this.$video.get(0).pause();
  };

  BgVideo.prototype.mute = function() {
    return this.$video.prop('muted', true);
  };

  BgVideo.prototype.unmute = function() {
    return this.$video.prop('muted', false);
  };

  BgVideo.prototype.setVideoDimensions = function($video) {
    var ar, css;
    ar = $(window).width() / $(window).height();
    css = {
      position: this.settings.cssPosition,
      minWidth: '100%',
      minHeight: '100%',
      width: function() {
        if (ar < 1.77) {
          return 'auto';
        } else {
          return '100%';
        }
      },
      height: function() {
        if (ar > 1.77) {
          return 'auto';
        } else {
          return '100%';
        }
      },
      zIndex: '-1000',
      overflow: 'hidden'
    };
    return $video.css($.extend(css, this.alignmentPosition()));
  };

  BgVideo.prototype.alignmentPosition = function() {
    switch (this.settings.alignment) {
      case 'top right':
        return {
          top: 0,
          right: 0
        };
      case 'bottom left':
        return {
          bottom: 0,
          left: 0
        };
      case 'bottom right':
        return {
          bottom: 0,
          right: 0
        };
      default:
        return {
          top: 0,
          left: 0
        };
    }
  };

  BgVideo.prototype.createVideoTag = function() {
    var $video, source, _i, _len, _ref;
    $video = $('<video />');
    this.setVideoDimensions($video);
    $.each(this.attributes, function(key, val) {
      if (typeof val === 'boolean') {
        if (val === true) {
          return $video.prop(key, true);
        }
      } else {
        if (val !== null) {
          return $video.prop(key, val);
        }
      }
    });
    _ref = this.settings.sources;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      this.appendSource($video, source);
    }
    return $video;
  };

  BgVideo.prototype.appendSource = function($video, source) {
    var mimeType;
    mimeType = this.detectMimeType(source);
    return $('<source />').attr('src', source).attr('type', mimeType).appendTo($video);
  };

  BgVideo.prototype.detectMimeType = function(source) {
    var ext;
    ext = source.split('.').pop().toLowerCase();
    return mimeTypes[ext];
  };

  BgVideo.prototype.destroy = function() {
    this.pause();
    return this.$video.remove();
  };

  BgVideo.prototype.detach = function() {
    this.pause();
    return this.$detachedElm = this.$video.detach();
  };

  BgVideo.prototype.attach = function() {
    this.$elm.append(this.$video);
    this.$detachedElm = null;
    return this.settings.attachImmediately = false;
  };

  return BgVideo;

})();

root.BgVideo = BgVideo;
