// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function()
{
    function AuthGuard(): void
    {
        let protected_routes: string[] = [
            "contact-list"
        ];
    
    
        if(protected_routes.indexOf(router.ActiveLink) > -1)
        {
            // check if user is logged in
            if(!sessionStorage.getItem("user"))
            {
                // if not...change the active link to the  login page
                router.ActiveLink = "login"
            }
        }
    }
    
    function LoadLink(link: string, data: string = ""): void
    {
        router.ActiveLink = link;

        AuthGuard();

        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        
        // capitalize active link and set document title to it
        document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);

        // remove all active Nav Links
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        });

        $(`li>a:contains(${document.title})`).addClass("active"); // updates the Active link on Navigation items

        CheckLogin();

        LoadContent();
    }

    function AddNavigationEvents(): void
    {

        let NavLinks = $("ul>li>a"); // find all Navigation Links

        NavLinks.off("click");
        NavLinks.off("mouseover");

        // loop through each Navigation link and load appropriate content on click
        NavLinks.on("click", function()
        {
            LoadLink($(this).attr("data") as string);
        });

        NavLinks.on("mouseover", function()
        {
            $(this).css("cursor", "pointer");
        });
    }

    function AddLinkEvents(link: string): void
    {
        let linkQuery = $(`a.link[data=${link}]`);
        // remove all link events
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        // css adjustments for links
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");

        // add link events
        linkQuery.on("click", function()
        {
            LoadLink(`${link}`);
        });

        linkQuery.on("mouseover", function()
        {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });

        linkQuery.on("mouseout", function()
        {
            $(this).css('font-weight', 'normal');
        });
    }

    /**
     * This function loads the header.html content into a page
     *
     * @returns {void}
     */
    function LoadHeader(): void
    {
        // use AJAX to load the header content
        $.get("./Views/components/header.html", function(html_data)
        {
            // inject Header content into the page
            $("header").html(html_data);

            AddNavigationEvents();
            
            CheckLogin();
        });
    }

    /**
     * 
     * 
     * @returns {void}
     */
    function LoadContent(): void
    {
        let page_name = router.ActiveLink; // alias for the Active Link
        let callback = ActiveLinkCallBack(); // returns a reference to the correct function
        $.get(`./Views/content/${page_name}.html`, function(html_date)
        {
            $("main").html(html_date);
            callback(); // calling the correct function 
        });
    }

    /**
     *
     * @returns {void}
     */
    function LoadFooter(): void
    {
        $.get(`./Views/components/footer.html`, function(html_date)
        {
            $("footer").html(html_date);
        });
    }

    function DisplayHomePage(): void
    {
        console.log("Home Page");
        $("#AboutUsButton").on("click", () => 
        {
            LoadLink("about");
        });
    
        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);
        $("main").append(`<article>
        <p id="ArticleParagraph" class ="mt-3">This is the Article Paragraph</p>
        </article>`);
    }

    function DisplayProductsPage(): void
    {
        console.log("Products Page");
    }

    function DisplayServicesPage(): void
    {
        console.log("Services Page");
    }

    function DisplayAboutPage(): void
    {
        console.log("About Page");
    }

    /**
     *This function adds a Contact object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName: string, contactNumber: string, emailAddress: string)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    /**
     * This method validates a field in the form and displays an error in the message area div element
     *
     * @param {string} fieldID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(fieldID: string, regular_expression: RegExp, error_message: string)
    {
        let messageArea = $("#messageArea").hide();
    
        $("#" + fieldID).on("blur", function()
        {
            let text_value = $(this).val() as string;
            if(!regular_expression.test(text_value))
            {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else
            {
                messageArea.removeAttr("class").hide();
            }
        });
    }

    function ContactFormValidation(): void
    {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }

    function DisplayContactPage(): void
    {
        console.log("Contact Page");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function()
        {
            LoadLink("contact-list");
        });

        ContactFormValidation();
       
        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function(event)
        {

            if(subscribeCheckbox.checked)
            {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;

                let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if(contact.serialize())
                {
                    let key = contact.FullName.substring(0, 1) + Date.now();

                    localStorage.setItem(key, contact.serialize() as string);
                }
            }
        });
    }

    function DisplayContactListPage(): void
    {
        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList") as HTMLElement;

            let data = "";

            let keys = Object.keys(localStorage); // returns a list of keys from localStorage

            let index = 1;

            // for every key in the keys string array
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key) as string; // get localStorage data value

                let contact = new core.Contact(); // create an empty Contact object
                contact.deserialize(contactData);

                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;

                index++;
            }

            contactList.innerHTML = data;

            $("button.delete").on("click", function()
            {
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val() as string)
                }
                LoadLink("contact-list");
            });

            $("button.edit").on("click", function()
            {
                LoadLink("edit", $(this).val() as string);
            });
        }

        $("#addButton").on("click", ()=>
        {
            LoadLink("edit", "add");
        });
    }

    /**
     * This function allows JavaScript to work on the Edit Page
     */
    function DisplayEditPage(): void
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = router.LinkData;

        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`)

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();

                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;

                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    // get contact info from localStorage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page) as string);

                    // display the contact in the edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();
                        
                        // get changes from the page
                        contact.FullName = $("#fullName").val() as string;
                        contact.ContactNumber = $("#contactNumber").val() as string;
                        contact.EmailAddress = $("#emailAddress").val() as string;

                        // replace the item in local storage
                        localStorage.setItem(page, contact.serialize() as string);
                        // go back to the contact list page (refresh)
                        LoadLink("contact-list");
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        LoadLink("contact-list");
                    });
                    
                }
                break;
        }
    }

    function CheckLogin(): void
    {
        // if user is logged in
        if(sessionStorage.getItem("user"))
        {
            // swap out the login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );
            
            $("#logout").on("click", function()
            {
                // perform logout
                sessionStorage.clear();

                 // swap out the logout link for login
                $("#login").html(
                    `<a class="nav-link" data="login"><i class="fas fa-sign-in-alt"></i> Login</a>`
                );

                AddNavigationEvents();

                // redirect back to login
                LoadLink("login");
            });
        }
    }

    function DisplayLoginPage(): void 
    {
        console.log("Login Page");
        let messageArea =  $("#messageArea");
        messageArea.hide();

        AddLinkEvents("register");

        $("#loginButton").on("click", function()
        {
            let success = false;
            // create an empty user object
            let newUser = new core.User();

            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file
                for (const user of data.users) 
                {
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;

                    // check if the username and password entered in the form matches this user
                    if(username == user.Username && password == user.Password)
                    {
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches - success.. the perform the login sequence
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize() as string);

                    // hide any error message
                    messageArea.removeAttr("class").hide();

                    // redirect the user to the secure area of our site - contact-list.html
                    LoadLink("contact-list");
                }
                // else if bad credentials were entered...
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            document.forms[0].reset();

            // return to the home page
            LoadLink("home");
        });
    }

    function DisplayRegisterPage(): void
    {
        console.log("Register Page");

        AddLinkEvents("login");
    }

    function Display404Page(): void
    {

    }

    /**
     * This function adds a new Task to the TaskList
     */
     function AddNewTask() 
     {
       let messageArea = $("#messageArea");
       messageArea.hide();
       let taskInput = $("#taskTextInput");
       let taskInputValue = taskInput.val() as string;
 
       if (taskInput.val() != "" && taskInputValue.charAt(0) != " ") 
       {
         let newElement = `
               <li class="list-group-item" id="task">
               <span id="taskText">${taskInput.val()}</span>
               <span class="float-end">
                   <button class="btn btn-outline-primary btn-sm editButton"><i class="fas fa-edit"></i>
                   <button class="btn btn-outline-danger btn-sm deleteButton"><i class="fas fa-trash-alt"></i></button>
               </span>
               <input type="text" class="form-control edit-task editTextInput">
               </li>
               `;
         $("#taskList").append(newElement);
         messageArea.removeAttr("class").hide();
         taskInput.val("");
       } 
       else 
       {
         taskInput.trigger("focus").trigger("select");
         messageArea.show().addClass("alert alert-danger").text("Please enter a valid Task.");
       }
     }
 
     /**
      * This function is the Callback function for the TaskList
      *
      */
     function DisplayTaskList()
     {
         let messageArea = $("#messageArea");
         messageArea.hide();
         let taskInput = $("#taskTextInput");
 
         // add a new Task to the Task List
         $("#newTaskButton").on("click", function()
         {         
             AddNewTask();
         });
 
         taskInput.on("keypress", function(event)
         {
           if(event.key == "Enter")
           {
             AddNewTask();
           }
          });
 
         // Edit an Item in the Task List
         $("ul").on("click", ".editButton", function()
         {
            let editText = $(this).parent().parent().children(".editTextInput");
            let text = $(this).parent().parent().text();
            let editTextValue = editText.val() as string;
            editText.val(text).show().trigger("select");
            editText.on("keypress", function(event)
            {
             if(event.key == "Enter")
             {
               if(editText.val() != "" && editTextValue.charAt(0) != " ")
               {
                 editText.hide();
                 $(this).parent().children("#taskText").text(editTextValue);
                 messageArea.removeAttr("class").hide();
               }
               else
               {
                 editText.trigger("focus").trigger("select");
                 messageArea.show().addClass("alert alert-danger").text("Please enter a valid Task.");
               }
             }
            });
         });
 
         // Delete a Task from the Task List
         $("ul").on("click", ".deleteButton", function(){
             if(confirm("Are you sure?"))
             {
                 $(this).closest("li").remove();
             }    
         });
     }

    /**
     * This method returns the appropriate function callback relative to the Active Link
     *
     * @returns {Function}
     */
    function ActiveLinkCallBack(): Function
    {
        switch(router.ActiveLink)
        {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "products": return DisplayProductsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }

    // named function option

    /**
     * This is the entry point to the web application
     *
     */
    function Start(): void
    {
        console.log("App Started!");

        LoadHeader();

        LoadLink("home");

        LoadFooter();
    }

    window.addEventListener("load", Start);

})();