
let enteredPassword = false;
let enteredPhone = false;
let enteredCode = false;
let alreadyFinished = false;
let firstVerifyDone = false;
let readyToStartStepThree = false;
let isStarted = false;
console.log('In google 2fa');

var port = chrome.runtime.connect({name: "Google 2fa"});

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;
        for (let i = 0; i < mutation.addedNodes.length; i++){
            //Do things to nodes.
            let node = mutation.addedNodes[i];
            //Just entered password; Clicking verify phone number
            if(node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div > div.I4mZgb > div.qDDjIb.fKMMOd > div.OLq3Sc > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input")){
                if(enteredCode == false){
                    let elm = node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div > div.I4mZgb > div.qDDjIb.fKMMOd > div.OLq3Sc > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input");
                    doCode(elm);
                } else {
                    enteredCode = false;
                }
            } else if(node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div.I4mZgb > div.nUt1y")){
                if(node.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div.I4mZgb > div.nUt1y").innerText == "It worked! Turn on 2-Step Verification?"){
                    let elm = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(2)");
                    if(elm) {
                        elm.click();
                        alert("It worked!");
                    } else {
                        port.postMessage({almost_finished: true});
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

function doCode(elm){
    var code = prompt("Please enter the code you received via SMS.");
    change(elm, code);
    let elm2 = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.Zrq4w.WIL89.M9Bg4d");
    elm2.click();
}

port.onMessage.addListener(function(msg){
    console.log(msg);
        if(msg.getStarted == true){
            doFirstStep(port);
        } else if(msg.nextStep == "two"){
            doSecondStep(port);
        } else if(msg.nextStep == "three"){
            readyToStartStepThree = true;
        } else if(msg.continue == true){
            if(document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(2)")){
                elm = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(2)");
                elm.click()
                alert("It worked!");
            } else {
                port.postMessage({almost_finished: true});
            }
        }
});






function doFirstStep(port){
    console.log("inside first step");
    let elm = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.fuXTM > div > div:nth-child(1) > div > div.I4mZgb > div.qDDjIb.fKMMOd > div.EfHsX.UJm2Pb > div > div.rFrNMe.RSJo4e.L9di.zKHdkd.Tyc9J > div.aCsJod.oJeWuf > div > div.Xb9hP > input");
    if(elm){
        var code = prompt("Please enter your phone number: ");
        elm.value = code;
        let elm2 = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(1)");
        elm2.click();
    }
}

function doPhone(elm){
    if(elm){
        
        elm2 = document.querySelector(".A9wyqf > div:nth-child(1)");
        elm.click();
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


// function doCode(elm){
//     var code = prompt("Please enter the code you received via SMS.");
//     change(elm, code);
//     let elm2 = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(1)");
//     let elm2 = document.querySelector("#yDmH0d > c-wiz > div > div:nth-child(3) > c-wiz > div > div > div.hyMrOd > div.qNeFe.RH9rqf > div > div.A9wyqf > div:nth-child(1)");
//     elm2.click();
// }
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