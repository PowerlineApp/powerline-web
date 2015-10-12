angular.module('app.controllers').controller('home', function (
  $scope, 
  topBar, 
  socialActivity, 
  homeCtrlParams,
  profile, 
  activity, 
  groups, 
  flurry, 
  layout,
  petitions,
  session,
  PetitionsResource,
  getFormData,
  $route,
  representatives,
  follows,
  influence, 
  facebook
  ) {
  topBar.setHomeBar();
  /*
  topBar.set('right', {
    btnClass: 'btn-new-post',
    click: function () {
      $scope.showPostWindow = !$scope.showPostWindow;
      $scope.execApply();
    }
  });
  */
  layout.setContainerClass('news-feed');

  flurry.log('news feed');

  /*
  $scope.newPost = function (type) {
    var types = {
      1: 'long petition',
      2: 'quorum'
    };
    $scope.path('/micro-petitions/add/' + types[type] + '/' +
      (homeCtrlParams.filter.selectedGroup ? homeCtrlParams.filter.selectedGroup.id : ''));
  };
  */ 

  if (!profile.get()) {
    profile.load();
  }
  $scope.filter = homeCtrlParams.filter;

  var activities = activity.getActivities();

  function getActivities() {
    
    $scope.activities = (homeCtrlParams.filter.selectedGroup && homeCtrlParams.filter.selectedGroup.id) ? homeCtrlParams.filter.selectedGroup.activities
      : activities.getFilteredModels();

      //console.log($scope.activities);

    _($scope.activities).each(function(a){
      //console.log(a.isInPriorityZone());
      a.isInPriorityZoneVal = a.isInPriorityZone();
    }); 
  }

  function getUnansweredCount(activities) {
    return _(activities).reduce(function (memo, activity) {
      return (activity.get('answered') || activity.get('closed') || activity.get('ignore_count')) ? memo : ++memo;
    }, 0);
  }

  function prepare() {
    homeCtrlParams.loaded = true;
    activities.setDeferredRead().sort();

    $scope.$watch(profile.get(), function () {
      
      homeCtrlParams.leftBar.currUser = profile.get();
    });

    homeCtrlParams.filter.unansweredCount = getUnansweredCount(activities.getFilteredModels());
    
    homeCtrlParams.filter.groups = groups.getGroupsOptions();

    var displayGroups = groups.getGroupsOptions();
    displayGroups.unshift({acronym:'All',avatar_file_path: "images/v2/icons/all-group.png",id:0,unansweredCount:homeCtrlParams.filter.unansweredCount});
    

    _(displayGroups).each(function (group) {
      if(group.id){
        group.activities = activities.getFilteredModels(group);
        group.unansweredCount = getUnansweredCount(group.activities);
      }
    });

    homeCtrlParams.filter.displayGroups = displayGroups;

    
    
    var start = new Date();
    var month = start.getMonth();
    start.setDate(0);
    petitions.loadByParams({user: session.user_id, start: start.toUTCString()}).then(function (collection) {
      
      _(homeCtrlParams.filter.groups).each(function (group) {
        group.activities = activities.getFilteredModels(group);

        group.read = !_.some(group.activities, function (item) {
          return !item.get('read');
        });

        group.available = group.petition_per_month - collection.reduce(function (memo, petition) {
          if (petition.get('group').id === group.id && petition.get('created_at').getMonth() === month) {
            memo++;
          }
          return memo;
        }, 0);

        if (homeCtrlParams.filter.selectedGroup && homeCtrlParams.filter.selectedGroup.id === group.id) {

          homeCtrlParams.filter.selectedGroup = group;
        }
      });


    /* recommendedGroups */
    if (!groups.getPopularGroups().length) {
      groups.loadSuggested();
    }

    homeCtrlParams.filter.recommendedGroups = groups.getPopularGroups();

    $scope.$watch(groups.getPopularGroups, function (newValue) {
      homeCtrlParams.filter.recommendedGroups = newValue;
    });

    

    /* /recommendedGroups */

    /* myRepresentatives */
    var representativesGroups = representatives.getRepresentativesGroups();

    $scope.$watch(representatives.getRepresentativesGroups, function (newValue) {
      var representativesGroups =  newValue;

      _(representativesGroups).each(function(representativesGroup){

        _(representativesGroup.representatives).each(function(representative){
          
          if(homeCtrlParams.filter.myRepresentatives.indexOf(representative) < 0){
            homeCtrlParams.filter.myRepresentatives.push(representative); 
          }
        });
      });
    });

    /* /myRepresentatives */

    /* followings */
    homeCtrlParams.filter.myInfluences = follows.getFollowing();
    $scope.$watch(follows.size, function () {
      homeCtrlParams.filter.myInfluences = follows.getFollowing();
    });
    $scope.$on('follows-loaded', function () {
      homeCtrlParams.filter.myInfluences = follows.getFollowing();
    });
    /* /followings */


    /* followings */
    if (homeCtrlParams.leftBar.currUser && homeCtrlParams.leftBar.currUser.facebook_id && facebook.getFriends().length) {
      influence.loadSuggested(facebook.getFriends()).then(function (suggested) {
        homeCtrlParams.filter.influencesToFollow = suggested;
        console.log('suggested',suggested); debugger;
      }, function () {
      });
    }
    /* /followings */
    
    });

    getActivities();
    $scope.loading = false;

    activity.saveRead();
  }

  $scope.$watch('filter.selectedGroup', getActivities);
  
  $scope.$watch('filter.selectedGroup', function (value) {
    //topBar.set('title', value ? value.getTitle() + ' Powerline' : 'Powerline');
    topBar.set('title', 'Powerline');
  });
  
  getActivities();

  if (!homeCtrlParams.loaded) {
    $scope.loading = true;
    activity.load().then(function () {
      prepare();
      $scope.$emit('home.activities-reloaded');
    }, prepare).finally(socialActivity.load);
  } else {
    prepare();
  }

  $scope.$on('notification.received', function () {
    activity.load().then(prepare, prepare);
  });

  $scope.$on('activity.reload', function () {
    activity.load().then(prepare, prepare);
  });

  $scope.filterLineStep = function () {
    return 5;
  };

  $scope.steps = function () {
    var items = homeCtrlParams.filter.groups.length - 3;
    items = items > 0 ? items : 0;
    var step = $scope.filterLineStep();
    var stepsCount = Math.ceil(items / step);
    var steps = [3];
    for (var i = 1; i < stepsCount; i++) {
      steps.push(i * step + 3);
    }
    if (items && 0 === items % step) {
      steps.push(steps[steps.length-1] + step);
    }
    return steps;
  };

  /* petion.add */
  $scope.expires_intervals = [
    {
      value: 1,
      label: '1 day'
    },
    {
      value: 3,
      label: '3 days'
    },
    {
      value: 7,
      label: '7 days'
    },
    {
      value: 30,
      label: '30 days'
    }
  ];
  

  $scope.user_expire_interval = $scope.expires_intervals[2];
  $scope.petition_types = ['quorum', 'open letter', 'long petition'];
  $scope.profile = profile.get();

  $scope.data = {
    is_outsiders_sign: false,
    type: $scope.petition_types[0]
  };

  $scope.create =  function(){

    if ($scope.petitionForm.$invalid) {
      $scope.formClass = 'error';
      if ($scope.petitionForm.petition_body.$error.required) {
        $scope.alert('No message entered', null, 'Error', 'OK');
      } else if ($scope.petitionForm.group.$error.required) {
        $scope.alert('No group selected', null, 'Error', 'OK');
      } else {
        $scope.alert(errorFormMessage($scope.petitionForm)[0], null, 'Error', 'OK');
      }
    } else if(!homeCtrlParams.filter.selectedGroup){
        $scope.alert('No group selected', null, 'Error', 'OK');
    }else{
      var formData = getFormData($scope.petitionForm, {
        group: ['group_id', function (group) {
          return homeCtrlParams.filter.selectedGroup.id;
        }],
        user_expire_interval: function (item) {
          return item.value;
        }
      });
      var petition = new PetitionsResource(formData);
      $scope.loading = true;
      petition.$save(function () {
        homeCtrlParams.loaded = false;
        flurry.log('micro petition created');
        $route.reload();
        /*
        if ($routeParams.group_id) {
          petitions.loadAll().then($scope.back, $scope.back);
        } else {
          $scope.back();
        }
        */
      }, function (response) {
        $scope.loading = false;
        if (response.status === 406) {
          $scope.alert('Your limit of petitions per month is reached for this group', null, 'Error', 'OK');
          return;
        }
        if (response.data && response.data.errors) {
          _(response.data.errors).each(function (error) {
            var property = camelcase2underscore(error.property);
            if ($scope.petitionForm[property]) {
              $scope.petitionForm[property].$setValidity('required', false);
            }
          });
          if (response.data.errors.length) {
            $scope.alert(response.data.errors[0].message, null, 'Error', 'OK');
          }
          $scope.formClass = 'error';
        } else {
          $scope.alert('Error occurred', null, 'Error', 'OK');
        }
      });
    }
  };
 /* petion.add */
});

angular.module('app.controllers').run(function(homeCtrlParams, $document, $rootScope) {
  $document.bind('resume', function() {
    homeCtrlParams.loaded = false;
    $rootScope.$broadcast('activity.reload');
    $rootScope.execApply();
  });
});

angular.module('app.controllers').controller('preload', function (topBar) {
  topBar.reset().set('title', 'Powerline').set('menu', true);
});

angular.module('app.controllers').directive('iActivity', function($rootScope, $location, questions, petitions, discussion, elapsedFilter) {

  function eventCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/event.html';
  }

  function newsCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/news.html';
    $scope.entity = $scope.activity.get('entity');
    $scope.rate = function(action) {
      $scope.sending = true;
      discussion.loadRoot('poll', $scope.entity.id).then(function(comment) {
        discussion.rate(comment, action).then(function(comment) {
          $scope.activity.set('rate_up', comment.rate_up).set('rate_down', comment.rate_down);
          $scope.sending = false;
        }, function() {
          $scope.sending = false;
        });
      });
    };
  }

  function paymentCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/payment.html';
  }

  function postCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/post.html';
    $scope.booster = (85 * ($scope.activity.get('owner').type === 'group' ? 100 : $scope.activity.getQuorumCompletedPercent())) / 100;
    $scope.sign = function(optionId) {
      $scope.sending = true;
      petitions.answer($scope.activity.get('entity').id, optionId).then(function(answer) {
        $scope.activity.set('answer', answer).set('answered', true);
        $scope.sending = false;
      });
    };
    $scope.unsign = function() {
      $scope.sending = true;
      petitions.unsign($scope.activity.get('entity').id, $scope.activity.get('answer').option_id).then(function() {
        $scope.activity.set('answered', false).set('answer', null);
        $scope.sending = false;
      });
    };
  }

  function petitionCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/petition.html';
    $scope.answer = function() {
      $scope.sending = true;
      if ($scope.answerAction === 'sign') { $scope.sign(); } else { $scope.unsign(); }
      $scope.answerAction = '';
    };
    $scope.$watch(function() {
      return $scope.activity.get('answer');
    }, function(answer) {
      $scope.answerAction = answer ? 'unsign' : 'sign';
    });
    $scope.sign = function() {
      questions.load($scope.activity.get('entity').id).then(function(question){
        question.answer({
          privacy: 0,
          comment: '',
          option_id: question.options[0].id
        }).then(function(answer) {
          $scope.activity.set('answer', answer).set('answered', true);
          $scope.sending = false;
        });
      });
    };
    $scope.unsign = function() {
      $scope.answerAction = '';
      var answer = $scope.activity.get('answer');
      questions.unsignFromPetition(answer.question.id, answer.option_id).then(function() {
        $scope.activity.set('answer', null).set('answered', false);
        $scope.sending = false;
      });
    };
  }

  function questionCtrl($scope) {
    $scope.templateSrc = 'templates/home/activities/question.html';
  }

  var ctrlByType = {
    'leader-event': eventCtrl,
    'leader-news': newsCtrl,
    'crowdfunding-payment-request': paymentCtrl,
    'payment-request': paymentCtrl,
    'micro-petition': postCtrl,
    'petition': petitionCtrl,
    'question': questionCtrl
  };

  return {
    scope: {
      activity: '='
    },
    restrict: 'E',
    template: '<ng-include src="templateSrc"></ng-include>',
    controller: function($scope,$compile,$timeout) {
      
      $scope.navigateTo = $rootScope.navigateTo;

      $scope.navigateToActivity = function(activity, focus) {
        activity.setRead();
        $rootScope.navigateTo('activity', activity, focus);
      };

      $scope.toggleComments = function(activity,$event){
        
        var entity = activity.get('entity').type;
        
        if(entity != 'micro-petition'){
          entity == 'poll';
        }

        var comments = "<discussions  id="+activity.get('entity').id+" entity=\"'poll'\"></discussions>";

        $('.discussion-container').html('');
        $('.activity-container').find('.reply').removeClass('discussion-open');

        $($event.target).addClass('discussion-open');

        angular.element($($event.target)
          .parents('.activity-container')
          .children('.discussion-container')
        )
          .html($compile(comments)($scope));
      };

      $scope.$on('discussion.comment-added', function () {
        
        $timeout(function(){
          $('.activity-container').find('.discussion-open').click();
        },10);
      });

      $scope.title = $scope.activity.get('title');
      $scope.description = $scope.activity.get('description');
      $scope.avatar_file_path = $scope.activity.get('owner').avatar_file_path;
      $scope.iconClass = $scope.activity.getIcon();
      $scope.official_title = $scope.activity.get('owner').official_title;
      $scope.full_name = [$scope.activity.get('owner').first_name, $scope.activity.get('owner').last_name].join(' ');
      $scope.owner_info_1 = $scope.activity.get('owner_info_1');
      $scope.sent_at_elapsed = elapsedFilter($scope.activity.get('sent_at'));
      $scope.responses_count = $scope.activity.get('responses_count');

      var activityRoutes = {
        'question': '/questions/',
        'micro-petition': '/petition/',
        'leader-news': '/questions/news/',
        'petition': '/question/leader-petition/',
        'payment-request': '/payment-polls/payment-request/',
        'leader-event': '/leader-event/',
        'crowdfunding-payment-request': '/payment-polls/crowdfunding-payment-request/'
      };

      $scope.activityUrl = $location.absUrl().split("#")[0] + '#' + activityRoutes[$scope.activity.get('entity').type] + $scope.activity.get('entity').id;

      var entity = $scope.activity.get('entity');

      if (ctrlByType[entity.type]) {
        ctrlByType[entity.type]($scope);
      } else if (ctrlByType[entity.type_default]) {
        $scope.templateSrc = 'templates/home/activities/default.html';
      }
    }
  };
});