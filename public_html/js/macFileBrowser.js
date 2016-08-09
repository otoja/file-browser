angular.module("macFileBrowser", [])
        .controller('MacFileBrowserCtrl', function ($scope, $timeout, AncestorsFactory) {

            $scope.ancestorsObject = AncestorsFactory;
            $scope.ancestors = $scope.ancestorsObject.getAncestors();

            var nodes = [
                {id: 1, parentId: -1, name: "Folder1", type: 0, children: []},
                {id: 2, parentId: -1, name: "Folder2", type: 0, children: []},
                {id: 3, parentId: -1, name: "Folder3", type: 0, children: []},
                {id: 4, parentId: -1, name: "Folder4", type: 0, children: []},
                {id: 5, parentId: -1, name: "Folder5", type: 0, children: []}
            ];

            var deselectNodes = function (nodes) {
                _.each(nodes, function (n) {
                    n.selected = false;
                });
            };

            var getChildrenNodes = function (parentNode) {
                var children = [];
                var types = [0, 144];

                for (var i = 1; i < 7; i++) {
                    var rand = types[Math.floor(Math.random() * types.length)];
                    children.push({id: parentNode.id + i + (Math.floor(Math.random() * 13)), parentId: parentNode.id, name: parentNode.name + ' ' + i, type: rand, children: []});
                }
                return children;
            };

            $scope.options = {
                width: 350,
                nodes: nodes
            };

            $scope.selectNode = function (node, evt) {
                if (node.type === 0 && !node.children.length) {
                    node.children = getChildrenNodes(node);
                }

                $scope.ancestorsObject.addToPath(node);
                $scope.ancestors = $scope.ancestorsObject.getAncestors();

                var nodes = node.parentId === -1 ? $scope.options.nodes : $scope.ancestors[$scope.ancestors.length - 2].children;
                deselectNodes(nodes);
                node.selected = true;

                $timeout(function () {
                    $("#file-browser").scrollLeft($(window).width());
                });
            };
        })
        .factory('AncestorsFactory', function () {
            var o = {};
            o._ancestors = [];

            o._ancestorsContainsNode = function (nodeId) {
                return _.findWhere(o._ancestors, {'id': nodeId}) !== undefined;
            };

            o._clearAncestors = function () {
                o._ancestors = [];
            };

            o.addToPath = function (node) {
                if (node.parentId === -1 || (o._ancestorsContainsNode(node.parentId) && !o._ancestorsContainsNode(node.id))) {
                    var parentNode = _.findWhere(o._ancestors, {id: node.parentId});
                    if (!parentNode) {
                        o._clearAncestors();
                    } else {
                        o._ancestors = o._ancestors.slice(0, o._ancestors.indexOf(parentNode) + 1);
                    }
                    o._ancestors.push(node);
                }
            };

            o.getAncestors = function () {
                return o._ancestors;
            };



            return o;
        });