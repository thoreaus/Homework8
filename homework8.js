
//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("locations_db", "0.1", "A Database of Locations", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY ASC, location TEXT, longitude TEXT, latitude TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

//function to output the list of cars in the database

function updateLocList(transaction, results) {
		console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("loclist");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.location + " - " + row.longitude +  " - " + row.latitude+ " (<a href='javascript:void(0);' onclick='deleteLoc(" + row.id + ");'>Delete Location</a>)";
    }

}

//function to get the list of cars from the database

function outputLoc() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM locations", [], updateLocList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to add the car to the database

function addMarker() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var location = document.getElementById("location").value;
        var longitude = document.getElementById("longitude").value;
        var latitude = document.getElementById("latitude").value;

        //Test to ensure that the user has entered both a make and model
        if (locations !== "" && longitude !== "" && latitude !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO locations (location, longitude, latitude) VALUES (?, ?, ?)", [location, longitude, latitude]);
                outputLoc(); //ad marker?
            });
        } else {
            alert("You must enter the locations name, longitude, and latitude!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


//function to remove a car from the database, passed the row id as it's only parameter

function deleteLoc(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM locations WHERE id=?", [id], outputLoc);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputLoc();

        var count = 0;
        var locations = [
//    [
//        select location from locations,
//        select longitude from locations,
//        select latitude from locations
//    ],
    [
        "First People's House",
        48.463997,
         -123.311609
    ],
    [
    		"Clearihue",
        48.464178,
        -123.310520
    ],
    [
    		"Cornett",
        48.464350,
        -123.313464
    ]
];
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.463649,  -123.311951),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var infowindow = new google.maps.InfoWindow();
    var marker, i;
    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            count++;
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
            alert(locations[i][1]+", "+locations[i][2] +", Count: " + count);
        }
      })(marker, i));
        
    }
     google.maps.event.addListener(map, 'bounds_changed', function(){
         console.log(map.getBounds().toString());
     });
