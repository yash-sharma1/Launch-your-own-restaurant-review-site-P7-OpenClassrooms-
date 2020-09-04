# Launch-your-own-restaurant-review-site-P7-OpenClassrooms-
You've chosen to get started in the restaurant review business! Your goal is to create an easy-to-use, simple service that offers reviews of restaurants around you.  For this project, you have to learn to use external APIs such as Google Maps and Google Places (your biggest competitor 😬). That's not all: you will have to integrate all this information in a clear, organized way in your application!  You will also be required to code using good coding practices like you've learned so far, among which object-oriented programming is one of the most important.

Step 1: Restaurants
Start with the real foundation of your application. There will be 2 main sections:
- A Google Maps map loaded with the Google Maps API
- A list of restaurants on the right side of the page that are within the area displayed on the map

The Google Maps map will focus immediately on the position of the user. You'll use the JavaScript geolocation API. A specific color marker should be shown at the user's current location.

A list of restaurants is provided as JSON data in a separate file. Normally, this data would be returned to the backend of your application by an API, but for this exercise, it's sufficient just to load the list of restaurants directly into memory!

Here's a sample JSON file with 2 restaurants pre-filled in there (you should create your own):


      [
     {
       "restaurantName":"Bronco",
      "address":"39 Rue des Petites Écuries, 75010 Paris",
      "lat":48.8737815,
      "long":2.3501649,
      "ratings":[
         {
            "stars":4,
            "comment":"Great! But not many veggie options."
         },
         {
            "stars":5,
            "comment":"My favorite restaurant!"
         }
      ]
       },
       {
      "restaurantName":"Babalou",
      "address":"4 Rue Lamarck, 75018 Paris",
      "lat":48.8865035,
      "long":2.3442197,
      "ratings":[
         {
            "stars":5,
            "comment":"Tiny pizzeria next to Sacre Coeur!"
         },
         {
            "stars":3,
            "comment":"Meh, it was fine."
         }
        ]
     }
    ]


Show restaurants on the map based on their GPS coordinates. Restaurants that are currently visible on the map should be displayed in list form on the side of the map as mentioned above. You will see the average reviews of each restaurant (ranging from 1 to 5 stars). These ratings come from your JSON file (not real reviews).

When you click on a restaurant, the list of reviews should be shown. Also show the Google Street View photo via the corresponding API! 

A filter tool allows the display of restaurants that have between X and Y stars. The map should be updated in real-time to show the corresponding restaurants.

Step 2: Add restaurants and reviews
Your visitors would also like to give their opinions on restaurants!
Let them:
- Add a review about an existing restaurant
- Add a restaurant by clicking on a specific place on the map

Once a review or restaurant has been added, it should appear immediately on the map. A new marker will show the position of the new restaurant.

The information will not be saved if they leave the page (it will just be saved in memory for the duration of the visit).

Step 3: Integration with Google Places API
For the moment, there are not many restaurants or reviews. Fortunately, Google Places offers an API to retrieve restaurants and reviews! Use it to display additional restaurants and reviews on your map so you don't have to use only your JSON file. Here's their documentation: https://developers.google.com/places/web-service/details

You'll use the search API to find restaurants in a particular display area.

Read the documentation to learn how to access data from Google Places, and feel free to search around on Google for tips if you get a little stuck!

You do not have to use Google Maps for this project. There are a number of Map APIs available that you could use for this project, for example :

- OpenStreetMap - https://openmaptiles.org/languages/en/#0.44/0/0
- OpenLayers - https://openlayers.org/
- LeafletJS - https://leafletjs.com/
- MapQuest - https://developer.mapquest.com/
- Mapbox - https://www.mapbox.com/documentation/

Here I'm using Google Map API
