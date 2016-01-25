/**
 * Created by nm on 1/22/2016.
 */
var app = angular.module('App.Directives', []);

app.directive('nonSuckyYoutubeEmbed', function factory() {
    var directiveDefinitionObject = {
        restrict: 'E',
        template: 	'<div style="position: relative;">' +
        '<img src="img/Play-Button.png" style="position: absolute; left: 50%; top: 50%; width: 48px; height: 48px; margin-left: -24px; margin-top: -24px; cursor: pointer;" alt="Play" />' +
        '<img src="http://i.ytimg.com/vi/{{id}}/0.jpg" style="width: 100%; height: auto; display: inline; cursor: pointer" alt="" />' +
        '</div>',
        scope: {
            id: '@id'
        },
        link: function(scope, element, attrs) {
            attrs.$observe('id', function(id) {
                if(id) {
                    var height = (attrs.height) ;
                    var width = (attrs.width) ;
                    var paddingBottom = ((height / width) * 100) + '%';
                    var iframeStyle = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%';
                    var iframeContainerStyle = 'position: relative; padding-bottom: '+paddingBottom+'; padding-top: 30px; height: 0; overflow: hidden;'
                    element.on('click', function() {
                        var v = '<iframe type="text/html" style="'+iframeStyle+'" width="'+width+'" height="'+height+'" src="http://youtube.com/embed/'+id+'?autoplay=1" frameborder="0" />'
                        var newHTML =	'<div style="'+iframeContainerStyle+'">' + v + '</div>';
                        element.html(newHTML);
                    });
                }
            });
        }
    };
    return directiveDefinitionObject;
});

app.directive('pulldown', function factory() {
    return {
        restrict: 'A',
        link: function ($scope, iElement, iAttrs) {
            var $parent = iElement.parent();
            var $parentHeight = $parent.height();
            var height = iElement.height();

            iElement.css('margin-top', $parentHeight - height);
        }
    };

});