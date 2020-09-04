//sort-by variables:
let one = false;
let two = false;
let all = false;
let five = false;
let three = false;
let four = false;
/*---------------------*/
let smallWindow;
let isRestaurantNew = true;
let restaurantIndex = -1;
let newReviewArray = new Array;
let markers = new Array;
let newRestaurantMarker = new Array;
let newRestaurants = new Array;
// example restaurants 
let restaurantsArray = new Array;
//restaurants from google maps API
let googleRestaurantsArray = new Array;
const restaurantInfoDiv = $('#restaurant-info');
const sortOptionsDiv = $('#sort-options');
sortOptionsDiv.hide();
restaurantInfoDiv.hide();
const sortBy = $('#sort');
const form = $('#add-restaurant');
const reviewSubmitBtn = $('#review-submit');
const reviewDiv = $('#review-window');
form.hide();
reviewSubmitBtn.hide();
let emptyRate = '&#9675;';
let fullRate = '&#9679;';


// init the map 
function initMap() {
    let currentPosition = {
        lat: 0,
        lng: 0,
    };

    const mapOptions = {
        center: currentPosition,
        zoom: 15,
        streetViewControl: false,
        styles: [{
            stylers: [
                { hue: "#00ff6f" },
                { saturation: -50 }
            ]
        }]
    }
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const infoWindow = new google.maps.InfoWindow({
        content: document.getElementById('information')
    });
    const newWindow = new google.maps.InfoWindow({
        content: document.getElementById('information-new-restaurant')
    });


    // JS Geolocation method, to find user current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            infoWindow.setPosition(currentPosition);
            map.setCenter(currentPosition);

            //adds marker of your current position (arrow)
            let marker = new google.maps.Marker({
                position: currentPosition,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                    fillColor: 'red',
                    fillOpacity: 0.3,
                    scale: 10,
                    strokeColor: 'red',
                    strokeWeight: 1,
                    zIndex: 1
                },
            });
            marker.setMap(map);
            // drag the map and find new restaurants and other area in the map
            map.addListener('dragend', function() {
                findPlaces();
            });
            //drop marker on the map
            function dropMarker(i) {
                return function() {
                    markers[i].setMap(map);
                };
            }

            //PLACES API to  find the restaurants around
            let places = new google.maps.places.PlacesService(map);
            let service = new google.maps.places.PlacesService(map);

            let request = {
                location: currentPosition,
                radius: 500,
                types: ['restaurant']
            }

            service.nearbySearch(request, callback);

            function callback(results, status) {
                const script = document.createElement('script');
                script.src = 'js/places.js';
                document.getElementsByTagName('head')[0].appendChild(script);
                window.eqfeed_callback = function(results) {
                    results = results.results;
                    restaurantsArray = [];
                    for (let i = 0; i < results.length; i++) {
                        restaurantsArray.push(results[i]);
                    }

                };
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    findPlaces()
                }
            }

            function findPlaces() {
                let findPlaces = {
                    bounds: map.getBounds(),
                    types: ['restaurant']
                };
                places.nearbySearch(findPlaces, function(results, status) {

                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        clearResults();
                        clearMarkers();

                        googleRestaurantsArray = [];
                        results.forEach(function(element) {
                            googleRestaurantsArray.push(element);
                        })

                        for (let i = 0; i < results.length; i++) {
                            markers[i] = new google.maps.Marker({
                                position: results[i].geometry.location,
                                placeId: results[i].id,
                                zIndex: 5,
                                id: googleRestaurantsArray[i].id
                            });
                            // If the user clicks a restaurant marker, it shows the details of that restaurant
                            google.maps.event.addListener(markers[i], 'click', displayInfoWindow);
                            google.maps.event.addListener(map, 'click', closeInfoWindow);

                            if (three) {
                                if (results[i].rating >= 3 && results[i].rating < 4) {
                                    displayResults(i, results, i);

                                }
                            } else if (four) {
                                if (results[i].rating >= 4 && results[i].rating < 5) {
                                    displayResults(i, results, i);


                                }
                            } else if (five) {
                                if (results[i].rating === 5) {
                                    displayResults(i, results, i);


                                }
                            } else if (one) {
                                if (results[i].rating === 1 && results[i].rating > 2) {
                                    displayResults(i, results, i);

                                }
                            } else if (two) {
                                if (results[i].rating >= 2 && results[i].rating < 3) {
                                    displayResults(i, results, i);

                                }
                            } else {
                                displayResults(i, results, i);
                            }

                        }


                        for (let i = 0; i < restaurantsArray.length; i++) {
                            markers[googleRestaurantsArray.length + i] = new google.maps.Marker({
                                position: restaurantsArray[i].geometry.location,
                                placeId: restaurantsArray[i].id,
                                zIndex: 5,
                                id: restaurantsArray[i].id,
                            });
                            // If the user clicks a restaurant marker, show the details of that restaurant (my examples of restaurants from json file)
                            google.maps.event.addListener(markers[googleRestaurantsArray.length + i], 'click', showExampleRestaurant);
                            google.maps.event.addListener(map, "click", closeInfoWindow);
                            displayResults(googleRestaurantsArray.length + i, restaurantsArray, i);

                        }
                    }
                });
            }
            //reset markers and results 
            function clearMarkers() {
                for (let i = 0; i < markers.length; i++) {
                    if (markers[i]) {
                        markers[i].setMap(null);
                    }
                }
                markers = [];
            }

            function clearResults() {
                let results = document.getElementById('results');
                while (results.childNodes[0]) {
                    results.removeChild(results.childNodes[0]);
                }
            }

            //list of restaurants on the right
            function addResultList(result, i) {
                let resultsDiv = document.getElementById('results');
                let listDiv = document.createElement('div');
                listDiv.setAttribute('class', 'results-list');
                listDiv.onclick = function() {
                    google.maps.event.trigger(markers[i], 'click');
                };
                let details = `<div class="placeIcon"><img src ="${createPhoto(result)}" /></div>
                                <div class="placeDetails">
                                <div class="name">${result.name}</div>
                                <div class="rating">${placeRating(result)}</div>`;

                listDiv.insertAdjacentHTML("beforeEnd", details);
                resultsDiv.appendChild(listDiv);
            }


            //restaurant photo - API
            function createPhoto(place) {
                let photos = place.photos;
                let photo;
                if (!photos) {

                    photo = 'image/logo.png';

                } else {

                    photo = photos[0].getUrl({ 'maxWidth': 780, 'maxHeight': 500 });
                }
                return photo;
            }

            //restaurants details window
            function displayInfoWindow() {
                let marker = this;
                places.getDetails({
                    placeId: marker.placeResult.place_id
                }, function(place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    infoWindow.open(map, marker);
                    infoWindowContent(place);
                    displayRestaurantInfo(place);
                });
            }


            function showExampleRestaurant() {
                let marker = this;
                infoWindow.open(map, marker);
                infoWindowContent(restaurantsArray[marker.id]);
                displayRestaurantInfo(restaurantsArray[marker.id]);
            }

            function addRestaurantInfoWindow() {
                let marker = this;
                if (isRestaurantNew) {
                    newWindow.open(map, marker);
                    buildContent(marker);
                    newRestaurantMarker.push(marker);
                    restaurantIndex += 1;
                } else {
                    infoWindow.open(map, marker);
                    infoWindowContent(newRestaurants[marker.id]);
                    displayRestaurantInfo(newRestaurants[marker.id]);
                }
            }

            //close the info windows
            function closeInfoWindow() {
                infoWindow.close(map, marker);
            }

            function closeInfoWindowNew() {
                newWindow.close(map, marker);
            }
            //display information when the restaurant is clicked
            function displayRestaurantInfo(place) {
                $('#review-window').show();
                $('#add-review-button').show();
                restaurantInfoDiv.show();
                $('#name').text(place.name);
                $('#address').text(place.vicinity);
                $('#telephone').text(place.formatted_phone_number);

                let reviewsDiv = $('#reviews');
                let reviewHTML = '';
                reviewsDiv.html(reviewHTML);
                if (place.reviews) {
                    if (place.reviews.length > 0) {
                        for (let i = 0; i < place.reviews.length; i += 1) {
                            let review = place.reviews[i];
                            let avatar;
                            if (place.reviews[i].profile_photo_url) {
                                avatar = place.reviews[i].profile_photo_url;
                            } else {
                                avatar = 'image/rest.png';
                            }
                            reviewHTML += `<div class="restaurant-reviews">
                                          <h3 class="review-title">
                                             <span class="profile-photo" style="background-image: url('${avatar}')"></span>`;
                            if (place.rating) {
                                reviewHTML += `<span id="review-rating" class="rating">${placeRating(review)}</span>`;
                            }
                            reviewHTML += ` <h3>${place.reviews[i].author_name}</h3>
                                    </h3>
                                                <p> ${place.reviews[i].text} </p>
                                            </div>`;
                            reviewsDiv.html(reviewHTML);
                        }
                    }
                }

                //street view functionality

                let sv = new google.maps.StreetViewService();
                sv.getPanorama({
                    location: place.geometry.location,
                    radius: 50
                }, processSVData);

                let streetViewWindow = $('#street-view-window');
                let photoDiv = $('#photo');
                let photoWindow = $('#see-photo');
                let seeStreetView = $('#see-street-view');
                photoDiv.empty();
                photoDiv.append('<img class="photo-big" ' + 'src="' + createPhoto(place) + '"/>');

                streetViewWindow.show();
                if (photo) {
                    photoWindow.show();
                } else {
                    photoWindow.hide();
                }

                function processSVData(data, status) {
                    if (status === 'OK') {
                        let panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
                        panorama.setPano(data.location.pano);
                        panorama.setPov({
                            heading: 440,
                            pitch: 0
                        });
                        panorama.setVisible(true);

                    } else {
                        photoWindow.hide();
                        streetViewWindow.hide();
                        photoDiv.show();
                    }
                }
            }

            // create markers's results
            function displayResults(markerID, array, i) {
                addResultList(array[i], markerID);
                markers[markerID].placeResult = array[i];
                setTimeout(dropMarker(markerID), i);
            }

            //builds the Info Window, when teh marker is clicked
            function infoWindowContent(place) {
                cleanWindowInfo();
                $('#info-icon').append('<img class="photo" ' + 'src="' + createPhoto(place) + '"/>');
                $('#info-url').append('<b><a href="#restaurant-info">' + place.name + '</a></b>');
                $('#info-address').text(place.vicinity);
                if (!place.formatted_phone_number) {
                    $('#info-phone').hide();
                } else {
                    $('#info-phone').text(place.formatted_phone_number);
                }
                addRating(place);

                $('#info-reviews').text('Read Reviews')
            }

            function cleanWindowInfo() {
                $('#info-icon').empty();
                $('#info-url').empty();
                $('#info-rating').empty();
            }
            //add new marker and new restaurant
            map.addListener('rightclick', function(e) {
                closeInfoWindow();
                isRestaurantNew = true;
                let latlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                let marker = new google.maps.Marker({
                    position: latlng,
                    id: restaurantIndex + 1
                });
                google.maps.event.addListener(marker, 'click', addRestaurantInfoWindow);
                marker.setMap(map);
            });
            //add new restaurant formular
            function buildContent(marker) {
                restaurantInfoDiv.show();
                form.empty();
                form.show();
                form.append(`
                    <input type="text" id="res-name" name="res-name" placeholder="Restaurant Name" required/>
                    <input type="hidden" id="res-location-lat" name="res-location-lat" value="${marker.position.lat()}"/>
                    <input type="hidden" id="res-location-lng" name="res-location-lng" value="${marker.position.lng()}"/>
                    <input type="text" name="res-address" id="res-address" placeholder="Address" required/>
                    <label for="res-rating">Rating: </label>
                    <select name="res-rating" id="res-rating" required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    <button id="btn-add-restaurant" class="button btn-submit">Add Restaurant</button>`

                );
            }

            form.on("submit", function(e) {
                e.preventDefault();
                let name = $('#res-name');
                let address = $('#res-address');
                let rating = $('#res-rating');
                let locationLat = $('#res-location-lat');
                let locationLng = $('#res-location-lng');


                let position = new google.maps.LatLng(locationLat.value, locationLng.value);

                let place = {
                    name: name.val(),
                    vicinity: address.val(),
                    rating: rating.val(),
                    position: position,
                    geometry: { location: position },
                    icon: 'image/logo.png',
                    reviews: '',
                    photos: '',

                };
                newRestaurants.push(place);
                closeInfoWindowNew();
                let marker = newRestaurantMarker[restaurantIndex];
                isRestaurantNew = false;
                infoWindow.open(map, marker);
                infoWindowContent(place);
                displayRestaurantInfo(place);

            });

            sortBy.on('change', function() {

                if (sortBy.val() === 'one') {
                    restSort();
                    one = true;
                    findPlaces();
                } else if (sortBy.val() === 'two') {
                    restSort();
                    two = true;
                    findPlaces();
                } else if (sortBy.val() === 'three') {
                    restSort();
                    three = true;
                    findPlaces();
                } else if (sortBy.val() === 'four') {
                    restSort();
                    four = true;
                    findPlaces();
                } else if (sortBy.val() === 'five') {
                    restSort();
                    five = true;
                    findPlaces();
                } else if (sortBy.val() === 'all') {
                    restSort();
                    all = true;
                    findPlaces();
                }
            });

        }, function(error) {

            if (error.code === 0) {
                alert("An unknown error occurred.");
            } else if (error.code === 1) {
                alert("User denied the request for Geolocation. Refresh the broswer and allow Geolocation");
            } else if (error.code === 2) {
                alert("Location information is unavailable.");
            } else if (error.code === 3) {
                alert("The request to get user location timed out.");
            }
            handleLocationError(true, infoWindow, map.getCenter(currentPosition));
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter(currentPosition));
        alert("Your browser does not support HTML5 Geolocation!!!");
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);

    }

}


//create a form to add a new review
function createReviewWindow() {

    reviewDiv.append(`<form id="add-review">
                        <label for="your-name">Your Name</label>
                        <input type="text" name="your-name" id="your-name" placeholder="Your Name" required>
                        <div class="add-rate">
                            <label for="your-rating">Rate the place</label>
                        </div>
                        <select name="your-rating" id="your-rating" required>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label for="your-review">Share your opinion about this restaurant.</label>
                        <textarea name="your-review" id="your-review" placeholder="Your Review" required></textarea>
                    </select>
                </form>`);
    $('#add-review-button').hide();
    reviewSubmitBtn.show();

}
//read and save in variables a review's information
function submitReview() {
    let newName = $("#your-name");
    let newRating = $("#your-rating");
    let newReview = $("#your-review");
    if (!(newName.val() && newRating.val() && newReview.val())) {
        return;
    }
    addReview(newName.val(), newRating.val(), newReview.val());
    newName.html();
    newRating.html();
    newReview.html();
    hideReviewForm();
    reviewSubmitBtn.hide();
    reviewDiv.empty();
}
//add a new review to the page
function addReview(newName, newRating, newReview) {
    let newReviewDetails = {
        name: newName,
        rating: newRating,
        review: newReview,
    };
    let reviewsDiv = $('#reviews');
    let newReviewHTML = '';
    newReviewHTML += `<div class="restaurant-reviews">
                         <h3 class="review-title">
                         <span class="profile-photo" style="background-image: url('image/avatar.png')"></span>
                         <span id="review-rating" class="rating">${placeRating(newReviewDetails)}</span>
                         </h3>
                         <h3>${newReviewDetails.name}</h3>
                         <p> ${newReviewDetails.review} </p>
                       </div>`;
    newReviewArray.push(newReviewDetails);
    reviewsDiv.prepend(newReviewHTML);
}

function restSort() {
    one = false;
    two = false;
    four = false;
    three = false;
    five = false;
    all = false;
}
//place rating
function placeRating(place) {
    let rating = [];
    if (place.rating) {
        for (let i = 0; i < 5; i++) {
            if (place.rating < (i + 1)) {
                rating.push(emptyRate);
            } else {
                rating.push(fullRate);
            }
        }
        return rating.join(' ');
    }
}

function addRating(place) {
    if (place.rating) {
        let displayRating = '';
        for (let i = 0; i < 5; i++) {
            if (place.rating < (i + 1)) {
                displayRating = '';
                displayRating += emptyRate;
            } else {
                displayRating = '';
                displayRating += fullRate;
            }
            $('#info-rating').show();
            $('#info-rating').append(displayRating);
        }
    } else {
        $('#info-rating').hide();
    }
}
//Shows or hides the form for the restaurant reviews
function showReviewForm() {
    $("#review-window").show();
    $("#add-review-button").show();
}

function hideReviewForm() {
    $("#review-window").hide();
    $("#add-review-button").hide();
}