# Terrains

## How to create terrain?

### Specificities

* width: `800px`
* height: `2000px`


1. create a visual
2. create a associate svg with illustrator
3. open the svg in the browser 
   * create snippet with this [code](#codeSnippet)
   * run the snippet
   * copy / paste the good svg format
   * create a new svg file or overwrite the illustrator one
4. write the infos in the json level object
5. run the game in Debug Mode
6. modify the centerOfMass attribute to put the body terrain in the good place
7. retry again and again 

#### codeSnippet
```javascript SvgCodeSnippet.js
var polys = document.querySelectorAll('polygon,polyline');
[].forEach.call(polys,convertPolyToPath);

function convertPolyToPath(poly){
  var svgNS = poly.ownerSVGElement.namespaceURI;
  var path = document.createElementNS(svgNS,'path');
  var pathdata = 'M '+poly.getAttribute('points');
  if (poly.tagName=='polygon') pathdata+='z';
  path.setAttribute('style', "fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1")
  path.setAttribute('d',pathdata);
  poly.parentNode.replaceChild(path,poly);
}

let svg = document.querySelectorAll('svg')[0];
console.log(svg);
```