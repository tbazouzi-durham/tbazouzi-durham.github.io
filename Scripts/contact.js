(function (core) {
    class Contact {
        // constructor
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this.FullName = fullName;
            this.ContactNumber = contactNumber;
            this.EmailAddress = emailAddress;
        }
        // public methods
        serialize() {
            if (this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "") {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            console.error("One or more properties of the Contact Object are missing or empty");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }
        // overridden methods
        toString() {
            return `Full Name     : ${this.FullName}\nContact Number: ${this.ContactNumber}\nEmail Address : ${this.EmailAddress}`;
        }
    }
    core.Contact = Contact;
})(core || (core = {}));