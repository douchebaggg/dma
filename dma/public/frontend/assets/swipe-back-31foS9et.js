import{B as h,C as f,D as M}from"./index-BmCyWIqS.js";import"./frappe-ui-DoeaObP-.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const B=(n,m,g,p,X)=>{const c=n.ownerDocument.defaultView;let s=h(n);const w=t=>{const{startX:e}=t;return s?e>=c.innerWidth-50:e<=50},a=t=>s?-t.deltaX:t.deltaX,v=t=>s?-t.velocityX:t.velocityX;return f({el:n,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:t=>(s=h(n),w(t)&&m()),onStart:g,onMove:t=>{const e=a(t)/c.innerWidth;p(e)},onEnd:t=>{const o=a(t),e=c.innerWidth,r=o/e,i=v(t),y=e/2,l=i>=0&&(i>.2||o>y),u=(l?1-r:r)*e;let d=0;if(u>5){const D=u/Math.abs(i);d=Math.min(D,540)}X(l,r<=0?.01:M(0,r,.9999),d)}})};export{B as createSwipeBackGesture};
//# sourceMappingURL=swipe-back-31foS9et.js.map
