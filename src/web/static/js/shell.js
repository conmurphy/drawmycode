(function (nx) {

   

    /**
     * define application
     */
    var Shell = nx.define(nx.ui.Application, {
        methods: {
            start: function () {


                function extendNodeTooltip() {
                    nx.define('ExtendedNodeTooltip', nx.ui.Component, {
                      'properties': {
                        "node": {
                          set: function(value) {
                        
                            var model = value.model();
                            var dataCollection = new nx.data.Collection(filterModel(model.getData()));
                  
                            //this.view('list').set('items', dataCollection);
                            this.view('variableTable').set('items', dataCollection);
                            this.title(value.label());
                  
                            function filterModel(model) {
                  
                              var newModel = [{
                                  label: "Name:",
                                  value: model.Name
                                }, {
                                  label: "Package:",
                                  value: model.Package
                                }, {
                                  label: "Parent Function:",
                                  value: model.OriginatingFunctionName
                                }, {
                                    label: "Group:",
                                    value: model.Group
                                }
                  
                              ];

                              variables = ""

                              topologyData.nodes.forEach(function(element) {
                                if (element.Name == model.Name)
                                {
                                    if (typeof element.Variables != 'undefined' && element.Variables instanceof Array)
                                    {
                                        element.Variables.forEach(function(element) {

                                            if (typeof element.Names != 'undefined' && element.Names instanceof Array)
                                            {
                                                variables += " - Names: " 
                                                element.Names.forEach(function(element) {
                                                    variables += element.Name + ",\n"
                                                });
                                            }
                                        
                                            if (typeof element.Values != 'undefined' && element.Values instanceof Array)
                                            {
                                                variables += " - Values: " 
                                                element.Values.forEach(function(element) {
                                                    variables += element.Value + ",\n"
                                                });
                                            }

                                            if (typeof element.Types != 'undefined' && element.Types instanceof Array)
                                            {
                                                variables += " - Types: " 
                                                element.Types.forEach(function(element) {
                                                    variables += element.Type + ",\n"
                                                });
                                            }
                                        });

                                        variables += "\n" 

                                    }
                                } 

                              }) ;

                              newModel.push({label:"Variables:",value:variables})

                              return newModel;
                  
                            }
                  
                          }
                        },
                        "title": "",
                        "nodePayload": {},
                        "topology": {}
                      },
                      // 'view' defines the appearance of the tooltip
                      view: {
                        content: [{
                           
                            tag: "table",
                            props: {
                                class: "col-md-12",
                                border: "1"
                            },
                            content: [{
                                tag: "thead",
                                content: {
                                    tag: "tr",
                                    content: [ {
                                        tag: "td",
                                        content: "Variable Name"
                                    }, {
                                        tag: "td",
                                        content: "Type"
                                    }, {
                                        tag: "td",
                                        content: "Value"
                                    }]
                                }
                            }, 
                            {
                                name: 'variableTable',
                                tag: "tbody",
                                props: {
                                        tag: "tr",
                                        content: [{
                                            tag: "td",
                                            content: [{
                                                tag: "spane",
                                                content: '{value}'
                                            }]
                                        }, {
                                            tag: "td",
                                            content: "test"
                                        }, {
                                            tag: "td",
                                            content: "test"
                                        }]
                                    
                                  }
                            },
                                      {
                                tag: "tbody",
                                props: {
                                        tag: "tr",
                                        content: [{
                                            tag: "td",
                                            content: "status"
                                        }, {
                                            tag: "td",
                                            content: "test"
                                        }, {
                                            tag: "td",
                                            content: "test"
                                        }]
                                    
                                  }
                            }]
                        }]
                       /* content: [{
                          name: 'header',
                          props: {
                            'class': 'n-topology-tooltip-header'
                          },
                          content: [{
                            tag: 'span',
                            props: {
                              'class': 'n-topology-tooltip-header-text'
                            },
                            name: 'title',
                            content: '{#title}'
                          }]
                        }, {
                          name: 'content',
                          props: {
                            'class': 'n-topology-tooltip-content n-list'
                          },
                          content: [{
                            name: 'list',
                            tag: 'ul',
                            props: {
                              'class': 'n-list-wrap',
                              template: {
                                tag: 'li',
                                props: {
                                  'class': 'n-list-item-i',
                                  role: 'listitem'
                                },
                                content: [{
                                  tag: 'label',
                                  content: '{label}: '
                                }, {
                                  tag: 'span',
                                  content: '{value}'
                                }]
                  
                              }
                            }
                          }]
                        }, {
                            name: 'variablesTable',
                            props: {
                              "class":""
                            },
                            tag: 'table',
                            content: [{
                                                           
                              props: {
                                template: {
                                  tag: 'tr',
                                  props: {
                                  
                                  },
                                  content: [{
                                    tag: 'td',
                                    content: '{value}'
                                  }]
                    
                                }
                              }
                            }]
                          }]*/
                        
                      },
                      "methods": {
                  
                        // inherit standard properties & methods
                        "init": function(args) {
                          this.inherited(args);
                        }
                  
                      }
                    });
                  }
                  
                extendNodeTooltip();

                nx.define('MyLink', nx.graphic.Topology.Link, {
                    properties: {
                      drawMethod: function() {
                        return function(edge) {
                          var line = this.line();
                          var path = [];
                          path.push('M', line.start.x, line.start.y);
                          path.push('a', " 50 50 0 1 0 0.001 0");
                          return path.join(' ');
                        }
                  
                      }
                    }
                  });

                nx.define('NodeSet.Aggregation', nx.ui.Component, {
                    view: {
                        content: {
                            name: 'topo',
                            type: 'nx.graphic.Topology',
                            props: {
                                adaptive: true,
                                identityKey: 'id',
                                nodeConfig: {
                                    label: 'model.id',
                                    iconType: 'model.device_type'
                                },
                                showIcon: false,
                                data: topologyData,
                                enableSmartLabel: false,
                                enableSmartNode: false,
                                enableGradualScaling: false,
                                //                    supportMultipleLink: false
                            }
                        }
                    }
                });


                var highlighted = false
                var visible = true

                nx.define("ActionPanel", nx.ui.Component, {
                    view: {
                        content: [
                            {
                                tag: "button",
                                content: "Highlight External Packages",
                                events: {
                                    click: "{#onHiglightExternalPackages}"
                                }
                            },
                            {
                                tag: "button",
                                content: "Hide external packages",
                                events: {
                                    click: "{#onHideExternalPackages}"
                                }
                            },
                        ]
                    },
                    methods: {
                       
                        // Show all of the external packages by highlighting
                        "onHiglightExternalPackages": function(sender, events){
                            

                            var groupsLayer = topo.getLayer("groups");
                            var nodesDict = topo.getLayer("nodes").nodeDictionary();
                            var nodes = []
                            var groups = []
                
                            var groupCount = 1

                            if (highlighted)
                            {
                                highlighted = false
                               
                                groupsLayer.clear();
                            
                            }
                            else
                            {
                               
                                highlighted = true

                                  
                                    topo.eachNode(function(element) {
                                        if (element._model._data.Group > groupCount)
                                        {
                                            groupCount = element._model._data.Group;
                                        }
                                    });
                        
                                    
                                    var colorTable = ['#513B56', '#525174', '#348AA7', '#5DD39E', '#BCE784'];
                        
                                    for (var i = 1; i <= groupCount ; i++) { 
                                    nodes = []

                                        var package = "";

                                        topo.eachNode(function(element) {
                                            if (element._model._data.Group == i && element._model._data.Package != "This")
                                            {
                                                nodes.push(nodesDict.getItem(element._model._data.id));
                                                package = element._model._data.Package;
                                            
                                            }
                                        });
                        
                                        var group = groupsLayer.addGroup({
                                            nodes: nodes,
                                            label:package,
                                            group: 'group' + i

                                        });
                        
                                
                                        groups.push(group);
                                    }
                            }

                          
                        },
                        // Show all of the external packages by highlighting
                        "onHideExternalPackages": function(sender, events){

                            if (visible)
                            {
                                
                                visible = false

                                topologyData.nodes.forEach(function(element) {
                                    if (element.Package != "This")
                                    {
                                        topo.graph().getVertex(element.id).visible(false);
                                            
                                    }
                                });

                            
                            }
                            else
                            {
                              
                                visible = true

                                topologyData.nodes.forEach(function(element) {
                                    if (element.Package != "This")
                                    {
                                        topo.graph().getVertex(element.id).visible(true);
                                            
                                    }
                                });

                               
                        
                            }

                          
                        },
                        
                    }
                });

                //your application main entry

                // initialize a topology
                var topo = new nx.graphic.Topology({
                    

                    linkInstanceClass: function(edge) {
                        if (edge.sourceID() == edge.targetID()) {
                          return 'MyLink'
                        } else {
                          return 'nx.graphic.Topology.Link'
                        }
                      },

                    autoLayout: true,

                    showNavigation: true,
                   			
					// property name to identify unique nodes
					identityKey: 'id', // helps to link source and target
					
					// if true, two nodes can have more than one link
					supportMultipleLink: true,

                    // creates layout automatically
                    dataProcessor: "force",

                     // show node's icon, could change to false to show dot
                     showIcon: true,
                     enableSmartLabel: true,
                     enableSmartNode: true,
 
                     adaptive: true,

                    // set the topology view's with and height
                    width: 1920,
                    height: 1000,

                    // node config
                    nodeConfig: {
                        // label display name from of node's model, could change to 'model.id' to show id
                        label: 'model.Name',
                        color: 'model.Color'
                    },
                    
                    // link config
                    linkConfig: {
                        // multiple link type is curve, could change to 'parallel' to use parallel link
                        linkType: 'curve',
                        label: 'model.originatingFunction'
                    },
                    
                    // custom tooltip
                    tooltipManagerConfig: {
                        nodeTooltipContentClass: "ExtendedNodeTooltip"
                    },

                   
                   
                });

                //set data to topology
                topo.data(topologyData);
                
                //attach topology to document
                topo.attach(this);

                // instantiate ActionPanel class
                var actionPanel = new ActionPanel();
                actionPanel.attach(this);
                
               
              
               var searchBoxDataToDisplay = [];

               // This is used in order to colour the correct nodes - we will search by node id
               var searchBoxDataWithID = [];
              
                var search = new autoComplete({
                    selector: '#searchBox',
                    minChars: 1,
                    source: function(term, suggest){
                        term = term.toLowerCase();
                        var choices = searchBoxDataToDisplay;
                        var suggestions = [];
                        for (i=0;i<choices.length;i++)
                            if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                        suggest(suggestions);
                    },
                    renderItem: function (item, search){
                        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                        return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
                    },
                    onSelect: function(e, term, item){

                        // Split the value that was selected in the search box into the name and the type (function, variable)
                        var selected = item.getAttribute('data-val')

                        var selectedType = selected.match(/Function|Variable Name|Variable Value|Variable Type/)

                        var selected = selected.replace(/Function: |Variable Name: |Variable Value: |Variable Type: /g,"")
                        

                        // Filter to retun just the results
                        var results = searchBoxDataWithID.filter(
                            function selectedType(searchBoxDataWithID) {
                                return searchBoxDataWithID.Name == selected;
                            })

                            console.log(searchBoxDataWithID)
                            console.log(results)
                        results.forEach (function(element){
                            
                            topo.getNode(element.id).color("purple")
                            
                        });
        

                        
                    }
                });

                
                topo.on("topologyGenerated", function() {

                    // Popoulates the autocomplete search box when the topology is generated and also the search box + IDs array which
                    // will be used to highlight the nodes
                    topologyData.nodes.forEach(function(element) {
                        
                        if (!searchBoxDataToDisplay.includes("Function: " + element.Name )) {
                            element.Name = element.Name.replace(/['"]+/g ,"")
                            searchBoxDataToDisplay.push("Function: " + element.Name)
                           
                        }

                        searchBoxDataWithID.push({Type:"Function",Name: element.Name,id: element.id})

                        if (typeof element.Variables != 'undefined' && element.Variables instanceof Array)
                        {
                            element.Variables.forEach(function(element) {

                                if (typeof element.Names != 'undefined' && element.Names instanceof Array)
                                {
                                    element.Names.forEach(function(element) {
                                        if (element.Name != 'undefined' )
                                        {
                                            element.Name = element.Name.replace(/['"]+/g ,"")
                                            if (!searchBoxDataToDisplay.includes("Variable Name: " + element.Name ) )
                                            {
                                                searchBoxDataToDisplay.push("Variable Name: " + element.Name)
                                            }
                                            searchBoxDataWithID.push({Type:"Variable Name",Name: element.Name,id: element.id})
                                        }
                                    });
                                }


                                if (typeof element.Values != 'undefined' && element.Values instanceof Array)
                                {
                                    element.Values.forEach(function(element) {
                                        if (element.Value != 'undefined' )
                                        {
                                            element.Value = element.Value.replace(/['"]+/g ,"")
                                            if (!searchBoxDataToDisplay.includes("Variable Value: " + element.Value ) )
                                            {
                                                searchBoxDataToDisplay.push("Variable Value: " + element.Value)
                                            }
                                            searchBoxDataWithID.push({Type:"Variable Value",Name: element.Value,id: element.id})
                                        }
                                    });
                                }

                                if (typeof element.Types != 'undefined' && element.Types instanceof Array)
                                {
                                    element.Types.forEach(function(element) {
                                        if (element.Type != 'undefined' )
                                        {
                                            element.Type = element.Type.replace(/['"]+/g ,"")
                                            if (!searchBoxDataToDisplay.includes("Variable Type: " + element.Type ) )
                                            {
                                             searchBoxDataToDisplay.push("Variable Type: " + element.Type)
                                            }
                                            searchBoxDataWithID.push({Type:"Variable Type",Name: element.Type,id: element.id})
                                        }
                                    });
                                }

                            });
                        }

                    });

                 

                });


                
            }
        }
    });

    
    
    

    /**
     * create application instance
     */
    var shell = new Shell();

    /**
     * invoke start method
     */
    shell.start();
})(nx);

