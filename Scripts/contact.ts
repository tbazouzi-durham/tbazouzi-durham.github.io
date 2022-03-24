namespace core
{
    export class Contact
    {
        // private instance members
        private m_fullName: string;
        private m_contactNumber: string;
        private m_emailAddress: string;

        // public properties (getters and setters)
        public get FullName(): string
        {
            return this.m_fullName;
        }

        public set FullName(fullName: string)
        {
            this.m_fullName = fullName;
        }

        public get ContactNumber(): string
        {
            return this.m_contactNumber;
        }

        public set ContactNumber(contactNumber: string)
        {
            this.m_contactNumber = contactNumber;
        }

        public get EmailAddress(): string
        {
            return this.m_emailAddress;
        }

        public set EmailAddress(emailAddress: string)
        {
            this.m_emailAddress = emailAddress;
        }

        // constructor
        constructor(fullName: string = "", contactNumber: string = "", emailAddress: string = "") // default parameters
        {
            this.m_fullName = fullName;
            this.m_contactNumber = contactNumber;
            this.m_emailAddress = emailAddress;
        }

        // public methods

        /**
         * This method converts the object's properties to a comma-separated string
         *
         * @returns {(string | null)}
         */
        serialize(): string | null
        {
            if(this.FullName !== "" && this.ContactNumber !== "" && this.EmailAddress !== "")
            {
                return `${this.FullName},${this.ContactNumber},${this.EmailAddress}`;
            }
            else
            {
                console.error("One or more properties of the Contact are missing or empty");
                return null;
            }
        }

        /**
         * This method separates the data string parameter into the object's properties
         *
         * @param {string} data
         * @returns {void}
         */
        deserialize(data: string): void // assume that data is a comma-separated list of properties (strings)
        {
            let propertyArray: string[] = data.split(",");
            this.FullName = propertyArray[0];
            this.ContactNumber = propertyArray[1];
            this.EmailAddress = propertyArray[2];
        }

        // public overrides

        /**
         * This method overrides the built-in toString method 
         * and returns a string that contains the values of the object's properties
         * @override
         * @returns {string}
         */
        toString(): string
        {
            return `Full Name     : ${this.FullName}\nContact Number: ${this.ContactNumber}\nEmail Address : ${this.EmailAddress}`;
        }
    }

}



