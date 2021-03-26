var automating_tab;
var isStarted = false;
var completedFirstStep = false;
let tabId = null;

console.log("starting");



chrome.webNavigation.onCompleted.addListener(function(currtab) {
    console.log("added listener");
    if(currtab.url == "https://myaccount.google.com/security"){
        console.log("At Google security page")
        if(!isStarted){
            if(confirm("Press okay to automate 2FA process.")){
                isStarted = true;
                chrome.tabs.create({active: true, url: "https://myaccount.google.com/u/2/signinoptions/two-step-verification/enroll-welcome"}, function (newtab) {
                    chrome.tabs.executeScript(newtab.id, {file: "google-initiate.js"});
                    tabId = newtab.id;                
                });
            } else {
                console.log("Pressed No");
            }
        } else {
        }
    }
    else if(currtab.url == "https://accounts.google.com/signin/v2/challenge/*"){  
        if(!isStarted){
            chrome.tabs.sendMessage(currtab.tabId, {site_ready: "true"});
            chrome.tabs.executeScript(currtab.id, {file: "google.js"});
            isStarted = true;
        }

    }
    // else {}
    // //chrome.tabs.executeScript(tab.id, {file: "twitter.js"});
}, {url: [{urlMatches : 'https://*/*'}]});

chrome.runtime.onConnect.addListener(function(port){
    if(port.name == "Google"){
        if(!completedFirstStep){
            port.postMessage({getStarted: true});
        } else {
            port.postMessage({nextStep: "two"});
        }
        
        port.onMessage.addListener(function(msg){
            if(msg.step == "one"){
                console.log("Completed step one");
                completedFirstStep = true;
                sleep(2);
                chrome.tabs.executeScript(tabId, {file: "google-initiate.js"});
            } else if(msg.step == "two"){
                port.postMessage({nextStep: "three"});
            } else if(msg.step == "three"){
                console.log("Completed step three");
                sleep(2);
                chrome.tabs.executeScript(tabId, {file: "google-2fa.js"});
            }else if(msg.step == "four"){
                port.postMessage({nextStep: "four"});
            } else if(msg.almost_finished == true){
                sleep(1);
                port.postMessage({continue: true});
            }else if(msg.error == true){
                return;
            }
        });
    } else if(port.name == "Google 2fa"){
        sleep(2);
        port.postMessage({getStarted: true});
        port.onMessage.addListener(function(msg){
            if(msg.step == "one"){
                console.log("Got to step 2");
            }
        })

    }
});

function sleep(seconds){
    var start = new Date().getTime();
    while (new Date() < start + seconds*1000){}
    return 0;
}

// port.onMessage.addListener(function(msg){
//     if(msg.step == "one"){
//         port.postMessage({nextStep: "two"});
//     } else if(msg.step == "two"){
//         port.postMessage({nextStep: "three"});
//     } else if(msg.step == "three"){
//         port.postMessage({nextStep: "four"});
//     }else if(msg.step == "four"){
//         port.postMessage({nextStep: "four"});
//     }else if(msg.error == true){
//         return;
//     }
// });

// chrome.runtime.onMessage.addListener(
//     function(request, sender){
//         console.log("received message from tab");
//         console.log(sender);
//         console.log(request);
//         if(request.past_first_step == true){
//             console.log(sender.tab.id);
//             sleep(1);
//             chrome.tabs.executeScript(sender.tab.id, {file: "google2.js"});
//             sleep(1);
//             chrome.tabs.sendMessage(sender.tab.id, {isAutomating: "true"})
                        
//         } else if(request.past_first_step == false){
//             console.log("error");
//         } else if(request.past_second_step == true){
//             console.log(sender.tab.id);
//             sleep(1);
//             chrome.tabs.executeScript(sender.tab.id, {file: "google3.js"});
//             sleep(1);
//             chrome.tabs.sendMessage(sender.tab.id, {isAutomating: "true"});
//         } else if(request.past_second_step == false){
//             console.log("error");
//         } else if(request.past_third_step == true){
//             console.log(sender.tab.id);
//             console.log("Completed Third step");
//         }
//     }
// )

// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
//     chrome.tabs.executeScript(null,{file:"content.js"});
// });


// import puppeteer from 'puppeteer-web';
 
// async function run(){
 
//   const browser = await puppeteer.connect({
//     browserWSEndpoint: `ws://0.0.0.0:8080`, // <-- connect to a server running somewhere
//     ignoreHTTPSErrors: true
//   });
 
//   const pagesCount = (await browser.pages()).length;
//   const browserWSEndpoint = await browser.wsEndpoint();
//   console.log({ browserWSEndpoint, pagesCount });
 
// // }


// function doFirstStep(port){
//     console.log("inside first step");
//     if(document.querySelector(".O0WRkf")){
//         document.querySelector(".O0WRkf").click();
//         port.postMessage({step: "one"});
//     } else {
//         port.postMessage({error: true});
//     }
// }

// function doSecondStep(port, elm){
//     if(document.querySelector("#password")){
//         let elm = document.querySelector("#password");
//         var code = prompt("Please enter your password for google: ");
//         let elm2  = document.querySelector("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input");    
//         change(elm2, code);
//         elm2 = document.querySelector("#passwordNext");
//         elm2.click();
//         port.postMessage({step: "two"});
//     } else {
//         port.postMessage({error: true});
//     }
// }
// function doThirdStep(port){
//     // check for unusual activity
//     if(document.querySelector("#headingText > span:nth-child(1)")){
//         console.log("Checking for unusual activity");
//         if(document.querySelector("#headingText > span:nth-child(1)").innerText = "Verify it’s you"){
//             console.log("on the verify page");
            
//             document.querySelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ").click();
//         }
//         //port.postMessage({step: "three"});
//     } else {
//         port.postMessage({error: true});
//     }
// }
