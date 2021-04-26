# Planetary Lander ![icon](https://kwabounga.fr/planetarylander/favicon.png) 
**/!\ work in progress /!\\** 

[demo](https://kwabounga.fr/planetarylander/)  

Test for MatterJs and PixiJs  
____

## Description:
it's a variation of the atari lunar lander in arcade mode
____

## Controls:

direction:  
<table style="border:none">
  <tr>
    <td colspan="3" align="center">
      <kbd>up</kbd>  
    </td>
  </tr>
  <tr>
    <td> <kbd>left</kbd> </td>
    <td>  </td>
    <td> <kbd>right</kbd> </td>
  </tr>
</table>

pause: <kbd>space</kbd>
____

## Progress


### optimise project for production
``` shell
# clean up old build files
> npm run clean

# combine js files
> npm run combine

# minify js files
> npm run minify

# clean & combine & minify
> npm run build
```


### local
Using [http-server](https://www.npmjs.com/package/http-server) to run it locally:  
  

  ```shell 
  > npm install http-server -g
  > cd /path/to/planetarylander/
  > http-server
  Starting up http-server, serving ./
  Available on:
    http://192.168.1.XX:8080
    http://127.0.0.1:8080
  Hit CTRL-C to stop the server
  ```

 then open a browser window

 ### For the moment; access the different worlds with:  
 http://127.0.0.1:8080#moon  
 http://127.0.0.1:8080#mars  
 http://127.0.0.1:8080#europa  
 http://127.0.0.1:8080#titan  

> http://x.x.x.x:8080/index_dev.html#moon  
for dev version (files no minified)  
> http://x.x.x.x:8080/index.html#moon  
for prod version (minified)  


for now only the first levels of each world are available
____
### Checklist / TODO:
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
- [x] Debugging : [wireframe](./exports/tools/tools.js#wireFrameFromVertex) for Matter shapes in Pixi
- [x] Menu with matter
- [x] Menu description in json
- [x] Menu stars like balls !
- [x] Accessing level from [menu](./exports/menu/Menu.js#launchLevel) with event 
- [x] Rules : europa [gravity](./exports/game/levels/Level.js#gravityRule)
- [ ] Rules : mars  [dust devils](./exports/game/levels/Level.js#dustDevils)
- [ ] Rules : titan jets
- [x] Data loader 
- [x] swap / overLoad Texture
- [x] start sequency (3, 2, 1, Go)
- [x] Pause
- [ ] switch between the worlds from the menu
- [ ] back to the menu from the game (pause exit)
- [ ] confirm modal
- [ ] add progression and lock levels accordingly
- [ ] add a login system and save the progression in bdd
- [x] [clean up](./exports/scripts/clean.js) production files
- [x] [combine](./exports/scripts/combiner.js) js classes using my own system
- [x] js classes minification using google-closure-compiler system
- [x] [build script](./package.json) : clean / combine and minify 
- [x] show loading animation between unload menu and getStarted

