class Node {

    constructor(canvas) {
        this.canvas = canvas
    }

    //
    // dummy for a new node.
    //
    getNewNode(type) {
        type=type||"idea"
        return {
            w:50,
            h:50,
            label:"idea",
            type: type,
            children: [],
            labelPosition: []
        }
    }

    getView() {
        return {
            all: {
                events: {
                    tap: (obj) => {
                        this.canvas.clearSelection(obj)
                    },
                    mouseenter: (obj) => {

                    },
                    contextmenu: (node, port, el, e) => {
                        if (node && node.el) {
                            $.contextMenu({
                                selector: `#${node.el.id}`,
                                items: {
                                    copy: {
                                        name: "Copy",
                                        callback: function(key, opt){
                                            alert("Clicked on " + key);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            },
            default: {
                parent: "all",
                template:"tmplNode"
            },
            idea: {
                parent: "default"
            },
            "r-thing": {
                parent: "idea"
            }
        }
    }
}

module.exports = Node