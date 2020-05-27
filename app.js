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

function pba() {
	$('main').empty();
	$('main').append(`<input type="text" oninput="searchArtist(this.value)"/>`);
}

function searchArtist(query) {
	$(document).ready(function () {
		var URL = 'https://api.spotify.com/v1/artists/3HqSLMAZ3g3d5poNaI7GOU/top-tracks?country=US';
		var options = {
			Accept: 'application/json',
			Authorization: 'Bearer BQDB1afZPojAXIrqVIlMG_CKFbmI0mk9o7R0AkQTLgS1mKLD2IiJZCp88bmQCqYV8eVGXNUMjzU1TYqmHrOcTYx9s_9CA12K0MCwSChHw3VZ9gdA95a4hDUUtMay1vxkB6-M2FWJ',
		}
		$.getJSON(URL, options, function(data) {
			console.log(data);
		});
		// var key = '';
		// var URL = 'https://api.spotify.com/v1/search';

		// var clientID = '33e6b36dc46c45729a03c0a7014d73e6';
		// var clientSecretID = 'eeb2fbf150684ccbb2bce82121814c18';
		// var authorizeURL = 'https://accounts.spotify.com/authorize?client_id=33e6b36dc46c45729a03c0a7014d73e6&response_type=code&redirect_uri=https%3A%2F%2Fgoogle.com%2F';

		// var options = {
		// 	q: query,
		// 	type: 'artist',
		// 	key: 'BQArnLC6MUSyNj7lpPO_mhGjFpSyqZFwr_794rJiFxnY-qzIisat5KdUkiIGE3naiGj2IffSQyAgp9t8B6cbwrouhtbiqRak_KVKYHbt2wyIyG7YMAXuSFcx1z4n3ZPTxCIn_-VL'
		// 	//authorization: 'BQArnLC6MUSyNj7lpPO_mhGjFpSyqZFwr_794rJiFxnY-qzIisat5KdUkiIGE3naiGj2IffSQyAgp9t8B6cbwrouhtbiqRak_KVKYHbt2wyIyG7YMAXuSFcx1z4n3ZPTxCIn_-VL'
		// }
		// console.log("hey");
		// $.ajax({
		// 	url: 'https://api.spotify.com/v1/search',
		// 	type: 'GET',
		// 	dataType: 'json',
		// 	contentType: 'application/json',
		// 	beforeSend: function(xhr) {
		// 		xhr.setRequestHeader('Authorization', 'Bearer BQArnLC6MUSyNj7lpPO_mhGjFpSyqZFwr_794rJiFxnY-qzIisat5KdUkiIGE3naiGj2IffSQyAgp9t8B6cbwrouhtbiqRak_KVKYHbt2wyIyG7YMAXuSFcx1z4n3ZPTxCIn_-VL');
		// 	},
		// 	data: {
		// 		"q" : `${query}&type=artist`
		// 	},
		// 	success: function(data) {
		// 		console.log(data);
		// 	}
		// });
	});
}

function hotTags(country) {
	let c = countryToISO(country);
	$(document).ready(function () {
		var key = 'AIzaSyB3PVG8UO8tsz5cE08sWxfdPLd3xIX3uu8';
		var URL = 'https://www.googleapis.com/youtube/v3/videos';
		var tagsMap = new Map();

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
					if(tags !== undefined) {
						tags.forEach(function(idx) {
							if(!tagsMap.has(idx)) {
								tagsMap.set(idx, 1);
							} else if(tagsMap.has(idx)){
								tagsMap.set(idx, tagsMap.get(idx) + 1);
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
						var myChart = new Chart(ctx, {
							type: 'bar',
							data: {
								labels: ['${largestK[0]}', '${largestK[1]}', '${largestK[2]}', 
										'${largestK[3]}', '${largestK[4]}', '${largestK[5]}', 
										'${largestK[6]}', '${largestK[7]}', '${largestK[8]}', '${largestK[9]}'],
								datasets: [{
									label: 'Tags',
									data: [${largestV[0]}, ${largestV[1]}, ${largestV[2]}, 
										${largestV[3]}, ${largestV[4]}, ${largestV[5]}, 
										${largestV[6]}, ${largestV[7]}, ${largestV[8]}, ${largestV[9]}],
									backgroundColor: [
						                'rgba(255, 99, 132, 0.2)',
						                'rgba(54, 162, 235, 0.2)',
						                'rgba(255, 206, 86, 0.2)',
						                'rgba(75, 192, 192, 0.2)',
						                'rgba(153, 102, 255, 0.2)',
						                'rgba(255, 159, 64, 0.2)'
						            ],
						            borderColor: [
						                'rgba(255, 99, 132, 1)',
						                'rgba(54, 162, 235, 1)',
						                'rgba(255, 206, 86, 1)',
						                'rgba(75, 192, 192, 1)',
						                'rgba(153, 102, 255, 1)',
						                'rgba(255, 159, 64, 1)'
						            ],
						            borderWidth: 1
								}]
							},
							options: {
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero: true
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