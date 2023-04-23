// loader
const img1 = ['images/p1-p1.png'];
let imgArr=[];
for(let i=1;i<=52;i++){
    imgArr.push('images/x'+i+'.png')
}

PIXI.loader
    .add(img1)
    .add(imgArr)
    .on('progress',function(loader,resource){
        console.log("loader.progress",loader.progress);
    })
    .load(setup)

  function setup(){
      const app = new PIXI.Application({
          width:750,
          height:1448
      })
      document.getElementById('stage').appendChild(app.view)
      let spr = new PIXI.Sprite.fromImage(img1[0])
      spr.position.set(375,724);
      spr.anchor.set(0.5,0.5);
      spr.alpha=0;
      app.stage.addChild(spr);


      let spr2= new PIXI.Sprite.fromImage(imgArr[0])
      spr2.position.set(375,724);
      spr2.anchor.set(0.5,0.5);
      spr2.alpha=0;
      app.stage.addChild(spr2);



    //  动画精灵
    let imgSprArr=[];
    for(let n=1; n<=52;n++){
        let tempspr = new PIXI.Texture.fromImage('images/x'+n+'.png')
        let temprect = new PIXI.Rectangle(0,0,1318,1448);
        let imgSprArrItem = new PIXI.Texture(tempspr,temprect);
        imgSprArr.push(imgSprArrItem);
    }
    let animatedSpr = new PIXI.extras.AnimatedSprite(imgSprArr);
    animatedSpr.position.set(0,0);
    animatedSpr.animationSpeed=0.8;
    // animatedSpr.play()
    // app.stage.addChild(animatedSpr);

    // TweenMax
    let allTimeLine = new TimelineMax({paused:true});
    // AlloyTouch
    let moveMin=-2000;
    let alloyTouch = new AlloyTouch({
        touch:'body', //反馈触摸的dom
        vertical:true, //不必需，默认是true代表监听竖直方向touch
        maxSpeed:0.1, //不必需，触摸反馈的最大速度限制 
        min:moveMin, //不必需,运动属性的最小值
        max:0, //不必需,滚动属性的最大值
        bindSelf: false,
        initialValue:0,
        change:function(value){
            let myprogress= value/moveMin
            console.log("myprogress",myprogress);
            allTimeLine.seek(myprogress)
            animationPlay(myprogress)
        }
    })
    // let timeline1 = new TimelineMax({delay:0.3})
    // let tweenMax1= new TweenMax(spr,0.1,{alpha:1})
    // timeline1.add(tweenMax1,0);
    // allTimeLine.add(timeline1,0)

    let timeline2 = new TimelineMax({delay:0.5})
    let tweenMax2= new TweenMax(spr2,0.1,{alpha:1})
    timeline2.add(tweenMax2,0);
    allTimeLine.add(timeline2,0) 


    function animationPlay(progress){
    if(progress>=0.6){
        let imgArrNum=imgArr.length;
        let index =Math.floor((progress-0.6)/0.3*imgArrNum);
        let tempnn = index+1;
        if(tempnn<imgArrNum){
            spr2.texture= new PIXI.Texture.fromImage('images/x'+tempnn+'.png')
        }
    }
  }
}