"use strict";
(function () {
    function AuthGuard() {
        var protected_routes = [
            "contact-list"
        ];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                router.ActiveLink = "login";
            }
        }
    }
    function LoadLink(link, data) {
        if (data === void 0) { data = ""; }
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $("li>a:contains(".concat(document.title, ")")).addClass("active");
        CheckLogin();
        LoadContent();
    }
    function AddNavigationEvents() {
        var NavLinks = $("ul>li>a");
        NavLinks.off("click");
        NavLinks.off("mouseover");
        NavLinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        NavLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function AddLinkEvents(link) {
        var linkQuery = $("a.link[data=".concat(link, "]"));
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text-decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink("".concat(link));
        });
        linkQuery.on("mouseover", function () {
            $(this).css('cursor', 'pointer');
            $(this).css('font-weight', 'bold');
        });
        linkQuery.on("mouseout", function () {
            $(this).css('font-weight', 'normal');
        });
    }
    function LoadHeader() {
        $.get("./Views/components/header.html", function (html_data) {
            $("header").html(html_data);
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        var page_name = router.ActiveLink;
        var callback = ActiveLinkCallBack();
        $.get("./Views/content/".concat(page_name, ".html"), function (html_date) {
            $("main").html(html_date);
            callback();
        });
    }
    function LoadFooter() {
        $.get("./Views/components/footer.html", function (html_date) {
            $("footer").html(html_date);
        });
    }
    function DisplayHomePage() {
        console.log("Home Page");
        $("#AboutUsButton").on("click", function () {
            LoadLink("about");
        });
        $("main").append("<p id=\"MainParagraph\" class=\"mt-3\">This is the Main Paragraph</p>");
        $("main").append("<article>\n        <p id=\"ArticleParagraph\" class =\"mt-3\">This is the Article Paragraph</p>\n        </article>");
    }
    function DisplayProductsPage() {
        console.log("Products Page");
    }
    function DisplayServicesPage() {
        console.log("Services Page");
    }
    function DisplayAboutPage() {
        console.log("About Page");
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        var contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            var key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function ValidateField(fieldID, regular_expression, error_message) {
        var messageArea = $("#messageArea").hide();
        $("#" + fieldID).on("blur", function () {
            var text_value = $(this).val();
            if (!regular_expression.test(text_value)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }
    function DisplayContactPage() {
        console.log("Contact Page");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        ContactFormValidation();
        var sendButton = document.getElementById("sendButton");
        var subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                var fullName = document.forms[0].fullName.value;
                var contactNumber = document.forms[0].contactNumber.value;
                var emailAddress = document.forms[0].emailAddress.value;
                var contact = new core.Contact(fullName, contactNumber, emailAddress);
                if (contact.serialize()) {
                    var key = contact.FullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }
    function DisplayContactListPage() {
        if (localStorage.length > 0) {
            var contactList = document.getElementById("contactList");
            var data = "";
            var keys = Object.keys(localStorage);
            var index = 1;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var contactData = localStorage.getItem(key);
                var contact = new core.Contact();
                contact.deserialize(contactData);
                data += "<tr>\n                <th scope=\"row\" class=\"text-center\">".concat(index, "</th>\n                <td>").concat(contact.FullName, "</td>\n                <td>").concat(contact.ContactNumber, "</td>\n                <td>").concat(contact.EmailAddress, "</td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-primary btn-sm edit\"><i class=\"fas fa-edit fa-sm\"></i> Edit</button></td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-danger btn-sm delete\"><i class=\"fas fa-trash-alt fa-sm\"></i> Delete</button></td>\n                </tr>");
                index++;
            }
            contactList.innerHTML = data;
            $("button.delete").on("click", function () {
                if (confirm("Are you sure?")) {
                    localStorage.removeItem($(this).val());
                }
                LoadLink("contact-list");
            });
            $("button.edit").on("click", function () {
                LoadLink("edit", $(this).val());
            });
        }
        $("#addButton").on("click", function () {
            LoadLink("edit", "add");
        });
    }
    function DisplayEditPage() {
        console.log("Edit Page");
        ContactFormValidation();
        var page = router.LinkData;
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html("<i class=\"fas fa-plus-circle fa-lg\"></i> Add");
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        var fullName = document.forms[0].fullName.value;
                        var contactNumber = document.forms[0].contactNumber.value;
                        var emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", function () {
                        LoadLink("contact-list");
                    });
                }
                break;
            default:
                {
                    var contact_1 = new core.Contact();
                    contact_1.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact_1.FullName);
                    $("#contactNumber").val(contact_1.ContactNumber);
                    $("#emailAddress").val(contact_1.EmailAddress);
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        contact_1.FullName = $("#fullName").val();
                        contact_1.ContactNumber = $("#contactNumber").val();
                        contact_1.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact_1.serialize());
                        LoadLink("contact-list");
                    });
                    $("#cancelButton").on("click", function () {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html("<a id=\"logout\" class=\"nav-link\" href=\"#\"><i class=\"fas fa-sign-out-alt\"></i> Logout</a>");
            $("#logout").on("click", function () {
                sessionStorage.clear();
                $("#login").html("<a class=\"nav-link\" data=\"login\"><i class=\"fas fa-sign-in-alt\"></i> Login</a>");
                AddNavigationEvents();
                LoadLink("login");
            });
        }
    }
    function DisplayLoginPage() {
        console.log("Login Page");
        var messageArea = $("#messageArea");
        messageArea.hide();
        AddLinkEvents("register");
        $("#loginButton").on("click", function () {
            var success = false;
            var newUser = new core.User();
            $.get("./Data/users.json", function (data) {
                for (var _i = 0, _a = data.users; _i < _a.length; _i++) {
                    var user = _a[_i];
                    var username = document.forms[0].username.value;
                    var password = document.forms[0].password.value;
                    if (username == user.Username && password == user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            LoadLink("home");
        });
    }
    function DisplayRegisterPage() {
        console.log("Register Page");
        AddLinkEvents("login");
    }
    function Display404Page() {
    }
    function AddNewTask() {
        var messageArea = $("#messageArea");
        messageArea.hide();
        var taskInput = $("#taskTextInput");
        var taskInputValue = taskInput.val();
        if (taskInput.val() != "" && taskInputValue.charAt(0) != " ") {
            var newElement = "\n               <li class=\"list-group-item\" id=\"task\">\n               <span id=\"taskText\">".concat(taskInput.val(), "</span>\n               <span class=\"float-end\">\n                   <button class=\"btn btn-outline-primary btn-sm editButton\"><i class=\"fas fa-edit\"></i>\n                   <button class=\"btn btn-outline-danger btn-sm deleteButton\"><i class=\"fas fa-trash-alt\"></i></button>\n               </span>\n               <input type=\"text\" class=\"form-control edit-task editTextInput\">\n               </li>\n               ");
            $("#taskList").append(newElement);
            messageArea.removeAttr("class").hide();
            taskInput.val("");
        }
        else {
            taskInput.trigger("focus").trigger("select");
            messageArea.show().addClass("alert alert-danger").text("Please enter a valid Task.");
        }
    }
    function DisplayTaskList() {
        if (localStorage.length > 0) {
            var messageArea_1 = $("#messageArea");
            messageArea_1.hide();
            var taskInput = $("#taskTextInput");
            $("#newTaskButton").on("click", function () {
                AddNewTask();
            });
            taskInput.on("keypress", function (event) {
                if (event.key == "Enter") {
                    AddNewTask();
                }
            });
            $("ul").on("click", ".editButton", function () {
                var editText = $(this).parent().parent().children(".editTextInput");
                var text = $(this).parent().parent().text();
                var editTextValue = editText.val();
                editText.val(text).show().trigger("select");
                editText.on("keypress", function (event) {
                    if (event.key == "Enter") {
                        if (editText.val() != "" && editTextValue.charAt(0) != " ") {
                            editText.hide();
                            $(this).parent().children("#taskText").text(editTextValue);
                            messageArea_1.removeAttr("class").hide();
                        }
                        else {
                            editText.trigger("focus").trigger("select");
                            messageArea_1.show().addClass("alert alert-danger").text("Please enter a valid Task.");
                        }
                    }
                });
            });
            $("ul").on("click", ".deleteButton", function () {
                if (confirm("Are you sure?")) {
                    $(this).closest("li").remove();
                }
            });
        }
    }
    function ActiveLinkCallBack() {
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutPage;
            case "products": return DisplayProductsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "content": return DisplayTaskList;
            case "edit": return DisplayEditPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "404": return Display404Page;
            default:
                console.error("ERROR: callback does not exist: " + router.ActiveLink);
                return new Function();
        }
    }
    function Start() {
        console.log("App Started!");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map