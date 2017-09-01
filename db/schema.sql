/* What do you all think makes sense in terms of DB structure? 
Seems to depend somewhat on how we handle matching. 

If matching is handled off site, perhaps we could have 2 tables, Users and Matches. 
Matches have a many to one relationship with users joined on user's ID. 
That way we can display all matches for a particular user. 
Other ideas? 

If we end up calculating matches ourselves, then obviously DB structure would be diffrent becasuse we'd need to actually save metrics on each individual photo. 
*/

/*
Perhaps we could use this for initial photos:
https://randomuser.me/photos
*/