import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";
import "./app.css";

const hackerNewsSearchURL = 'https://hn.algolia.com/api/v1/search?query=';
const wikiSearchURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=halodoc&origin=*';


class Manager {

	@observable profileData: any = [];
	@observable repoData: any = [];

	constructor() {
		this.setProfileInfo();
	}

	@action setProfileInfo(): void {
		// 	fetch(profileURL)
		// 		.then(response => response.json())
		// 		.then(data => this.profileData = data)
	}
}

class ViewModel {

	manager: Manager
	@observable filter: "";
	@observable searchResult: any = []
	public searchSource: Array<string> =["wiki", "hackerNews"];
	@observable selectedSource: string = this.searchSource[0];
	@observable finalResult: any = [];

	constructor(manager: Manager) {
		this.manager = manager;

	}

	@action handleSourceChange = (event)=> {
		this.selectedSource = event.target.value;
	}
	@action handleInput = (value) => {
		this.filter = value;
	}

	buildURL = (source, searchString) => {
		switch (source) {
			case "hackerNews":
				return `https://hn.algolia.com/api/v1/search?query=${searchString}`;
			case "wiki":
				return `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${searchString}&origin=*`
		}
	}

	@action search = ()=> {
		this.finalResult = [];
		const url = this.buildURL(this.selectedSource, this.filter);
		fetch(url)
			.then(response => response.json())
			.then(data => {
				this.searchResult = data;
				switch (this.selectedSource) {
					case "wiki":
						this.finalResult = this.parseWikiResults();
						break;
					case "hackerNews":
						this.finalResult = this.parseHackerNewsResults();
						break;
				}

			})
	}

	parseHackerNewsResults = ()=> {
		let result = [];
		let values = this.searchResult.hits
		values.forEach((item,i) => {
			result.push({id: i + item.title, title: item.title,  url: item.url, additionalInfo: item.author, author:""})

		})
		return result;
	}


	parseWikiResults = ()=> {
		let result = [];
		let titles = this.searchResult[1];
		let description = this.searchResult[2];
		let urls = this.searchResult[3];
		for (let i=0; i<urls.length; i++) {
			result.push({id: i + titles[i], title: titles[i],  url: urls[i], additionalInfo: description[i]})
		}

		return result;
	}


}



@observer
class InnerView extends React.Component<{ manager: Manager }> {
	private viewModel: ViewModel

	constructor(props) {
		super(props)
		this.viewModel = new ViewModel(props.manager);
	}

	handleInput = (event) => {
		this.viewModel.handleInput(event.target.value);
	}

	render() {
		return (
			<>
				<input className="input-component" type="text" value={this.viewModel.filter} placeholder="" onChange={this.handleInput}></input>
				<select className="select-comp" value={this.viewModel.selectedSource} onChange={this.viewModel.handleSourceChange}>
					{this.viewModel.searchSource.map((source) => (<option key={source} value={source}>{source}</option>))}
				</select>
				<button className="search-button" onClick={this.viewModel.search}>Search</button>
				<div className="wrapper">
					{this.viewModel.finalResult ? this.viewModel.finalResult.map((item) => (
						<ul key={item.id}>
							<li><span><a href={item.url}>{item.title}</a></span><span>|{item.additionalInfo}</span></li>
						</ul>

					)) : <span>No Result Found</span>}
				</div>
			</>
		);
	}
};

@observer
class AppView extends React.Component<{ manager: Manager }> {
	private viewModel: ViewModel

	constructor(props) {
		super(props)

	}

	render() {
		return (
			<div >
				<InnerView manager={manager}></InnerView>
			</div>
		);
	}
};


let manager = new Manager()
ReactDOM.render(<AppView manager={manager} />, document.getElementById('root'));
