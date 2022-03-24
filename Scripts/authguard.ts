"use strict";
((function()
{
    let protected_routes: string[] = [
        "contact-list"
    ];


    if(protected_routes.indexOf(router.ActiveLink) > -1)
    {
        // check if user is logged in
        if(!sessionStorage.getItem("user"))
        {
            // if not...redirect them back to the login page
            location.href = "/login";
        }
    }
   
}))();