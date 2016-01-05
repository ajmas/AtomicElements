var settings = {
    familyColour: false,
    elementSpacing: 2,
    showDetails: true
    };


function addDetailsRow( propertyName, value ) {
    return '<li style="display: block"><label style="font-weight: bold; width: 200px; display: inline-block;">' + propertyName + ':</label> ' + value + '</li>';
}

function showDetails(elementNumber) {
    var html = '';
    if (elementNumber && elementNumber.trim().length > 0) {
        html += '<ul>'
        html += addDetailsRow( 'Atomic Number', elementNumber );
        html += addDetailsRow( 'Symbol', elements[elementNumber].symbol );
        html += addDetailsRow( 'Name', elements[elementNumber].name );
        html += addDetailsRow( 'Atomic Weight', elements[elementNumber].atomic_weight );
        html += addDetailsRow( 'Radioactive', 'undefined' );
        html += '</ul>';
    } else {
        html += '<p style="margin-left: 40px">No Element selected</p>';
    }

    $('#elementDetails .content').html(html);
}


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
    var box, text, rect, elementId, cssClass = 'element ';

    group = snap.group();

    if (elementInfo.number) {
        if (elementInfo.family && elementInfo.family.trim().length > 0) {
            cssClass += elementInfo.family
                .toLowerCase().replace(' ', '').replace('-', '');
            if (settings.familyColour === false) {
                cssClass += ' nofill';
            }
        }

        box = snap.rect(0,0,200,200).attr({
            stroke: 'white',
            fill: 'white',
            'class': cssClass
        });
        group.append(box);


        text = snap.text(100, 40, elementInfo.number);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '200%'
           });

        group.append(text);

        text = snap.text(100, 105, elementInfo.symbol);
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

        elementId = 'element-' + elementInfo.number;

    } else {
        box = snap.rect(0,0,200,200).attr({
            stroke: 'none',
            fill: 'none',
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

    scale = width / 200;

    group.transform('s' + scale.toFixed(2));

    bbox = group.getBBox();

    group.transform('S' + scale.toFixed(2) + 'T' + ((-bbox.x)+x) + ' ' + ((-bbox.y)+y));

    if (elementInfo.number) {
        group2 = snap.group();
        group2.append(group);

        rect = snap.rect(x, y, width, height).attr({
           stroke: 'black',
           fill: 'none',
           'stroke-width': '1px'
        });
        group2.append(rect);

        group2.attr({
           id: elementId
        });

        $('#' + elementId).on('mouseenter', function (event) {
            Snap.select('#' + elementId).attr('class', 'highlight');
            showDetails(elementId.substring(elementId.indexOf('-') + 1));
        });

        $('#' + elementId).on('mouseleave', function (event) {
            Snap.select('#' + elementId).attr('class', '');
            showDetails();
        });
    } else {
        snap.rect(x, y, width, height).attr({
           stroke: 'black',
           fill: 'none',
           strokeDasharray: '5 5'
        });
    }
}

function initSnap (htmlElementId) {
    var snap, elementRef, element, width, height;

    elementRef = '#' + htmlElementId;
    element = $(elementRef);

    width = element.width();
    height = element.height();

    html = '<svg style="width: ' + element.width() + 'px; height: ' + element.height() + 'px;" shape-rendering="crispEdges" />';

    element.append(html);

    return  Snap(elementRef + ' svg');
}

function drawTable (htmlElementId) {
    var snap, rows, columns, options;

    snap = initSnap(htmlElementId);

    //

    if (document.location.hash) {
        options = document.location.hash.substring(1).split(',');
        if (options.indexOf('colour') > -1) {
            settings.familyColour = true;
        }
        if (options.indexOf('hideDetails') > -1) {
            settings.showDetails = false;
        }
    }

    rows = periodicTableLayout.length;
    columns = maxColumns(periodicTableLayout);

    cellWidth = 55;
    cellHeight =  55;

    offsetY = 2;
    for (i=0; i<periodicTableLayout.length; i++) {
      offsetX = 2;
      for (j=0; j<periodicTableLayout[i].length; j++) {

          if (periodicTableLayout[i][j] && periodicTableLayout[i][j].trim().length > 0) {

             if (parseInt(periodicTableLayout[i][j].trim()) > 0) {
                 var atomicNumber = periodicTableLayout[i][j].trim();
                 var elementInfo = {
                        number: periodicTableLayout[i][j].trim(),
                        symbol: elements[atomicNumber].symbol,
                        name: elements[atomicNumber].name,
                        atomicWeight: elements[atomicNumber].atomic_weight,
                        family: elements[atomicNumber].family
                    };

                 drawElement (snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             } else {
                 var elementInfo = {
                        symbol: periodicTableLayout[i][j].trim(),
                    };

                 drawElement (snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             }
          }

          offsetX = offsetX + cellWidth + settings.elementSpacing ;
      }
      offsetY = offsetY + cellHeight + settings.elementSpacing;
    }

    if (settings.familyColour === false) {
        $('#legend').css('display', 'none');
    }

    if (settings.showDetails === false) {
        $('#elementDetails').css('display', 'none');
    }
}

