# SavTourApi
API to serve the Savannah Tour mobile app

* LOCATION OPERATIONS    

1. Retrieve all locations

GET: "/api/locations"

/* when data is present, response looks like:

[   
    {
        
        "name":"Location name",
        "type":"TourStop|Sponsor",
        "map":"true|false",
        "address":"Street address",
        "description":"Info on location",
        "image":"url/to/image",
        "pos":{
            "lat":latitude,
            "lng":longitute},
        "_id":id
    },
    {
        ... next place ...
    }
]

2. Add new location

POST: "/api/new/location"

location object (req.body) looks like:  

{

    "name":"Location name",
    "type":"TourStop|Sponsor",
    "map":"true|false",
    "address":"Street address",
    "description":"Info on location",
    "image":"url/to/image",
    "pos":{
        "lat":latitude,
        "lng":longitude}
}


3. Remove location

GET: "/api/remove/location/:id"

4. Update location

POST: "/api/update/location"

(post body must include { id : id } property)

* FRIENDS OF TOUR OPERATIONS

1. Retrieve all friends of tour

GET: "/api/friendsoftour"

2. Update friend of tour

POST: "/api/update/friend"

(post body must include { id : id } property)

3. Remove friend of tour
GET: "/api/remove/friend/:id"

4. Add new friend of tour
POST: "/api/new/friend"

* TOUR EVENT OPERATIONS

1. Retrieve all tour events
Get: "/api/events"

2. Update event

POST: "/api/update/event"

(post body must include { id : id } property)

3. Remove event

GET: "/api/remove/event/:id"

4. Add new event 

Post: "/api/new/event"

* USER OPERATIONS

1. Add user 

POST: "/api/signup"

2. Log-in user

POST: "/api/signin"