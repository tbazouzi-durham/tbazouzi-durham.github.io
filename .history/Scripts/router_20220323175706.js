"use strict";
var core;
(function (core) {
    var Router = (function () {
        function Router() {
            this.m_activeLink = "";
            this.m_linkData = "";
            this.m_routingTable = [];
        }
        Object.defineProperty(Router.prototype, "ActiveLink", {
            get: function () {
                return this.m_activeLink;
            },
            set: function (link) {
                this.m_activeLink = link;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Router.prototype, "LinkData", {
            get: function () {
                return this.m_linkData;
            },
            set: function (data) {
                this.m_linkData = data;
            },
            enumerable: false,
            configurable: true
        });
        Router.prototype.Add = function (route) {
            this.m_routingTable.push(route);
        };
        Router.prototype.AddTable = function (routingTable) {
            this.m_routingTable = routingTable;
        };
        Router.prototype.Find = function (route) {
            return this.m_routingTable.indexOf(route);
        };
        Router.prototype.Remove = function (route) {
            if (this.Find(route) > -1) {
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        };
        Router.prototype.toString = function () {
            return this.m_routingTable.toString();
        };
        return Router;
    }());
    core.Router = Router;
})(core || (core = {}));
var router = new core.Router();
router.AddTable([
    "/",
    "/home",
    "/about",
    "/services",
    "/task-list",
    "/contact-list",
    "/products",
    "/register",
    "/login",
    "/edit"
]);
var route = location.pathname;
router.ActiveLink = (router.Find(route) > -1) ? (route == "/") ? "home" : route.substring(1) : "404";
//# sourceMappingURL=router.js.map