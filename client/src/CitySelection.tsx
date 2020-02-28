import React from "react";
import { Form, Select, Input } from "semantic-ui-react";

import HTTPAsyncRequest from "./HTTPAsyncRequest";
import App from "./App";

interface CitySelectionProps {
    name: string;
    app: App;
    selectMethod;
}

interface CitySelectionState {
    options: CityOption[];
    loading: boolean;
    selectedIndex: number;
}

class CityOption {
    key: string;
    value: string;
    text: string;
    id: string;
    long: number;
    lat: number;
    constructor(
        key: string,
        value: string,
        text: string,
        id: string,
        long: number,
        lat: number
    ) {
        this.key = key;
        this.value = value;
        this.text = text;
        this.id = id;
        this.long = long;
        this.lat = lat;
    }
}

class CitySelection extends React.Component<
    CitySelectionProps,
    CitySelectionState
> {
    constructor(props: CitySelectionProps) {
        super(props);

        this.state = { options: [], loading: false, selectedIndex: -1 };
    }

    onTextChange(evt) {
        this.setState({ loading: true });

        if (evt.target.value !== "") {
            let url =
                "https://api.sncf.com/v1/coverage/sncf/places?q=" +
                evt.target.value +
                "&type%5B%5D=stop_area&";

            HTTPAsyncRequest.navitiaGetAsync(url, this.updateList.bind(this));
        } else {
            this.setState(
                { options: [], loading: false, selectedIndex: -1 },
                () => this.props.selectMethod()
            );
        }
    }

    updateList(json) {
        let allCity: CityOption[] = [];
        if (json.places) {
            let i = 0;

            for (let city of json.places) {
                allCity.push(
                    new CityOption(
                        i.toString(),
                        i.toString(),
                        city.name,
                        city.id,
                        parseFloat(city.stop_area.coord.lon),
                        parseFloat(city.stop_area.coord.lat)
                    )
                );
                i++;
            }
        }

        this.setState({ options: allCity, loading: false }, () =>
            this.props.selectMethod()
        );
    }

    updateSelectedIndex(event, { value }) {
        this.setState({ selectedIndex: value }, () =>
            this.props.selectMethod()
        );
    }

    render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <Form>
                    <Form.Field>
                        <label>Nom de la ville</label>
                        <Input
                            placeholder="Paris ..."
                            icon="search"
                            onChange={this.onTextChange.bind(this)}
                        />
                        <Select
                            loading={this.state.loading}
                            placeholder="Selectionner la gare"
                            options={this.state.options}
                            disabled={this.state.options.length < 1}
                            onChange={this.updateSelectedIndex.bind(this)}
                        />
                    </Form.Field>
                </Form>
            </div>
        );
    }

    public getCity() {
        if (this.state.options.length > 0) {
            if (
                this.state.selectedIndex < this.state.options.length &&
                this.state.selectedIndex >= 0
            ) {
                return this.state.options[this.state.selectedIndex];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default CitySelection;
export { CityOption };
