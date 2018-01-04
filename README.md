# SavTourApi
API to serve the Savannah Tour mobile app and control panel

Host: `https://savtourapi.herokuapp.com`

#### Notes
All endpoints but admin user login are protected from public access in that they require an expiring token generated through successful login. Developers should pass this token with ajax calls to this API by setting the x-access-token header.

Example, where variable `token` holds the login token: 

```javascript
$.ajax({
    *Method:* "GET",
    url: apiHost + apiEndpoint,
    beforeSend: function(request){
        request.setRequestHeader("x-access-token", token) 
        }
    })
    .done( function(response){
        console.log(response);
        // hooray! it worked. response contains data...
    })
    .fail( function(err){
        console.log("Error retrieving data:",err);
        // something went wrong.
    })
}
```
## Endpoint quick links
- [Tour locations](#tour-locations)
- [Friends of Tour management](#friends-of-tour-management)
- [Tour event management](#tour-event-management)
- [User management](#user-management)

## Tour locations    
- [Retrieve all locations](#retrieve-all-locations)
- [Add new location](#add-new-location)
- [Remove location](#remove-location)
- [Update location](#update-location)

### Retrieve all locations

*Method:* GET

*Endpoint:* `/api/locations`

*Returns:* Tour sponsor and stop data

When data is present, response looks like:
```javascript
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
        //next place
    }
]
```

### Add new location

*Method:* POST

*Endpoint:* `/api/new/location`

*Returns:* New location object:  
```javascript
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
```

### Remove location

*Method:* GET

*Endpoint:* `/api/remove/location/<id>`

Note: `<id>` is the ID of the tour location you wish to delete from the database.

### Update location

*Method:* POST

*Endpoint:* `/api/update/location`

*Notes:* Post body must include `id` property along with any properties you with to alter.

*Returns:* Updated location object.

## Friends of Tour management

- [Retrieve Friends of Tour](#retrieve-friends-of-tour)

### Retrieve Friends of Tour

*Notes:* For now, we are just scraping Friends of Tour data from the main Tour website.

*Method:* GET

*Endpoint:* `/api/friends`

*Returns:* Array of current "Friends of the Tour"

## Tour event management

- [Retrieve all events](#retrieve-all-events)
- [Update event](#update-event)
- [Remove event](#remove-event)
- [Add event](#add-event)

### Retrieve all events

*Method:* GET

*Endpoint:* `/api/events`

*Returns:* All events in database. Events look like:
```javascript
[
    { 
        "title": "<title>",
        "description": "<description>",
        "start": "<start date>",
        "end": "<end date>"
    },
    {
        // next event
    }    
]
```

### Update event

*Method:* POST

*Endpoint:* `/api/update/event`

*Notes:* Post body must include `id` property as well as any other event properties you wish to alter.

### Remove event

*Method:* GET

*Endpoint:* `/api/remove/event/<id>`

*Notes:* `<id>` is the ID of the event you wish to remove from the database.

### Add event

*Method:* POST

*Endpoint:* `/api/new/event`

*Notes:* Event body looks like:
```javascript
{ 
    "title": "<title>",
    "description": "<description>",
    "start": "<start date>",
    "end": "<end date>"
}
```

## User management

*Notes:* Only a properly logged-in administrative user can manage users.

- [Retrieve all users](#retrieve-all-users)
- [Add user](#add-user)

### Add user 

*Method:* POST

*Endpoint:* `/api/signup`

*Notes:* User post body looks like: 
```javascript
{
    "username": "<username>",
    "password": "<password>"
}
```
Passwords are hashed before database storage. They are not returned with any other user endpoints. They can be reset by other administrative users, but not seen.

*Returns:* 

2. Log-in user

POST: "/api/signin"