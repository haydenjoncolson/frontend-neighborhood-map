var map,
    largeInfowindow,
    styles; // add map style if wanted


// Create a new blank array for all the listing markers.
var markers = [];

var CLIENT_ID = "DMLIWBSJSUZ13YSSHU1HUCTQ1AQVINBJVSSU5WB55PBGMOGB",
    CLIENT_SECRET = "WONXX20DUNUG4HQ2P0RCAMIMLJKWYAB3F0JXSCGIORVFS4MI";

var viewModel;
var marker;

var locations = [
  {title: 'Taco Plus', location: {lat: 34.039792, lng: -118.462749}, id: '4aefb029f964a520e4d921e3'},
  {title: "Pili's Tacos", location: {lat: 34.041434, lng: -118.460919}, id: '4bce16dacc8cd13a15b9c3cf'},
  {title: "Tacos Punta Cabras", location: {lat: 34.031109, lng: -118.477382}, id: '51146ef8e4b0bdd77b8c1af7'},
  {title: "Mondo Taco", location: {lat: 34.026732, lng: -118.474803}, id: '500b50ebe4b084af1e3a8420'},
  {title: 'Tacoteca', location: {lat: 34.035087, lng: -118.478183}, id: '548bb3bf498e486d0cc82af9'}
];
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.038004, lng: -118.467396},
      zoom: 13
    });

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);

      locations[i].marker = marker;




      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);

      });


      bounds.extend(markers[i].position);

      //     Foursqaure included in loop
             //console.log(locations[i]);


      var foursquare = function(location) {
        //    Turn into loop
        var name,
            url;
              $.ajax({
                    url:'https://api.foursquare.com/v2/venues/search',
                    dataType: 'json',
                    data: 'limit=1' +
                        '&ll=34.038004,-118.467396' +
                        '&query=' + location.title +
                        '&client_id='+ CLIENT_ID +
                        '&client_secret='+ CLIENT_SECRET +
                        '&v=20130815',

                    async: true,

                    success: function(data) {
                      //console.log("success")
                      //console.log(data);
                      var venues = data.response.venues;

                      location.marker.venueName = venues[0].name;
                      //if (venues[0].url != undefined) {
                      location.marker.venueUrl = venues[0].url;
                    //  } else {
                        //  location.marker.venueUrl = "";
                    //  }


                      //console.log(marker);

                    },
                    error: function(e) {
              				alert("issue connecting to foursquare");

              		  }
                });
              };
        foursquare(locations[i]);

    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
    //end of map
}

function foursqaureError() {

}

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        marker.setAnimation(null);
      }, 700);
      if (marker.venueUrl != undefined) {
        infowindow.setContent('<div>' + '<p>' + marker.venueName + '</p>' + '<a href="' + marker.venueUrl + '">' + marker.venueUrl + '</a>' + '</div>');
      } else {
        infowindow.setContent('<div>' + '<p>' + marker.venueName + '</p>' + 'Website Not Available' + '</div>');
      }
      infowindow.open(map, marker);

      console.log(marker);

      // Make sure the marker property is cleared if the infowindow is closed.
      // infowindow.addListener('closeclick',function(){
      //   infowindow.setMarker(null);
      // });
    }
  }



// Model
var Restaurant = function(data) {
  var self = this;
  self.title = data.title;
  self.location = ko.observable(data.location);
  self.display = ko.observable(true);
  // self.marker

  // self.yelp data rrom yelp api (rating)
}


// Class
// Constructor function
// Function expression
// new operator
ViewModel = function() {
  var self = this;
  self.query = ko.observable("");
  self.locations =  ko.observableArray(locations);
  // self.filteredResults = ko.observableArray();
  // // For each restaurant, push to filteredResults
  // var restaurant;
  // for (var i = 0; i < locations.length; i++) {
  //   restaurant = new Restaurant(locations[i]);
  //   self.filteredResults.push(restaurant);
  // }


    //filter the items using the filter text
  self.filter = ko.computed(function() {
        var filter = self.query().toLowerCase();
        if (!filter) {
        	self.locations().forEach(function(location) {
        		var marker = location.marker;
        		if (marker) {
        			marker.setVisible(true);
        		}
        	});
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                //return location.title.toLowerCase();
                var title = location.title.toLowerCase();
                var marker = location.marker;
                var found = title.indexOf(filter) > -1; // true or false
                //console.log(title, filter, found);
                //console.log(location);
                marker.setVisible(found); // toggle markers' visibilty
                return found; // true or false
            });
        }
    });

    self.listClick = function(restaurant) {
      populateInfoWindow(restaurant.marker, largeInfowindow);
    };

  //  self.foursquare =

    //  self.foursquare("Santa Monica");




  };

  //http://knockoutjs.com/documentation/computedObservables.html
//  self.writeToConsole = ko.computed(function() {
    //console.log(self.query());
  //});






   // Instantiate an instance of ViewModel
   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
   viewModel = new ViewModel();

   // Activate Knockout
   ko.applyBindings(viewModel);

   function googleError() {
       alert("Problem loading google");
   };
