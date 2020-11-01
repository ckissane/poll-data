// https://codesandbox.io/live/6wcemyb
import "regenerator-runtime/runtime";
import Metronome from "./third_party/Metronome.js";
import createBufferMap from "./third_party/CreateBufferMap.js";
import loadCSV from "./third_party/LoadCSV";

const context_ = new AudioContext();
const panner1_ = new PannerNode(context_, { panningModel: "HRTF" });
const panner2_ = new PannerNode(context_, { panningModel: "HRTF" });
const reverb_ = new ConvolverNode(context_);
let w=512;
let h=1;
let canvas = document.getElementById("c");
canvas.width = w;
canvas.height = h;
let ctx=canvas.getContext("2d");
let pos={x:0,y:0};
panner1_.connect(reverb_);
panner2_.connect(reverb_);
reverb_.connect(context_.destination);

panner1_.positionX.value = -1.0;
panner2_.positionX.value = 1.0;
const poll=(color)=>{
  if(ctx.fillStyle!=color)ctx.fillStyle=color;
  ctx.fillRect(pos.x,pos.y,1,1);
  pos.x+=1;
  if(pos.x+1>w){
    pos.y+=1;
    pos.x=0;
    window.scrollTo(0,pos.y-window.innerHeight);
  }

}
const date=(text)=>{
  ctx.fillStyle="black";
  ctx.fillText(text,pos.x,pos.y);

}
const playGrain = (output, buffer, start, duration, value) => {
  const source = new AudioBufferSourceNode(context_);
  const amp = new GainNode(context_);
  source.connect(amp).connect(output);
  source.buffer = buffer;
  source.loop = true;

  // Grain!
  const grainStart = start + duration * Math.random();
  const bufferOffset = source.buffer.length * value;
  const grainDuration = 0.05 + duration * value;
  amp.gain.setValueAtTime(0.0, grainStart);
  amp.gain.linearRampToValueAtTime(0.7, grainStart + grainDuration * 0.5);
  amp.gain.linearRampToValueAtTime(0.0, grainStart + grainDuration);
  source.playbackRate.value = 1 + value;
  source.start(grainStart, bufferOffset, grainDuration);
};

const playDataSet = (bufferMap, csvData, timeStart, timeEnd) => {
  const metro = new Metronome(context_,240);//365.25);
  const values = csvData;
  let q = Math.floor((timeEnd-timeStart)/1000/60/60/24/7);
  let sI=0;
  // console.log("V", values);
  metro.onbeat = (start, duration, counter) => {
    if (counter >= q) {
      metro.stop();
      return;
    }
    
    let tS = timeStart + (counter / q) * (-timeStart + timeEnd);
    let tE = timeStart +((counter + 1) / q) * (-timeStart + timeEnd);
    // if(counter%4===0){
    //   date(new Date(tS));
    // }
    document.getElementById("time").innerText=new Date(tS);
    let M=values.findIndex((y) => y[0] >= tE);
    let mp0 = values.splice(0,M)
    // sI=M;
    
    let qz=mp0.map(x=>x[1]);
    // for(let o=0;o<qz.length/10;o++){
    //   let color=["blue","red"][qz[o]];
    //   poll(color);
    // }
    // while(qz.length<10000){
    //   qz.splice(Math.floor(Math.random()*qz.length),0,[2]);
    // }
    for(let o=0;o<qz.length;o++){
      let color=o<qz.length?["blue","red","white"][qz[o]]:"white";
      poll(color);
    }
    let mp=[0,1].map(x=>values.filter(y=>y[1]===x).length / 100000);
    console.log(counter,q, mp,new Date(tS),new Date(tE));
    playGrain(panner1_, bufferMap.ca, start, duration, mp[0]);
    playGrain(panner2_, bufferMap.ny, start, duration, mp[1]);
  };
  metro.start();
};

const OnStartButtonClicked = async () => {
  const csvData = await loadCSV("./data/president_polls.csv");
  let events = [];
  let fires = [[], []];
  let keyR = csvData[0];
  let sc = 100000;
  let lastId = "-1";

  for (var i = 1; i < csvData.length; i++) {
    let rowR = csvData[i];
    let ans = rowR[keyR.indexOf("answer")];
    let pId = rowR[keyR.indexOf("poll_id")];
    let sDate = new Date(rowR[keyR.indexOf("start_date")]).getTime();
    let eDate = new Date(rowR[keyR.indexOf("end_date")]).getTime();
    let count =
      (parseFloat(rowR[keyR.indexOf("sample_size")]) *
        parseFloat(rowR[keyR.indexOf("pct")])) /
      100;
    if (!isNaN(count / sc) && isFinite(count / sc)) {
      count = Math.round(count);
      let st = lastId === pId;
      lastId = pId;
      if (!st) {
        events.push({
          timeStart: sDate,
          duration: Math.max(eDate - sDate, 1000 * 60 * 60 * 24),
          votes: [0, 0],
        });
      }
      if (ans === "Biden") {
        events[events.length - 1].votes[0] += count;
      } else if (ans === "Trump") {
        events[events.length - 1].votes[1] += count;
      }
    }
  }
  let minT=Infinity;
  let maxT=-Infinity;
  console.log("firing logs")
  for (var i = 0; i < events.length; i++) {
    // console.log(i, events.length);
    let ev = events[i];
    for (let k = 0; k < ev.votes.length; k++) {
      for (let j = 0; j < ev.votes[k]; j++) {
        let t = ev.timeStart + Math.random() * ev.duration;
        minT=Math.min(minT,t);
        maxT=Math.max(maxT,t);
        fires[k].push(t);
      }
    }
  }
  h=Math.ceil((fires[0].length+fires[1].length)/w);
  canvas.height = h;
  console.log("sorting firing logs")
  // for (let i = 0; i < fires.length; i++) fires[i].sort();
  // let minT = Math.min(...fires.filter((x) => x.length > 0).map((x) => x.reduce((a,b)=>Math.min(a,b))));
  // let maxT = Math.max(
  //   ...fires.filter((x) => x.length > 0).map((x) => x.reduce((a,b)=>Math.max(a,b)))
  // );

  console.log("creting b map")
  const bufferMap = await createBufferMap(context_, [
    { key: "ny", url: "./sound/ny.m4a" },
    { key: "ca", url: "./sound/waves.m4a" },
    { key: "heavy", url: "./sound/heavy.wav" },
  ]);
  reverb_.buffer = bufferMap.heavy;
  playDataSet(bufferMap, fires.map((x,i)=>x.map(y=>[y,i])).reduce((a,b)=>a.concat(b)).sort((a,b)=>a[0]-b[0]), minT, maxT);
};

window.addEventListener("load", () => {
  const buttonEl = document.getElementById("start");
  buttonEl.addEventListener("click", async () => {
    buttonEl.disabled = true;
    await OnStartButtonClicked();
    buttonEl.textContent = "PLAYING";
  });
});
