# Custom Colour Clustering for Image Quantisation

> **Archived.** Later colour palette work: [Vector-Based-Color-Image-Quantization](https://github.com/VarunAgarwalOfficial/Vector-Based-Color-Image-Quantization). This repository is kept as a record and is read-only.

A small Node.js experiment in colour quantisation. An Express server reads a PNG, groups its pixel colours into clusters, and either returns the cluster colours as an HTML palette or writes a copy of the image with every pixel replaced by its cluster colour.

## Why it is interesting

- It started as a K-means experiment but uses a simpler single-pass clustering instead. Each pixel joins the nearest existing cluster whose mean colour is within a squared RGB distance of 6000 (about 77 units) and updates that cluster's running mean; if no cluster is close enough, the pixel starts a new one.
- So the number of colours is not fixed in advance (there is no k and no iteration): it falls out of the distance threshold and the image itself, and the result depends on pixel order.
- The second pass maps every pixel to its nearest cluster mean, which gives the quantised image.

## Run it

Needs Node.js. Put a PNG (for example `photo.png`) in the directory you start the server from.

```bash
npm install
node app.js
```

Then, with the server on port 3000:

- `http://localhost:3000/Pallete/photo` returns the palette as coloured HTML swatches.
- `http://localhost:3000/Flatten/photo` writes the quantised image to `out.png` and responds with `done`.

The route names are spelt `Pallete` in the code. `npm start` calls `nodemon`, which is not listed as a dependency, so use `node app.js` or install `nodemon` first.

## Tech

JavaScript (Node.js), Express, pngjs.

## Context

Personal experiment, 2021. It led to later work on vector-based colour image quantisation: https://github.com/VarunAgarwalOfficial/Vector-Based-Color-Image-Quantization

## License

MIT, see LICENSE.
