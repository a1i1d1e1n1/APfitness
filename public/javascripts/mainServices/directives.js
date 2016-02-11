/**
 * Created by nm on 1/22/2016.
 */
var app = angular.module('App.Directives', []);

app.directive('youtubeEmbed', function factory() {
    var Object = {
        restrict: 'E',
        template: 	'<div style="position: relative;">' +
        '<img src="http://i.ytimg.com/vi/{{id}}/0.jpg" style="width: 100%; height: auto; display: inline alt="" />' +
        '</div>',
        scope: {
            id: '@id'
        },
        link: function(scope, element, attrs) {
            attrs.$observe('id', function(id) {
                if(id) {


                    var Style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%';
                    var iframeContainerStyle = 'position: relative;'
                    element.on('click', function() {
                        var v = '<iframe class="embed-responsive" type="text/html" style="' + Style + '" width="100%" ' +
                            'height="auto" src="http://youtube.com/embed/' + id + '?autoplay=1" allowfullscreen frameborder="0"/>'
                        var contain = '<div class="embed-responsive embed-responsive-4by3" ' +
                            'style="' + iframeContainerStyle + '">' + v + '</div>';
                        element.html(contain);
                    });
                }
            });
        }
    };
    return Object;
});

