# JDLightbox

A small, framework-free lightbox for images and embedded pages. JDLightbox uses the browser's native dialog for keyboard and focus handling.

## Usage

Include the stylesheet and script. Mark each link with `data-jdlightbox`, then create a lightbox after the page has loaded.

```html
<link rel="stylesheet" href="lib/jdlightbox.css">

<a href="photo.jpg" data-jdlightbox title="A mountain lake">
  <img src="thumbnail.jpg" alt="A mountain lake">
</a>

<script src="lib/jdlightbox.js"></script>
<script>
  new JDLightbox();
</script>
```

The link's `title` becomes the caption and image description. If there is no title, JDLightbox uses the linked thumbnail's `alt` text. An image without either has no caption. The original link remains available when JavaScript is disabled.

Add `data-jdlightbox-iframe` to show an embedded page instead of an image. Use a title to describe the frame. Some sites do not allow themselves to be embedded.

```html
<a href="example.html" data-jdlightbox data-jdlightbox-iframe title="Example page">Open example</a>
```

Click the close button, click outside the content, or press Escape to close the dialog. The original link is available inside the dialog. Modified clicks, download links, and links with a target other than `_self` keep their normal behavior.

The lightbox listens for clicks on the document. Links added later work without further setup. You can supply a different selector or remove an instance when it is no longer needed:

```js
const lightbox = new JDLightbox({ selector: 'a.gallery' });
lightbox.destroy();
```

The selector must match links. Create one instance for each set of links. Avoid selectors that overlap.

## Development

Run `npm ci`, `npm run build`, and `npm test`. The browser tests require Chrome or Chromium. Set `CHROME_BIN` if it is not on the path. The generated files in `lib` are committed.

JDLightbox requires a browser with native `<dialog>` support. It is released under the [MIT license](LICENSE.md).
