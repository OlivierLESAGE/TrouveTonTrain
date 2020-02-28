import React from "react";
import { Grid, Container, Segment, Message } from "semantic-ui-react";
import CitySelection from "./CitySelection";
import { CityOption } from "./CitySelection";
import JourneyInfo from "./JourneyInfo";
import JourneyShcedule from "./JourneySchedule";
import DateSelection from "./DateSelection";

import "./App.css";

interface AppState {
    departCity: CityOption;
    arriveCity: CityOption;
    date: string;
}

class App extends React.Component<{}, AppState> {
    public refDepart;
    public refArrive;
    public refDate;
    public refInfo;
    public refSchedule;

    constructor(props) {
        super(props);

        this.state = {
            departCity: null,
            arriveCity: null,
            date: ""
        };

        this.refDepart = React.createRef();
        this.refArrive = React.createRef();
        this.refDate = React.createRef();
        this.refInfo = React.createRef();
        this.refSchedule = React.createRef();
    }

    selectDepart() {
        this.setState({ departCity: this.refDepart.current.getCity() }, () => {
            this.refInfo.current.getDistance();
            this.refSchedule.current.getSchedule();
        });
    }

    selectArrive() {
        this.setState({ arriveCity: this.refArrive.current.getCity() }, () => {
            this.refInfo.current.getDistance();
            this.refSchedule.current.getSchedule();
        });
    }

    selectDate() {
        this.setState({ date: this.refDate.current.navitiaDate }, () => {
            this.refInfo.current.getDistance();
            this.refSchedule.current.getSchedule();
        });
    }

    public get depart(): CityOption {
        return this.state.departCity;
    }

    public get arrive(): CityOption {
        return this.state.arriveCity;
    }

    public get date(): string {
        return this.state.date;
    }

    render() {
        return (
            <Container>
                <Segment.Group>
                    <Segment>
                        <h1>TouveTonTrain</h1>
                    </Segment>
                    <Segment>
                        <h2>Informations horaire</h2>
                    </Segment>
                    <Segment>
                        <Grid stackable columns="equal">
                            <Grid.Column>
                                <CitySelection
                                    name={"Départ"}
                                    app={this}
                                    selectMethod={this.selectDepart.bind(this)}
                                    ref={this.refDepart}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <CitySelection
                                    name={"Arrivée"}
                                    app={this}
                                    selectMethod={this.selectArrive.bind(this)}
                                    ref={this.refArrive}
                                />
                            </Grid.Column>

                            <Grid.Column>
                                <DateSelection app={this} ref={this.refDate} />
                            </Grid.Column>
                        </Grid>
                        {(this.depart === null ||
                            this.arrive === null ||
                            this.state.date === "") && (
                            <Message
                                warning
                                icon="warning sign"
                                header="Veuillez sélectionner deux gares et une date."
                            />
                        )}
                    </Segment>
                    <JourneyInfo app={this} ref={this.refInfo} />
                    <JourneyShcedule app={this} ref={this.refSchedule} />
                </Segment.Group>
            </Container>
        );
    }
}

export default App;
