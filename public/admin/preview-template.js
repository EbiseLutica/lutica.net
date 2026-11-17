// 下書きを /preview に送り、返ってきた実ページの HTML を iframe に流し込む。
// iframe 自体は差し替えず document.write で中身だけ更新し、スクロール位置を保持する。
(function () {
  var React = CMS.React;
  var h = React.createElement;

  function BlogPreview(props) {
    var ref = React.useRef(null);
    var json = JSON.stringify(props.entry.get('data').toJS());

    React.useEffect(function () {
      var timer = setTimeout(function () {
        fetch('/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        })
          .then(function (res) { return res.text(); })
          .then(function (html) {
            var frame = ref.current;
            if (!frame || !frame.contentWindow) return;
            var win = frame.contentWindow;
            var doc = frame.contentDocument;
            var y = win.scrollY;
            doc.open();
            doc.write(html);
            doc.close();
            win.scrollTo(0, y);
          });
      }, 300);
      return function () { clearTimeout(timer); };
    }, [json]);

    // 編集ペインのスクロール量を比率に換算し、プレビューの同じ比率位置へ合わせる
    React.useEffect(function () {
      function onScroll(e) {
        var src = e.target;
        var frame = ref.current;
        if (!frame || !frame.contentWindow || !(src instanceof Element)) return;
        if (!src.querySelector('[contenteditable="true"], textarea')) return;
        var max = src.scrollHeight - src.clientHeight;
        if (max <= 0) return;
        var win = frame.contentWindow;
        var previewMax = frame.contentDocument.documentElement.scrollHeight - win.innerHeight;
        win.scrollTo(0, (src.scrollTop / max) * previewMax);
      }
      document.addEventListener('scroll', onScroll, true);
      return function () { document.removeEventListener('scroll', onScroll, true); };
    }, []);

    return h('iframe', {
      ref: ref,
      style: { width: '100%', height: '100%', minHeight: '80vh', border: 0 },
    });
  }

  CMS.registerPreviewTemplate('blog', BlogPreview);
})();
