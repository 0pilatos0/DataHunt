(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("grass5x3",
{ "compressionlevel":-1,
 "editorsettings":
    {
     "export":
        {
         "format":"js",
         "target":"grass5x3..js"
        }
    },
 "height":3,
 "infinite":false,
 "layers":[
        {
         "data":[2, 8, 8, 8, 5, 3, 9, 9, 9, 6, 4, 1, 1, 1, 7],
         "height":3,
         "id":1,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":5,
         "x":0,
         "y":0
        }],
 "nextlayerid":2,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.4.3",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "source":"C:\/Users\/paulv\/Desktop\/Floors_outdoor (1).tsx"
        }],
 "tilewidth":32,
 "type":"map",
 "version":1.4,
 "width":5
});