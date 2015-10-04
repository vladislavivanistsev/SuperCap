angular.module('SuperCap').controller('DataCtrl', function ($scope, DataService) {

    DataService.getAnions().then(function (response) {
        $scope.anions = response.data;
    });

    DataService.getCations().then(function (response) {
        $scope.cations = response.data;
    });

    DataService.getElectrolytes().then(function (response) {
        $scope.electrolytes = response.data;
    });

    $scope.inputChanged = function () {
        if ($scope.selectedAnion && $scope.selectedCation && $scope.selectedElectrolyte) {
            refreshChart($scope.selectedAnion, $scope.selectedCation, $scope.selectedElectrolyte);
        }
    };
    
    
    var inputsList = [];
    $(document).ready(function() {
        $('#add-input-set').click(function() {
            addNewInputSet(inputsList.length, inputsList);
            inputsList.push(inputsList.length);
        });
    });

//    $scope.save = function(book) {
//        BookService.editBook(book).then(function(response) {
//            book = response.data;
//        })
//    }
//    $scope.createBook = function(newbook) {
//        BookService.addBook(newbook).then(function(response) {
//            $scope.books.push(newbook);
//        })
//    }

    createChart();
    load3Dmodel();
    

});

function load3Dmodel() {
    var glmol = new GLmol('glmol', true);

    glmol.defineRepresentation = function () {
        var all = this.getAllAtoms();
        var hetatm = this.removeSolvents(this.getHetatms(all));
        this.colorByAtom(all, {});
        this.colorByChain(all);
        var asu = new THREE.Object3D();

        this.drawBondsAsStick(asu, hetatm, this.cylinderRadius, this.cylinderRadius);
        this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['A'])), [58, 87]), this.cylinderRadius, this.cylinderRadius);
        this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['B'])), [63, 92]), this.cylinderRadius, this.cylinderRadius);
        this.drawCartoon(asu, all, this.curveWidth, this.thickness);

        this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
        this.modelGroup.add(asu);
    };

    $.get("molecule.xyz", function (ret) {
        $("#glmol_src").val(ret);
        glmol.loadMolecule();
    });
    
    window.addEventListener('resize', function() {
        //console.log($("#inputContainer").height());
    }, true);
    
}

function addNewInputSet(id, list) {
    var html = '<div id="input-panel-' + id + '" class="input-panel">' +
               'Si - Hg - BMIm' +
                '<span id="input-panel-delete-' + id + '" class="glyphicon glyphicon-remove pull-right" aria-hidden="true"></span>' +
            '</div>';
    $("#input-panels").append(html);
    $("#input-panel-delete-" + id).click(function(){
        $("#input-panel-" + id).remove();
        list.splice(id, 1);
        console.log("Removing id " + id);
        for(var i = id; i < list.length; i++) {
            console.log("Reducing " + list[i] + " by 1");
            $("#input-panel-" + id).attr('id', "input-panel-" + (i - 1));
            list[i] = list[i] - 1;
        }
    });
}