"use strict";
var core;
(function (core) {
    class Contact {
        m_fullName;
        m_contactNumber;
        m_emailAddress;
        get FullName() {
            return this.m_fullName;
        }
        set FullName(fullName) {
            this.m_fullName = fullName;
        }
        get ContactNumber() {
            return this.m_contactNumber;
        }
        set ContactNumber(contactNumber) {
            this.m_contactNumber = contactNumber;
        }
        get EmailAddress() {
            return this.m_emailAddress;
        }
        set EmailAddress(emailAddress) {
            this.m_emailAddress = emailAddress;
        }
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this.m_fullName = fullName;
            this.m_contactNumber = contactNumber;
            this.m_emailAddress = emailAddress;
        }
        serialize() {
            if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            else {
                console.error("One or more properties of the Contact are missing or empty");
                return null;
            }
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
        toString() {
            return `Full Name     : ${this.FullName}\nContact Number: ${this.ContactNumber}\nEmail Address : ${this.EmailAddress}`;
        }
    }
    core.Contact = Contact;
})(core || (core = {}));
//# sourceMappingURL=contact.js.map