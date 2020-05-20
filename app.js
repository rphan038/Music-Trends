const countrySelector_select = document.getElementById("country-names");
var currCountry_option = document.getElementById("country-names").value;
const currentPage_p = document.querySelector(".current-page > p");

function main() {
	trending("South Korea");
	countrySelector_select.onchange = function() {
		currCountry_option.innerHTML = document.getElementById("country-names").value;
		currCountry_option = document.getElementById("country-names").value;
		console.log(currCountry_option);
		trending(currCountry_option);
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
	} else if(stat === "p") {
		pba();
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

function imgToVid(mediaId, vidId) {
	$(`#${mediaId}`).empty();
	$(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${vidId}" 
							frameborder="0" allow="accelerometer; autoplay; encrypted-media;" allowfullscreen></iframe>`).appendTo(`#${mediaId}`);
	document.getElementById(`${mediaId}`).removeEventListener('click', () => imgToVid(`${mediaId}`, `${vidId}`));
}

function trending(country) {
	let c = countryToISO(country);
	$(document).ready(function () {
		var key = 'AIzaSyB1eGmERaVmCcmRXAWUQocoGLHuKtGs3cI';
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