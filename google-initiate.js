
let enteredPassword = false;
let enteredPhone = false;
let enteredCode = false;
let alreadyFinished = false;
let firstVerifyDone = false;
let readyToStartStepThree = false;
let isStarted = false;
console.log('In google 1');

var port = chrome.runtime.connect({name: "Google"});

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;
        for (let i = 0; i < mutation.addedNodes.length; i++){
            //Do things to nodes.
            let node = mutation.addedNodes[i];
            //Just entered password; Clicking verify phone number
            if(node.querySelector("#password")){
                if(firstVerifyDone == false){
                    if(document.querySelector("#headingText > span:nth-child(1)").innerText = "Verify it’s you"){
                        firstVerifyDone = true;
                        document.querySelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ").click();
                    } else {
                        firstVerifyDone = false;
                    }  
                }
            //If on the verify code page    
            } else if(node.querySelector("#idvPin")){
                if(enteredCode == false){
                    let elm = node.querySelector("#idvPin")
                    var code = prompt("Please enter the code you received via SMS: ");
                    change(elm, code)
                    let elm2= document.querySelector("#idvPreregisteredPhoneNext > div > button");
                    elm2.click()
                    enteredCode = true;
                    port.postMessage({step: "three"})
                } else {
                    enteredPhone = false;
                }
                
            } else if(node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div > div.I4mZgb > div.qDDjIb.fKMMOd > div.EfHsX.UJm2Pb > div > div.rFrNMe.RSJo4e.L9di.zKHdkd.Tyc9J > div.aCsJod.oJeWuf > div > div.Xb9hP > input")){
                if(enteredPhone == false){
                    let elm = node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div > div.I4mZgb > div.qDDjIb.fKMMOd > div.EfHsX.UJm2Pb > div > div.rFrNMe.RSJo4e.L9di.zKHdkd.Tyc9J > div.aCsJod.oJeWuf > div > div.Xb9hP > input");
                    doCode(elm);
                    enteredCode = true;
                } else {
                    enteredCode = false;
                }
            } else if(node.querySelector("h1.lH1")){
                if(node.querySelector("h1.lH1").innerText == "Backup code"){
                    if(alreadyFinished == false){
                        let elm = node.querySelector(".deprecatedTextSizeXL");
                        finish(elm);
                        alreadyFinished = true;
                    } else {
                        alreadyFinished = false;
                    }
                }
            }
        }
    })
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
});


port.onMessage.addListener(function(msg){
    console.log(msg);
        if(msg.getStarted == true){
            doFirstStep(port);
        } else if(msg.nextStep == "two"){
            doSecondStep(port);
        } else if(msg.nextStep == "three"){
            readyToStartStepThree = true;
        } else {
            console.log();
        }
});

function doCode(elm){
    var code = prompt("Please enter the code you received via SMS.");
    change(elm, code);
    let elm2 = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(1)");
    elm2.click();
}


function doFirstStep(port){
    console.log("inside first step");
    if(document.querySelector(".O0WRkf")){
        document.querySelector(".O0WRkf").click();
        port.postMessage({step: "one"});
    } else {
        port.postMessage({error: true});
    }
}
function doSecondStep(port, elm){
        if(document.querySelector("#password")){
            let elm = document.querySelector("#password");
            var code = prompt("Please enter your password for google: ");
            let elm2  = document.querySelector("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input");    
            change(elm2, code);
            elm2 = document.querySelector("#passwordNext");
            elm2.click();
            port.postMessage({step: "two"});
        } else {
            port.postMessage({error: true});
        }
}

// function doSecondStep(port){
//     if(elm){
//         var code = prompt("Please enter your password for google: ");
//         let elm2  = document.querySelector("#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input");    
//         change(elm2, code);
//         elm2 = document.querySelector("#passwordNext");
//         elm2.click();
//         //port.postMessage({step: "two"});
//     } else {
//         port.postMessage({error: true});
//     }
// }

function doThirdStep(port){
    // check for unusual activity
    if(document.querySelector("#headingText > span:nth-child(1)")){
        console.log("Checking for unusual activity");
        if(document.querySelector("#headingText > span:nth-child(1)").innerText = "Verify it’s you"){
            console.log("on the verify page");
            
            document.querySelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ").click();
        }
        //port.postMessage({step: "three"});
    } else {
        port.postMessage({error: true});
    }
}





// //https://github.com/keepassxreboot/keepassxc-browser/blob/37acdeea3cd087d8a8a5a35c2b2df165b68c69ea/keepassxc-browser/content/keepassxc-browser.js#L1523
function change(field, value) { field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: false, key: '', char: '' }));
    field.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, cancelable: false, key: '', char: '' }));
    field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: false, key: '', char: '' }));
}


function sleep(seconds){
    var start = new Date().getTime();
    while (new Date() < start + seconds*1000){}
    return 0;
}


function finish(elm){
    let message = "You're all set. Please store this backup code somewhere safe in case you lose access to your phone." + elm.innerText;
    alert(message);
    let elm2 = document.querySelector("#passwordNext");
    elm2.click()
}



function doPassword(elm){
    var code = prompt("Please enter your password for Pinterest: ");
    change(elm, code);
    let elm2 = document.querySelector(".VfPpkd-LgbsSe-OWXEXe-k8QpJ");
    elm2.click();
}

function doPhone(elm){
        if(elm){
        var code = prompt("Please enter your phone number: ");
        elm.value = code;
        elm = document.querySelector(".Il7");
        elm.click();
    }
}

    // function(request, sender){

    //     if(request.isAutomating == "true"){
    //         if(!isStarted){
    //             isStarted = true;
    //             doAutomation();
    //         }
            
    //         // observer.observe(document.body, {
    //         //     childList: true,
    //         //     subtree: true,
    //         //     attributes: false,
    //         //     characterData: false
    //         // })
    //     }
    //     // if(request.site_ready == "true"){
    //     //     console.log("Site is ready");
    //     //     doAutomation();
    //     // }
    // });

//doAutomation();

// document.addEventListener("DOMSubtreeModified", function(event){
//     console.log("DOm changed");
//     if(isWorking === false){
//         if(document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > section:nth-child(2) > div.css-1dbjc4n.r-qocrb3.r-kemksi.r-1h0z5md.r-1jx8gzb.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div:nth-child(2) > label")) {
//             console.log(document.readyState);
//             isWorking = true;
//             console.log(isWorking);
//             elm = document.querySelector("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > section:nth-child(2) > div.css-1dbjc4n.r-qocrb3.r-kemksi.r-1h0z5md.r-1jx8gzb.r-1jgb5lz.r-1ye8kvj.r-13qz1uu > div:nth-child(2) > label");
//             elm.click();
//             console.log(elm);
//         }            
//     }
// });