import {
    p1Arr,
    p2Arr,
    p2Arr2,
    p3Arr,
    p4Arr,
    p5Arr,
    spriteGroupBgObject,
    sence1Object,
    sence2Object,
    sence3Object,
    sence4Object,
    spriteGroupLastObject,
} from "./data.js";
console.log("spriteGroupBgObject", spriteGroupBgObject);

PIXI.loader
    .add(p1Arr)
    .add(p2Arr)
    .add(p2Arr2)
    .add(p3Arr)
    .add(p4Arr)
    .add(p5Arr)
    .on("progress", function (loader, resource) {
        // console.log("loader.progress", loader.progress)
        $('#loadingProgress').html(Math.floor(loader.progress)+'%');
    })
    .load(setup);

//总时间轴
let allTimeLine = new TimelineMax({ paused: true });

let app = null;
//setup 函数
function setup() {
    $('#loadingProgress').hide()
    setTimeout(()=>{
        $('#tip').fadeIn('slow')
        setTimeout(()=>{
            $("#tip").addClass('upTip')
        },1500)
    },1000)
    app = new PIXI.Application({
        width: 750,
        height: 1488,
    });
    document.getElementById("stage").appendChild(app.view);

    //创建精灵组
    let spriteGroupBg = new PIXI.Container();
    spriteGroupBg.position.set(0, 0);
    spriteGroupBg.name = "spriteGroupBg";
    app.stage.addChild(spriteGroupBg);

    let spriteGroupSences = new PIXI.Container();
    spriteGroupSences.position.set(0, 0);
    spriteGroupSences.name = "spriteGroupSences";
    app.stage.addChild(spriteGroupSences);

    let sence1 = new PIXI.Container();
    sence1.position.set(1784,621);
    sence1.pivot.set(1784,621);
    sence1.name = "sence1";
    let sence2 = new PIXI.Container();
    sence2.position.set(1773, 0);
    sence2.name = "sence2";
    sence2.alpha = 0;
    let sence3 = new PIXI.Container();
    sence3.position.set(4960, 0);
    sence3.name = "sence3";
    let sence4 = new PIXI.Container();
    sence4.position.set(7902, 0);
    sence4.name = "sence4";

    spriteGroupSences.addChild(sence1);
    spriteGroupSences.addChild(sence2);
    spriteGroupSences.addChild(sence3);
    spriteGroupSences.addChild(sence4);

    let spriteGroupLast = new PIXI.Container();
    spriteGroupLast.position.set(-203, 0);
    spriteGroupLast.name = "spriteGroupLast";
    app.stage.addChild(spriteGroupLast);

    //添加精灵到精灵组
    let spritesObject = [];
    spritesObject.push(...spriteGroupBgObject);
    spritesObject.push(...sence1Object);
    spritesObject.push(...sence2Object);
    spritesObject.push(...sence3Object);
    spritesObject.push(...sence4Object);
    spritesObject.push(...spriteGroupLastObject);
    // console.log("spritesObject", spritesObject);

    for (let key of Object.keys(spritesObject)) {
        let temp = spritesObject[key];
        addSprToGroup(
            temp.img,
            temp.x,
            temp.y,
            temp.alpha,
            temp.sprName,
            temp.sprGroup
        );
    }
    // 各种滑动和动画
    touchAction();
    tweenAciton();
    $('#loading').on('touchstart',function(){
        $('#loading').hide()
    })
}
//创建精灵组 加载精灵
function addSprToGroup(img, x, y, alpha, sprName, sprGroup) {
    let spr = new PIXI.Sprite.fromImage(img);
    spr.position.set(x, y);
    spr.alpha = alpha;
    spr.name = sprName;
    let sprArr = sprGroup.split("/");
    let sprites = app.stage.getChildByName(sprArr[0]);
    let sprArrNum = sprArr.length;
    if (sprArrNum > 1) {
        for (let i = 1; i < sprArrNum; i++) {
            let midName = sprArr[i];
            console.log("midName", midName);
            sprites = sprites.getChildByName(midName);
        }
    }
    sprites.addChild(spr);
}

let maxLong = -(10800 - 750);
//识别滑动
function touchAction() {
    let alloyTouch = new AlloyTouch({
        touch: "body", //反馈触摸的dom
        vertical: true, //不必需，默认是true代表监听竖直方向touch
        maxSpeed: 0.8, //不必需，触摸反馈的最大速度限制
        min: maxLong, //不必需,运动属性的最小值
        max: 0, //不必需,滚动属性的最大值
        bindSelf: false,
        initialValue: 0,
        change: function (value) {
            if (value <= 0 && value >= maxLong) {
                let progress = value / maxLong;
                console.log("progress", value, progress);
                allTimeLine.seek(progress);
                animationPlay(progress);
                audioAction(progress)
            }
        },
    });
}

// 子时间轴 TweenMax
function tweenAciton() {
    //sences spriteGroupSences
    let sences = app.stage.getChildByName("spriteGroupSences");
    let sencesTimeline = new TimelineMax({ delete: 0 });
    let sencesTween = TweenMax.to(sences.position, 1, { x: maxLong });
    sencesTimeline.add(sencesTween, 0);
    allTimeLine.add(sencesTimeline, 0);

    //星星显现 spriteGroupSences/sence1/p1Star
    let star = app.stage
        .getChildByName("spriteGroupSences")
        .getChildByName("sence1")
        .getChildByName("p1Star");
    let starStartTime = -15 / maxLong;
    let starDuringTime = -24 / maxLong;
    let starTimeline = new TimelineMax({ delay: starStartTime });
    let starTween = TweenMax.to(star, starDuringTime, { alpha: 1 });
    starTimeline.add(starTween, 0);
    allTimeLine.add(starTimeline, 0);


    // 房子放大  spriteGroupSences/sence1
    let house = app.stage
    .getChildByName("spriteGroupSences").getChildByName("sence1")
    let houseStartTime = -600 / maxLong;
    let houseDuringTime = -200 / maxLong;
    let houseTimeline = new TimelineMax({ delay: houseStartTime });
    let houseTween = TweenMax.to(house.scale,houseDuringTime, {x:3,y:3 });
    let houseTween2 = TweenMax.to(house,houseDuringTime, {alpha:0 });
    houseTimeline.add(houseTween, 0);
    houseTimeline.add(houseTween2, 0);
    allTimeLine.add(houseTimeline, 0);


    let sence2 = app.stage.getChildByName("spriteGroupSences").getChildByName("sence2")

    let sence2StartTime = -680 / maxLong;
    let sence2DuringTime = -100 / maxLong;
    let sence2Timeline = new TimelineMax({ delay: sence2StartTime });
    let sence2Tween = TweenMax.to(sence2,sence2DuringTime, {alpha:1});
    sence2Timeline.add(sence2Tween, 0);
    allTimeLine.add(sence2Timeline, 0);

    //音符飘动 spriteGroupSences/sence2/p2Yinfu
    let yinfu = app.stage.getChildByName("spriteGroupSences").getChildByName("sence2").getChildByName("p2Yinfu")
    let yinfuStartTime = -2450/maxLong;
    let yinfuDuringTime = -200/maxLong;
    let yinfuTimeline = new TimelineMax({ delay: yinfuStartTime });
    let yinfuTween = TweenMax.to(yinfu.position,yinfuDuringTime,{x:3400,y:300});
    let yinfuTween2 = TweenMax.to(yinfu,yinfuDuringTime,{alpha:0});
    yinfuTimeline.add(yinfuTween,0)
    yinfuTimeline.add(yinfuTween2,0)
    allTimeLine.add(yinfuTimeline,0)


    //黑夜缩小窗户 spriteGroupSences/sence3/p32
    let chuanghu = app.stage.getChildByName("spriteGroupSences").getChildByName("sence3").getChildByName("p32")
    let chStartTime = -2580/maxLong;
    let chDuringTime = -800/maxLong;
    let chTimeline = new TimelineMax({ delay: chStartTime });
    let chTween = TweenMax.from(chuanghu.position,chDuringTime,{x:0,y:-20});
    let chTween2 = TweenMax.from(chuanghu.scale,chDuringTime,{x:5,y:5});
    chTimeline.add(chTween,0)
    chTimeline.add(chTween2,0)
    allTimeLine.add(chTimeline,0)

   //工作中的男孩 spriteGroupSences/sence3/p31
   let boyworking =app.stage.getChildByName("spriteGroupSences").getChildByName("sence3").getChildByName("p31")
   let bwStartTime = -2780/maxLong;
   let bwDuringTime = -600/maxLong;
   let bwTimeline = new TimelineMax({ delay: bwStartTime });
   let bwTween = TweenMax.to(boyworking,bwDuringTime,{alpha:1});
   bwTimeline.add(bwTween,0)
   allTimeLine.add(bwTimeline,0)

   //旋涡显示
   let xn = app.stage.getChildByName("spriteGroupLast").getChildByName("bgLast");
   let xnStartTime = -6613/maxLong;
   let xnDuringTime= -50/maxLong
   let xnTimeline  = new TimelineMax({delay:xnStartTime})
   let xnTween = TweenMax.to(xn,xnDuringTime,{alpha:1});
   xnTimeline.add(xnTween,0)
   allTimeLine.add(xnTimeline,0)
}

// animationPlay 参数progress
function animationPlay(progress) {
    //孩子蹒跚学走路 spriteGroupSences/sence2/p2Child
    // 图片数组p2Arr2
    let childStepStartTime = -900/maxLong;
    let childDuringTime =(-1300-childStepStartTime)/maxLong
    if(progress>=childStepStartTime){
        let childNum = p2Arr2.length;
        let childIndex = Math.floor((progress-childStepStartTime)/childDuringTime*childNum);
        console.log("childIndex",childIndex);
        if((childIndex<childNum)&&(childIndex>=0)){
            app.stage.getChildByName("spriteGroupSences").getChildByName("sence2").getChildByName("p2Child").texture= new PIXI.Texture.fromImage(p2Arr2[childIndex])
        }
    }


    //旋涡 并出现扣题文字 spriteGroupLast/bgLast
    let xunStartTime= -6613/maxLong;
    let xunDuringTime = -1000/maxLong;
    if(progress>=xunStartTime){
        let xunNum = p5Arr.length;
        let xunIndex=  Math.floor((progress-xunStartTime)/xunDuringTime*xunNum);
        if((xunIndex<xunNum)&&(xunIndex>=0)){
            app.stage.getChildByName("spriteGroupLast").getChildByName("bgLast").texture= new PIXI.Texture.fromImage(p5Arr[xunIndex])
        }
    }

    let ewmStartTime = -7600/maxLong;
    if(progress>=ewmStartTime){
        $('.ewm').show()
    }else{
        $('.ewm').hide()
    }
}


// 播放声音 
function audioAction(progress){
    let timeDur= 20;
    let auStarStartTime = -40 / maxLong;
    let auStarEndTime = -(40+timeDur) / maxLong;

    if((progress>=auStarStartTime) && (progress<=auStarEndTime)){
        audioPlay('ding')
    }
    if(progress<auStarStartTime){
        audioPause('ding')
    }

    //欢呼
    let auHuanhuStartTime = -2270 / maxLong;
    let auHuanhuEndTime = -(2270+timeDur) / maxLong;
    if((progress>=auHuanhuStartTime) && (progress<=auHuanhuEndTime)){
        audioPlay('huanhu')
    }
    if(progress<=auHuanhuStartTime){
        audioPause('huanhu')
    }
}


//音频加载

function audioPlay(musicId){
    let mus =document.getElementById(musicId)
    mus.play()
    document.addEventListener('WeixinJSBridgeReady',function(){
    mus.play()
    },false)
  }

  function audioPause(musicId){
    let au=document.getElementById(musicId)
    au.pause()
    document.addEventListener('WeixinJSBridgeReady',function(){
      au.pause()
    },false)
  }

//背景音乐默认播放
audioPlay('bgmusic')
let audioFlag = true;
function musicAction(){
    if(audioFlag){
        audioPause('bgmusic')
        audioFlag=false
        $('#musicIcon').removeClass('mplay').addClass('mpause')
    }else{
        audioPlay('bgmusic')
        audioFlag=true
        $('#musicIcon').removeClass('mpause').addClass('mplay')
    }
}
document.getElementById('musicIcon').onclick=function(){
    musicAction()
}


//预加载其他声音文件
audioPlay('ding')
setTimeout(function(){
    audioPause('ding')
},200)

audioPlay('huanhu')
setTimeout(function(){
    audioPause('huanhu')
},200)