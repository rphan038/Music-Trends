const countrySelector_select = document.getElementById("country-names");
var currCountry_option = document.getElementById("country-names").value;
const currentPage_p = document.querySelector(".current-page > p");
var currTab = 't';

function main() {
	trending("South Korea");
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

function changeStat(stat) {
	if(stat === "t") {
		trending("South Korea");
		currTab = 't';
	} else if(stat === "p") {
		hotTags("South Korea");
		currTab = 'h'
	}
}

function hotTags(country) {
	let c = countryToISO(country);
	$(document).ready(function () {
		var key = 'AIzaSyB3PVG8UO8tsz5cE08sWxfdPLd3xIX3uu8';
		var URL = 'https://www.googleapis.com/youtube/v3/videos';
		var tagsMap = new Map();
		var tagsMapVids = new Map();

		var options = {
			part: 'snippet',
			key: key,
			chart: 'mostPopular',
			maxResults: 50,
			regionCode: c,
			videoCategoryId: 10
		}

		load();

		function load() {
			$.getJSON(URL, options, function(data) {
				$('main').empty();
				$.each(data.items, function(i, item) {
					var tags = item.snippet.tags;
					var vid = item.id;
					if(tags !== undefined) {
						tags.forEach(function(idx) {
							if(!tagsMap.has(idx)) {
								tagsMap.set(idx, 1);
								tagsMapVids.set(idx, new Array(vid));
							} else if(tagsMap.has(idx)){
								tagsMap.set(idx, tagsMap.get(idx) + 1);
								var tmpArr1 = tagsMapVids.get(idx);
								var tmpArr2 = new Array(vid);
								tmpArr1 = tmpArr1.concat(tmpArr2);
								tagsMapVids.set(idx, tmpArr1);
							}
						});
					}
				});
				var largestV = [];
				var largestK = [];
				for(var i = 0; i < 10; i++) {
					var x = 0;
					var y = '';
					for(var ent of tagsMap.entries()) {
						if(ent[1] > x) {
							x = ent[1];
							y = ent[0];
							tagsMap.delete(y);
						}
					}
					largestV[i] = x;
					largestK[i] = y;
				}
				$('main').append(`<canvas id="chart" width="400" height="400"></canvas>
					<script>
						var ctx = document.getElementById('chart').getContext('2d');
						Chart.defaults.global.defaultFontColor = 'black';
						var myChart = new Chart(ctx, {
							type: 'bar',
							data: {
								labels: ['${largestK[0]}', '${largestK[1]}', '${largestK[2]}', 
										'${largestK[3]}', '${largestK[4]}', '${largestK[5]}', 
										'${largestK[6]}', '${largestK[7]}', '${largestK[8]}', '${largestK[9]}'],
								datasets: [{
									label: ['${largestK[0]}', '${largestK[1]}', '${largestK[2]}', 
										'${largestK[3]}', '${largestK[4]}', '${largestK[5]}', 
										'${largestK[6]}', '${largestK[7]}', '${largestK[8]}', '${largestK[9]}'],
									data: [${largestV[0]}, ${largestV[1]}, ${largestV[2]}, 
										${largestV[3]}, ${largestV[4]}, ${largestV[5]}, 
										${largestV[6]}, ${largestV[7]}, ${largestV[8]}, ${largestV[9]}],
									backgroundColor: [
						                'rgba(255, 99, 132, 0.5)',
						                'rgba(54, 162, 235, 0.5)',
						                'rgba(255, 206, 86, 0.5)',
						                'rgba(75, 192, 192, 0.5)',
						                'rgba(153, 102, 255, 0.5)',
						                'rgba(255, 159, 64, 0.5)',
						                'rgba(5, 57, 111, 0.5)',
						                'rgba(172, 128, 225, 0.5)',
						                'rgba(143, 147, 149, 0.5)',
						                'rgba(116, 232, 127, 0.5)'
						            ],
						            borderColor: [
						                'rgba(255, 99, 132, 1)',
						                'rgba(54, 162, 235, 1)',
						                'rgba(255, 206, 86, 1)',
						                'rgba(75, 192, 192, 1)',
						                'rgba(153, 102, 255, 1)',
						                'rgba(255, 159, 64, 1)',
						                'rgba(5, 57, 111, 1)',
						                'rgba(172, 128, 225, 1)',
						                'rgba(143, 147, 149, 1)',
						                'rgba(116, 232, 127, 1)'
						            ],
						            borderWidth: 1
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
										tics: {
											fontColor: "black"
										}
									}]
								}
							}
						});
						//document.getElementById("chart").onclick = thisBar(jQuery.Event("click"), myChart);
						function vids(e, legendItem) {
							var point = legendItem.datasetIndex;
							//var point = myChart.getElementAtEvent(evt)[0];
							console.log("TEST");
							//console.log(myChart.data.labels[point._index]);
							if(point) {
								$('VIDS').empty();
								//var label = myChart.data.labels[point._index];
								var arr = tagsMapVids.get(${largestK[point]});
								for(var v of arr) {
									$('VIDS').append('<iframe width="560" height="315" src="https://www.youtube.com/embed/${v}" frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>');
								}
							}
						}
					</script>
					<div class="media" id="VIDS">
					</div>
				`);
			});
		}
	});
}

function thisBar(evt, myChart) {
	var point = myChart.getElementAtEvent(evt)[0];
	console.log("TEST");
	console.log(myChart.data.labels[point._index]);
	if(point) {
		$('VIDS').empty();
		var label = myChart.data.labels[point._index];
		var arr = tagsMapVids.get(label);
		for(var v of arr) {
			$('VIDS').append(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${v}" 
				frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>
			`);
		}
	}
}

function imgToVid(mediaId, vidId) {
	$(`#${mediaId}`).empty();
	$(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${vidId}" 
							frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>`).appendTo(`#${mediaId}`);
	document.getElementById(`${mediaId}`).removeEventListener('click', () => imgToVid(`${mediaId}`, `${vidId}`));
}

function trending(country) {
	let c = countryToISO(country);
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

		function loadVids() {
			$.getJSON(URL, options, function(data) {
				$('main').empty();
				var rank = 1;
				$.each(data.items, function(i, item) {
					var thumb = item.snippet.thumbnails.medium.url;
					var title = item.snippet.title;
					var vid = item.id;
					var channel = item.snippet.channelTitle;
					var channelId = item.snippet.channelId;
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
					document.getElementById(`media${tmp}`).addEventListener('click', () => imgToVid(`media${tmp}`, vid));
					rank++;
				});
			});
		}
	});
}
main();