
// function drawElement(snap, x, y, width, height, elementNumber, elementInfo) {
//     var shape;
//
//     shape = snap.rect(x, y, width, height).attr({
//         'class': 'atomicElement'
//     });
//
//     shape = snap.text(x, y, elementNumber.trim());
//
//     shape.attr({
//         x: x + (width / 2 - shape.getBBox().width / 2),
//         y: y + (height / 2  + shape.getBBox().height / 2)
//     });
// }


function maxColumns(array) {
    var maxColumns = 0, i;
    for (i=0; i<periodicTableLayout.length; i++) {
        if (periodicTableLayout[i].length > maxColumns) {
            maxColumns = periodicTableLayout[i].length;
        }
    }
    return maxColumns;
}

function drawElement(snap, x, y, width, height, elementInfo) {

    group = snap.group();

    if (elementInfo.number) {
        box = snap.rect(0,0,200,200).attr({
            stroke: 'black',
            fill: 'white'
        });
        group.append(box);


        text = snap.text(100, 40, elementInfo.number);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '200%'
           });

        group.append(text);

        text = snap.text(100, 110, elementInfo.symbol);
        text.attr({
           'text-anchor': 'middle',
           'font-weight': 'bold',
           'font-size': '360%'
           });

        group.append(text);

        text = snap.text(100, 150, elementInfo.name);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '180%'
           });

        group.append(text);

        text = snap.text(100, 185, elementInfo.atomicWeight);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '180%'
           });

        group.append(text);
    } else {

        box = snap.rect(0,0,200,200).attr({
            stroke: 'none',
            fill: 'white',
            'stroke-width': 0
        });
        group.append(box);

        text = snap.text(100, 110, elementInfo.symbol);
        text.attr({
           'text-anchor': 'middle',
           'font-weight': 'bold',
           'font-size': '300%'
           });

        group.append(text);
    }

    scale = width / 201;


    group.transform('s' + scale.toFixed(2));

    bbox = group.getBBox();

    group.transform('S' + scale.toFixed(2) + 'T' + ((-bbox.x)+x) + ' ' + ((-bbox.y)+y));

}

function drawTable (htmlElementId) {
    var snap, elementRef, element, width, height, rows, columns;

    elementRef = '#' + htmlElementId;
    element = $(elementRef);

    width = element.width();
    height = element.height();

    html = '<svg style="width: ' + element.width() + 'px; height: ' + element.height() + 'px;"/>';

    element.append(html);

    snap =  Snap(elementRef + ' svg');

    rows = periodicTableLayout.length;
    columns = maxColumns(periodicTableLayout);

    cellWidth = 56; //snap.node.clientWidth / columns;
    cellHeight =  56; //snap.node.clientHeight / rows;

    offsetY = 0;
    for (i=0; i<periodicTableLayout.length; i++) {
      offsetX = 0;
      for (j=0; j<periodicTableLayout[i].length; j++) {

          if (periodicTableLayout[i][j] && periodicTableLayout[i][j].trim().length > 0) {

             if (parseInt(periodicTableLayout[i][j].trim()) > 0) {
                 var atomicNumber = periodicTableLayout[i][j].trim();
                 var elementInfo = {
                        number: periodicTableLayout[i][j].trim(),
                        symbol: elements[atomicNumber].symbol,
                        name: elements[atomicNumber].name,
                        atomicWeight: elements[atomicNumber].atomicWeight
                    };

                 createIdealBox(snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             } else {
                 var elementInfo = {
                        symbol: periodicTableLayout[i][j].trim(),
                    };

                 createIdealBox(snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             }
          }

          offsetX = offsetX + cellWidth;
      }
      offsetY = offsetY + cellHeight;
    }
}

