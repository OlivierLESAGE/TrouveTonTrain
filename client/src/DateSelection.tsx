import React from "react";
import { Form } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import App from "./App";

interface DateSelectionProps {
    app: App;
}

interface DateSelectionState {
    date: string;
    navitiaDate: string;
}

class DateSelection extends React.Component<
    DateSelectionProps,
    DateSelectionState
> {
    constructor(props) {
        super(props);

        this.state = { date: "", navitiaDate: "" };
    }

    public handleDate(event, { name, value }) {
        let jour = value.substring(0, 2);
        let mois = value.substring(3, 5);
        let annee = value.substring(6, 10);
        let heure = value.substring(11, 13);
        let minute = value.substring(14, 16);

        let callback = this.props.app.selectDate.bind(this.props.app);
        this.setState(
            {
                date: value,
                navitiaDate: annee + mois + jour + "T" + heure + minute + "00"
            },
            () => callback()
        );
    }

    public get navitiaDate() {
        return this.state.navitiaDate;
    }

    render() {
        return (
            <div>
                <h3>{"Date"}</h3>
                <Form>
                    <Form.Field>
                        <label>Date de départ</label>
                        <DateTimeInput
                            name="Date"
                            placeholder="Date"
                            value={this.state.date}
                            iconPosition="left"
                            onChange={this.handleDate.bind(this)}
                        />
                    </Form.Field>
                </Form>
            </div>
        );
    }
}

export default DateSelection;
