import React from "react";
import { Grid, Button, Segment, Message, Icon } from "semantic-ui-react";

import HTTPAsyncRequest from "./HTTPAsyncRequest";
import App from "./App";

class DateTime {
    public jour: number;
    public mois: number;
    public annee: number;
    public heure: number;
    public minute: number;

    constructor(dateTime: string) {
        this.annee = parseInt(dateTime.substring(0, 4));
        this.mois = parseInt(dateTime.substring(4, 6));
        this.jour = parseInt(dateTime.substring(6, 8));
        this.heure = parseInt(dateTime.substring(9, 11));
        this.minute = parseInt(dateTime.substring(11, 13));
    }

    public get horraire() {
        return this.heure + ":" + (this.minute < 10 ? "0" : "") + this.minute;
    }

    public get date() {
        return this.jour + "/" + this.mois + "/" + this.annee;
    }

    public static secondToText(time: number) {
        var minute = time / 60;
        return (
            Math.trunc(minute / 60) +
            "h" +
            (minute < 10 ? "0" : "") +
            (minute % 60)
        );
    }
}

class Travel {
    public dateDepart: DateTime;
    public dateArrivee: DateTime;
    public duration: number;
    public transfer: number;

    constructor(
        dateDepart: DateTime,
        dateArrivee: DateTime,
        duration: number,
        transfer: number
    ) {
        this.dateDepart = dateDepart;
        this.dateArrivee = dateArrivee;
        this.duration = duration;
        this.transfer = transfer;
    }
}

class Journey {
    journeys: Travel[] = [];

    linkPrev: string;
    linkNext: string;
    linkFirst: string;
    linkLast: string;

    constructor(json) {
        for (let travel of json.journeys) {
            let dateDepart = new DateTime(travel.departure_date_time);
            let dateArrivee = new DateTime(travel.arrival_date_time);
            let duration = travel.duration;
            let transfer = travel.nb_transfers;

            this.journeys.push(
                new Travel(dateDepart, dateArrivee, duration, transfer)
            );
        }

        for (let link of json.links) {
            switch (link.rel) {
                case "prev": {
                    this.linkPrev = link.href;
                    break;
                }
                case "next": {
                    this.linkNext = link.href;
                    break;
                }
                case "first": {
                    this.linkFirst = link.href;
                    break;
                }
                case "last": {
                    this.linkLast = link.href;
                    break;
                }
            }
        }
    }
}

interface JourneyScheduleProps {
    app: App;
}

interface JourneyScheduleState {
    currentJourney: Journey;
}

class JourneyShcedule extends React.Component<
    JourneyScheduleProps,
    JourneyScheduleState
> {
    constructor(props) {
        super(props);
        this.state = { currentJourney: null };
    }

    getSchedule() {
        this.setState({ currentJourney: null });

        if (
            this.props.app.depart != null &&
            this.props.app.arrive != null &&
            this.props.app.date !== ""
        ) {
            let url = `https://api.navitia.io/v1/coverage/sncf/journeys?to=${this.props.app.arrive.id}&from=${this.props.app.depart.id}&datetime_represents=arrival&datetime=${this.props.app.date}&`;

            HTTPAsyncRequest.navitiaGetAsync(
                url,
                this.updateShcedule.bind(this)
            );
        } else {
            this.setState({ currentJourney: null });
        }
    }

    public updateShcedule(json) {
        this.setState({ currentJourney: new Journey(json) });
    }

    render() {
        let element;

        if (
            this.props.app.depart === null ||
            this.props.app.arrive === null ||
            this.props.app.date === ""
        ) {
            element = <div></div>;
        } else if (this.state.currentJourney === null) {
            element = (
                <Segment>
                    <Message
                        info
                        icon="search"
                        header="Aucun résultats trouvés"
                        content="Veuillez essayer avec une date différentes."
                    />
                </Segment>
            );
        } else {
            let array = [];
            for (let travel of this.state.currentJourney.journeys) {
                array.push(
                    <Segment>
                        <Grid stackable columns="equal">
                            <Grid.Column>
                                <p>
                                    <Icon
                                        name="calendar alternate"
                                        size="big"
                                    />{" "}
                                    {travel.dateDepart.date}
                                </p>
                            </Grid.Column>
                            <Grid.Column>
                                <p>
                                    {travel.dateDepart.horraire}
                                    {" > "}
                                    <Icon name="train" size="large" />
                                    {" > "}
                                    {travel.dateArrivee.horraire}
                                </p>
                            </Grid.Column>
                            <Grid.Column>
                                <p>
                                    <Icon name="clock" size="big" />{" "}
                                    {DateTime.secondToText(travel.duration)}
                                </p>
                            </Grid.Column>
                            <Grid.Column>
                                <p>
                                    <Icon name="coffee" size="big" />{" "}
                                    {travel.transfer}
                                </p>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                );
            }
            element = (
                <Segment textAlign="center">
                    <Button.Group>
                        <Button
                            content="Prev"
                            icon="left arrow"
                            labelPosition="left"
                            onClick={evt => {
                                HTTPAsyncRequest.navitiaGetAsync(
                                    this.state.currentJourney.linkPrev,
                                    this.updateShcedule.bind(this)
                                );
                            }}
                        />
                        <Button
                            content="First"
                            onClick={evt => {
                                HTTPAsyncRequest.navitiaGetAsync(
                                    this.state.currentJourney.linkFirst,
                                    this.updateShcedule.bind(this)
                                );
                            }}
                        />
                        <Button
                            content="Last"
                            onClick={evt => {
                                HTTPAsyncRequest.navitiaGetAsync(
                                    this.state.currentJourney.linkLast,
                                    this.updateShcedule.bind(this)
                                );
                            }}
                        />
                        <Button
                            content="Next"
                            icon="right arrow"
                            labelPosition="right"
                            onClick={evt => {
                                HTTPAsyncRequest.navitiaGetAsync(
                                    this.state.currentJourney.linkNext,
                                    this.updateShcedule.bind(this)
                                );
                            }}
                        />
                    </Button.Group>
                    <Segment.Group>{array}</Segment.Group>
                </Segment>
            );
        }

        return element;
    }
}

export default JourneyShcedule;
