(function () {
  var tilesets = [];
  var tiles = [];
  tiles.push(null);

  tmxJSON = {
    map: null,

    load: function (jsonFile) {
      var xhr = new XMLHttpRequest();
      window.addEventListener("resize", resizeCanvas, false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          tmxJSON.parse(xhr.responseText);
          console.log(xhr.responseText);
        }
      };
      xhr.open("GET", jsonFile, true);
      xhr.send();
    },

    parse: function (json) {
      map = eval("(" + json + ")");

      tmxJSON.loadTilesetImages();
    },

    loadTilesetImages: function () {
      var successCount = 0;
      var errorCount = 0;

      for (var ts = 0; ts < map.tilesets.length; ts++) {
        var image = new Image();
        image.addEventListener("load", function () {
          successCount++;
          if (successCount + errorCount == map.tilesets.length) {
            tmxJSON.separateTiles();
          }
        });
        image.addEventListener("error", function () {
          errorCount++;
          alert("error loading: " + map.tilesets[ts].image);
        });
        image.src = map.tilesets[ts].image;

        tilesets.push(image);
      }
    },

    separateTiles: function () {
      var successCount = 0;

      for (var ts = 0; ts < tilesets.length; ts++) {
        var nTilesX = tilesets[ts].width / map.tilewidth;
        var nTilesY = tilesets[ts].height / map.tileheight;

        for (ty = 0; ty < nTilesY; ty++) {
          for (tx = 0; tx < nTilesX; tx++) {
            var tileCanvas = document.createElement("canvas");
            var tileContext = tileCanvas.getContext("2d");

            tileCanvas.width = map.tilewidth;
            tileCanvas.height = map.tileheight;

            var x = tx * map.tilewidth;
            var y = ty * map.tileheight;

            tileContext.drawImage(tilesets[ts], -x, -y);

            var tile = new Image();
            tile.src = tileCanvas.toDataURL("image/png");

            tiles.push(tile);
          }
        }
      }
      tmxJSON.drawTiles();
    },

    drawTiles: function () {
      for (var l = 0; l < map.layers.length; l++) {
        //Enge public stuff die ook ergens anders vandaan kan komen
        var PlayerX = 0;
        var PlayerY = 0;
        var drawScale = 0.5;

        var x = 0 + PlayerX;
        var y = 0 + PlayerY;

        if (map.layers[l].type === "tilelayer") {
          for (var d = 0; d < map.layers[l].data.length; d++) {
            if (d % map.width == 0 && d != 0) {
              y += map.tileheight;
              x = 0;
            }

            if (map.layers[l].data[d] != 0) {
              context.drawImage(
                tiles[map.layers[l].data[d]],
                x * drawScale,
                y * drawScale,
                32 * drawScale,
                32 * drawScale
              );
            }
            x += map.tilewidth;
          }
        }
      }
    },
  };
  function resizeCanvas() {
    var tileCanvas = document.getElementById("display");
    tileCanvas.width = window.innerWidth;
    tileCanvas.height = window.innerHeight;
    tmxJSON.drawTiles();
  }
})();
