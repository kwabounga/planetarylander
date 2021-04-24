# Planetary Lander ![icon](https://kwabounga.fr/planetarylander/favicon.png) 
**/!\ work in progress /!\\** 

[demo](https://kwabounga.fr/planetarylander/)  

Test for MatterJs and PixiJs

## Description:
it is a variation of the atari lunar lander in arcade mode


Using [http-server](https://www.npmjs.com/package/http-server) to run it locally:  
  

  ```shell 
  > npm install http-server -g
  > cd /path/to/planetarylander/
  > http-server
  Starting up http-server, serving ./
  Available on:
    http://192.168.1.90:8080
    http://127.0.0.1:8080
  Hit CTRL-C to stop the server
  ```
 then open a browser window

 ### For the moment; access the different worlds with:  
 http://192.168.1.90:8080#moon  
 http://192.168.1.90:8080#mars  
 http://192.168.1.90:8080#europa  
 http://192.168.1.90:8080#titan  


for now only the first levels of each world are available

### Checklist:
- [x] worlds description in json format
- [x] landers description in json
- [x] levels description in json  
 cf:  [moon.json](./data/moon.json); 
      [mars.json](./data/mars.json); 
      [europa.json](./data/europa.json); 
      [titan.json](./data/titan.json)
- [x] [bonus](./exports/game/levels/BonusSprite.js) ([fuel](./data/mars.json))
- [ ] more bonus
- [x] [damages](./exports/game/levels/Level.js#damageLander)
- [x] SpriteSheetAutoSlicer !! for explosion
- [x] [lander](./exports/game/levels/Level.js#die) [explosion](./exports/game/landers/Landers.js#explosion)
- [x] [Terrains](./exports/game/levels/Terrains.js#TerrainsFactory); Levels; and [landers](./exports/game/landers/Landers.js#LandersFactory) Factories
- [x] Debugging : [wireframe](./exports/tools/tools.js#wireFrameFromVertex) for Matter shape in pixi
- [x] Menu with matter
- [x] Menu description in json
- [x] Menu stars like balls !
- [x] Accessing level from [menu](./exports/menu/Menu.js#launchLevel) with event 
- [x] Rules : europa [gravity](./exports/game/levels/Level.js#gravityRule)
- [ ] Rules : mars  [dust devils](./exports/game/levels/Level.js#dustDevils)
- [ ] Rules : titan jets
- [x] Data loader 
- [x] swap / overLoad Texture
- [x] start sequency ( 3, 2, 1, Go)
- [x] Pause
- [ ] switch between the worlds from the menu
- [ ] back to the menu from the game (pause exit)
- [ ] add progression and lock levels accordingly
- [ ] add a login system and save the progression in bdd
- [ ] todo todo

