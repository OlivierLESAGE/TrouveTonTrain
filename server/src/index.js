var express = require("express");

var app = express();

class Devise {
    constructor(nom, code, valeur, icon) {
        this.nom = nom;
        this.code = code;
        this.valeur = valeur;
        this.icon = icon;
    }
}

class DevisesManager {
    constructor() {
        this.devises = new Map();

        this.devises.set("EURO", new Devise("Euro", "EURO", 1.0, "€"));
        this.devises.set("DOLLAR", new Devise("Dollar", "DOLLAR", 0.92, "$"));
        this.devises.set("POUND", new Devise("Pound", "POUND", 1.19, "£"));
        this.devises.set("RUBLE", new Devise("Ruble", "RUBLE", 0.014, "₽"));
        this.devises.set("YEN", new Devise("Yen", "YEN", 0.0083, "¥"));
        this.devises.set("WON", new Devise("Won", "WON", 0.00076, "₩"));
    }

    get all() {
        return [...this.devises.values()];
    }

    get(code) {
        return this.devises.get(code);
    }

    convert(valeur, from, to) {
        var devise_from = this.devises.get(from);
        var devise_to = this.devises.get(to);

        var devise_euro = this.get("EURO");

        if (devise_from !== undefined && devise_to !== undefined) {
            return valeur * (devise_from.valeur / devise_to.valeur);
        } else {
            return null;
        }
    }
}

var devises = new DevisesManager();

var RADIUS_PLANET = 6378.137;

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://trouve-ton-train-lesage.appspot.com"
    );

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

app.get("/", function(req, res) {
    var text = "API REST Trouve Ton Train LESAGE";

    res.setHeader("Content-Type", "text/plain");
    res.send(text);
});

app.get("/distance/:lat1/:lon1/:lat2/:lon2", function(req, res) {
    res.setHeader("Content-Type", "application/json");

    latitude1 = degrees_to_radians(parseFloat(req.params.lat1));
    longitude1 = degrees_to_radians(parseFloat(req.params.lon1));

    latitude2 = degrees_to_radians(parseFloat(req.params.lat2));
    longitude2 = degrees_to_radians(parseFloat(req.params.lon2));

    var S = Math.acos(
        Math.sin(latitude1) * Math.sin(latitude2) +
            Math.cos(latitude1) *
                Math.cos(latitude2) *
                Math.cos(longitude2 - longitude1)
    );

    S = S * RADIUS_PLANET;

    res.send({ error: false, value: S.toFixed(2) });
});

var PRIX_KILOMETRE = 0.08;

app.get("/prix/:devise/:distance", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    var devise = devises.get(req.params.devise);
    if (devise === undefined)
        res.send({
            error: true,
            value: `La devise ${req.params.devise} n'éxiste pas.`
        });
    else
        res.send({
            error: false,
            value: {
                prix: devises
                    .convert(
                        req.params.distance * PRIX_KILOMETRE,
                        "EURO",
                        req.params.devise
                    )
                    .toFixed(2),
                devise: {
                    nom: devise.nom,
                    code: devise.code,
                    icon: devise.icon
                }
            }
        });
});

app.get("/devises", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    var result = [];

    devises.all.forEach(element => {
        result.push({
            nom: element.nom,
            code: element.code,
            icon: element.icon
        });
    });
    res.send({ devises: result });
});

app.listen(8080);
