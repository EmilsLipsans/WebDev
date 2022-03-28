/*
 * Emīls Lipšāns 
 * Datumu filtrs nav izveidots.
 */
window.addEventListener('DOMContentLoaded', (event) => { // execute the code when the initial HTML document has been completely loaded, we need the continent select to be loaded 
    
	var lookup = {};
	var TableHeader = ["Date","Country","Cases","Deaths","Cumulative number for 14 days of COVID-19 cases per 100000"];
	
	for (let i in data) { // for every item in the data - every piece of statistic info
		let continent = data[i].continentExp; // read continent from data
		let country = data[i].countriesAndTerritories; // read country from data
		if (continent && !(continent in lookup)) { // if the continet hasn't been previously processed
			lookup[continent] = {}; // add a new continent to the lookup
		}
		lookup[continent][country] = 1; // add a country to the lookup. lookup is a two-dimensional associative array/object
	}

	console.log(lookup); // uncomment this line if you want to see the result in the console
	
	var continents = Object.keys(lookup).sort(); // get the list of keys in the lookup and sort it

	var continent_s = document.getElementById("continent-select"); // get continent select element
	for (let i in continents) { // for every continent
		let opt = document.createElement('option'); // create a new option		
		opt.innerHTML = continents[i]; // fill the text with the continent name
		opt.value = continents[i]; // fill the value with the continent name
		continent_s.appendChild(opt); // add newly created option to the continent select
	}
		
	var AsiaCountries = Object.keys(lookup[continents[0]]).sort();
	var EuropeCountries = Object.keys(lookup[continents[1]]).sort();
	var countries = AsiaCountries.concat(EuropeCountries).sort();
	var result = "All";
	var CountrySelect = "All";
	var country_s = document.getElementById("country-select"); 
	for (let i in countries) { 
		let opt = document.createElement('option'); 		
		opt.innerHTML = countries[i]; 
		opt.value = countries[i]; 
		country_s.appendChild(opt);
	}
		
	function FilterCountries(){
		var e = document.getElementById("country-select");
		CountrySelect = e.options[e.selectedIndex].text;
		console.log(CountrySelect);
						
	}
	function Filter(){
		var e = document.getElementById("continent-select");
		result = e.options[e.selectedIndex].text;

		var select = document.getElementById("country-select");
		var length = select.options.length;
		for (i = length-1; i > 0; i--) {
  			select.options[i] = null;
		}
		

		if(result==="Asia"){	
			var AsiaCountry_s = document.getElementById("country-select");
			for (let i in AsiaCountries) { 
				let opt = document.createElement('option');		
				opt.innerHTML = AsiaCountries[i]; 
				opt.value = AsiaCountries[i];
				AsiaCountry_s.appendChild(opt);								
			}		
		}

		if(result==="Europe"){				
			var EuropeCountry_s = document.getElementById("country-select"); 
			for (let i in EuropeCountries) { 
				let opt = document.createElement('option'); 		
				opt.innerHTML = EuropeCountries[i]; 
				opt.value = EuropeCountries[i];
				EuropeCountry_s.appendChild(opt); 
											
			}
		}

		if(result==="All"){
			var country_s = document.getElementById("country-select"); 
			for (let i in countries) { 
				let opt = document.createElement('option');		
				opt.innerHTML = countries[i]; 
				opt.value = countries[i]; 
				country_s.appendChild(opt); 			
			}
		}
		FilterCountries();
	}
	document.getElementById("continent-select").onchange = function() { console.log(result)};
	document.getElementById("continent-select").onchange = function() { Filter()};
	document.getElementById("country-select").onchange = function() { FilterCountries()};
	document.getElementById("show-list").onclick = function() {addTable()};

	function addTable() {
		var Table = document.getElementById("myDynamicTable");
		Table.innerHTML = "";

		var myTableDiv = document.getElementById("myDynamicTable");
	  
		var table = document.createElement('TABLE');
		table.border = '1';
	  
		var tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);

		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
		
		for (var h = 0; h < 5; h++) {
			var th = document.createElement('TH');
			th.appendChild(document.createTextNode(TableHeader[h]));
			if(h!=4)th.width = '80';
			tr.appendChild(th);
		}
		if(result==="All" && CountrySelect==="All" ){
			console.log("Viss");
			for (var i = 0; i < data.length; i++) {
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
				for (var j = 0; j < 5; j++) {
					var td = document.createElement('TD');
					if(j==0){
						td.appendChild(document.createTextNode(data[i].dateRep));
					}
					if(j==1){
						td.appendChild(document.createTextNode(data[i].countriesAndTerritories));
					}
					if(j==2){
						td.appendChild(document.createTextNode(data[i].cases));
					}
					if(j==3){
						td.appendChild(document.createTextNode(data[i].deaths));
					}
					if(j==4){
						td.appendChild(document.createTextNode(data[i]["Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"]));
					}				
					tr.appendChild(td);		
				}			
			}	
		}
		if((result==="Europe" || result==="Asia") && CountrySelect==="All"){
			console.log("Kontinets");
			for (var i = 0; i < data.length; i++) {
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
				for (var j = 0; j < 5; j++) {					
					var td = document.createElement('TD');
					if(data[i].continentExp===result){
						if(j==0){
							td.appendChild(document.createTextNode(data[i].dateRep));
						}
						if(j==1){
							td.appendChild(document.createTextNode(data[i].countriesAndTerritories));
						}
						if(j==2){
							td.appendChild(document.createTextNode(data[i].cases));
						}
						if(j==3){
							td.appendChild(document.createTextNode(data[i].deaths));
						}
						if(j==4){
							td.appendChild(document.createTextNode(data[i]["Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"]));
						}				
						tr.appendChild(td);
					}						
				}			
			}	
		}
		if(CountrySelect!=="All"){
			console.log("else");
			for (var i = 0; i < data.length; i++) {
				var tr = document.createElement('TR');
				tableBody.appendChild(tr);
				for (var j = 0; j < 5; j++) {
					var td = document.createElement('TD');
					if(data[i].countriesAndTerritories===CountrySelect){
						if(j==0){
							td.appendChild(document.createTextNode(data[i].dateRep));
						}
						if(j==1){
							td.appendChild(document.createTextNode(data[i].countriesAndTerritories));
						}
						if(j==2){
							td.appendChild(document.createTextNode(data[i].cases));
						}
						if(j==3){
							td.appendChild(document.createTextNode(data[i].deaths));
						}
						if(j==4){
							td.appendChild(document.createTextNode(data[i]["Cumulative_number_for_14_days_of_COVID-19_cases_per_100000"]));
						}				
						tr.appendChild(td);		
					}			
				}
			}
		}
		myTableDiv.appendChild(table);
	  }
});

