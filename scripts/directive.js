function timeDisplay($i){
 return {
  restrict: 'E',
  scope:{},
  templateUrl: 'directive/time.html',
  link: function(scope,elem, attrs) {
   scope.time = new Date();
   $i(function(){
     scope.time = new Date();
   }, 1000, 0);
  }
 };
}

function note(){
 return {
  restrict: 'E',
  scope: {
   'file' : '@'
  },
  templateUrl: 'directive/note.html',
  link: function(scope){
   scope.showAdd = false;
   scope.noteHolder = window.localStorage.getItem(scope.file);
   if (scope.noteHolder == null){
     scope.noteHolder = "No Notes";
   }
   scope.openNote = function(){
     scope.showAdd = true;
   }
   scope.saveNote = function(){
     window.localStorage.setItem(scope.file, scope.noteHolder);
     scope.showAdd = false;
   };
  }
 };
}

function todo(){
 return {
  restrict: 'E',
  scope: {
   file: '@',
   headerclass: '@',
   headertitle: '@'
  },
  templateUrl: 'directive/todo.html',
  link: function(scope, elem, attr){
  angular.element(angular.element(elem).children()[0]).addClass(scope.headerclass);
  scope.goals = JSON.parse(window.localStorage.getItem(scope.file));
  if (scope.goals  == null){
   scope.goals = [];
  }
  scope.changeGoal = "";
  scope.changeAddGoal = "";
  scope.showAdd = false;
  scope.currentlyEditing = false;
  scope.editText = function(oneGoal){
   if (!scope.currentlyEditing){
    oneGoal.hide = !oneGoal.hide;
    scope.changeGoal = oneGoal.text;
    scope.currentlyEditing = true;
   }
  };
  scope.saveOneGoal = function(oneGoal,oneVal){
   oneGoal.hide = !oneGoal.hide;
   for (var i= 0; i< scope.goals.length; i++){
     if (scope.goals[i].id == oneGoal.id){
      scope.goals[i].text = oneVal.changeGoal;
      break;
     }
   }
   s.currentlyEditing = false;
  };
  scope.removeGoal = function(oneGoal){
    for (var i = 0; i< scope.goals.length; i++){
      if (scope.goals[i].id == oneGoal){
        scope.goals.splice(i,1);
        break;
      }
    }
   };
   scope.save = function(){
    window.localStorage.setItem(scope.file, JSON.stringify(scope.goals.map(function(oneGoal){
      return {
        id: oneGoal.id,
        text: oneGoal.text
      };
    })));
   };
   scope.add = function(){
     scope.changeAddGoal = '';
     scope.showAdd = !scope.showAdd;
   };

   scope.addOneGoal = function(oneVal){
     if (oneVal.changeAddGoal.length > 0){
      var ids = scope.goals.map(function(v){ return v.id});
      var id = ids.reduceRight(function(v,i){return Math.max(v,i);},0);
      scope.goals.push({
       id: id + 1,
       text: oneVal.changeAddGoal,
       hide: false
      });
     }
     scope.changeAddGoal = "";
     scope.showAdd = false;
   };
   scope.countList = function(){
     return scope.goals.length > 0;
   };

  }
 };
}

function redditListing($http){
 return {
  restrict: 'E',
  scope:{},
  templateUrl: 'directive/reddit.html',
  link: function(scope,elem, attrs) {
    scope.list = [];
    scope.loadList = function(){
     scope.list = [];
     $http({
      method: 'GET',
      url: 'http://www.reddit.com/r/leagueoflegends/.json',
      cache: false})
     .success(function(data) {
       data.data.children.map(function(oneEntry){
        scope.list.push({
          num_comments: oneEntry.data.num_comments,
          commentList: oneEntry.data.permalink,
          url: oneEntry.data.url,
          title: oneEntry.data.title
        })
      });
     })
     .error(function(err,status) {

     });
    };
   scope.countList = function(){
     return scope.list.length > 0;
   };

    scope.loadList();

  }
 };
}

angular.module('Dashboard.directives', [])
.directive( 'timeDisplay', ['$interval', timeDisplay])
.directive( 'redditListing', ['$http', redditListing])
.directive( 'todo', [todo])
.directive( 'note', [note])
.directive( 'topNav', [function ( ) {
 return {
  restrict: 'E',
  scope:{},
  templateUrl: 'directive/topNav.html',
  link: function(scope,elem, attrs) {
  }
 };
}]);
