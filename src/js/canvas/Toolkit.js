const jsPlumbToolkit = window.jsPlumbToolkit
const _CanvasBase = require('./_CanvasBase')

class Toolkit extends _CanvasBase {

    constructor(canvas) {
        super(canvas)

        // get a new instance of the Toolkit. provide a set of methods that control who can connect to what, and when.
        this.toolkit = jsPlumbToolkit.newInstance({
            beforeStartConnect: (fromNode, edgeType) => {
                return {
                    type: edgeType,
                    direction: 'none',
                    leftSize: 0,
                    rightSize: 0
                }
            },
            beforeConnect: (fromNode, toNode, edgeData) => {
                var ret = true
                //Prevent self-referencing connections
                if (fromNode == toNode) {
                    ret = false
                } else {
                    //Between the same two nodes, only one perspective connection may exist
                    switch (edgeData.type) {
                        case 'perspective':
                            var edges = fromNode.getEdges({ filter: function (e) { return e.data.type == 'perspective' } })
                            for (var i = 0; i < edges.length; i+= 1) {
                                var ed = edges[i]
                                if ((ed.source == fromNode && ed.target == toNode) || (ed.target == fromNode && ed.source == toNode)) {
                                    ret = false
                                    break
                                }
                            }
                            break
                    }
                }
                return ret
            },
            saveStateOnExit:true,              // serialize state on page unload automatically. defaults to false.
            saveStateOnDrag:true,              // serialize state after each drag. defaults to false.
            stateHandle: 'metaMapCanvas_' + (canvas.mapId || canvas.mapName),
            saveState: function (...o) {
                debugger
            }
        })
    }

    bindEvents() {
        this.toolkit.bind("dataUpdated", () => {
            this.canvas.update()
            this.canvas.dumpEdgeCounts();
            this.canvas.jsRenderer.State.save()
            this.canvas.onAutoSave(this.canvas.exportData())
        })
    }
}

module.exports = Toolkit