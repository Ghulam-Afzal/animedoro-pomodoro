
const pTimer = document.querySelector(".timer");


const startBtn = document.querySelector('.start');
const stopBtn = document.querySelector('.stop');
const pauseBtn = document.querySelector('.pause');
const header = document.querySelector('.mode'); 
const animeBtn = document.querySelector('.animedoro'); 
const pomoBtn = document.querySelector('.pomodoro');
const taskName = document.querySelector('#session-input')
const eTask = document.querySelector('.enter-task')
const workInput = document.querySelector('#work-time'); 
const breakInput = document.querySelector('#break-time');


workInput.value = '25'
breakInput.value = '5'
// set up the initail values for the timer in seconds 
let workDuration = 1500; 
let currentTimeleft = 1500; 
let initialBreak = 300;  

let sessionTime = 0; 

let animeLongBreak = initialBreak * 2; 
let pomoLongBreak = initialBreak * 4; 

let pType = 'Pomodoro'; 
let pomodorosCompleted = 0; 
let type = 'work'; 

let clockOn = false; 
let clockoff = true; 

// calulate the value for the time in minutes and then make it the default value that is shown in the html, so there is something there
initialTime = (currentTimeleft / 60) % 60; 
pTimer.innerHTML = String(`${initialTime}:00`);


startBtn.addEventListener('click', () => {
    checkNotificationPerms(); 
    timer(); 
})

pauseBtn.addEventListener('click', () => { 
    timer(); 
})

stopBtn.addEventListener('click', () => { 
    timer(true); 
})

animeBtn.addEventListener('click', () => { 
    pType = "Animedoro"; 
    header.innerHTML = "Animedoro Timer"; 
    workDuration = 3600; 
    currentTimeleft = workDuration; 
    initialBreak = 1200;
    updateInputValueShown(); 
    displayUpdatedTime();  
})

pomoBtn.addEventListener('click', () => { 
    pType = 'Pomodoro';
    header.innerHTML = "Pomodoro Timer"; 
    workDuration = 1500; 
    currentTimeleft = workDuration; 
    initialBreak = 300;
    updateInputValueShown();
    displayUpdatedTime();
})

workInput.addEventListener('input', () => {
    let updateWorkTimer = minsToSecs(workInput.value)
    currentTimeleft = updateWorkTimer ?  updateWorkTimer : workDuration
    workDuration = currentTimeleft; 
    displayUpdatedTime(); 

})

breakInput.addEventListener('input', () => {
    let updateBreakTimer = minsToSecs(breakInput.value)
    currentTimeleft = updateBreakTimer ?  updateBreakTimer : initialBreak
    initialBreak = currentTimeleft; 

})

const minsToSecs = mins => {
    return mins * 60; 
}


const updateInputValueShown = () => { 
    workInput.value = workDuration / 60; 
    breakInput.value = initialBreak / 60;
}

// initial func to make the timer work
const timer = condition => { 
    if (condition) { 
        stopClock(); 
    }else { 
        if (clockOn === true) { 
            clockOn = false;
            clearInterval(clockTimer); 
        }else {
            clockOn = true; 
            clockTimer = setInterval (() => { 
                countDown(); 
                displayUpdatedTime(); 
            }, 1000)
        }
    }
}


const countDown = () => { 
    if (currentTimeleft > 0) { 
        currentTimeleft--; 
        sessionTime++; 
    }else if (currentTimeleft === 0) { 
        if (pomodorosCompleted !== 4) { 
            if (pType === 'Animedoro') { 
                if (type === 'work') { 
                    type = 'break'; 
                    currentTimeleft = initialBreak;
                    notifyUser('Time is up','Time for a anime ep');
                }else { 
                    type = 'work'; 
                    currentTimeleft = workDuration;
                    pomodorosCompleted += 1; 
                    notifyUser('Time is up','Time to watch a episode');
                }
                
                displayUpdatedTime();  
                timer(true); 
            }else if (pType === 'Pomodoro') { 
                if (type = 'work') { 
                    type = 'break'; 
                    currentTimeleft = initialBreak;
                    notifyUser('Time is up','Time for a break');
                }else { 
                    type = 'work'; 
                    currentTimeleft = workDuration; 
                    pomodorosCompleted += 1; 
                    notifyUser('Time is up','time to work again');
                } 
                
                displayUpdatedTime();  
                timer(true); 
            }
        }else if (pomodorosCompleted === 4) { 
            if (pType === 'Animedoro'){ 
                if (type === 'work') { 
                    type = 'break'; 
                    currentTimeleft = animeLongBreak;
                    pomodorosCompleted = 0; 
                    notifyUser('Time is up','time to watch 2 episodes of anime');
                }else if (type === 'break') {
                        type = 'work'; 
                        currentTimeleft = workDuration ;
                        notifyUser('Time is up','Time to work again');
                    }else { 
                        type = 'work'; 
                        currentTimeleft = workDuration;
                        notifyUser('Time is up','Time to work again, dont\n dont watch another episode');
                }
                 
                displayUpdatedTime();  
                timer(true); 
            }else if (pType === 'Pomodoro') { 
                if (type === 'work') { 
                    type = 'break'; 
                    currentTimeleft = pomoLongBreak; 
                    pomodorosCompleted = 0;
                    notifyUser('Time is up','Time for a break');
                }else { 
                    type = 'break'; 
                    currentTimeleft = workDuration;
                    notifyUser('Time is up','Time to work');
                }
                 
                displayUpdatedTime();
                timer(true); 
            } 
        }
    }
}


const sessionLog = () => { 
    const tName = taskName.value; 
    const sTime = (sessionTime / 60); 
    const sList = document.querySelector(".sessions"); 
    const listItem = document.createElement("li");
    const text = document.createTextNode(`${tName} : ${sTime} mins`);
    listItem.appendChild(text); 
    sList.appendChild(listItem); 
}


// show calculate the time and update the displayo to show it 
const displayUpdatedTime = () => { 
    const secsLeft = currentTimeleft; 
    let output = ''; 
    const secs = secsLeft % 60; 
    const mins = parseInt(secsLeft / 60) % 60; 
    const hours = parseInt(secsLeft / 3600);

    const leadingZeroes = time => { 
        return time < 10 ? `0${time}` : time 
    }

    if (hours > 0) output += `${hours}:`;
    output += `${leadingZeroes(mins)}:${leadingZeroes(secs)}`;
    pTimer.innerHTML = output.toString(); 

}


const stopClock = () => { 
    // reset everthing to the original state and stop the timer 
    sessionLog(); 
    clearInterval(clockTimer); 
    clockoff = true; 
    clockOn = false; 
    currentTimeleft = workDuration
    type = 'work'    
    sessionTime = 0; 
    displayUpdatedTime(); 
}


const notifyUser = (heading, bodyDesc) => { 
    const notification = new Notification(heading, {
        body: bodyDesc
    })
}

console.log(Notification.permission); 

const checkNotificationPerms = () => { 
    if (Notification.permission === 'granted') { 
        console.log('you have granted permission') 
    }else if (Notification.permission !== 'denied') { 
        Notification.requestPermission().then(permission => { 
            console.log(permission); 
        })
    }
}

checkNotificationPerms(); 
