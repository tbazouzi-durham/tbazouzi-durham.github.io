"use strict";
(function()
{
    // if user does not exist in session storage
    if(!sessionStorage.getItem("user"))
    {
        // redirect to the login page
        location.href = "login.html";
    }
})();