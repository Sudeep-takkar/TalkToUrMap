var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var testBtn = document.querySelector('button');
var speechInput = document.querySelector('input');

testBtn.addEventListener('click', testSpeech);

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = Hello;';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

    recognition.onresult = function(event) {
    var speechResult = event.results[0][0].transcript;

    speechInput.value = speechResult;

    if(speechResult){
      var geocoder =  new google.maps.Geocoder();
      geocoder.geocode({ 'address': speechResult}, function(results, status) {
      
      if (status == google.maps.GeocoderStatus.OK) {
        var center = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
        var map = new google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var marker = new google.maps.Marker({
          position: center,
          map: map,
          title: speechResult
        });
        //map.setCenter(center);
      }
    });
  }
    console.log(speechResult);
    console.log('Confidence: ' + event.results[0][0].confidence);
    responsiveVoice.speak(speechResult);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

   recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;

  }

}

 function initMap() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
}
