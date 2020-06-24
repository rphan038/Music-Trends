//Global variables
const countrySelector_select = document.getElementById("country-names");
var currCountry_option = document.getElementById("country-names").value;
var currTab = 't';
var tabTitle = document.querySelector(".current-page > p");;
var largestV = [];
var largestK = [];
var largeVidID = [[]];

/**
 *	@brief Project's main method that calls the method that loads the startup page
 *  Initializes the dropdown menu's functionality
 */
function main() {
	// The page that loads when the URL is typed, which is the trending songs page
	trending("South Korea");
	//Develops the functionality of the dropdown menu
	currCountry_option = "South Korea";
	countrySelector_select.onchange = function() {
		currCountry_option.innerHTML = document.getElementById("country-names").value;
		currCountry_option = document.getElementById("country-names").value;
		if(currTab === "t") {
			trending(currCountry_option);
		} else if(currTab === "h") {
			hotTags(currCountry_option);
		}
	};
}

/**
 *	@brief The YouTube Data API abreviates countries by their two letter ISO code. This method
 *	translates the country's English name to its corresponding two letter ISO code
 *
 *	@param country the selected country's name in English
 *	@return the country's corresponding two letter ISO code
 */
function countryToISO(country) {
	if(country === "United States") return "US";
	if(country === "South Korea") return "KR";
	if(country === "Japan") return "JP";
	if(country === "Taiwan") return "TW";
	if(country === "Australia") return "AU";
	if(country === "Brazil") return "BR";
	if(country === "Canada") return "CA";
	if(country === "Hong Kong") return "HK";
	if(country === "Colombia") return "CO";
	if(country === "France") return "FR";
	if(country === "Germany") return "DE";
	if(country === "Greece") return "GR";
	if(country === "India") return "IN";
	if(country === "Indonesia") return "ID";
	if(country === "Malaysia") return "MY";
	if(country === "Mexico") return "MX";
	if(country === "Philippines") return "PH";
	if(country === "Poland") return "PL";
	if(country === "Singapore") return "SG";
	if(country === "United Kingdom") return "GB";
	if(country === "Vietnam") return "VN";
}

/**
 *	@brief Interacts with HTML code to change the page's contents
 *	@param stat the page to be loaded
 */
function changeStat(stat) {
	//If stat equals t, then the trending songs page must be loaded
	if(stat === "t") {
		trending(currCountry_option);
		currTab = 't';
		//Change the title of the page
		tabTitle.innerHTML = "Trending Songs";
	} else if(stat === "p") {
		//Load statistics about the current trending music tags
		hotTags(currCountry_option);
		currTab = 'h'
		tabTitle.innerHTML = "Trending Tags";
	}
}

/**
 *	@breif Determines the trending tags at the current time and displays this information
 *	in the form of a bar chart by utilizing chart.js. Allows clicking events to load the songs
 *	corresponding to the clicked tag
 *
 *	@param country The country that the user wants to load the music statistics of
 */
function hotTags(country) {
	//Obtains the two letter ISO code to give to the YouTube's APi
	let c = countryToISO(country);
	$(document).ready(function () {
		//Personal API key that was generated
		var key = 'AIzaSyB3PVG8UO8tsz5cE08sWxfdPLd3xIX3uu8';
		//Target URL
		var URL = 'https://www.googleapis.com/youtube/v3/videos';
		//Map Data Structure that is necessary to store the information needed
		//This map helps determine the most popular tags by (tag_name, magnitude)
		var tagsMap = new Map();
		//This map saves the videos ID's that correspond with the tag using array of strings (tag_name, Array)
		var tagsMapVids = new Map();

		//Parameters sent to the YouTube API to get the data we want
		var options = {
			part: 'snippet',
			key: key,
			chart: 'mostPopular',
			maxResults: 50,
			regionCode: c,
			videoCategoryId: 10
		}

		load();

		/**
		 *	@brief Loads data from API, parses the received data by storing it into the maps,
		 *	and finally provides the data to the chart.js source code
		 */
		function load() {
			//jQuery command that interacts with YouTube's Data API
			$.getJSON(URL, options, function(data) {
				//Clears the main tag of any contents
				$('main').empty();
				//Goes through every single tag of every video provided by API
				$.each(data.items, function(i, item) {
					var tags = item.snippet.tags;
					//Saves the video id so that it can be later referenced
					var vid = item.id;
					//If the video has at least one tag...
					if(tags !== undefined) {
						tags.forEach(function(idx) {
							idx = idx.toUpperCase();
							//If this tag does not exist already, include it into the maps
							if(!tagsMap.has(idx)) {
								tagsMap.set(idx, 1);
								tagsMapVids.set(idx, new Array(vid));
							} else if(tagsMap.has(idx)){
								//Increase magnitude of tag 
								tagsMap.set(idx, tagsMap.get(idx) + 1);
								//Utilizes array concatenation to include the new video ID
								var tmpArr1 = tagsMapVids.get(idx);
								var tmpArr2 = new Array(vid);
								tmpArr1 = tmpArr1.concat(tmpArr2);
								//Saves the new array into the map
								tagsMapVids.set(idx, tmpArr1);
							}
						});
					}
				});
				//Processes the top ten most popular tags
				for(var i = 0; i < 10; i++) {
					//Variable that finds the max value in the map
					var x = 0;
					var y = '';
					//Goes through every single entry in the map
					for(var ent of tagsMap.entries()) {
						//If the current entry value is greater than max, it's the new max
						if(ent[1] > x) {
							//Change the variable values
							x = ent[1];
							y = ent[0];
							//Take it out of the map so that it does not get counted again
							tagsMap.delete(y);
						}
					}
					//Save the values in a sorted array to be used in chart js
					largestV[i] = x;
					largestK[i] = y;
					largeVidID[i] = tagsMapVids.get(largestK[i]);
				}
				//Use jQuery to render Chart.js code
				$('main').append(`<canvas id="chart" width="400" height="400"></canvas>
					<style>
						.tooltip {
						  position: relative;
						  display: inline-block;
						  border-bottom: 1px dotted black;
						  padding 10px;
						  font-weight: bold;
						  color: blue;
						}

						.tooltip .tooltiptext {
						  visibility: hidden;
						  width: 120px;
						  top: 100%;
						  left: 50%;
						  margin-left: -60px;
						  background-color: black;
						  color: #fff;
						  text-align: center;
						  border-radius: 6px;
						  padding: 2px 0;

						  /* Position the tooltip */
						  position: absolute;
						  z-index: 1;
						}

						.tooltip .tooltiptext::after {
							content: "";
							position: absolute;
							bottom: 100%;
							left: 50%;
							margin-left: -5px;
							border-width: 5px;
							border-style: solid;
							border-color: transparent transparent black transparent;
						}

						.tooltip:hover .tooltiptext {
						  visibility: visible;
						}
					</style>
					<div class="media" id="VIDS">
						<div class="tooltip">Videos
							<span class="tooltiptext">Click on the colored boxes in the legend to load the corresponding videos</span>
						</div>
					</div>
					<script>
						var ctx = document.getElementById('chart').getContext('2d');
						Chart.defaults.global.defaultFontColor = 'black';
						var myChart = new Chart(ctx, {
							type: 'bar',
							data: {
								datasets: [{
									label: '${largestK[0]}',
									backgroundColor: 'rgba(255, 99, 132, 0.5)',
									borderColor: 'rgba(255, 99, 132, 1)',
									data: '${largestV[0]}',
									borderWidth: 1,
								}, {
									label: '${largestK[1]}',
									backgroundColor: 'rgba(54, 162, 235, 0.5)',
									borderColor: 'rgba(54, 162, 235, 1)',
									data: '${largestV[1]}',
									borderWidth: 1,
								}, {
									label: '${largestK[2]}',
									backgroundColor: 'rgba(255, 206, 86, 0.5)',
									borderColor: 'rgba(255, 206, 86, 1)',
									data: '${largestV[2]}',
									borderWidth: 1,
								}, {
									label: '${largestK[3]}',
									backgroundColor: 'rgba(75, 192, 192, 0.5)',
									borderColor: 'rgba(75, 192, 192, 1)',
									data: '${largestV[3]}',
									borderWidth: 1,
								}, {
									label: '${largestK[4]}',
									backgroundColor: 'rgba(153, 102, 255, 0.5)',
									borderColor: 'rgba(153, 102, 255, 1)',
									data: '${largestV[4]}',
									borderWidth: 1,
								}, {
									label: '${largestK[5]}',
									backgroundColor: 'rgba(255, 159, 64, 0.5)',
									borderColor: 'rgba(255, 159, 64, 1)',
									data: '${largestV[5]}',
									borderWidth: 1,
								}, {
									label: '${largestK[6]}',
									backgroundColor: 'rgba(5, 57, 111, 0.5)',
									borderColor: 'rgba(5, 57, 111, 1)',
									data: '${largestV[6]}',
									borderWidth: 1,
								}, {
									label: '${largestK[7]}',
									backgroundColor: 'rgba(172, 128, 225, 0.5)',
									borderColor: 'rgba(172, 128, 225, 1)',
									data: '${largestV[7]}',
									borderWidth: 1,
								}, {
									label: '${largestK[8]}',
									backgroundColor: 'rgba(143, 147, 149, 0.5)',
									borderColor: 'rgba(143, 147, 149, 1)',
									data: '${largestV[8]}',
									borderWidth: 1,
								}, {
									label: '${largestK[9]}',
									backgroundColor: 'rgba(116, 232, 127, 0.5)',
									borderColor: 'rgba(116, 232, 127, 1)',
									data: '${largestV[9]}',
									borderWidth: 1,
								}]
							},
							options: {
								legend: {
									labels: {
										fontColor: "black"
									},
									onClick: vids
								},
								scales: {
									yAxes: [{
										ticks: {
											fontColor: "black",
											beginAtZero: true
										}
									}],
									xAxes: [{
										ticks: {
											fontColor: "black"
										}
									}]
								}
							}
						});
					</script>
				`);
			});
		}
	});
}

/**
 *	@brief Called with the onClick event of the chart that loads the songs of the clicked tag
 *	@param e
 *	@param legendItem Object for the legend of the chart
 */
function vids(e, legendItem) {
	//Obtain which legend item was clicked
	var point = legendItem.datasetIndex;
	//Clear out whatever videos was previously loaded
	$(`#VIDS`).empty();
	var mapTmp = [[]];
	mapTmp = [largeVidID[0], largeVidID[1], largeVidID[2], 
			largeVidID[3], largeVidID[4], largeVidID[5], 
			largeVidID[6], largeVidID[7], largeVidID[8], largeVidID[9]];
	var arr = mapTmp[point];
	//Load all of the embedded YouTube videos using ifram tag that correspond to the clicked music tag
	for(var v of arr) {
		var t = "https://www.youtube.com/embed/" + v;
		$(`<iframe width="560" height="315" src="${t}" frameborder="0" 
			allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>`).appendTo(`#VIDS`);
	}
}

/**
 *	@brief Changes the thumbnail to an embedded YouTube video so that the user can listen to the song
 *	@param mediaId Identifies which song thumbnail was clicked
 *	@param vidId YouTube's Id for the specific video
 */
function imgToVid(mediaId, vidId) {
	//Remove the thumbnail
	$(`#${mediaId}`).empty();
	//Add the iframe embedded YouTube video
	$(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${vidId}" 
							frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>`).appendTo(`#${mediaId}`);
	//Remove the click event for the particular thumbnail clicked
	document.getElementById(`${mediaId}`).removeEventListener('click', () => imgToVid(`${mediaId}`, `${vidId}`));
}

/**
 *	@brief Communicates with YouTube's Data API to find the top 50 trending songs of a given country
 *	@param country The trending songs to load for the particular country in English
 */
function trending(country) {
	//Obtain the two letter ISO code for the given country
	let c = countryToISO(country);
	//API communication method
	$(document).ready(function () {
		var key = 'AIzaSyB3PVG8UO8tsz5cE08sWxfdPLd3xIX3uu8';
		var URL = 'https://www.googleapis.com/youtube/v3/videos';

		var options = {
			part: 'snippet',
			key: key,
			chart: 'mostPopular',
			maxResults: 50,
			regionCode: c,
			videoCategoryId: 10
		}

		loadVids();

		/**
		 *	@brief Loads the thumbnails of the songs into the main tag
		 */
		function loadVids() {
			//jQuery method that talks with the API using the set parameters above
			$.getJSON(URL, options, function(data) {
				//Empties main tag
				$('main').empty();
				//Gives a number to the top 50 songs
				var rank = 1;
				$.each(data.items, function(i, item) {
					//Thumbnail URL
					var thumb = item.snippet.thumbnails.medium.url;
					//Title of the YouTube video
					var title = item.snippet.title;
					//YouTube's assigned video ID
					var vid = item.id;
					//YouTube video's channel name
					var channel = item.snippet.channelTitle;
					//YouTube's assigned channel ID
					var channelId = item.snippet.channelId;
					//Adds the thumbnail onto the page as well as an href to the associated YouTube channel
					$('main').append(`
						<div class="media" id="media${rank}">
							<img src="${thumb}" alt="" width="560" heigh="315" class="thumb">							
						</div>
						<div class="item" data-key="${vid}">
							<div class="details">
								<h3>${rank} : ${title} </h3>
								<a href="https://www.youtube.com/channel/${channelId}" target="_blank" style="color: blue">${channel}</a>
							</div>
						</div>
					`);
					let tmp = rank;
					//Adds a click event to the thumbnail so that when it is clicked, it removes the thumbnail
					//and adds an iframe tag for the embedded YouTube video
					document.getElementById(`media${tmp}`).addEventListener('click', () => imgToVid(`media${tmp}`, vid));
					rank++;
				});
			});
		}
	});
}
main();