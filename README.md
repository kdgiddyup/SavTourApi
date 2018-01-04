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
## Quick links
- [Tour locations](#tour-locations)
- [Friends of Tour](#friends-of-tour)
- [Tour events](#tour-events)
- [Users](#users)
- [Clients](#clients)

## Tour locations    
- [Retrieve all locations](#retrieve-all-locations)
- [Add new location](#add-new-location)
- [Remove location](#remove-location)
- [Update location](#update-location)

### Retrieve all locations

*Method:* GET

*Endpoint:* `/api/locations`

*Returns:* Tour sponsor and stop data. When data is present, response looks like:
```javascript
[   
    {
        
        "name":"<Location name>",
        "type":"<TourStop>|<Sponsor>",
        "map":true|false,
        "address":"<Street address>",
        "description":"<Info on location>",
        "image":"<url/to/image>",
        "pos":{
            "lat":"<latitude>",
            "lng":"<longitute>"
            },
        "_id":"<id>"
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
    "name":"<Location name>",
    "type":"<TourStop>|<Sponsor>",
    "map":true|false,
    "address":"<Street address>",
    "description":"<Info on location>",
    "image":"<url/to/image>",
    "pos":{
        "lat":"<latitude>",
        "lng":"<longitute>"
        },
    "_id":"<id>"
}
```

### Remove location

*Method:* GET

*Endpoint:* `/api/remove/location/<id>`

*Note:* `<id>` is the ID of the tour location you wish to delete from the database.

*Returns:* JSON with success flag, message confirming ID of removed location

### Update location

*Method:* POST

*Endpoint:* `/api/update/location`

*Notes:* Post body must include `id` property along with any properties you with to alter.

*Returns:* Updated location object.

## Friends of Tour

- [Retrieve Friends of Tour](#retrieve-friends-of-tour)

### Retrieve Friends of Tour

*Notes:* For now, we are just scraping Friends of Tour data from the main Tour website.

*Method:* GET

*Endpoint:* `/api/friends`

*Returns:* Array of current "Friends of the Tour"

## Tour events

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

## Users

*Notes:* Only a properly logged-in administrative user can manage users.

- [Retrieve all users](#retrieve-all-users)
- [Sign in user](#sign-in-user)
- [Add user](#add-user)
- [Update user](#update-user)
- [Remove user](#remove-user)
- [Create system token](#create-system-token)

### Retrieve all users

*Method:* GET

*Endpoint:* `/api/users`

*Returns:* Array of all users in database, as objects containing `username` and `_id` properties.

### Sign in user

*Method:* POST

*Endpoint:* `/api/signin`

*Notes:* This is the only endpoint that does not require an `x-access-token`. The post body looks like:
```javascript
{
    "username":"<username>",
    "password":"<password>"
}
```

*Returns:* Error messages if user not found or password not authenticated. Successful login returns:
```javascript
{
    "success":true,
    "token": "<token>",
    "user": "<username>",
    "message": "Welcome, <username>"
}
```

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

*Returns:* Username

### Update user

*Method:* POST

*Endpoint:* `api/update/user`

*Notes:* In addition to `username` and/or `password` properites, post body must also include the `id` of the user you wish to alter.

*Returns:* Error message if user already exists (or other database failure), or if successful, a success message and the user's `username` and `id`.

### Remove user

*Method:* GET

*Endpoint:* `/api/remove/user/<id>`

*Notes:* `<id>` is the ID of the user you wish to remove from the database.

*Returns:* Success message that confirms the ID of the removed user. 

## Clients

- [Add new client](#add-new-client)
### Add new client

*Method:* POST

*Endpoint:* `/api/new/client`

*Notes:* This endpoint provides for the creation of a token that can be used by a client app to access endpoints. 

*Important:* The database will NOT store the token. It should be stored in a secure place by the app developer. 

The post request's body should contain:
```javascript
{
    "name":"<client name>",
    "email":"<a contact email for this client>"
}
```

*Returns:* 
```javascript
{
    "success":true|false,
    "client":{
        "name": "<client name>",
        "email": "<client email>"
        "id": "<client id>",
        "token":"<token>"
    },
    "message": "Client <client name> created. Keep token in a safe place."      
}
```
