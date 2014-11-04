(function(){
	
	
	var app = angular.module('arenaNews',['ngRoute','ngSanitize','angularMoment','filters','duScroll']);

    var currentDataFileName = "php/wordpress/wp-json/posts?filter[cat]=";
	var termsURL = "php/wordpress/wp-json/taxonomies/category/terms";

	/*
  	//SETTINGS FOR ANGULAR MOMENT (Nice formatting of date)
	app.constant('angularMomentConfig', {
	    preprocess: 'unix', // optional
	    timezone: 'Europe/London' // optional
	});*/
	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////       ROUTING          	/////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	app.config(['$routeProvider', function($routeProvider)
	 {
	    $routeProvider
	      .when('/category/:categoryID', 
	        {
	          templateUrl: 'templates/article.html', 
	          controller: 'MainController'
	        }
	      ) .when('/article/:articleID', 
	        {
	          templateUrl: 'templates/comment.html', 
	          controller: 'CommentController'
	        }
	      ). otherwise({
	        redirectTo: '/',
	        templateUrl: 'templates/article.html'
	      });
	      	      
	    // configure html5 to get links working on plnkr
	    //$locationProvider.html5Mode(true);
	}]);
	
	
	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////       MAIN    CONTROLLER	/////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	app.controller('MainController',function($rootScope,$scope,$route,$routeParams,$http,$document,$location){
		
		$rootScope.articles = [];
		$rootScope.categories =[];
		$rootScope.currentCategory={};

		
		console.log('////////// START MainController ///////////');
		
		/////////////////// ROUTE CHANGES EVENTS ////////////////////
		$scope.$on("$locationChangeStart",function(event, next, current){
		   	//console.log('locationChangeStart');
		    //event.preventDefault();
		});
		
		$scope.$on("$routeChangeStart",function(event, next, current){
		   //console.log('routeChangeStart');		   
		});
		
		$scope.$on("$routeChangeSuccess",function(event, next, current){
		   console.log('routeChangeSuccess');
		    //event.preventDefault();		
		   
		  
		});
		
		//LOAD (Tags and Categories)
		$rootScope.loadCategories = function(){		
			
			console.log('loadCategories file: '+termsURL );
			
			$http.get(termsURL)
			.success(function(data,status,headers,config){
				 var terms = data;
				 console.log('categories:'+terms);
				 
				 function sortByID(a,b) {
					  if (a.ID < b.ID)
					     return -1;
					  if (a.ID > b.ID)
					    return 1;
					  return 0;
				 }
				 
				  
				 $rootScope.categories = terms.sort(sortByID);
				 
				// if($rootScope.currentCategory!=$rootScope.getLatestCategory()){
					 $rootScope.currentCategory = $rootScope.getLatestCategory();
					 //IF WE HAVE A CATEGORY INDEX PASSED TO BROWSER WE OVERRIDE THE CURRENT ONE
					 var categoryID = $rootScope.currentCategory.ID;
					 if($routeParams.categoryID){
					 	console.log('WE HAVE A CATEGORY INDEX passed in the url: $routeParams.categoryIndex='+$routeParams.ID);
					 	categoryID = $routeParams.categoryID;
					 	$rootScope.currentCategory = $rootScope.getCategoryByID(categoryID);
					 }
					 
					 $rootScope.loadArticlesByCategoryID(categoryID);
				 //}
				 
				
			})
			.error(function(data,status,headers,config){
				window.alert("We have been unable to access the feed");
			});
			
		} //$scope.loadCategories = function()
		if($rootScope.categories.length<=0)
		$rootScope.loadCategories();
		
		
		$rootScope.loadArticlesByCategoryID = function(categoryID){		
			console.log('//// loadCategoryByID='+categoryID);
			//SET PATH TO CURRENT CATEGORY ID
			$location.path('/category/'+categoryID);
			
			
			//START LOAD FILE
			console.log('EMIT:'+categoryID);
			$rootScope.$emit('startLoadArticlesByCategoryID',categoryID);
			
			//$rootScope.loadDataFile(currentDataFileName+categoryID);
			
		}
		
		
		$rootScope.getCategoryByID = function(value){
			var category = {};
			for(var i=0;i< $rootScope.categories.length;i++){
					
				if($rootScope.categories[i].ID == value){
					category = $rootScope.categories[i];
				}
				
			 }
			 return category;
		}
		
		$rootScope.getLatestCategory = function(){
			return $rootScope.categories[$rootScope.categories.length-1];
		}
		
		
				
	});	//	app.controller('MainController'.... ///


	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////       ARTICLE CONTROLLER	/////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	app.controller('ArticleController',function($rootScope,$scope,$route,$routeParams,$http,$document,$location){
		console.log('////////// START ArticleController ///////////');
		
	
		
		
		// LOAD POST FILES 
		$scope.loadArticlesFromDB = function(categoryID){		
			console.log("$scope.loadArticlesFromDB(" +JSON.stringify(categoryID)+")");

			$http.get(currentDataFileName+categoryID)
			.success(function(data,status,headers,config){
				//console.log('data file loaded'+data);
				$rootScope.articles  = data;
				
				//var timeSince = Date.parse($scope.articles[0].date);
				//console.log('timestamp:'+moment(timeSince).fromNow());
				
				 
			})
			.error(function(data,status,headers,config){
				window.alert("We have been unable to access the feed");
				
			});
		} 
		
		
		$scope.onClickPreviousDayBtn = function(){
			console.log('onClickPreviousDayBtn');
			
			var currentCategoryID = $rootScope.getCategoryByID($scope.currentCategory.ID).ID;
			
			//FIND THE ID THAT PRECEDE THE CURRENT CATEGORY
			var previousCategoryIndex = $rootScope.categories.indexOf($scope.currentCategory)-1;
			var previousCategoryID = $rootScope.categories[previousCategoryIndex].ID;
			// LOAD THE PREVIOUS CATEGORY
			$location.path('/category/'+previousCategoryID);
			console.log('previousCategoryID = '+previousCategoryID);
			$location.replace();
			$rootScope.loadCategoryByID (previousCategoryID);
			
			//GO BACK TO BEGINNING
			$document.scrollTo(angular.element(document.getElementById('category')), 30, 1000);
			
		}
		
		$scope.onClickCommentBtn = function(articleID){
			console.log('onClickCommentBtn'+articleID);
			
			// LOAD THE PREVIOUS COMMENT
			$location.path('/article/'+articleID);
			$location.replace();
			
		}
		
		
		///// LISTENERS /////
		//START LOAD FILE
		$rootScope.$on('startLoadArticlesByCategoryID',function(event,categoryID){
			console.log((categoryID));

			$scope.loadArticlesFromDB(categoryID);
		});
				
		
	});
		
		
		
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////      COMMENTS CONTROLLER	/////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	app.controller('CommentController',function($rootScope,$scope,$route,$routeParams,$http,$document,$location){
		console.log('////////// START CommentController ///////////');
		
		$scope.article = {};
				
		$scope.loadArticleByID = function(articleID){		
			console.log('//// loadArticleByID='+articleID);
			//SET PATH TO CURRENT post ID
			$location.path('/article/'+articleID);
			 
			 
			 	console.log("$rootScope.articles = "+JSON.stringify($rootScope.articles));

			 if($rootScope.articles.length==0){
				console.log("ARTICLE IS NOT AVAILABLE IN THE MODEL WE GO GET IT");
				$http.get("php/wordpress/wp-json/posts/"+articleID)
				.success(function(data,status,headers,config){
						console.log('article loaded'+data);
						$scope.article = data;
						
				})
				.error(function(data,status,headers,config){
					window.alert("We have been unable to access the feed");
				});
			}else {
				 
				 //console.log(JSON.stringify($rootScope.articles));
				 //GET CURRENT ARTICLE BY ID
				 var filteredArticles = $rootScope.articles.filter(function(el){
					 if(el.ID==articleID)
					 return true;
					 else 
					 false;
				});
				$scope.article = filteredArticles[0];
			}

			//$scope.loadComments();
			 //console.log(JSON.stringify($scope.article));
			// $scope.loadComments();
			//IF ARTICLE IS NOT AVAILABLE IN THE MODEL WE GO GET IT
			
			
			
			/////////// LOAD COMMENTS  ////////
					var disqus_shortname = 'arenanews'; // required: replace example with your forum shortname
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			
						
		}
		
		
		//AUTOLOAD RIGHT ARTICLE
		if($routeParams.articleID){
			$scope.loadArticleByID($routeParams.articleID);
		}else {
			$scope.loadArticleByID(8);
		}
		
		
		////////////////////// DISQUS STUFF ///////////////////////
					
		$scope.onClickPreviousArticle = function(){
			var currentArticle = $scope.article;
			var currentArticleIndex = $rootScope.articles.indexOf(currentArticle);
			console.log("currentArticleIndex = "+currentArticleIndex);
			$scope.loadArticleByID ($rootScope.articles[currentArticleIndex-1].ID);
		}
		
		$scope.onClickNextArticle = function(){
			var currentArticle = $scope.article;
			var currentArticleIndex = $rootScope.articles.indexOf(currentArticle);
			console.log("currentArticleIndex = "+currentArticleIndex);
			$scope.loadArticleByID ($rootScope.articles[currentArticleIndex+1].ID);
			
		}
		
	});
		

	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	///////////////////////      CUSTOM DIRECTIVES	/////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	
	
	//CUSTOM DIRECTIVES FOR RESPONSIVE HANDLING
	app.directive('responsiveMobile',function(){
		var directive = {};

		directive.restrict = 'E'; 
		directive.template="";

		if(mobilecheck()){
			//IF MOBILE WE ALLOW IT
            directive.transclude = false;
        }else {
        	//OTHERWISE WE REPLACE IT
            
            directive.transclude = true;
        } 
				
		return directive;
		
		
	});
	
	app.directive('responsiveDesktop',function(){
		var directive = {};

		directive.restrict = 'E'; 
		directive.template="";
		if(mobilecheck()){
			//IF MOBILE WE ALLOW IT
            directive.transclude = true;
        }else {
        	//DESKTOP == ALLOW
            directive.transclude = false;
        } 
				
		return directive;
		
		
	});
	
	
	app.directive('scrollOnClick', function() {
	  return {
	    restrict: 'A',
	    link: function(scope, $elm, attrs) {
	      var idToScroll = attrs.href;
	      $elm.on('click', function() {
	        var $target;
	        if (idToScroll) {
	          $target = $(idToScroll);
	        } else {
	          $target = $elm;
	        }
	        $("body").animate({scrollTop: $target.offset().top}, "slow");
	      });
	    }
	  }
	  
	  
});
	
		
	
})();
  

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
////////////////////////      CUSTOM FILTERS	/////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
angular.module('filters', [])
	.filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    })
    .filter('fromNow', function() {
	    return function(dateString) {
	  	     return moment(dateString).fromNow();
	    };
	})
	.filter('stringToTimestamp', function() {
        return function(string){
             return Date.parse(string);
        };
    });



 //ENFORCE 2 DIGIT NUMBER 9 => 09
var digit2 = function (n){
    return n > 9 ? "" + n: "0" + n;
};
	     

//MOBILE CHECKING
var mobilecheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check; 
}





