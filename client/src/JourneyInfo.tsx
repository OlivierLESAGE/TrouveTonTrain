import React from "react";
import { Message, Grid, Segment, Modal, Select } from "semantic-ui-react";

import HTTPAsyncRequest from "./HTTPAsyncRequest";
import App from "./App";

var api = "https://api-rest-info-802-lesage.appspot.com";

class Devise {
    public key: string;
    public value: string;
    public text: string;
    public nom: string;
    public code: string;
    public icon: string;

    constructor(key, value, text, nom, code, icon) {
        this.key = key;
        this.value = value;
        this.text = text;
        this.nom = nom;
        this.code = code;
        this.icon = icon;
    }
}

interface JourneyInfoProps {
    app: App;
}

interface JourneyInfoState {
    distance: string;
    price: string;
    devise: number;
    devisesList: Devise[];
    modalOpen: boolean;
}

class JourneyInfo extends React.Component<JourneyInfoProps, JourneyInfoState> {
    public static readonly DISTANCE_DEFAULT_STRING = "...";
    public static readonly DISTANCE_ERROR_STRING = "ERROR";

    public static readonly PRICE_DEFAULT_STRING = "--,--";
    public static readonly PRICE_ERROR_STRING = "??-??";

    constructor(props) {
        super(props);

        this.state = {
            distance: JourneyInfo.DISTANCE_DEFAULT_STRING,
            price: JourneyInfo.PRICE_DEFAULT_STRING,
            devise: 0,
            devisesList: [],
            modalOpen: false
        };

        this.getAllDevise();
    }

    public getDistance() {
        this.setState({ distance: JourneyInfo.DISTANCE_DEFAULT_STRING });

        if (this.props.app.depart != null && this.props.app.arrive != null) {
            let url =
                api +
                "/distance/" +
                this.props.app.depart.lat +
                "/" +
                this.props.app.depart.long +
                "/" +
                this.props.app.arrive.lat +
                "/" +
                this.props.app.arrive.long +
                "/";

            HTTPAsyncRequest.httpGetAsync(url, this.updateDistance.bind(this));
        } else {
            this.setState({ distance: JourneyInfo.DISTANCE_ERROR_STRING });
        }
    }

    public getPrice() {
        this.setState({ price: JourneyInfo.PRICE_DEFAULT_STRING });
        if (
            this.props.app.depart != null &&
            this.props.app.arrive != null &&
            this.state.devisesList[this.state.devise] !== undefined
        ) {
            let url =
                api +
                "/prix/" +
                this.state.devisesList[this.state.devise].code +
                "/" +
                this.state.distance;

            HTTPAsyncRequest.httpGetAsync(url, this.updatePrice.bind(this));
        } else {
            this.setState({ distance: JourneyInfo.DISTANCE_ERROR_STRING });
        }
    }

    public getAllDevise() {
        this.setState({ devisesList: [] });

        let url = api + "/devises";

        HTTPAsyncRequest.httpGetAsync(url, this.updateDeviseList.bind(this));
    }

    public updateDeviseList(json) {
        let devises = [];

        let key = 0;
        [...json.devises].forEach(ele => {
            devises.push(
                new Devise(
                    key,
                    key,
                    ele.icon + " - " + ele.nom,
                    ele.nom,
                    ele.code,
                    ele.icon
                )
            );
            key++;
        });

        this.setState({ devisesList: devises });
    }

    public updateDevise(event, { value }) {
        let callback = this.getPrice.bind(this);
        this.setState({ devise: value, modalOpen: false }, () => {
            callback();
        });
    }

    public updateDistance(json) {
        if (!json.error) {
            this.setState({ distance: json.value });
            this.getPrice();
        } else this.setState({ distance: JourneyInfo.DISTANCE_ERROR_STRING });
    }

    public updatePrice(json) {
        if (!json.error) this.setState({ price: json.value.prix });
        else this.setState({ price: JourneyInfo.PRICE_ERROR_STRING });
    }

    public handleOpenModal() {
        this.setState({ modalOpen: true });
    }

    public handleCloseModal() {
        this.setState({ modalOpen: false });
    }

    render() {
        let element;

        if (
            this.props.app.depart === null ||
            this.props.app.arrive === null ||
            this.props.app.date === ""
        ) {
            element = <div></div>;
        } else {
            //element = <div>Distance: {parseInt(this.state.distance)} Km</div>;
            element = (
                <Segment>
                    <Grid stackable columns="equal">
                        <Grid.Column>
                            <Message
                                icon="train"
                                header={`Distance: ${this.state.distance} Km`}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <Message
                                icon="money bill alternate"
                                header={`Prix: ${this.state.price} ${
                                    this.state.devisesList[this.state.devise]
                                        .icon
                                }`}
                            />
                            <Modal
                                trigger={
                                    <a
                                        href="#"
                                        onClick={this.handleOpenModal.bind(
                                            this
                                        )}
                                    >
                                        changer devise
                                    </a>
                                }
                                open={this.state.modalOpen}
                                onClose={this.handleCloseModal.bind(this)}
                                size="tiny"
                                closeIcon
                            >
                                {" "}
                                <Modal.Header
                                    icon="currency"
                                    content="Sélectionner une devise"
                                />
                                <Modal.Content>
                                    <p>Veuillez choisir une devise :</p>
                                    <Select
                                        placeholder={
                                            this.state.devisesList[
                                                this.state.devise
                                            ].text
                                        }
                                        options={this.state.devisesList}
                                        onChange={this.updateDevise.bind(this)}
                                    />
                                </Modal.Content>
                            </Modal>
                        </Grid.Column>
                    </Grid>
                </Segment>
            );
        }

        return element;
    }
}

export default JourneyInfo;
