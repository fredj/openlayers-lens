/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Drag.js
 * @requires OpenLayers/Map.js
 */

/**
 * Class: OpenLayers.Control.LayerLens
 *
 * Inerits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.LayerLens = OpenLayers.Class(OpenLayers.Control, {

    /**
     * APIProperty: layer
     * {<OpenLayers.Layer>}
     */
    layer: null,

    /**
     * Property: lensmap
     * {<OpenLayers.Map>}
     */
    lensmap: null,

    /**
     * APIProperty: draggable
     * {Boolean}
     */
    draggable: true,

    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
    },

    draw: function(px) {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.lensmap = new OpenLayers.Map(this.div, OpenLayers.Util.applyDefaults({
            controls: [],
            layers: [this.layer]
        }, this.map.initialOptions));

        if (this.draggable) {
            this.layer.tileLoadingDelay = 0;
            this.handler = new OpenLayers.Handler.Drag(this, {
                move: this.drag
            });
            this.handler.setMap(this.lensmap);
            this.handler.activate();
        }

        this.map.events.register('move', this, this.update);

        return this.div;
    },

    drag: function(px) {
        var left = this.div.offsetLeft - (this.handler.start.x - px.x);
        var top = this.div.offsetTop - (this.handler.start.y - px.y);
        this.div.style.left = left + "px";
        this.div.style.top = top + "px";
        this.update();
    },

    update: function() {
        var px = new OpenLayers.Pixel(this.div.offsetLeft + (this.div.offsetWidth / 2),
                                      this.div.offsetTop + (this.div.offsetHeight / 2));
        this.lensmap.updateSize();
        this.lensmap.moveTo(this.map.getLonLatFromPixel(px),
                            this.map.getZoom());
    },

    destroy: function() {
        if (this.lensmap) {
            this.lensmap.destroy();
        }
        this.map.events.unregister('move', this, this.update);
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    CLASS_NAME: 'OpenLayers.Control.LayerLens'
});
