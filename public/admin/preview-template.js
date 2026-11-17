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

    return h('iframe', {
      ref: ref,
      style: { width: '100%', height: '100%', minHeight: '80vh', border: 0 },
    });
  }

  CMS.registerPreviewTemplate('blog', BlogPreview);
})();
