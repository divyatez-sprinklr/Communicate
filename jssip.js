let socket_creds={server_address:"blr-sbc1.ozonetel.com",username:"10075",password:"10075"};
var remoteView = document.getElementById("audioStream");
var call, ua;
let socket_connected = false;
function answer() {
  if (call) {
      call.answer({
          "extraHeaders": ["X-Foo: foo", "X-Bar: bar"],
          "mediaConstraints": { "audio": true, "video": false },
          "pcConfig": { rtcpMuxPolicy: "negotiate" },
          "rtcOfferConstraints": {
              offerToReceiveAudio: 1,
              offerToReceiveVideo: 0
          }
      });
  }
}
function decline() {
  if (call) {
      call.terminate();
  }
}
function decline() {
  if (call) {
      call.terminate();
  }
}
function connect() {
  let sip = socket_creds.username;
  let password = socket_creds.password;
  let server_address = socket_creds.server_address;
  
  var configuration = {
      sockets: [
          new JsSIP.WebSocketInterface("wss://" + server_address + ":442")
      ],
      uri: "sip:" + sip + "@" + server_address,
      authorization_user: sip,
      password: password,
      registrar_server: "sip:" + server_address,
      session_timers: false
  };
  ua = new JsSIP.UA(configuration);
  ua.on("connected", function (e) {
      handleSocketLiveUI();
      socket_connected = true;
      console.log("connected", e);
  });
  ua.on("newRTCSession", function (e) {
      console.log("newRTCSession", e);
      call = e.session;
      call.on("sdp", function (e) {
          console.log("call sdp:", e);
          var lbody = e.sdp.split("\n");
          var tempbody;
          for (var i = 0; i < lbody.length; i++) {
              if (!lbody[i].indexOf("a=crypto:1")) {
                  continue;
              }
              if (!tempbody) {
                  tempbody = lbody[i];
              } else {
                  tempbody += "\n" + lbody[i];
              }
          }
          e.sdp = tempbody;
      });
      call.on("accepted", function (e) {
          console.log("call accepted", e);
      });
      call.on("progress", function (e) {
          console.log("call is in progress", e);
          answer();
      });
      call.on("confirmed", function (e) {
          console.log("call accepted/confirmed", e);
      });
      call.on("ended", function (e) {
          console.log("Call ended: ", e);
      });
      call.on("failed", function (e) {
          console.log("Call failed: ", e);
      });
      call.on("addstream", function (e) {
          console.log("call addstream: ", e);
          var remoteStream = e.stream;
          remoteView = document.getElementById("callStream");
          remoteView = JsSIP.rtcninja.attachMediaStream(remoteView, remoteStream);
      });
      call.on("peerconnection", function (e) {
          console.log("call peerconnection: ", e);
          e.peerconnection.onaddstream = function (e) {
              console.log("call peerconnection addstream:", e);
              remoteView = document.getElementById("callStream");
              var remoteStream = e.stream;
              remoteView.srcObject = remoteStream;
          };
      });
  });
  ua.start();
}