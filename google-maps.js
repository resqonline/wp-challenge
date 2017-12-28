// for rendering the Google Map

var g_new_map = null;
(function ($) {

  /*
  *  new_map
  *
  *  This function will render a Google Map onto the selected jQuery element
  *
  *  @type  function
  *  @date  8/11/2013
  *  @since 4.3.0
  *
  *  @param $el (jQuery element)
  *  @return  n/a
  */

  function new_map($el) {

    // var
    var $markers = $el.find('.marker');

    var styles = [
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
    ]

    // vars
    var args = {
      zoom: 6,
      center: new google.maps.LatLng(51.51, 9.19),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };

    var styledMap = new google.maps.StyledMapType(styles,
      { name: "Styled Map" });

    // create map           
    var map = new google.maps.Map($el[0], args);

    // display custom legend
    var legend = document.getElementById('legend');

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    // Define the LatLng coordinates for the polygon.
    map.data.loadGeoJson('wp-content/plugins/myplugin/public/js/germany.json');
    map.data.setStyle({
      strokeColor: '#f2f2f2',
      strokeWeight: '1px',
    });

    // add a markers reference
    map.markers = [];


    // add markers
    $markers.each(function () {

      add_marker($(this), map);

    });

    // center map
    center_map(map);

    // return
    return map;

  }

  g_new_map = new_map;

  /*
  *  add_marker
  *
  *  This function will add a marker to the selected Google Map
  *
  *  @type  function
  *  @date  8/11/2013
  *  @since 4.3.0
  *
  *  @param $marker (jQuery element)
  *  @param map (Google Map object)
  *  @return  n/a
  */

  function add_marker($marker, map) {

    // var
    var latlng = new google.maps.LatLng($marker.attr('data-lat'), $marker.attr('data-lng'));
    var name = $marker.attr('data-title');
    var link = $marker.attr('data-url');
    var icon = {
      url: $marker.attr('data-icon'),
      size: new google.maps.Size(43, 57),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(21, 57),
    }    

    // create marker
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: icon,
      title: name,
      url: link,
    });

    // add to array
    map.markers.push(marker);

    // if marker contains HTML, add it to an infoWindow
    if ($marker.html()) {
      var iwdiv = $('.markerwrap').outerHeight();

      // create info window
      var infowindow = new google.maps.InfoWindow({
        content: $marker.html(),
        pixelOffset: new google.maps.Size(175, iwdiv + 114),
        maxWidth: '290',
      });

      // show info window when marker is clicked
      google.maps.event.addListener(marker, 'click', function () {
        // added in to close the previous open info window
        if($('.gm-style-iw').length) {
          $('.gm-style-iw').parent().hide();
        }
        infowindow.open(map, marker);
        map.panTo(marker.getPosition());
      });

      google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
      });

      google.maps.event.addListener(infowindow, 'domready', function() {

        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');

        /* Since this div is in a position prior to .gm-div style-iw.
         * We use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
        */
        var iwBackground = iwOuter.prev();

        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        // Moves the infowindow to the right.
        iwOuter.parent().parent().css({left: '0px', top: '0px'});

        // Moves the shadow of the arrow to the left.
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 0px !important; top: 0px !important;'});

        // Moves the arrow to the left.
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 0px !important; top: 0px !important;'});

        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'unset', 'z-index' : '0', 'background' : 'transparent'});

        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.addClass('close-icon');
      });
      google.maps.event.addListener(infowindow, 'domready', function() {

        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');

        /* Since this div is in a position prior to .gm-div style-iw.
         * We use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
        */
        var iwBackground = iwOuter.prev();

        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        // Moves the infowindow to the right.
        iwOuter.parent().parent().css({left: '0px', top: '0px'});

        // Moves the shadow of the arrow to the left.
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 0px !important; top: 0px !important;'});

        // Moves the arrow to the left.
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 0px !important; top: 0px !important;'});

        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'unset', 'z-index' : '0', 'background' : 'transparent'});

        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();

        // Apply the desired effect to the close button
        iwCloseBtn.addClass('close-icon');
      });
    }

  }

  /*
  *  center_map
  *
  *  This function will center the map, showing all markers attached to this map
  *
  *  @type  function
  *  @date  8/11/2013
  *  @since 4.3.0
  *
  *  @param map (Google Map object)
  *  @return  n/a
  */

  function center_map(map) {

    // vars
    var bounds = new google.maps.LatLngBounds();

    // loop through all markers and create bounds
    $.each(map.markers, function (i, marker) {

      var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

      bounds.extend(latlng);

    });

    // only 1 marker?
    if (map.markers.length == 1) {
      // set center of map
      map.setCenter(bounds.getCenter());
      map.setZoom(10);
    }
    else {
      // fit to bounds
      //map.fitBounds(bounds);
    }

  }

  /*
  *  document ready
  *
  *  This function will render each map when the document is ready (page has loaded)
  *
  *  @type  function
  *  @date  8/11/2013
  *  @since 5.0.0
  *
  *  @param n/a
  *  @return  n/a
  */
  // global var
  var map = null;

  $(document).ready(function () {

    $('.acf-map').each(function () {

      // create map
      map = new_map($(this));

    });

    $('[data-fancybox]').fancybox({
        afterShow: function() {
          google.maps.event.trigger(map, 'resize'); // this currently doesn't really do anything, it was just experimental
        },
    });

  });

})(jQuery);