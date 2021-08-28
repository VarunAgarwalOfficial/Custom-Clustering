var fs = require("fs");
var PNG = require("pngjs").PNG;
const express = require("express");
const app = express();
var path = require("path")


app.listen(3000, () => {
  console.log("Listening at Port 3000");
});

function dis(p1, p2) {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
}

function getPixels(id) {
  return new Promise((resolve) => {
    fs.createReadStream(id + ".png")
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        var pixels = [];
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var pos = (this.width * y + x) * 4;
            pixels.push([
              this.data[pos],
              this.data[pos + 1],
              this.data[pos + 2],
            ]);
          }
        }
        resolve(pixels);
      });
  });
}

function getRange(pixels) {
  var ranges = [];
  ranges.push({
    arr: [pixels[0]],
    avg: pixels[0],
  });
  for (var i = 1; i < pixels.length; i++) {
    var done = 0;
    var smallestD = 6000;
    var smallestP = 0;

    for (var j = 0; j < ranges.length; j++) {
      var dist = dis(pixels[i], ranges[j].avg);
      if (dist < 6000) {
        done = 1;
        if (dist < smallestD) {
          smallestP = j;
          smallestD = dist;
        }
      }
    }
    if (done) {
      len = ranges[smallestP].arr.length;
      ranges[smallestP].arr.push(pixels[i]);
      rx = ((ranges[smallestP].avg[0] * len) + pixels[i][0]) / (len + 1);
      ry = ((ranges[smallestP].avg[1] * len) + pixels[i][1]) / (len + 1);
      rz = ((ranges[smallestP].avg[2] * len) + pixels[i][2]) / (len + 1);
      ranges[smallestP].avg = [rx, ry, rz];
    }
    if (done == 0) {
      ranges.push({
        arr: [pixels[i]],
        avg: pixels[i],
      });
    }
  }
  return ranges;
}

function getHtml(ranges) {
  html = "";
  for (var i = 0; i < ranges.length; i++) {
    [r, g, b] = ranges[i].avg;
    html +=
      '<span style = "background-color: rgb(' +
      r +
      "," +
      g +
      "," +
      b +
      ');height: 20%;width:20%;display: inline-block"></span>';
  }
  return html;
}

app.get("/Pallete/:id", async (req, res) => {
  var id = req.params.id;
  console.log(id);
  var pixels = await getPixels(id);
  var ranges = getRange(pixels);
  var html = getHtml(ranges);
  console.log(`Sent the Color Pallete for ${id}.png`);
  res.send(html);
});




function GetNewPixel(pixel, ranges) {
  var smallestD = 100000;
  var smallestP = 0;
  for (var j = 0; j < ranges.length; j++) {
    var dist = dis(pixel, ranges[j].avg);
    if (smallestD > dist){
      smallestP = j;
      smallestD = dist;
    } 
  }
  return(ranges[smallestP].avg)
}

function flatten(id, ranges) {
  fs.createReadStream(id + ".png")
    .pipe(
      new PNG({
        filterType: 4,
      })
    )
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var pos = (this.width * y + x) * 4;
          var newPixel = GetNewPixel(
            [this.data[pos], this.data[pos + 1], this.data[pos + 2]],
            ranges
          );
          this.data[pos] = newPixel[0]
          this.data[pos+1] = newPixel[1]
          this.data[pos+2] = newPixel[2]
        }
      }

      this.pack().pipe(fs.createWriteStream("out.png"));
    });
}

app.get("/Flatten/:id", async (req, res) => {
  var id = req.params.id;
  var pixels = await getPixels(id);
  var ranges = getRange(pixels);
  flatten(id, ranges);
  res.send("done")
});


