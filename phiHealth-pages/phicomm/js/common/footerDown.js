(function () {
    document.getElementsByClassName("callbackthis")[0].addEventListener("click", function() {
        window.location.href = "scheme://phicomm.phicare/awaken/html/scheme?name=google&page=2";
        window.setTimeout(function() {
            window.location.href = "https://phiclouds.phicomm.com/ota/Service/App/downloadpage?appid=2017030031&channel=1NEW"
        }, 2E3)
    }, !1);
})();