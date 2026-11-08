function G(r){return r<0?-1:r===0?0:1}function ut(r,t,e){return(1-e)*r+e*t}function Te(r,t,e){return e<r?r:e>t?t:e}function _(r,t,e){return e<r?r:e>t?t:e}function ft(r){return r=r%360,r<0&&(r=r+360),r}function z(r){return r=r%360,r<0&&(r=r+360),r}function ke(r,t){return z(t-r)<=180?1:-1}function Bt(r,t){return 180-Math.abs(Math.abs(r-t)-180)}function At(r,t){let e=r[0]*t[0][0]+r[1]*t[0][1]+r[2]*t[0][2],n=r[0]*t[1][0]+r[1]*t[1][1]+r[2]*t[1][2],a=r[0]*t[2][0]+r[1]*t[2][1]+r[2]*t[2][2];return[e,n,a]}var be=[[.41233895,.35762064,.18051042],[.2126,.7152,.0722],[.01932141,.11916382,.95034478]],Je=[[3.2413774792388685,-1.5376652402851851,-.49885366846268053],[-.9691452513005321,1.8758853451067872,.04156585616912061],[.05562093689691305,-.20395524564742123,1.0571799111220335]],oe=[95.047,100,108.883];function pt(r,t,e){return(255<<24|(r&255)<<16|(t&255)<<8|e&255)>>>0}function ie(r){let t=lt(r[0]),e=lt(r[1]),n=lt(r[2]);return pt(t,e,n)}function De(r){return r>>24&255}function dt(r){return r>>16&255}function gt(r){return r>>8&255}function yt(r){return r&255}function se(r,t,e){let n=Je,a=n[0][0]*r+n[0][1]*t+n[0][2]*e,o=n[1][0]*r+n[1][1]*t+n[1][2]*e,i=n[2][0]*r+n[2][1]*t+n[2][2]*e,s=lt(a),l=lt(o),p=lt(i);return pt(s,l,p)}function Ze(r){let t=at(dt(r)),e=at(gt(r)),n=at(yt(r));return At([t,e,n],be)}function we(r,t,e){let n=oe,a=(r+16)/116,o=t/500+a,i=a-e/200,s=Lt(o),l=Lt(a),p=Lt(i),u=s*n[0],d=l*n[1],P=p*n[2];return se(u,d,P)}function Ot(r){let t=at(dt(r)),e=at(gt(r)),n=at(yt(r)),a=be,o=a[0][0]*t+a[0][1]*e+a[0][2]*n,i=a[1][0]*t+a[1][1]*e+a[1][2]*n,s=a[2][0]*t+a[2][1]*e+a[2][2]*n,l=oe,p=o/l[0],u=i/l[1],d=s/l[2],P=Tt(p),y=Tt(u),g=Tt(d),m=116*y-16,C=500*(P-y),w=200*(y-g);return[m,C,w]}function ve(r){let t=Z(r),e=lt(t);return pt(e,e,e)}function kt(r){let t=Ze(r)[1];return 116*Tt(t/100)-16}function Z(r){return 100*Lt((r+16)/116)}function bt(r){return Tt(r/100)*116-16}function at(r){let t=r/255;return t<=.040449936?t/12.92*100:Math.pow((t+.055)/1.055,2.4)*100}function lt(r){let t=r/100,e=0;return t<=.0031308?e=t*12.92:e=1.055*Math.pow(t,1/2.4)-.055,Te(0,255,Math.round(e*255))}function Fe(){return oe}function Tt(r){let t=.008856451679035631,e=24389/27;return r>t?Math.pow(r,1/3):(e*r+16)/116}function Lt(r){let t=.008856451679035631,e=24389/27,n=r*r*r;return n>t?n:(116*r-16)/e}var X=class r{static make(t=Fe(),e=200/Math.PI*Z(50)/100,n=50,a=2,o=!1){let i=t,s=i[0]*.401288+i[1]*.650173+i[2]*-.051461,l=i[0]*-.250268+i[1]*1.204414+i[2]*.045854,p=i[0]*-.002079+i[1]*.048952+i[2]*.953127,u=.8+a/10,d=u>=.9?ut(.59,.69,(u-.9)*10):ut(.525,.59,(u-.8)*10),P=o?1:u*(1-1/3.6*Math.exp((-e-42)/92));P=P>1?1:P<0?0:P;let y=u,g=[P*(100/s)+1-P,P*(100/l)+1-P,P*(100/p)+1-P],m=1/(5*e+1),C=m*m*m*m,w=1-C,S=C*e+.1*w*w*Math.cbrt(5*e),D=Z(n)/t[1],M=1.48+Math.sqrt(D),O=.725/Math.pow(D,.2),V=O,T=[Math.pow(S*g[0]*s/100,.42),Math.pow(S*g[1]*l/100,.42),Math.pow(S*g[2]*p/100,.42)],I=[400*T[0]/(T[0]+27.13),400*T[1]/(T[1]+27.13),400*T[2]/(T[2]+27.13)],N=(2*I[0]+I[1]+.05*I[2])*O;return new r(D,N,O,V,d,y,g,S,Math.pow(S,.25),M)}constructor(t,e,n,a,o,i,s,l,p,u){this.n=t,this.aw=e,this.nbb=n,this.ncb=a,this.c=o,this.nc=i,this.rgbD=s,this.fl=l,this.fLRoot=p,this.z=u}};X.DEFAULT=X.make();var K=class r{constructor(t,e,n,a,o,i,s,l,p){this.hue=t,this.chroma=e,this.j=n,this.q=a,this.m=o,this.s=i,this.jstar=s,this.astar=l,this.bstar=p}distance(t){let e=this.jstar-t.jstar,n=this.astar-t.astar,a=this.bstar-t.bstar,o=Math.sqrt(e*e+n*n+a*a);return 1.41*Math.pow(o,.63)}static fromInt(t){return r.fromIntInViewingConditions(t,X.DEFAULT)}static fromIntInViewingConditions(t,e){let n=(t&16711680)>>16,a=(t&65280)>>8,o=t&255,i=at(n),s=at(a),l=at(o),p=.41233895*i+.35762064*s+.18051042*l,u=.2126*i+.7152*s+.0722*l,d=.01932141*i+.11916382*s+.95034478*l,P=.401288*p+.650173*u-.051461*d,y=-.250268*p+1.204414*u+.045854*d,g=-.002079*p+.048952*u+.953127*d,m=e.rgbD[0]*P,C=e.rgbD[1]*y,w=e.rgbD[2]*g,S=Math.pow(e.fl*Math.abs(m)/100,.42),D=Math.pow(e.fl*Math.abs(C)/100,.42),M=Math.pow(e.fl*Math.abs(w)/100,.42),O=G(m)*400*S/(S+27.13),V=G(C)*400*D/(D+27.13),T=G(w)*400*M/(M+27.13),I=(11*O+-12*V+T)/11,N=(O+V-2*T)/9,L=(20*O+20*V+21*T)/20,Y=(40*O+20*V+T)/20,nt=Math.atan2(N,I)*180/Math.PI,$=z(nt),ct=$*Math.PI/180,It=Y*e.nbb,it=100*Math.pow(It/e.aw,e.c*e.z),Mt=4/e.c*Math.sqrt(it/100)*(e.aw+4)*e.fLRoot,ee=$<20.14?$+360:$,re=.25*(Math.cos(ee*Math.PI/180+2)+3.8),ae=5e4/13*re*e.nc*e.ncb*Math.sqrt(I*I+N*N)/(L+.305),Rt=Math.pow(ae,.9)*Math.pow(1.64-Math.pow(.29,e.n),.73),Se=Rt*Math.sqrt(it/100),xe=Se*e.fLRoot,qe=50*Math.sqrt(Rt*e.c/(e.aw+4)),Xe=(1+100*.007)*it/(1+.007*it),Ae=1/.0228*Math.log(1+.0228*xe),je=Ae*Math.cos(ct),We=Ae*Math.sin(ct);return new r($,Se,it,Mt,xe,qe,Xe,je,We)}static fromJch(t,e,n){return r.fromJchInViewingConditions(t,e,n,X.DEFAULT)}static fromJchInViewingConditions(t,e,n,a){let o=4/a.c*Math.sqrt(t/100)*(a.aw+4)*a.fLRoot,i=e*a.fLRoot,s=e/Math.sqrt(t/100),l=50*Math.sqrt(s*a.c/(a.aw+4)),p=n*Math.PI/180,u=(1+100*.007)*t/(1+.007*t),d=1/.0228*Math.log(1+.0228*i),P=d*Math.cos(p),y=d*Math.sin(p);return new r(n,e,t,o,i,l,u,P,y)}static fromUcs(t,e,n){return r.fromUcsInViewingConditions(t,e,n,X.DEFAULT)}static fromUcsInViewingConditions(t,e,n,a){let o=e,i=n,s=Math.sqrt(o*o+i*i),p=(Math.exp(s*.0228)-1)/.0228/a.fLRoot,u=Math.atan2(i,o)*(180/Math.PI);u<0&&(u+=360);let d=t/(1-(t-100)*.007);return r.fromJchInViewingConditions(d,p,u,a)}toInt(){return this.viewed(X.DEFAULT)}viewed(t){let e=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),n=Math.pow(e/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),a=this.hue*Math.PI/180,o=.25*(Math.cos(a+2)+3.8),i=t.aw*Math.pow(this.j/100,1/t.c/t.z),s=o*(5e4/13)*t.nc*t.ncb,l=i/t.nbb,p=Math.sin(a),u=Math.cos(a),d=23*(l+.305)*n/(23*s+11*n*u+108*n*p),P=d*u,y=d*p,g=(460*l+451*P+288*y)/1403,m=(460*l-891*P-261*y)/1403,C=(460*l-220*P-6300*y)/1403,w=Math.max(0,27.13*Math.abs(g)/(400-Math.abs(g))),S=G(g)*(100/t.fl)*Math.pow(w,1/.42),D=Math.max(0,27.13*Math.abs(m)/(400-Math.abs(m))),M=G(m)*(100/t.fl)*Math.pow(D,1/.42),O=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),V=G(C)*(100/t.fl)*Math.pow(O,1/.42),T=S/t.rgbD[0],I=M/t.rgbD[1],N=V/t.rgbD[2],L=1.86206786*T-1.01125463*I+.14918677*N,Y=.38752654*T+.62144744*I-.00897398*N,j=-.0158415*T-.03412294*I+1.04996444*N;return se(L,Y,j)}static fromXyzInViewingConditions(t,e,n,a){let o=.401288*t+.650173*e-.051461*n,i=-.250268*t+1.204414*e+.045854*n,s=-.002079*t+.048952*e+.953127*n,l=a.rgbD[0]*o,p=a.rgbD[1]*i,u=a.rgbD[2]*s,d=Math.pow(a.fl*Math.abs(l)/100,.42),P=Math.pow(a.fl*Math.abs(p)/100,.42),y=Math.pow(a.fl*Math.abs(u)/100,.42),g=G(l)*400*d/(d+27.13),m=G(p)*400*P/(P+27.13),C=G(u)*400*y/(y+27.13),w=(11*g+-12*m+C)/11,S=(g+m-2*C)/9,D=(20*g+20*m+21*C)/20,M=(40*g+20*m+C)/20,V=Math.atan2(S,w)*180/Math.PI,T=V<0?V+360:V>=360?V-360:V,I=T*Math.PI/180,N=M*a.nbb,L=100*Math.pow(N/a.aw,a.c*a.z),Y=4/a.c*Math.sqrt(L/100)*(a.aw+4)*a.fLRoot,j=T<20.14?T+360:T,nt=1/4*(Math.cos(j*Math.PI/180+2)+3.8),ct=5e4/13*nt*a.nc*a.ncb*Math.sqrt(w*w+S*S)/(D+.305),It=Math.pow(ct,.9)*Math.pow(1.64-Math.pow(.29,a.n),.73),it=It*Math.sqrt(L/100),Mt=it*a.fLRoot,ee=50*Math.sqrt(It*a.c/(a.aw+4)),re=(1+100*.007)*L/(1+.007*L),ne=Math.log(1+.0228*Mt)/.0228,ae=ne*Math.cos(I),Rt=ne*Math.sin(I);return new r(T,it,L,Y,Mt,ee,re,ae,Rt)}xyzInViewingConditions(t){let e=this.chroma===0||this.j===0?0:this.chroma/Math.sqrt(this.j/100),n=Math.pow(e/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),a=this.hue*Math.PI/180,o=.25*(Math.cos(a+2)+3.8),i=t.aw*Math.pow(this.j/100,1/t.c/t.z),s=o*(5e4/13)*t.nc*t.ncb,l=i/t.nbb,p=Math.sin(a),u=Math.cos(a),d=23*(l+.305)*n/(23*s+11*n*u+108*n*p),P=d*u,y=d*p,g=(460*l+451*P+288*y)/1403,m=(460*l-891*P-261*y)/1403,C=(460*l-220*P-6300*y)/1403,w=Math.max(0,27.13*Math.abs(g)/(400-Math.abs(g))),S=G(g)*(100/t.fl)*Math.pow(w,1/.42),D=Math.max(0,27.13*Math.abs(m)/(400-Math.abs(m))),M=G(m)*(100/t.fl)*Math.pow(D,1/.42),O=Math.max(0,27.13*Math.abs(C)/(400-Math.abs(C))),V=G(C)*(100/t.fl)*Math.pow(O,1/.42),T=S/t.rgbD[0],I=M/t.rgbD[1],N=V/t.rgbD[2],L=1.86206786*T-1.01125463*I+.14918677*N,Y=.38752654*T+.62144744*I-.00897398*N,j=-.0158415*T-.03412294*I+1.04996444*N;return[L,Y,j]}};var tt=class r{static sanitizeRadians(t){return(t+Math.PI*8)%(Math.PI*2)}static trueDelinearized(t){let e=t/100,n=0;return e<=.0031308?n=e*12.92:n=1.055*Math.pow(e,1/2.4)-.055,n*255}static chromaticAdaptation(t){let e=Math.pow(Math.abs(t),.42);return G(t)*400*e/(e+27.13)}static hueOf(t){let e=At(t,r.SCALED_DISCOUNT_FROM_LINRGB),n=r.chromaticAdaptation(e[0]),a=r.chromaticAdaptation(e[1]),o=r.chromaticAdaptation(e[2]),i=(11*n+-12*a+o)/11,s=(n+a-2*o)/9;return Math.atan2(s,i)}static areInCyclicOrder(t,e,n){let a=r.sanitizeRadians(e-t),o=r.sanitizeRadians(n-t);return a<o}static intercept(t,e,n){return(e-t)/(n-t)}static lerpPoint(t,e,n){return[t[0]+(n[0]-t[0])*e,t[1]+(n[1]-t[1])*e,t[2]+(n[2]-t[2])*e]}static setCoordinate(t,e,n,a){let o=r.intercept(t[a],e,n[a]);return r.lerpPoint(t,o,n)}static isBounded(t){return 0<=t&&t<=100}static nthVertex(t,e){let n=r.Y_FROM_LINRGB[0],a=r.Y_FROM_LINRGB[1],o=r.Y_FROM_LINRGB[2],i=e%4<=1?0:100,s=e%2===0?0:100;if(e<4){let l=i,p=s,u=(t-l*a-p*o)/n;return r.isBounded(u)?[u,l,p]:[-1,-1,-1]}else if(e<8){let l=i,p=s,u=(t-p*n-l*o)/a;return r.isBounded(u)?[p,u,l]:[-1,-1,-1]}else{let l=i,p=s,u=(t-l*n-p*a)/o;return r.isBounded(u)?[l,p,u]:[-1,-1,-1]}}static bisectToSegment(t,e){let n=[-1,-1,-1],a=n,o=0,i=0,s=!1,l=!0;for(let p=0;p<12;p++){let u=r.nthVertex(t,p);if(u[0]<0)continue;let d=r.hueOf(u);if(!s){n=u,a=u,o=d,i=d,s=!0;continue}(l||r.areInCyclicOrder(o,d,i))&&(l=!1,r.areInCyclicOrder(o,e,d)?(a=u,i=d):(n=u,o=d))}return[n,a]}static midpoint(t,e){return[(t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2]}static criticalPlaneBelow(t){return Math.floor(t-.5)}static criticalPlaneAbove(t){return Math.ceil(t-.5)}static bisectToLimit(t,e){let n=r.bisectToSegment(t,e),a=n[0],o=r.hueOf(a),i=n[1];for(let s=0;s<3;s++)if(a[s]!==i[s]){let l=-1,p=255;a[s]<i[s]?(l=r.criticalPlaneBelow(r.trueDelinearized(a[s])),p=r.criticalPlaneAbove(r.trueDelinearized(i[s]))):(l=r.criticalPlaneAbove(r.trueDelinearized(a[s])),p=r.criticalPlaneBelow(r.trueDelinearized(i[s])));for(let u=0;u<8&&!(Math.abs(p-l)<=1);u++){let d=Math.floor((l+p)/2),P=r.CRITICAL_PLANES[d],y=r.setCoordinate(a,P,i,s),g=r.hueOf(y);r.areInCyclicOrder(o,e,g)?(i=y,p=d):(a=y,o=g,l=d)}}return r.midpoint(a,i)}static inverseChromaticAdaptation(t){let e=Math.abs(t),n=Math.max(0,27.13*e/(400-e));return G(t)*Math.pow(n,1/.42)}static findResultByJ(t,e,n){let a=Math.sqrt(n)*11,o=X.DEFAULT,i=1/Math.pow(1.64-Math.pow(.29,o.n),.73),l=.25*(Math.cos(t+2)+3.8)*(5e4/13)*o.nc*o.ncb,p=Math.sin(t),u=Math.cos(t);for(let d=0;d<5;d++){let P=a/100,y=e===0||a===0?0:e/Math.sqrt(P),g=Math.pow(y*i,1/.9),C=o.aw*Math.pow(P,1/o.c/o.z)/o.nbb,w=23*(C+.305)*g/(23*l+11*g*u+108*g*p),S=w*u,D=w*p,M=(460*C+451*S+288*D)/1403,O=(460*C-891*S-261*D)/1403,V=(460*C-220*S-6300*D)/1403,T=r.inverseChromaticAdaptation(M),I=r.inverseChromaticAdaptation(O),N=r.inverseChromaticAdaptation(V),L=At([T,I,N],r.LINRGB_FROM_SCALED_DISCOUNT);if(L[0]<0||L[1]<0||L[2]<0)return 0;let Y=r.Y_FROM_LINRGB[0],j=r.Y_FROM_LINRGB[1],nt=r.Y_FROM_LINRGB[2],$=Y*L[0]+j*L[1]+nt*L[2];if($<=0)return 0;if(d===4||Math.abs($-n)<.002)return L[0]>100.01||L[1]>100.01||L[2]>100.01?0:ie(L);a=a-($-n)*a/(2*$)}return 0}static solveToInt(t,e,n){if(e<1e-4||n<1e-4||n>99.9999)return ve(n);t=z(t);let a=t/180*Math.PI,o=Z(n),i=r.findResultByJ(a,e,o);if(i!==0)return i;let s=r.bisectToLimit(o,a);return ie(s)}static solveToCam(t,e,n){return K.fromInt(r.solveToInt(t,e,n))}};tt.SCALED_DISCOUNT_FROM_LINRGB=[[.001200833568784504,.002389694492170889,.0002795742885861124],[.0005891086651375999,.0029785502573438758,.0003270666104008398],[.00010146692491640572,.0005364214359186694,.0032979401770712076]];tt.LINRGB_FROM_SCALED_DISCOUNT=[[1373.2198709594231,-1100.4251190754821,-7.278681089101213],[-271.815969077903,559.6580465940733,-32.46047482791194],[1.9622899599665666,-57.173814538844006,308.7233197812385]];tt.Y_FROM_LINRGB=[.2126,.7152,.0722];tt.CRITICAL_PLANES=[.015176349177441876,.045529047532325624,.07588174588720938,.10623444424209313,.13658714259697685,.16693984095186062,.19729253930674434,.2276452376616281,.2579979360165119,.28835063437139563,.3188300904430532,.350925934958123,.3848314933096426,.42057480301049466,.458183274052838,.4976837250274023,.5391024159806381,.5824650784040898,.6277969426914107,.6751227633498623,.7244668422128921,.775853049866786,.829304845476233,.8848452951698498,.942497089126609,1.0022825574869039,1.0642236851973577,1.1283421258858297,1.1946592148522128,1.2631959812511864,1.3339731595349034,1.407011200216447,1.4823302800086415,1.5599503113873272,1.6398909516233677,1.7221716113234105,1.8068114625156377,1.8938294463134073,1.9832442801866852,2.075074464868551,2.1693382909216234,2.2660538449872063,2.36523901573795,2.4669114995532007,2.5710888059345764,2.6777882626779785,2.7870270208169257,2.898822059350997,3.0131901897720907,3.1301480604002863,3.2497121605402226,3.3718988244681087,3.4967242352587946,3.624204428461639,3.754355295633311,3.887192587735158,4.022731918402185,4.160988767090289,4.301978482107941,4.445716283538092,4.592217266055746,4.741496401646282,4.893568542229298,5.048448422192488,5.20615066083972,5.3666897647573375,5.5300801301023865,5.696336044816294,5.865471690767354,6.037501145825082,6.212438385869475,6.390297286737924,6.571091626112461,6.7548350853498045,6.941541251256611,7.131223617812143,7.323895587840543,7.5195704746346665,7.7182615035334345,7.919981813454504,8.124744458384042,8.332562408825165,8.543448553206703,8.757415699253682,8.974476575321063,9.194643831691977,9.417930041841839,9.644347703669503,9.873909240696694,10.106627003236781,10.342513269534024,10.58158024687427,10.8238400726681,11.069304815507364,11.317986476196008,11.569896988756009,11.825048221409341,12.083451977536606,12.345119996613247,12.610063955123938,12.878295467455942,13.149826086772048,13.42466730586372,13.702830557985108,13.984327217668513,14.269168601521828,14.55736596900856,14.848930523210871,15.143873411576273,15.44220572664832,15.743938506781891,16.04908273684337,16.35764934889634,16.66964922287304,16.985093187232053,17.30399201960269,17.62635644741625,17.95219714852476,18.281524751807332,18.614349837764564,18.95068293910138,19.290534541298456,19.633915083172692,19.98083495742689,20.331304511189067,20.685334046541502,21.042933821039977,21.404114048223256,21.76888489811322,22.137256497705877,22.50923893145328,22.884842241736916,23.264076429332462,23.6469514538663,24.033477234264016,24.42366364919083,24.817520537484558,25.21505769858089,25.61628489293138,26.021211842414342,26.429848230738664,26.842203703840827,27.258287870275353,27.678110301598522,28.10168053274597,28.529008062403893,28.96010235337422,29.39497283293396,29.83362889318845,30.276079891419332,30.722335150426627,31.172403958865512,31.62629557157785,32.08401920991837,32.54558406207592,33.010999283389665,33.4802739966603,33.953417292456834,34.430438229418264,34.911345834551085,35.39614910352207,35.88485700094671,36.37747846067349,36.87402238606382,37.37449765026789,37.87891309649659,38.38727753828926,38.89959975977785,39.41588851594697,39.93615253289054,40.460400508064545,40.98864111053629,41.520882981230194,42.05713473317016,42.597404951718396,43.141702194811224,43.6900349931913,44.24241185063697,44.798841244188324,45.35933162437017,45.92389141541209,46.49252901546552,47.065252796817916,47.64207110610409,48.22299226451468,48.808024568002054,49.3971762874833,49.9904556690408,50.587870934119984,51.189430279724725,51.79514187861014,52.40501387947288,53.0190544071392,53.637271562750364,54.259673423945976,54.88626804504493,55.517063457223934,56.15206766869424,56.79128866487574,57.43473440856916,58.08241284012621,58.734331877617365,59.39049941699807,60.05092333227251,60.715611475655585,61.38457167773311,62.057811747619894,62.7353394731159,63.417162620860914,64.10328893648692,64.79372614476921,65.48848194977529,66.18756403501224,66.89098006357258,67.59873767827808,68.31084450182222,69.02730813691093,69.74813616640164,70.47333615344107,71.20291564160104,71.93688215501312,72.67524319850172,73.41800625771542,74.16517879925733,74.9167682708136,75.67278210128072,76.43322770089146,77.1981124613393,77.96744375590167,78.74122893956174,79.51947534912904,80.30219030335869,81.08938110306934,81.88105503125999,82.67721935322541,83.4778813166706,84.28304815182372,85.09272707154808,85.90692527145302,86.72564993000343,87.54890820862819,88.3767072518277,89.2090541872801,90.04595612594655,90.88742016217518,91.73345337380438,92.58406282226491,93.43925555268066,94.29903859396902,95.16341895893969,96.03240364439274,96.9059996312159,97.78421388448044,98.6670533535366,99.55452497210776];var A=class r{static from(t,e,n){return new r(tt.solveToInt(t,e,n))}static fromInt(t){return new r(t)}toInt(){return this.argb}get hue(){return this.internalHue}set hue(t){this.setInternalState(tt.solveToInt(t,this.internalChroma,this.internalTone))}get chroma(){return this.internalChroma}set chroma(t){this.setInternalState(tt.solveToInt(this.internalHue,t,this.internalTone))}get tone(){return this.internalTone}set tone(t){this.setInternalState(tt.solveToInt(this.internalHue,this.internalChroma,t))}setValue(t,e){this[t]=e}toString(){return`HCT(${this.hue.toFixed(0)}, ${this.chroma.toFixed(0)}, ${this.tone.toFixed(0)})`}static isBlue(t){return t>=250&&t<270}static isYellow(t){return t>=105&&t<125}static isCyan(t){return t>=170&&t<207}constructor(t){this.argb=t;let e=K.fromInt(t);this.internalHue=e.hue,this.internalChroma=e.chroma,this.internalTone=kt(t),this.argb=t}setInternalState(t){let e=K.fromInt(t);this.internalHue=e.hue,this.internalChroma=e.chroma,this.internalTone=kt(t),this.argb=t}inViewingConditions(t){let n=K.fromInt(this.toInt()).xyzInViewingConditions(t),a=K.fromXyzInViewingConditions(n[0],n[1],n[2],X.make());return r.from(a.hue,a.chroma,bt(n[1]))}};var Pt=class r{static harmonize(t,e){let n=A.fromInt(t),a=A.fromInt(e),o=Bt(n.hue,a.hue),i=Math.min(o*.5,15),s=z(n.hue+i*ke(n.hue,a.hue));return A.from(s,n.chroma,n.tone).toInt()}static hctHue(t,e,n){let a=r.cam16Ucs(t,e,n),o=K.fromInt(a),i=K.fromInt(t);return A.from(o.hue,i.chroma,kt(t)).toInt()}static cam16Ucs(t,e,n){let a=K.fromInt(t),o=K.fromInt(e),i=a.jstar,s=a.astar,l=a.bstar,p=o.jstar,u=o.astar,d=o.bstar,P=i+(p-i)*n,y=s+(u-s)*n,g=l+(d-l)*n;return K.fromUcs(P,y,g).toInt()}};var U=class r{static ratioOfTones(t,e){return t=_(0,100,t),e=_(0,100,e),r.ratioOfYs(Z(t),Z(e))}static ratioOfYs(t,e){let n=t>e?t:e,a=n===e?t:e;return(n+5)/(a+5)}static lighter(t,e){if(t<0||t>100)return-1;let n=Z(t),a=e*(n+5)-5,o=r.ratioOfYs(a,n),i=Math.abs(o-e);if(o<e&&i>.04)return-1;let s=bt(a)+.4;return s<0||s>100?-1:s}static darker(t,e){if(t<0||t>100)return-1;let n=Z(t),a=(n+5)/e-5,o=r.ratioOfYs(n,a),i=Math.abs(o-e);if(o<e&&i>.04)return-1;let s=bt(a)-.4;return s<0||s>100?-1:s}static lighterUnsafe(t,e){let n=r.lighter(t,e);return n<0?100:n}static darkerUnsafe(t,e){let n=r.darker(t,e);return n<0?0:n}};var ht=class r{static isDisliked(t){let e=Math.round(t.hue)>=90&&Math.round(t.hue)<=111,n=Math.round(t.chroma)>16,a=Math.round(t.tone)<65;return e&&n&&a}static fixIfDisliked(t){return r.isDisliked(t)?A.from(t.hue,t.chroma,70):t}};function Qe(r,t,e){if(r.name!==e.name)throw new Error(`Attempting to extend color ${r.name} with color ${e.name} of different name for spec version ${t}.`);if(r.isBackground!==e.isBackground)throw new Error(`Attempting to extend color ${r.name} as a ${r.isBackground?"background":"foreground"} with color ${e.name} as a ${e.isBackground?"background":"foreground"} for spec version ${t}.`)}function E(r,t,e){return Qe(r,t,e),h.fromPalette({name:r.name,palette:n=>n.specVersion===t?e.palette(n):r.palette(n),tone:n=>n.specVersion===t?e.tone(n):r.tone(n),isBackground:r.isBackground,chromaMultiplier:n=>{let a=n.specVersion===t?e.chromaMultiplier:r.chromaMultiplier;return a!==void 0?a(n):1},background:n=>{let a=n.specVersion===t?e.background:r.background;return a!==void 0?a(n):void 0},secondBackground:n=>{let a=n.specVersion===t?e.secondBackground:r.secondBackground;return a!==void 0?a(n):void 0},contrastCurve:n=>{let a=n.specVersion===t?e.contrastCurve:r.contrastCurve;return a!==void 0?a(n):void 0},toneDeltaPair:n=>{let a=n.specVersion===t?e.toneDeltaPair:r.toneDeltaPair;return a!==void 0?a(n):void 0}})}var h=class r{static fromPalette(t){return new r(t.name??"",t.palette,t.tone??r.getInitialToneFromBackground(t.background),t.isBackground??!1,t.chromaMultiplier,t.background,t.secondBackground,t.contrastCurve,t.toneDeltaPair)}static getInitialToneFromBackground(t){return t===void 0?e=>50:e=>t(e)?t(e).getTone(e):50}constructor(t,e,n,a,o,i,s,l,p){if(this.name=t,this.palette=e,this.tone=n,this.isBackground=a,this.chromaMultiplier=o,this.background=i,this.secondBackground=s,this.contrastCurve=l,this.toneDeltaPair=p,this.hctCache=new Map,!i&&s)throw new Error(`Color ${t} has secondBackgrounddefined, but background is not defined.`);if(!i&&l)throw new Error(`Color ${t} has contrastCurvedefined, but background is not defined.`);if(i&&!l)throw new Error(`Color ${t} has backgrounddefined, but contrastCurve is not defined.`)}clone(){return r.fromPalette({name:this.name,palette:this.palette,tone:this.tone,isBackground:this.isBackground,chromaMultiplier:this.chromaMultiplier,background:this.background,secondBackground:this.secondBackground,contrastCurve:this.contrastCurve,toneDeltaPair:this.toneDeltaPair})}clearCache(){this.hctCache.clear()}getArgb(t){return this.getHct(t).toInt()}getHct(t){let e=this.hctCache.get(t);if(e!=null)return e;let n=Ee(t.specVersion).getHct(t,this);return this.hctCache.size>4&&this.hctCache.clear(),this.hctCache.set(t,n),n}getTone(t){return Ee(t.specVersion).getTone(t,this)}static foregroundTone(t,e){let n=U.lighterUnsafe(t,e),a=U.darkerUnsafe(t,e),o=U.ratioOfTones(n,t),i=U.ratioOfTones(a,t);if(r.tonePrefersLightForeground(t)){let l=Math.abs(o-i)<.1&&o<e&&i<e;return o>=e||o>=i||l?n:a}else return i>=e||i>=o?a:n}static tonePrefersLightForeground(t){return Math.round(t)<60}static toneAllowsLightForeground(t){return Math.round(t)<=49}static enableLightForeground(t){return r.tonePrefersLightForeground(t)&&!r.toneAllowsLightForeground(t)?49:t}},ce=class{getHct(t,e){let n=e.getTone(t);return e.palette(t).getHct(n)}getTone(t,e){let n=t.contrastLevel<0,a=e.toneDeltaPair?e.toneDeltaPair(t):void 0;if(a){let o=a.roleA,i=a.roleB,s=a.delta,l=a.polarity,p=a.stayTogether,u=l==="nearer"||l==="lighter"&&!t.isDark||l==="darker"&&t.isDark,d=u?o:i,P=u?i:o,y=e.name===d.name,g=t.isDark?1:-1,m=d.tone(t),C=P.tone(t);if(e.background&&d.contrastCurve&&P.contrastCurve){let w=e.background(t),S=d.contrastCurve(t),D=P.contrastCurve(t);if(w&&S&&D){let M=w.getTone(t),O=S.get(t.contrastLevel),V=D.get(t.contrastLevel);U.ratioOfTones(M,m)<O&&(m=h.foregroundTone(M,O)),U.ratioOfTones(M,C)<V&&(C=h.foregroundTone(M,V)),n&&(m=h.foregroundTone(M,O),C=h.foregroundTone(M,V))}}return(C-m)*g<s&&(C=_(0,100,m+s*g),(C-m)*g>=s||(m=_(0,100,C-s*g))),50<=m&&m<60?g>0?(m=60,C=Math.max(C,m+s*g)):(m=49,C=Math.min(C,m+s*g)):50<=C&&C<60&&(p?g>0?(m=60,C=Math.max(C,m+s*g)):(m=49,C=Math.min(C,m+s*g)):g>0?C=60:C=49),y?m:C}else{let o=e.tone(t);if(e.background==null||e.background(t)===void 0||e.contrastCurve==null||e.contrastCurve(t)===void 0)return o;let i=e.background(t).getTone(t),s=e.contrastCurve(t).get(t.contrastLevel);if(U.ratioOfTones(i,o)>=s||(o=h.foregroundTone(i,s)),n&&(o=h.foregroundTone(i,s)),e.isBackground&&50<=o&&o<60&&(U.ratioOfTones(49,i)>=s?o=49:o=60),e.secondBackground==null||e.secondBackground(t)===void 0)return o;let[l,p]=[e.background,e.secondBackground],[u,d]=[l(t).getTone(t),p(t).getTone(t)],[P,y]=[Math.max(u,d),Math.min(u,d)];if(U.ratioOfTones(P,o)>=s&&U.ratioOfTones(y,o)>=s)return o;let g=U.lighter(P,s),m=U.darker(y,s),C=[];return g!==-1&&C.push(g),m!==-1&&C.push(m),h.tonePrefersLightForeground(u)||h.tonePrefersLightForeground(d)?g<0?100:g:C.length===1?C[0]:m<0?0:m}}},ue=class{getHct(t,e){let n=e.palette(t),a=e.getTone(t),o=n.hue,i=n.chroma*(e.chromaMultiplier?e.chromaMultiplier(t):1);return A.from(o,i,a)}getTone(t,e){let n=e.toneDeltaPair?e.toneDeltaPair(t):void 0;if(n){let a=n.roleA,o=n.roleB,i=n.polarity,s=n.constraint,l=i==="darker"||i==="relative_lighter"&&t.isDark||i==="relative_darker"&&!t.isDark?-n.delta:n.delta,p=e.name===a.name,u=p?a:o,d=p?o:a,P=u.tone(t),y=d.getTone(t),g=l*(p?1:-1);if(s==="exact"?P=_(0,100,y+g):s==="nearer"?g>0?P=_(0,100,_(y,y+g,P)):P=_(0,100,_(y+g,y,P)):s==="farther"&&(g>0?P=_(y+g,100,P):P=_(0,y+g,P)),e.background&&e.contrastCurve){let m=e.background(t),C=e.contrastCurve(t);if(m&&C){let w=m.getTone(t),S=C.get(t.contrastLevel);P=U.ratioOfTones(w,P)>=S&&t.contrastLevel>=0?P:h.foregroundTone(w,S)}}return e.isBackground&&!e.name.endsWith("_fixed_dim")&&(P>=57?P=_(65,100,P):P=_(0,49,P)),P}else{let a=e.tone(t);if(e.background==null||e.background(t)===void 0||e.contrastCurve==null||e.contrastCurve(t)===void 0)return a;let o=e.background(t).getTone(t),i=e.contrastCurve(t).get(t.contrastLevel);if(a=U.ratioOfTones(o,a)>=i&&t.contrastLevel>=0?a:h.foregroundTone(o,i),e.isBackground&&!e.name.endsWith("_fixed_dim")&&(a>=57?a=_(65,100,a):a=_(0,49,a)),e.secondBackground==null||e.secondBackground(t)===void 0)return a;let[s,l]=[e.background,e.secondBackground],[p,u]=[s(t).getTone(t),l(t).getTone(t)],[d,P]=[Math.max(p,u),Math.min(p,u)];if(U.ratioOfTones(d,a)>=i&&U.ratioOfTones(P,a)>=i)return a;let y=U.lighter(d,i),g=U.darker(P,i),m=[];return y!==-1&&m.push(y),g!==-1&&m.push(g),h.tonePrefersLightForeground(p)||h.tonePrefersLightForeground(u)?y<0?100:y:m.length===1?m[0]:g<0?0:g}}},tr=new ce,er=new ue;function Ee(r){return r==="2025"?er:tr}var x=class r{static fromInt(t){let e=A.fromInt(t);return r.fromHct(e)}static fromHct(t){return new r(t.hue,t.chroma,t)}static fromHueAndChroma(t,e){let n=new le(t,e).create();return new r(t,e,n)}constructor(t,e,n){this.hue=t,this.chroma=e,this.keyColor=n,this.cache=new Map}tone(t){let e=this.cache.get(t);return e===void 0&&(t==99&&A.isYellow(this.hue)?e=this.averageArgb(this.tone(98),this.tone(100)):e=A.from(this.hue,this.chroma,t).toInt(),this.cache.set(t,e)),e}getHct(t){return A.fromInt(this.tone(t))}averageArgb(t,e){let n=t>>>16&255,a=t>>>8&255,o=t&255,i=e>>>16&255,s=e>>>8&255,l=e&255,p=Math.round((n+i)/2),u=Math.round((a+s)/2),d=Math.round((o+l)/2);return(255<<24|(p&255)<<16|(u&255)<<8|d&255)>>>0}},le=class{constructor(t,e){this.hue=t,this.requestedChroma=e,this.chromaCache=new Map,this.maxChromaValue=200}create(){let a=0,o=100;for(;a<o;){let i=Math.floor((a+o)/2),s=this.maxChroma(i)<this.maxChroma(i+1);if(this.maxChroma(i)>=this.requestedChroma-.01)if(Math.abs(a-50)<Math.abs(o-50))o=i;else{if(a===i)return A.from(this.hue,this.requestedChroma,a);a=i}else s?a=i+1:o=i}return A.from(this.hue,this.requestedChroma,a)}maxChroma(t){if(this.chromaCache.has(t))return this.chromaCache.get(t);let e=A.from(this.hue,this.maxChromaValue,t).chroma;return this.chromaCache.set(t,e),e}};var Dt=class r{constructor(t){this.input=t,this.hctsByTempCache=[],this.hctsByHueCache=[],this.tempsByHctCache=new Map,this.inputRelativeTemperatureCache=-1,this.complementCache=null}get hctsByTemp(){if(this.hctsByTempCache.length>0)return this.hctsByTempCache;let t=this.hctsByHue.concat([this.input]),e=this.tempsByHct;return t.sort((n,a)=>e.get(n)-e.get(a)),this.hctsByTempCache=t,t}get warmest(){return this.hctsByTemp[this.hctsByTemp.length-1]}get coldest(){return this.hctsByTemp[0]}analogous(t=5,e=12){let n=Math.round(this.input.hue),a=this.hctsByHue[n],o=this.relativeTemperature(a),i=[a],s=0;for(let g=0;g<360;g++){let m=ft(n+g),C=this.hctsByHue[m],w=this.relativeTemperature(C),S=Math.abs(w-o);o=w,s+=S}let l=1,p=s/e,u=0;for(o=this.relativeTemperature(a);i.length<e;){let g=ft(n+l),m=this.hctsByHue[g],C=this.relativeTemperature(m),w=Math.abs(C-o);u+=w;let S=i.length*p,D=u>=S,M=1;for(;D&&i.length<e;){i.push(m);let O=(i.length+M)*p;D=u>=O,M++}if(o=C,l++,l>360){for(;i.length<e;)i.push(m);break}}let d=[this.input],P=Math.floor((t-1)/2);for(let g=1;g<P+1;g++){let m=0-g;for(;m<0;)m=i.length+m;m>=i.length&&(m=m%i.length),d.splice(0,0,i[m])}let y=t-P-1;for(let g=1;g<y+1;g++){let m=g;for(;m<0;)m=i.length+m;m>=i.length&&(m=m%i.length),d.push(i[m])}return d}get complement(){if(this.complementCache!=null)return this.complementCache;let t=this.coldest.hue,e=this.tempsByHct.get(this.coldest),n=this.warmest.hue,o=this.tempsByHct.get(this.warmest)-e,i=r.isBetween(this.input.hue,t,n),s=i?n:t,l=i?t:n,p=1,u=1e3,d=this.hctsByHue[Math.round(this.input.hue)],P=1-this.inputRelativeTemperature;for(let y=0;y<=360;y+=1){let g=z(s+p*y);if(!r.isBetween(g,s,l))continue;let m=this.hctsByHue[Math.round(g)],C=(this.tempsByHct.get(m)-e)/o,w=Math.abs(P-C);w<u&&(u=w,d=m)}return this.complementCache=d,this.complementCache}relativeTemperature(t){let e=this.tempsByHct.get(this.warmest)-this.tempsByHct.get(this.coldest),n=this.tempsByHct.get(t)-this.tempsByHct.get(this.coldest);return e===0?.5:n/e}get inputRelativeTemperature(){return this.inputRelativeTemperatureCache>=0?this.inputRelativeTemperatureCache:(this.inputRelativeTemperatureCache=this.relativeTemperature(this.input),this.inputRelativeTemperatureCache)}get tempsByHct(){if(this.tempsByHctCache.size>0)return this.tempsByHctCache;let t=this.hctsByHue.concat([this.input]),e=new Map;for(let n of t)e.set(n,r.rawTemperature(n));return this.tempsByHctCache=e,e}get hctsByHue(){if(this.hctsByHueCache.length>0)return this.hctsByHueCache;let t=[];for(let e=0;e<=360;e+=1){let n=A.from(e,this.input.chroma,this.input.tone);t.push(n)}return this.hctsByHueCache=t,this.hctsByHueCache}static isBetween(t,e,n){return e<n?e<=t&&t<=n:e<=t||t<=n}static rawTemperature(t){let e=Ot(t.toInt()),n=z(Math.atan2(e[2],e[1])*180/Math.PI),a=Math.sqrt(e[1]*e[1]+e[2]*e[2]);return-.5+.02*Math.pow(a,1.07)*Math.cos(z(n-50)*Math.PI/180)}};var k=class{constructor(t,e,n,a){this.low=t,this.normal=e,this.medium=n,this.high=a}get(t){return t<=-1?this.low:t<0?ut(this.low,this.normal,(t- -1)/1):t<.5?ut(this.normal,this.medium,(t-0)/.5):t<1?ut(this.medium,this.high,(t-.5)/.5):this.high}};var B=class{constructor(t,e,n,a,o,i){this.roleA=t,this.roleB=e,this.delta=n,this.polarity=a,this.stayTogether=o,this.constraint=i,this.constraint=i??"exact"}};var c;(function(r){r[r.MONOCHROME=0]="MONOCHROME",r[r.NEUTRAL=1]="NEUTRAL",r[r.TONAL_SPOT=2]="TONAL_SPOT",r[r.VIBRANT=3]="VIBRANT",r[r.EXPRESSIVE=4]="EXPRESSIVE",r[r.FIDELITY=5]="FIDELITY",r[r.CONTENT=6]="CONTENT",r[r.RAINBOW=7]="RAINBOW",r[r.FRUIT_SALAD=8]="FRUIT_SALAD"})(c||(c={}));function Ct(r){return r.variant===c.FIDELITY||r.variant===c.CONTENT}function H(r){return r.variant===c.MONOCHROME}function rr(r,t,e,n){let a=e,o=A.from(r,t,e);if(o.chroma<t){let i=o.chroma;for(;o.chroma<t;){a+=n?-1:1;let s=A.from(r,t,a);if(i>s.chroma||Math.abs(s.chroma-t)<.4)break;let l=Math.abs(s.chroma-t),p=Math.abs(o.chroma-t);l<p&&(o=s),i=Math.max(i,s.chroma)}}return a}var Vt=class{primaryPaletteKeyColor(){return h.fromPalette({name:"primary_palette_key_color",palette:t=>t.primaryPalette,tone:t=>t.primaryPalette.keyColor.tone})}secondaryPaletteKeyColor(){return h.fromPalette({name:"secondary_palette_key_color",palette:t=>t.secondaryPalette,tone:t=>t.secondaryPalette.keyColor.tone})}tertiaryPaletteKeyColor(){return h.fromPalette({name:"tertiary_palette_key_color",palette:t=>t.tertiaryPalette,tone:t=>t.tertiaryPalette.keyColor.tone})}neutralPaletteKeyColor(){return h.fromPalette({name:"neutral_palette_key_color",palette:t=>t.neutralPalette,tone:t=>t.neutralPalette.keyColor.tone})}neutralVariantPaletteKeyColor(){return h.fromPalette({name:"neutral_variant_palette_key_color",palette:t=>t.neutralVariantPalette,tone:t=>t.neutralVariantPalette.keyColor.tone})}errorPaletteKeyColor(){return h.fromPalette({name:"error_palette_key_color",palette:t=>t.errorPalette,tone:t=>t.errorPalette.keyColor.tone})}background(){return h.fromPalette({name:"background",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98,isBackground:!0})}onBackground(){return h.fromPalette({name:"on_background",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>this.background(),contrastCurve:t=>new k(3,3,4.5,7)})}surface(){return h.fromPalette({name:"surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98,isBackground:!0})}surfaceDim(){return h.fromPalette({name:"surface_dim",palette:t=>t.neutralPalette,tone:t=>t.isDark?6:new k(87,87,80,75).get(t.contrastLevel),isBackground:!0})}surfaceBright(){return h.fromPalette({name:"surface_bright",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(24,24,29,34).get(t.contrastLevel):98,isBackground:!0})}surfaceContainerLowest(){return h.fromPalette({name:"surface_container_lowest",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(4,4,2,0).get(t.contrastLevel):100,isBackground:!0})}surfaceContainerLow(){return h.fromPalette({name:"surface_container_low",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(10,10,11,12).get(t.contrastLevel):new k(96,96,96,95).get(t.contrastLevel),isBackground:!0})}surfaceContainer(){return h.fromPalette({name:"surface_container",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(12,12,16,20).get(t.contrastLevel):new k(94,94,92,90).get(t.contrastLevel),isBackground:!0})}surfaceContainerHigh(){return h.fromPalette({name:"surface_container_high",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(17,17,21,25).get(t.contrastLevel):new k(92,92,88,85).get(t.contrastLevel),isBackground:!0})}surfaceContainerHighest(){return h.fromPalette({name:"surface_container_highest",palette:t=>t.neutralPalette,tone:t=>t.isDark?new k(22,22,26,30).get(t.contrastLevel):new k(90,90,84,80).get(t.contrastLevel),isBackground:!0})}onSurface(){return h.fromPalette({name:"on_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>this.highestSurface(t),contrastCurve:t=>new k(4.5,7,11,21)})}surfaceVariant(){return h.fromPalette({name:"surface_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:90,isBackground:!0})}onSurfaceVariant(){return h.fromPalette({name:"on_surface_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?80:30,background:t=>this.highestSurface(t),contrastCurve:t=>new k(3,4.5,7,11)})}inverseSurface(){return h.fromPalette({name:"inverse_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?90:20,isBackground:!0})}inverseOnSurface(){return h.fromPalette({name:"inverse_on_surface",palette:t=>t.neutralPalette,tone:t=>t.isDark?20:95,background:t=>this.inverseSurface(),contrastCurve:t=>new k(4.5,7,11,21)})}outline(){return h.fromPalette({name:"outline",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?60:50,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1.5,3,4.5,7)})}outlineVariant(){return h.fromPalette({name:"outline_variant",palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:80,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5)})}shadow(){return h.fromPalette({name:"shadow",palette:t=>t.neutralPalette,tone:t=>0})}scrim(){return h.fromPalette({name:"scrim",palette:t=>t.neutralPalette,tone:t=>0})}surfaceTint(){return h.fromPalette({name:"surface_tint",palette:t=>t.primaryPalette,tone:t=>t.isDark?80:40,isBackground:!0})}primary(){return h.fromPalette({name:"primary",palette:t=>t.primaryPalette,tone:t=>H(t)?t.isDark?100:0:t.isDark?80:40,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(3,4.5,7,7),toneDeltaPair:t=>new B(this.primaryContainer(),this.primary(),10,"nearer",!1)})}primaryDim(){}onPrimary(){return h.fromPalette({name:"on_primary",palette:t=>t.primaryPalette,tone:t=>H(t)?t.isDark?10:90:t.isDark?20:100,background:t=>this.primary(),contrastCurve:t=>new k(4.5,7,11,21)})}primaryContainer(){return h.fromPalette({name:"primary_container",palette:t=>t.primaryPalette,tone:t=>Ct(t)?t.sourceColorHct.tone:H(t)?t.isDark?85:25:t.isDark?30:90,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.primaryContainer(),this.primary(),10,"nearer",!1)})}onPrimaryContainer(){return h.fromPalette({name:"on_primary_container",palette:t=>t.primaryPalette,tone:t=>Ct(t)?h.foregroundTone(this.primaryContainer().tone(t),4.5):H(t)?t.isDark?0:100:t.isDark?90:30,background:t=>this.primaryContainer(),contrastCurve:t=>new k(3,4.5,7,11)})}inversePrimary(){return h.fromPalette({name:"inverse_primary",palette:t=>t.primaryPalette,tone:t=>t.isDark?40:80,background:t=>this.inverseSurface(),contrastCurve:t=>new k(3,4.5,7,7)})}secondary(){return h.fromPalette({name:"secondary",palette:t=>t.secondaryPalette,tone:t=>t.isDark?80:40,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(3,4.5,7,7),toneDeltaPair:t=>new B(this.secondaryContainer(),this.secondary(),10,"nearer",!1)})}secondaryDim(){}onSecondary(){return h.fromPalette({name:"on_secondary",palette:t=>t.secondaryPalette,tone:t=>H(t)?t.isDark?10:100:t.isDark?20:100,background:t=>this.secondary(),contrastCurve:t=>new k(4.5,7,11,21)})}secondaryContainer(){return h.fromPalette({name:"secondary_container",palette:t=>t.secondaryPalette,tone:t=>{let e=t.isDark?30:90;return H(t)?t.isDark?30:85:Ct(t)?rr(t.secondaryPalette.hue,t.secondaryPalette.chroma,e,!t.isDark):e},isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.secondaryContainer(),this.secondary(),10,"nearer",!1)})}onSecondaryContainer(){return h.fromPalette({name:"on_secondary_container",palette:t=>t.secondaryPalette,tone:t=>H(t)?t.isDark?90:10:Ct(t)?h.foregroundTone(this.secondaryContainer().tone(t),4.5):t.isDark?90:30,background:t=>this.secondaryContainer(),contrastCurve:t=>new k(3,4.5,7,11)})}tertiary(){return h.fromPalette({name:"tertiary",palette:t=>t.tertiaryPalette,tone:t=>H(t)?t.isDark?90:25:t.isDark?80:40,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(3,4.5,7,7),toneDeltaPair:t=>new B(this.tertiaryContainer(),this.tertiary(),10,"nearer",!1)})}tertiaryDim(){}onTertiary(){return h.fromPalette({name:"on_tertiary",palette:t=>t.tertiaryPalette,tone:t=>H(t)?t.isDark?10:90:t.isDark?20:100,background:t=>this.tertiary(),contrastCurve:t=>new k(4.5,7,11,21)})}tertiaryContainer(){return h.fromPalette({name:"tertiary_container",palette:t=>t.tertiaryPalette,tone:t=>{if(H(t))return t.isDark?60:49;if(!Ct(t))return t.isDark?30:90;let e=t.tertiaryPalette.getHct(t.sourceColorHct.tone);return ht.fixIfDisliked(e).tone},isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.tertiaryContainer(),this.tertiary(),10,"nearer",!1)})}onTertiaryContainer(){return h.fromPalette({name:"on_tertiary_container",palette:t=>t.tertiaryPalette,tone:t=>H(t)?t.isDark?0:100:Ct(t)?h.foregroundTone(this.tertiaryContainer().tone(t),4.5):t.isDark?90:30,background:t=>this.tertiaryContainer(),contrastCurve:t=>new k(3,4.5,7,11)})}error(){return h.fromPalette({name:"error",palette:t=>t.errorPalette,tone:t=>t.isDark?80:40,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(3,4.5,7,7),toneDeltaPair:t=>new B(this.errorContainer(),this.error(),10,"nearer",!1)})}errorDim(){}onError(){return h.fromPalette({name:"on_error",palette:t=>t.errorPalette,tone:t=>t.isDark?20:100,background:t=>this.error(),contrastCurve:t=>new k(4.5,7,11,21)})}errorContainer(){return h.fromPalette({name:"error_container",palette:t=>t.errorPalette,tone:t=>t.isDark?30:90,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.errorContainer(),this.error(),10,"nearer",!1)})}onErrorContainer(){return h.fromPalette({name:"on_error_container",palette:t=>t.errorPalette,tone:t=>H(t)?t.isDark?90:10:t.isDark?90:30,background:t=>this.errorContainer(),contrastCurve:t=>new k(3,4.5,7,11)})}primaryFixed(){return h.fromPalette({name:"primary_fixed",palette:t=>t.primaryPalette,tone:t=>H(t)?40:90,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.primaryFixed(),this.primaryFixedDim(),10,"lighter",!0)})}primaryFixedDim(){return h.fromPalette({name:"primary_fixed_dim",palette:t=>t.primaryPalette,tone:t=>H(t)?30:80,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.primaryFixed(),this.primaryFixedDim(),10,"lighter",!0)})}onPrimaryFixed(){return h.fromPalette({name:"on_primary_fixed",palette:t=>t.primaryPalette,tone:t=>H(t)?100:10,background:t=>this.primaryFixedDim(),secondBackground:t=>this.primaryFixed(),contrastCurve:t=>new k(4.5,7,11,21)})}onPrimaryFixedVariant(){return h.fromPalette({name:"on_primary_fixed_variant",palette:t=>t.primaryPalette,tone:t=>H(t)?90:30,background:t=>this.primaryFixedDim(),secondBackground:t=>this.primaryFixed(),contrastCurve:t=>new k(3,4.5,7,11)})}secondaryFixed(){return h.fromPalette({name:"secondary_fixed",palette:t=>t.secondaryPalette,tone:t=>H(t)?80:90,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.secondaryFixed(),this.secondaryFixedDim(),10,"lighter",!0)})}secondaryFixedDim(){return h.fromPalette({name:"secondary_fixed_dim",palette:t=>t.secondaryPalette,tone:t=>H(t)?70:80,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.secondaryFixed(),this.secondaryFixedDim(),10,"lighter",!0)})}onSecondaryFixed(){return h.fromPalette({name:"on_secondary_fixed",palette:t=>t.secondaryPalette,tone:t=>10,background:t=>this.secondaryFixedDim(),secondBackground:t=>this.secondaryFixed(),contrastCurve:t=>new k(4.5,7,11,21)})}onSecondaryFixedVariant(){return h.fromPalette({name:"on_secondary_fixed_variant",palette:t=>t.secondaryPalette,tone:t=>H(t)?25:30,background:t=>this.secondaryFixedDim(),secondBackground:t=>this.secondaryFixed(),contrastCurve:t=>new k(3,4.5,7,11)})}tertiaryFixed(){return h.fromPalette({name:"tertiary_fixed",palette:t=>t.tertiaryPalette,tone:t=>H(t)?40:90,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.tertiaryFixed(),this.tertiaryFixedDim(),10,"lighter",!0)})}tertiaryFixedDim(){return h.fromPalette({name:"tertiary_fixed_dim",palette:t=>t.tertiaryPalette,tone:t=>H(t)?30:80,isBackground:!0,background:t=>this.highestSurface(t),contrastCurve:t=>new k(1,1,3,4.5),toneDeltaPair:t=>new B(this.tertiaryFixed(),this.tertiaryFixedDim(),10,"lighter",!0)})}onTertiaryFixed(){return h.fromPalette({name:"on_tertiary_fixed",palette:t=>t.tertiaryPalette,tone:t=>H(t)?100:10,background:t=>this.tertiaryFixedDim(),secondBackground:t=>this.tertiaryFixed(),contrastCurve:t=>new k(4.5,7,11,21)})}onTertiaryFixedVariant(){return h.fromPalette({name:"on_tertiary_fixed_variant",palette:t=>t.tertiaryPalette,tone:t=>H(t)?90:30,background:t=>this.tertiaryFixedDim(),secondBackground:t=>this.tertiaryFixed(),contrastCurve:t=>new k(3,4.5,7,11)})}highestSurface(t){return t.isDark?this.surfaceBright():this.surfaceDim()}};function R(r,t=0,e=100,n=1){let a=Ie(r.hue,r.chroma*n,100,!0);return _(t,e,a)}function st(r,t=0,e=100){let n=Ie(r.hue,r.chroma,0,!1);return _(t,e,n)}function Ie(r,t,e,n){let a=e,o=A.from(r,t,a);for(;o.chroma<t&&!(e<0||e>100);){e+=n?-1:1;let i=A.from(r,t,e);o.chroma<i.chroma&&(o=i,a=e)}return a}function v(r){return r===1.5?new k(1.5,1.5,3,5.5):r===3?new k(3,3,4.5,7):r===4.5?new k(4.5,4.5,7,11):r===6?new k(6,6,7,11):r===7?new k(7,7,11,21):r===9?new k(9,9,11,21):r===11?new k(11,11,21,21):r===21?new k(21,21,21,21):new k(r,r,7,21)}var Nt=class extends Vt{surface(){let t=h.fromPalette({name:"surface",palette:e=>e.neutralPalette,tone:e=>(super.surface().tone(e),e.platform==="phone"?e.isDark?4:A.isYellow(e.neutralPalette.hue)?99:e.variant===c.VIBRANT?97:98:0),isBackground:!0});return E(super.surface(),"2025",t)}surfaceDim(){let t=h.fromPalette({name:"surface_dim",palette:e=>e.neutralPalette,tone:e=>e.isDark?4:A.isYellow(e.neutralPalette.hue)?90:e.variant===c.VIBRANT?85:87,isBackground:!0,chromaMultiplier:e=>{if(!e.isDark){if(e.variant===c.NEUTRAL)return 2.5;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?2.7:1.75;if(e.variant===c.VIBRANT)return 1.36}return 1}});return E(super.surfaceDim(),"2025",t)}surfaceBright(){let t=h.fromPalette({name:"surface_bright",palette:e=>e.neutralPalette,tone:e=>e.isDark?18:A.isYellow(e.neutralPalette.hue)?99:e.variant===c.VIBRANT?97:98,isBackground:!0,chromaMultiplier:e=>{if(e.isDark){if(e.variant===c.NEUTRAL)return 2.5;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?2.7:1.75;if(e.variant===c.VIBRANT)return 1.36}return 1}});return E(super.surfaceBright(),"2025",t)}surfaceContainerLowest(){let t=h.fromPalette({name:"surface_container_lowest",palette:e=>e.neutralPalette,tone:e=>e.isDark?0:100,isBackground:!0});return E(super.surfaceContainerLowest(),"2025",t)}surfaceContainerLow(){let t=h.fromPalette({name:"surface_container_low",palette:e=>e.neutralPalette,tone:e=>e.platform==="phone"?e.isDark?6:A.isYellow(e.neutralPalette.hue)?98:e.variant===c.VIBRANT?95:96:15,isBackground:!0,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 1.3;if(e.variant===c.TONAL_SPOT)return 1.25;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?1.3:1.15;if(e.variant===c.VIBRANT)return 1.08}return 1}});return E(super.surfaceContainerLow(),"2025",t)}surfaceContainer(){let t=h.fromPalette({name:"surface_container",palette:e=>e.neutralPalette,tone:e=>e.platform==="phone"?e.isDark?9:A.isYellow(e.neutralPalette.hue)?96:e.variant===c.VIBRANT?92:94:20,isBackground:!0,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 1.6;if(e.variant===c.TONAL_SPOT)return 1.4;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?1.6:1.3;if(e.variant===c.VIBRANT)return 1.15}return 1}});return E(super.surfaceContainer(),"2025",t)}surfaceContainerHigh(){let t=h.fromPalette({name:"surface_container_high",palette:e=>e.neutralPalette,tone:e=>e.platform==="phone"?e.isDark?12:A.isYellow(e.neutralPalette.hue)?94:e.variant===c.VIBRANT?90:92:25,isBackground:!0,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 1.9;if(e.variant===c.TONAL_SPOT)return 1.5;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?1.95:1.45;if(e.variant===c.VIBRANT)return 1.22}return 1}});return E(super.surfaceContainerHigh(),"2025",t)}surfaceContainerHighest(){let t=h.fromPalette({name:"surface_container_highest",palette:e=>e.neutralPalette,tone:e=>e.isDark?15:A.isYellow(e.neutralPalette.hue)?92:e.variant===c.VIBRANT?88:90,isBackground:!0,chromaMultiplier:e=>e.variant===c.NEUTRAL?2.2:e.variant===c.TONAL_SPOT?1.7:e.variant===c.EXPRESSIVE?A.isYellow(e.neutralPalette.hue)?2.3:1.6:e.variant===c.VIBRANT?1.29:1});return E(super.surfaceContainerHighest(),"2025",t)}onSurface(){let t=h.fromPalette({name:"on_surface",palette:e=>e.neutralPalette,tone:e=>e.variant===c.VIBRANT?R(e.neutralPalette,0,100,1.1):h.getInitialToneFromBackground(n=>n.platform==="phone"?this.highestSurface(n):this.surfaceContainerHigh())(e),chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 2.2;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?e.isDark?3:2.3:1.6}return 1},background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.isDark&&e.platform==="phone"?v(11):v(9)});return E(super.onSurface(),"2025",t)}onSurfaceVariant(){let t=h.fromPalette({name:"on_surface_variant",palette:e=>e.neutralPalette,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 2.2;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?e.isDark?3:2.3:1.6}return 1},background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?e.isDark?v(6):v(4.5):v(7)});return E(super.onSurfaceVariant(),"2025",t)}outline(){let t=h.fromPalette({name:"outline",palette:e=>e.neutralPalette,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 2.2;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?e.isDark?3:2.3:1.6}return 1},background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(3):v(4.5)});return E(super.outline(),"2025",t)}outlineVariant(){let t=h.fromPalette({name:"outline_variant",palette:e=>e.neutralPalette,chromaMultiplier:e=>{if(e.platform==="phone"){if(e.variant===c.NEUTRAL)return 2.2;if(e.variant===c.TONAL_SPOT)return 1.7;if(e.variant===c.EXPRESSIVE)return A.isYellow(e.neutralPalette.hue)?e.isDark?3:2.3:1.6}return 1},background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(1.5):v(3)});return E(super.outlineVariant(),"2025",t)}inverseSurface(){let t=h.fromPalette({name:"inverse_surface",palette:e=>e.neutralPalette,tone:e=>e.isDark?98:4,isBackground:!0});return E(super.inverseSurface(),"2025",t)}inverseOnSurface(){let t=h.fromPalette({name:"inverse_on_surface",palette:e=>e.neutralPalette,background:e=>this.inverseSurface(),contrastCurve:e=>v(7)});return E(super.inverseOnSurface(),"2025",t)}primary(){let t=h.fromPalette({name:"primary",palette:e=>e.primaryPalette,tone:e=>e.variant===c.NEUTRAL?e.platform==="phone"?e.isDark?80:40:90:e.variant===c.TONAL_SPOT?e.platform==="phone"?e.isDark?80:R(e.primaryPalette):R(e.primaryPalette,0,90):e.variant===c.EXPRESSIVE?e.platform==="phone"?R(e.primaryPalette,0,A.isYellow(e.primaryPalette.hue)?25:A.isCyan(e.primaryPalette.hue)?88:98):R(e.primaryPalette):e.platform==="phone"?R(e.primaryPalette,0,A.isCyan(e.primaryPalette.hue)?88:98):R(e.primaryPalette),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(4.5):v(7),toneDeltaPair:e=>e.platform==="phone"?new B(this.primaryContainer(),this.primary(),5,"relative_lighter",!0,"farther"):void 0});return E(super.primary(),"2025",t)}primaryDim(){return h.fromPalette({name:"primary_dim",palette:t=>t.primaryPalette,tone:t=>t.variant===c.NEUTRAL?85:t.variant===c.TONAL_SPOT?R(t.primaryPalette,0,90):R(t.primaryPalette),isBackground:!0,background:t=>this.surfaceContainerHigh(),contrastCurve:t=>v(4.5),toneDeltaPair:t=>new B(this.primaryDim(),this.primary(),5,"darker",!0,"farther")})}onPrimary(){let t=h.fromPalette({name:"on_primary",palette:e=>e.primaryPalette,background:e=>e.platform==="phone"?this.primary():this.primaryDim(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onPrimary(),"2025",t)}primaryContainer(){let t=h.fromPalette({name:"primary_container",palette:e=>e.primaryPalette,tone:e=>e.platform==="watch"?30:e.variant===c.NEUTRAL?e.isDark?30:90:e.variant===c.TONAL_SPOT?e.isDark?st(e.primaryPalette,35,93):R(e.primaryPalette,0,90):e.variant===c.EXPRESSIVE?e.isDark?R(e.primaryPalette,30,93):R(e.primaryPalette,78,A.isCyan(e.primaryPalette.hue)?88:90):e.isDark?st(e.primaryPalette,66,93):R(e.primaryPalette,66,A.isCyan(e.primaryPalette.hue)?88:93),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,toneDeltaPair:e=>e.platform==="phone"?void 0:new B(this.primaryContainer(),this.primaryDim(),10,"darker",!0,"farther"),contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.primaryContainer(),"2025",t)}onPrimaryContainer(){let t=h.fromPalette({name:"on_primary_container",palette:e=>e.primaryPalette,background:e=>this.primaryContainer(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onPrimaryContainer(),"2025",t)}primaryFixed(){let t=h.fromPalette({name:"primary_fixed",palette:e=>e.primaryPalette,tone:e=>{let n=Object.assign({},e,{isDark:!1,contrastLevel:0});return this.primaryContainer().getTone(n)},isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.primaryFixed(),"2025",t)}primaryFixedDim(){let t=h.fromPalette({name:"primary_fixed_dim",palette:e=>e.primaryPalette,tone:e=>this.primaryFixed().getTone(e),isBackground:!0,toneDeltaPair:e=>new B(this.primaryFixedDim(),this.primaryFixed(),5,"darker",!0,"exact")});return E(super.primaryFixedDim(),"2025",t)}onPrimaryFixed(){let t=h.fromPalette({name:"on_primary_fixed",palette:e=>e.primaryPalette,background:e=>this.primaryFixedDim(),contrastCurve:e=>v(7)});return E(super.onPrimaryFixed(),"2025",t)}onPrimaryFixedVariant(){let t=h.fromPalette({name:"on_primary_fixed_variant",palette:e=>e.primaryPalette,background:e=>this.primaryFixedDim(),contrastCurve:e=>v(4.5)});return E(super.onPrimaryFixedVariant(),"2025",t)}inversePrimary(){let t=h.fromPalette({name:"inverse_primary",palette:e=>e.primaryPalette,tone:e=>R(e.primaryPalette),background:e=>this.inverseSurface(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.inversePrimary(),"2025",t)}secondary(){let t=h.fromPalette({name:"secondary",palette:e=>e.secondaryPalette,tone:e=>e.platform==="watch"?e.variant===c.NEUTRAL?90:R(e.secondaryPalette,0,90):e.variant===c.NEUTRAL?e.isDark?st(e.secondaryPalette,0,98):R(e.secondaryPalette):e.variant===c.VIBRANT?R(e.secondaryPalette,0,e.isDark?90:98):e.isDark?80:R(e.secondaryPalette),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(4.5):v(7),toneDeltaPair:e=>e.platform==="phone"?new B(this.secondaryContainer(),this.secondary(),5,"relative_lighter",!0,"farther"):void 0});return E(super.secondary(),"2025",t)}secondaryDim(){return h.fromPalette({name:"secondary_dim",palette:t=>t.secondaryPalette,tone:t=>t.variant===c.NEUTRAL?85:R(t.secondaryPalette,0,90),isBackground:!0,background:t=>this.surfaceContainerHigh(),contrastCurve:t=>v(4.5),toneDeltaPair:t=>new B(this.secondaryDim(),this.secondary(),5,"darker",!0,"farther")})}onSecondary(){let t=h.fromPalette({name:"on_secondary",palette:e=>e.secondaryPalette,background:e=>e.platform==="phone"?this.secondary():this.secondaryDim(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onSecondary(),"2025",t)}secondaryContainer(){let t=h.fromPalette({name:"secondary_container",palette:e=>e.secondaryPalette,tone:e=>e.platform==="watch"?30:e.variant===c.VIBRANT?e.isDark?st(e.secondaryPalette,30,40):R(e.secondaryPalette,84,90):e.variant===c.EXPRESSIVE?e.isDark?15:R(e.secondaryPalette,90,95):e.isDark?25:90,isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,toneDeltaPair:e=>e.platform==="watch"?new B(this.secondaryContainer(),this.secondaryDim(),10,"darker",!0,"farther"):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.secondaryContainer(),"2025",t)}onSecondaryContainer(){let t=h.fromPalette({name:"on_secondary_container",palette:e=>e.secondaryPalette,background:e=>this.secondaryContainer(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onSecondaryContainer(),"2025",t)}secondaryFixed(){let t=h.fromPalette({name:"secondary_fixed",palette:e=>e.secondaryPalette,tone:e=>{let n=Object.assign({},e,{isDark:!1,contrastLevel:0});return this.secondaryContainer().getTone(n)},isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.secondaryFixed(),"2025",t)}secondaryFixedDim(){let t=h.fromPalette({name:"secondary_fixed_dim",palette:e=>e.secondaryPalette,tone:e=>this.secondaryFixed().getTone(e),isBackground:!0,toneDeltaPair:e=>new B(this.secondaryFixedDim(),this.secondaryFixed(),5,"darker",!0,"exact")});return E(super.secondaryFixedDim(),"2025",t)}onSecondaryFixed(){let t=h.fromPalette({name:"on_secondary_fixed",palette:e=>e.secondaryPalette,background:e=>this.secondaryFixedDim(),contrastCurve:e=>v(7)});return E(super.onSecondaryFixed(),"2025",t)}onSecondaryFixedVariant(){let t=h.fromPalette({name:"on_secondary_fixed_variant",palette:e=>e.secondaryPalette,background:e=>this.secondaryFixedDim(),contrastCurve:e=>v(4.5)});return E(super.onSecondaryFixedVariant(),"2025",t)}tertiary(){let t=h.fromPalette({name:"tertiary",palette:e=>e.tertiaryPalette,tone:e=>e.platform==="watch"?e.variant===c.TONAL_SPOT?R(e.tertiaryPalette,0,90):R(e.tertiaryPalette):e.variant===c.EXPRESSIVE||e.variant===c.VIBRANT?R(e.tertiaryPalette,0,A.isCyan(e.tertiaryPalette.hue)?88:e.isDark?98:100):e.isDark?R(e.tertiaryPalette,0,98):R(e.tertiaryPalette),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(4.5):v(7),toneDeltaPair:e=>e.platform==="phone"?new B(this.tertiaryContainer(),this.tertiary(),5,"relative_lighter",!0,"farther"):void 0});return E(super.tertiary(),"2025",t)}tertiaryDim(){return h.fromPalette({name:"tertiary_dim",palette:t=>t.tertiaryPalette,tone:t=>t.variant===c.TONAL_SPOT?R(t.tertiaryPalette,0,90):R(t.tertiaryPalette),isBackground:!0,background:t=>this.surfaceContainerHigh(),contrastCurve:t=>v(4.5),toneDeltaPair:t=>new B(this.tertiaryDim(),this.tertiary(),5,"darker",!0,"farther")})}onTertiary(){let t=h.fromPalette({name:"on_tertiary",palette:e=>e.tertiaryPalette,background:e=>e.platform==="phone"?this.tertiary():this.tertiaryDim(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onTertiary(),"2025",t)}tertiaryContainer(){let t=h.fromPalette({name:"tertiary_container",palette:e=>e.tertiaryPalette,tone:e=>e.platform==="watch"?e.variant===c.TONAL_SPOT?R(e.tertiaryPalette,0,90):R(e.tertiaryPalette):e.variant===c.NEUTRAL?e.isDark?R(e.tertiaryPalette,0,93):R(e.tertiaryPalette,0,96):e.variant===c.TONAL_SPOT?R(e.tertiaryPalette,0,e.isDark?93:100):e.variant===c.EXPRESSIVE?R(e.tertiaryPalette,75,A.isCyan(e.tertiaryPalette.hue)?88:e.isDark?93:100):e.isDark?R(e.tertiaryPalette,0,93):R(e.tertiaryPalette,72,100),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,toneDeltaPair:e=>e.platform==="watch"?new B(this.tertiaryContainer(),this.tertiaryDim(),10,"darker",!0,"farther"):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.tertiaryContainer(),"2025",t)}onTertiaryContainer(){let t=h.fromPalette({name:"on_tertiary_container",palette:e=>e.tertiaryPalette,background:e=>this.tertiaryContainer(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onTertiaryContainer(),"2025",t)}tertiaryFixed(){let t=h.fromPalette({name:"tertiary_fixed",palette:e=>e.tertiaryPalette,tone:e=>{let n=Object.assign({},e,{isDark:!1,contrastLevel:0});return this.tertiaryContainer().getTone(n)},isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.tertiaryFixed(),"2025",t)}tertiaryFixedDim(){let t=h.fromPalette({name:"tertiary_fixed_dim",palette:e=>e.tertiaryPalette,tone:e=>this.tertiaryFixed().getTone(e),isBackground:!0,toneDeltaPair:e=>new B(this.tertiaryFixedDim(),this.tertiaryFixed(),5,"darker",!0,"exact")});return E(super.tertiaryFixedDim(),"2025",t)}onTertiaryFixed(){let t=h.fromPalette({name:"on_tertiary_fixed",palette:e=>e.tertiaryPalette,background:e=>this.tertiaryFixedDim(),contrastCurve:e=>v(7)});return E(super.onTertiaryFixed(),"2025",t)}onTertiaryFixedVariant(){let t=h.fromPalette({name:"on_tertiary_fixed_variant",palette:e=>e.tertiaryPalette,background:e=>this.tertiaryFixedDim(),contrastCurve:e=>v(4.5)});return E(super.onTertiaryFixedVariant(),"2025",t)}error(){let t=h.fromPalette({name:"error",palette:e=>e.errorPalette,tone:e=>e.platform==="phone"?e.isDark?st(e.errorPalette,0,98):R(e.errorPalette):st(e.errorPalette),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):this.surfaceContainerHigh(),contrastCurve:e=>e.platform==="phone"?v(4.5):v(7),toneDeltaPair:e=>e.platform==="phone"?new B(this.errorContainer(),this.error(),5,"relative_lighter",!0,"farther"):void 0});return E(super.error(),"2025",t)}errorDim(){return h.fromPalette({name:"error_dim",palette:t=>t.errorPalette,tone:t=>st(t.errorPalette),isBackground:!0,background:t=>this.surfaceContainerHigh(),contrastCurve:t=>v(4.5),toneDeltaPair:t=>new B(this.errorDim(),this.error(),5,"darker",!0,"farther")})}onError(){let t=h.fromPalette({name:"on_error",palette:e=>e.errorPalette,background:e=>e.platform==="phone"?this.error():this.errorDim(),contrastCurve:e=>e.platform==="phone"?v(6):v(7)});return E(super.onError(),"2025",t)}errorContainer(){let t=h.fromPalette({name:"error_container",palette:e=>e.errorPalette,tone:e=>e.platform==="watch"?30:e.isDark?st(e.errorPalette,30,93):R(e.errorPalette,0,90),isBackground:!0,background:e=>e.platform==="phone"?this.highestSurface(e):void 0,toneDeltaPair:e=>e.platform==="watch"?new B(this.errorContainer(),this.errorDim(),10,"darker",!0,"farther"):void 0,contrastCurve:e=>e.platform==="phone"&&e.contrastLevel>0?v(1.5):void 0});return E(super.errorContainer(),"2025",t)}onErrorContainer(){let t=h.fromPalette({name:"on_error_container",palette:e=>e.errorPalette,background:e=>this.errorContainer(),contrastCurve:e=>e.platform==="phone"?v(4.5):v(7)});return E(super.onErrorContainer(),"2025",t)}surfaceVariant(){let t=Object.assign(this.surfaceContainerHighest().clone(),{name:"surface_variant"});return E(super.surfaceVariant(),"2025",t)}surfaceTint(){let t=Object.assign(this.primary().clone(),{name:"surface_tint"});return E(super.surfaceTint(),"2025",t)}background(){let t=Object.assign(this.surface().clone(),{name:"background"});return E(super.background(),"2025",t)}onBackground(){let t=Object.assign(this.onSurface().clone(),{name:"on_background",tone:e=>e.platform==="watch"?100:this.onSurface().getTone(e)});return E(super.onBackground(),"2025",t)}};var f=class r{constructor(){this.allColors=[this.background(),this.onBackground(),this.surface(),this.surfaceDim(),this.surfaceBright(),this.surfaceContainerLowest(),this.surfaceContainerLow(),this.surfaceContainer(),this.surfaceContainerHigh(),this.surfaceContainerHighest(),this.onSurface(),this.onSurfaceVariant(),this.outline(),this.outlineVariant(),this.inverseSurface(),this.inverseOnSurface(),this.primary(),this.primaryDim(),this.onPrimary(),this.primaryContainer(),this.onPrimaryContainer(),this.primaryFixed(),this.primaryFixedDim(),this.onPrimaryFixed(),this.onPrimaryFixedVariant(),this.inversePrimary(),this.secondary(),this.secondaryDim(),this.onSecondary(),this.secondaryContainer(),this.onSecondaryContainer(),this.secondaryFixed(),this.secondaryFixedDim(),this.onSecondaryFixed(),this.onSecondaryFixedVariant(),this.tertiary(),this.tertiaryDim(),this.onTertiary(),this.tertiaryContainer(),this.onTertiaryContainer(),this.tertiaryFixed(),this.tertiaryFixedDim(),this.onTertiaryFixed(),this.onTertiaryFixedVariant(),this.error(),this.errorDim(),this.onError(),this.errorContainer(),this.onErrorContainer()].filter(t=>t!==void 0)}highestSurface(t){return r.colorSpec.highestSurface(t)}primaryPaletteKeyColor(){return r.colorSpec.primaryPaletteKeyColor()}secondaryPaletteKeyColor(){return r.colorSpec.secondaryPaletteKeyColor()}tertiaryPaletteKeyColor(){return r.colorSpec.tertiaryPaletteKeyColor()}neutralPaletteKeyColor(){return r.colorSpec.neutralPaletteKeyColor()}neutralVariantPaletteKeyColor(){return r.colorSpec.neutralVariantPaletteKeyColor()}errorPaletteKeyColor(){return r.colorSpec.errorPaletteKeyColor()}background(){return r.colorSpec.background()}onBackground(){return r.colorSpec.onBackground()}surface(){return r.colorSpec.surface()}surfaceDim(){return r.colorSpec.surfaceDim()}surfaceBright(){return r.colorSpec.surfaceBright()}surfaceContainerLowest(){return r.colorSpec.surfaceContainerLowest()}surfaceContainerLow(){return r.colorSpec.surfaceContainerLow()}surfaceContainer(){return r.colorSpec.surfaceContainer()}surfaceContainerHigh(){return r.colorSpec.surfaceContainerHigh()}surfaceContainerHighest(){return r.colorSpec.surfaceContainerHighest()}onSurface(){return r.colorSpec.onSurface()}surfaceVariant(){return r.colorSpec.surfaceVariant()}onSurfaceVariant(){return r.colorSpec.onSurfaceVariant()}outline(){return r.colorSpec.outline()}outlineVariant(){return r.colorSpec.outlineVariant()}inverseSurface(){return r.colorSpec.inverseSurface()}inverseOnSurface(){return r.colorSpec.inverseOnSurface()}shadow(){return r.colorSpec.shadow()}scrim(){return r.colorSpec.scrim()}surfaceTint(){return r.colorSpec.surfaceTint()}primary(){return r.colorSpec.primary()}primaryDim(){return r.colorSpec.primaryDim()}onPrimary(){return r.colorSpec.onPrimary()}primaryContainer(){return r.colorSpec.primaryContainer()}onPrimaryContainer(){return r.colorSpec.onPrimaryContainer()}inversePrimary(){return r.colorSpec.inversePrimary()}primaryFixed(){return r.colorSpec.primaryFixed()}primaryFixedDim(){return r.colorSpec.primaryFixedDim()}onPrimaryFixed(){return r.colorSpec.onPrimaryFixed()}onPrimaryFixedVariant(){return r.colorSpec.onPrimaryFixedVariant()}secondary(){return r.colorSpec.secondary()}secondaryDim(){return r.colorSpec.secondaryDim()}onSecondary(){return r.colorSpec.onSecondary()}secondaryContainer(){return r.colorSpec.secondaryContainer()}onSecondaryContainer(){return r.colorSpec.onSecondaryContainer()}secondaryFixed(){return r.colorSpec.secondaryFixed()}secondaryFixedDim(){return r.colorSpec.secondaryFixedDim()}onSecondaryFixed(){return r.colorSpec.onSecondaryFixed()}onSecondaryFixedVariant(){return r.colorSpec.onSecondaryFixedVariant()}tertiary(){return r.colorSpec.tertiary()}tertiaryDim(){return r.colorSpec.tertiaryDim()}onTertiary(){return r.colorSpec.onTertiary()}tertiaryContainer(){return r.colorSpec.tertiaryContainer()}onTertiaryContainer(){return r.colorSpec.onTertiaryContainer()}tertiaryFixed(){return r.colorSpec.tertiaryFixed()}tertiaryFixedDim(){return r.colorSpec.tertiaryFixedDim()}onTertiaryFixed(){return r.colorSpec.onTertiaryFixed()}onTertiaryFixedVariant(){return r.colorSpec.onTertiaryFixedVariant()}error(){return r.colorSpec.error()}errorDim(){return r.colorSpec.errorDim()}onError(){return r.colorSpec.onError()}errorContainer(){return r.colorSpec.errorContainer()}onErrorContainer(){return r.colorSpec.onErrorContainer()}static highestSurface(t){return r.colorSpec.highestSurface(t)}};f.contentAccentToneDelta=15;f.colorSpec=new Nt;f.primaryPaletteKeyColor=f.colorSpec.primaryPaletteKeyColor();f.secondaryPaletteKeyColor=f.colorSpec.secondaryPaletteKeyColor();f.tertiaryPaletteKeyColor=f.colorSpec.tertiaryPaletteKeyColor();f.neutralPaletteKeyColor=f.colorSpec.neutralPaletteKeyColor();f.neutralVariantPaletteKeyColor=f.colorSpec.neutralVariantPaletteKeyColor();f.background=f.colorSpec.background();f.onBackground=f.colorSpec.onBackground();f.surface=f.colorSpec.surface();f.surfaceDim=f.colorSpec.surfaceDim();f.surfaceBright=f.colorSpec.surfaceBright();f.surfaceContainerLowest=f.colorSpec.surfaceContainerLowest();f.surfaceContainerLow=f.colorSpec.surfaceContainerLow();f.surfaceContainer=f.colorSpec.surfaceContainer();f.surfaceContainerHigh=f.colorSpec.surfaceContainerHigh();f.surfaceContainerHighest=f.colorSpec.surfaceContainerHighest();f.onSurface=f.colorSpec.onSurface();f.surfaceVariant=f.colorSpec.surfaceVariant();f.onSurfaceVariant=f.colorSpec.onSurfaceVariant();f.inverseSurface=f.colorSpec.inverseSurface();f.inverseOnSurface=f.colorSpec.inverseOnSurface();f.outline=f.colorSpec.outline();f.outlineVariant=f.colorSpec.outlineVariant();f.shadow=f.colorSpec.shadow();f.scrim=f.colorSpec.scrim();f.surfaceTint=f.colorSpec.surfaceTint();f.primary=f.colorSpec.primary();f.onPrimary=f.colorSpec.onPrimary();f.primaryContainer=f.colorSpec.primaryContainer();f.onPrimaryContainer=f.colorSpec.onPrimaryContainer();f.inversePrimary=f.colorSpec.inversePrimary();f.secondary=f.colorSpec.secondary();f.onSecondary=f.colorSpec.onSecondary();f.secondaryContainer=f.colorSpec.secondaryContainer();f.onSecondaryContainer=f.colorSpec.onSecondaryContainer();f.tertiary=f.colorSpec.tertiary();f.onTertiary=f.colorSpec.onTertiary();f.tertiaryContainer=f.colorSpec.tertiaryContainer();f.onTertiaryContainer=f.colorSpec.onTertiaryContainer();f.error=f.colorSpec.error();f.onError=f.colorSpec.onError();f.errorContainer=f.colorSpec.errorContainer();f.onErrorContainer=f.colorSpec.onErrorContainer();f.primaryFixed=f.colorSpec.primaryFixed();f.primaryFixedDim=f.colorSpec.primaryFixedDim();f.onPrimaryFixed=f.colorSpec.onPrimaryFixed();f.onPrimaryFixedVariant=f.colorSpec.onPrimaryFixedVariant();f.secondaryFixed=f.colorSpec.secondaryFixed();f.secondaryFixedDim=f.colorSpec.secondaryFixedDim();f.onSecondaryFixed=f.colorSpec.onSecondaryFixed();f.onSecondaryFixedVariant=f.colorSpec.onSecondaryFixedVariant();f.tertiaryFixed=f.colorSpec.tertiaryFixed();f.tertiaryFixedDim=f.colorSpec.tertiaryFixedDim();f.onTertiaryFixed=f.colorSpec.onTertiaryFixed();f.onTertiaryFixedVariant=f.colorSpec.onTertiaryFixedVariant();var b=class r{static maybeFallbackSpecVersion(t,e){switch(e){case c.EXPRESSIVE:case c.VIBRANT:case c.TONAL_SPOT:case c.NEUTRAL:return t;default:return"2021"}}constructor(t){this.sourceColorArgb=t.sourceColorHct.toInt(),this.variant=t.variant,this.contrastLevel=t.contrastLevel,this.isDark=t.isDark,this.platform=t.platform??"phone",this.specVersion=r.maybeFallbackSpecVersion(t.specVersion??"2021",this.variant),this.sourceColorHct=t.sourceColorHct,this.primaryPalette=t.primaryPalette??St(this.specVersion).getPrimaryPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.secondaryPalette=t.secondaryPalette??St(this.specVersion).getSecondaryPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.tertiaryPalette=t.tertiaryPalette??St(this.specVersion).getTertiaryPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.neutralPalette=t.neutralPalette??St(this.specVersion).getNeutralPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.neutralVariantPalette=t.neutralVariantPalette??St(this.specVersion).getNeutralVariantPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel),this.errorPalette=t.errorPalette??St(this.specVersion).getErrorPalette(this.variant,t.sourceColorHct,this.isDark,this.platform,this.contrastLevel)??x.fromHueAndChroma(25,84),this.colors=new f}toString(){return`Scheme: variant=${c[this.variant]}, mode=${this.isDark?"dark":"light"}, platform=${this.platform}, contrastLevel=${this.contrastLevel.toFixed(1)}, seed=${this.sourceColorHct.toString()}, specVersion=${this.specVersion}`}static getPiecewiseHue(t,e,n){let a=Math.min(e.length-1,n.length),o=t.hue;for(let i=0;i<a;i++)if(o>=e[i]&&o<e[i+1])return z(n[i]);return o}static getRotatedHue(t,e,n){let a=r.getPiecewiseHue(t,e,n);return Math.min(e.length-1,n.length)<=0&&(a=0),z(t.hue+a)}getArgb(t){return t.getArgb(this)}getHct(t){return t.getHct(this)}get primaryPaletteKeyColor(){return this.getArgb(this.colors.primaryPaletteKeyColor())}get secondaryPaletteKeyColor(){return this.getArgb(this.colors.secondaryPaletteKeyColor())}get tertiaryPaletteKeyColor(){return this.getArgb(this.colors.tertiaryPaletteKeyColor())}get neutralPaletteKeyColor(){return this.getArgb(this.colors.neutralPaletteKeyColor())}get neutralVariantPaletteKeyColor(){return this.getArgb(this.colors.neutralVariantPaletteKeyColor())}get errorPaletteKeyColor(){return this.getArgb(this.colors.errorPaletteKeyColor())}get background(){return this.getArgb(this.colors.background())}get onBackground(){return this.getArgb(this.colors.onBackground())}get surface(){return this.getArgb(this.colors.surface())}get surfaceDim(){return this.getArgb(this.colors.surfaceDim())}get surfaceBright(){return this.getArgb(this.colors.surfaceBright())}get surfaceContainerLowest(){return this.getArgb(this.colors.surfaceContainerLowest())}get surfaceContainerLow(){return this.getArgb(this.colors.surfaceContainerLow())}get surfaceContainer(){return this.getArgb(this.colors.surfaceContainer())}get surfaceContainerHigh(){return this.getArgb(this.colors.surfaceContainerHigh())}get surfaceContainerHighest(){return this.getArgb(this.colors.surfaceContainerHighest())}get onSurface(){return this.getArgb(this.colors.onSurface())}get surfaceVariant(){return this.getArgb(this.colors.surfaceVariant())}get onSurfaceVariant(){return this.getArgb(this.colors.onSurfaceVariant())}get inverseSurface(){return this.getArgb(this.colors.inverseSurface())}get inverseOnSurface(){return this.getArgb(this.colors.inverseOnSurface())}get outline(){return this.getArgb(this.colors.outline())}get outlineVariant(){return this.getArgb(this.colors.outlineVariant())}get shadow(){return this.getArgb(this.colors.shadow())}get scrim(){return this.getArgb(this.colors.scrim())}get surfaceTint(){return this.getArgb(this.colors.surfaceTint())}get primary(){return this.getArgb(this.colors.primary())}get primaryDim(){let t=this.colors.primaryDim();if(t===void 0)throw new Error("`primaryDim` color is undefined prior to 2025 spec.");return this.getArgb(t)}get onPrimary(){return this.getArgb(this.colors.onPrimary())}get primaryContainer(){return this.getArgb(this.colors.primaryContainer())}get onPrimaryContainer(){return this.getArgb(this.colors.onPrimaryContainer())}get primaryFixed(){return this.getArgb(this.colors.primaryFixed())}get primaryFixedDim(){return this.getArgb(this.colors.primaryFixedDim())}get onPrimaryFixed(){return this.getArgb(this.colors.onPrimaryFixed())}get onPrimaryFixedVariant(){return this.getArgb(this.colors.onPrimaryFixedVariant())}get inversePrimary(){return this.getArgb(this.colors.inversePrimary())}get secondary(){return this.getArgb(this.colors.secondary())}get secondaryDim(){let t=this.colors.secondaryDim();if(t===void 0)throw new Error("`secondaryDim` color is undefined prior to 2025 spec.");return this.getArgb(t)}get onSecondary(){return this.getArgb(this.colors.onSecondary())}get secondaryContainer(){return this.getArgb(this.colors.secondaryContainer())}get onSecondaryContainer(){return this.getArgb(this.colors.onSecondaryContainer())}get secondaryFixed(){return this.getArgb(this.colors.secondaryFixed())}get secondaryFixedDim(){return this.getArgb(this.colors.secondaryFixedDim())}get onSecondaryFixed(){return this.getArgb(this.colors.onSecondaryFixed())}get onSecondaryFixedVariant(){return this.getArgb(this.colors.onSecondaryFixedVariant())}get tertiary(){return this.getArgb(this.colors.tertiary())}get tertiaryDim(){let t=this.colors.tertiaryDim();if(t===void 0)throw new Error("`tertiaryDim` color is undefined prior to 2025 spec.");return this.getArgb(t)}get onTertiary(){return this.getArgb(this.colors.onTertiary())}get tertiaryContainer(){return this.getArgb(this.colors.tertiaryContainer())}get onTertiaryContainer(){return this.getArgb(this.colors.onTertiaryContainer())}get tertiaryFixed(){return this.getArgb(this.colors.tertiaryFixed())}get tertiaryFixedDim(){return this.getArgb(this.colors.tertiaryFixedDim())}get onTertiaryFixed(){return this.getArgb(this.colors.onTertiaryFixed())}get onTertiaryFixedVariant(){return this.getArgb(this.colors.onTertiaryFixedVariant())}get error(){return this.getArgb(this.colors.error())}get errorDim(){let t=this.colors.errorDim();if(t===void 0)throw new Error("`errorDim` color is undefined prior to 2025 spec.");return this.getArgb(t)}get onError(){return this.getArgb(this.colors.onError())}get errorContainer(){return this.getArgb(this.colors.errorContainer())}get onErrorContainer(){return this.getArgb(this.colors.onErrorContainer())}};b.DEFAULT_SPEC_VERSION="2021";b.DEFAULT_PLATFORM="phone";var Ht=class{getPrimaryPalette(t,e,n,a,o){switch(t){case c.CONTENT:case c.FIDELITY:return x.fromHueAndChroma(e.hue,e.chroma);case c.FRUIT_SALAD:return x.fromHueAndChroma(z(e.hue-50),48);case c.MONOCHROME:return x.fromHueAndChroma(e.hue,0);case c.NEUTRAL:return x.fromHueAndChroma(e.hue,12);case c.RAINBOW:return x.fromHueAndChroma(e.hue,48);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,36);case c.EXPRESSIVE:return x.fromHueAndChroma(z(e.hue+240),40);case c.VIBRANT:return x.fromHueAndChroma(e.hue,200);default:throw new Error(`Unsupported variant: ${t}`)}}getSecondaryPalette(t,e,n,a,o){switch(t){case c.CONTENT:case c.FIDELITY:return x.fromHueAndChroma(e.hue,Math.max(e.chroma-32,e.chroma*.5));case c.FRUIT_SALAD:return x.fromHueAndChroma(z(e.hue-50),36);case c.MONOCHROME:return x.fromHueAndChroma(e.hue,0);case c.NEUTRAL:return x.fromHueAndChroma(e.hue,8);case c.RAINBOW:return x.fromHueAndChroma(e.hue,16);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,16);case c.EXPRESSIVE:return x.fromHueAndChroma(b.getRotatedHue(e,[0,21,51,121,151,191,271,321,360],[45,95,45,20,45,90,45,45,45]),24);case c.VIBRANT:return x.fromHueAndChroma(b.getRotatedHue(e,[0,41,61,101,131,181,251,301,360],[18,15,10,12,15,18,15,12,12]),24);default:throw new Error(`Unsupported variant: ${t}`)}}getTertiaryPalette(t,e,n,a,o){switch(t){case c.CONTENT:return x.fromHct(ht.fixIfDisliked(new Dt(e).analogous(3,6)[2]));case c.FIDELITY:return x.fromHct(ht.fixIfDisliked(new Dt(e).complement));case c.FRUIT_SALAD:return x.fromHueAndChroma(e.hue,36);case c.MONOCHROME:return x.fromHueAndChroma(e.hue,0);case c.NEUTRAL:return x.fromHueAndChroma(e.hue,16);case c.RAINBOW:case c.TONAL_SPOT:return x.fromHueAndChroma(z(e.hue+60),24);case c.EXPRESSIVE:return x.fromHueAndChroma(b.getRotatedHue(e,[0,21,51,121,151,191,271,321,360],[120,120,20,45,20,15,20,120,120]),32);case c.VIBRANT:return x.fromHueAndChroma(b.getRotatedHue(e,[0,41,61,101,131,181,251,301,360],[35,30,20,25,30,35,30,25,25]),32);default:throw new Error(`Unsupported variant: ${t}`)}}getNeutralPalette(t,e,n,a,o){switch(t){case c.CONTENT:case c.FIDELITY:return x.fromHueAndChroma(e.hue,e.chroma/8);case c.FRUIT_SALAD:return x.fromHueAndChroma(e.hue,10);case c.MONOCHROME:return x.fromHueAndChroma(e.hue,0);case c.NEUTRAL:return x.fromHueAndChroma(e.hue,2);case c.RAINBOW:return x.fromHueAndChroma(e.hue,0);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,6);case c.EXPRESSIVE:return x.fromHueAndChroma(z(e.hue+15),8);case c.VIBRANT:return x.fromHueAndChroma(e.hue,10);default:throw new Error(`Unsupported variant: ${t}`)}}getNeutralVariantPalette(t,e,n,a,o){switch(t){case c.CONTENT:return x.fromHueAndChroma(e.hue,e.chroma/8+4);case c.FIDELITY:return x.fromHueAndChroma(e.hue,e.chroma/8+4);case c.FRUIT_SALAD:return x.fromHueAndChroma(e.hue,16);case c.MONOCHROME:return x.fromHueAndChroma(e.hue,0);case c.NEUTRAL:return x.fromHueAndChroma(e.hue,2);case c.RAINBOW:return x.fromHueAndChroma(e.hue,0);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,8);case c.EXPRESSIVE:return x.fromHueAndChroma(z(e.hue+15),12);case c.VIBRANT:return x.fromHueAndChroma(e.hue,12);default:throw new Error(`Unsupported variant: ${t}`)}}getErrorPalette(t,e,n,a,o){}},he=class r extends Ht{getPrimaryPalette(t,e,n,a,o){switch(t){case c.NEUTRAL:return x.fromHueAndChroma(e.hue,a==="phone"?A.isBlue(e.hue)?12:8:A.isBlue(e.hue)?16:12);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,a==="phone"&&n?26:32);case c.EXPRESSIVE:return x.fromHueAndChroma(e.hue,a==="phone"?n?36:48:40);case c.VIBRANT:return x.fromHueAndChroma(e.hue,a==="phone"?74:56);default:return super.getPrimaryPalette(t,e,n,a,o)}}getSecondaryPalette(t,e,n,a,o){switch(t){case c.NEUTRAL:return x.fromHueAndChroma(e.hue,a==="phone"?A.isBlue(e.hue)?6:4:A.isBlue(e.hue)?10:6);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,16);case c.EXPRESSIVE:return x.fromHueAndChroma(b.getRotatedHue(e,[0,105,140,204,253,278,300,333,360],[-160,155,-100,96,-96,-156,-165,-160]),a==="phone"&&n?16:24);case c.VIBRANT:return x.fromHueAndChroma(b.getRotatedHue(e,[0,38,105,140,333,360],[-14,10,-14,10,-14]),a==="phone"?56:36);default:return super.getSecondaryPalette(t,e,n,a,o)}}getTertiaryPalette(t,e,n,a,o){switch(t){case c.NEUTRAL:return x.fromHueAndChroma(b.getRotatedHue(e,[0,38,105,161,204,278,333,360],[-32,26,10,-39,24,-15,-32]),a==="phone"?20:36);case c.TONAL_SPOT:return x.fromHueAndChroma(b.getRotatedHue(e,[0,20,71,161,333,360],[-40,48,-32,40,-32]),a==="phone"?28:32);case c.EXPRESSIVE:return x.fromHueAndChroma(b.getRotatedHue(e,[0,105,140,204,253,278,300,333,360],[-165,160,-105,101,-101,-160,-170,-165]),48);case c.VIBRANT:return x.fromHueAndChroma(b.getRotatedHue(e,[0,38,71,105,140,161,253,333,360],[-72,35,24,-24,62,50,62,-72]),56);default:return super.getTertiaryPalette(t,e,n,a,o)}}static getExpressiveNeutralHue(t){return b.getRotatedHue(t,[0,71,124,253,278,300,360],[10,0,10,0,10,0])}static getExpressiveNeutralChroma(t,e,n){let a=r.getExpressiveNeutralHue(t);return n==="phone"?e?A.isYellow(a)?6:14:18:12}static getVibrantNeutralHue(t){return b.getRotatedHue(t,[0,38,105,140,333,360],[-14,10,-14,10,-14])}static getVibrantNeutralChroma(t,e){let n=r.getVibrantNeutralHue(t);return e==="phone"||A.isBlue(n)?28:20}getNeutralPalette(t,e,n,a,o){switch(t){case c.NEUTRAL:return x.fromHueAndChroma(e.hue,a==="phone"?1.4:6);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,a==="phone"?5:10);case c.EXPRESSIVE:return x.fromHueAndChroma(r.getExpressiveNeutralHue(e),r.getExpressiveNeutralChroma(e,n,a));case c.VIBRANT:return x.fromHueAndChroma(r.getVibrantNeutralHue(e),r.getVibrantNeutralChroma(e,a));default:return super.getNeutralPalette(t,e,n,a,o)}}getNeutralVariantPalette(t,e,n,a,o){switch(t){case c.NEUTRAL:return x.fromHueAndChroma(e.hue,(a==="phone"?1.4:6)*2.2);case c.TONAL_SPOT:return x.fromHueAndChroma(e.hue,(a==="phone"?5:10)*1.7);case c.EXPRESSIVE:let i=r.getExpressiveNeutralHue(e),s=r.getExpressiveNeutralChroma(e,n,a);return x.fromHueAndChroma(i,s*(i>=105&&i<125?1.6:2.3));case c.VIBRANT:let l=r.getVibrantNeutralHue(e),p=r.getVibrantNeutralChroma(e,a);return x.fromHueAndChroma(l,p*1.29);default:return super.getNeutralVariantPalette(t,e,n,a,o)}}getErrorPalette(t,e,n,a,o){let i=b.getPiecewiseHue(e,[0,3,13,23,33,43,153,273,360],[12,22,32,12,22,32,22,12]);switch(t){case c.NEUTRAL:return x.fromHueAndChroma(i,a==="phone"?50:40);case c.TONAL_SPOT:return x.fromHueAndChroma(i,a==="phone"?60:48);case c.EXPRESSIVE:return x.fromHueAndChroma(i,a==="phone"?64:48);case c.VIBRANT:return x.fromHueAndChroma(i,a==="phone"?80:60);default:return super.getErrorPalette(t,e,n,a,o)}}},nr=new Ht,ar=new he;function St(r){return r==="2025"?ar:nr}var Ut=class{fromInt(t){return Ot(t)}toInt(t){return we(t[0],t[1],t[2])}distance(t,e){let n=t[0]-e[0],a=t[1]-e[1],o=t[2]-e[2];return n*n+a*a+o*o}};var or=10,ir=3,_t=class{static quantize(t,e,n){let a=new Map,o=new Array,i=new Array,s=new Ut,l=0;for(let S=0;S<t.length;S++){let D=t[S],M=a.get(D);M===void 0?(l++,o.push(s.fromInt(D)),i.push(D),a.set(D,1)):a.set(D,M+1)}let p=new Array;for(let S=0;S<l;S++){let D=i[S],M=a.get(D);M!==void 0&&(p[S]=M)}let u=Math.min(n,l);e.length>0&&(u=Math.min(u,e.length));let d=new Array;for(let S=0;S<e.length;S++)d.push(s.fromInt(e[S]));let P=u-d.length;if(e.length===0&&P>0)for(let S=0;S<P;S++){let D=Math.random()*100,M=Math.random()*201+-100,O=Math.random()*201+-100;d.push(new Array(D,M,O))}let y=new Array;for(let S=0;S<l;S++)y.push(Math.floor(Math.random()*u));let g=new Array;for(let S=0;S<u;S++){g.push(new Array);for(let D=0;D<u;D++)g[S].push(0)}let m=new Array;for(let S=0;S<u;S++){m.push(new Array);for(let D=0;D<u;D++)m[S].push(new me)}let C=new Array;for(let S=0;S<u;S++)C.push(0);for(let S=0;S<or;S++){for(let T=0;T<u;T++){for(let I=T+1;I<u;I++){let N=s.distance(d[T],d[I]);m[I][T].distance=N,m[I][T].index=T,m[T][I].distance=N,m[T][I].index=I}m[T].sort();for(let I=0;I<u;I++)g[T][I]=m[T][I].index}let D=0;for(let T=0;T<l;T++){let I=o[T],N=y[T],L=d[N],Y=s.distance(I,L),j=Y,nt=-1;for(let $=0;$<u;$++){if(m[N][$].distance>=4*Y)continue;let ct=s.distance(I,d[$]);ct<j&&(j=ct,nt=$)}nt!==-1&&Math.abs(Math.sqrt(j)-Math.sqrt(Y))>ir&&(D++,y[T]=nt)}if(D===0&&S!==0)break;let M=new Array(u).fill(0),O=new Array(u).fill(0),V=new Array(u).fill(0);for(let T=0;T<u;T++)C[T]=0;for(let T=0;T<l;T++){let I=y[T],N=o[T],L=p[T];C[I]+=L,M[I]+=N[0]*L,O[I]+=N[1]*L,V[I]+=N[2]*L}for(let T=0;T<u;T++){let I=C[T];if(I===0){d[T]=[0,0,0];continue}let N=M[T]/I,L=O[T]/I,Y=V[T]/I;d[T]=[N,L,Y]}}let w=new Map;for(let S=0;S<u;S++){let D=C[S];if(D===0)continue;let M=s.toInt(d[S]);w.has(M)||w.set(M,D)}return w}},me=class{constructor(){this.distance=-1,this.index=-1}};var zt=class{static quantize(t){let e=new Map;for(let n=0;n<t.length;n++){let a=t[n];De(a)<255||e.set(a,(e.get(a)??0)+1)}return e}};var $t=5,et=33,wt=35937,q={RED:"red",GREEN:"green",BLUE:"blue"},Gt=class{constructor(t=[],e=[],n=[],a=[],o=[],i=[]){this.weights=t,this.momentsR=e,this.momentsG=n,this.momentsB=a,this.moments=o,this.cubes=i}quantize(t,e){this.constructHistogram(t),this.computeMoments();let n=this.createBoxes(e);return this.createResult(n.resultCount)}constructHistogram(t){this.weights=Array.from({length:wt}).fill(0),this.momentsR=Array.from({length:wt}).fill(0),this.momentsG=Array.from({length:wt}).fill(0),this.momentsB=Array.from({length:wt}).fill(0),this.moments=Array.from({length:wt}).fill(0);let e=zt.quantize(t);for(let[n,a]of e.entries()){let o=dt(n),i=gt(n),s=yt(n),l=8-$t,p=(o>>l)+1,u=(i>>l)+1,d=(s>>l)+1,P=this.getIndex(p,u,d);this.weights[P]=(this.weights[P]??0)+a,this.momentsR[P]+=a*o,this.momentsG[P]+=a*i,this.momentsB[P]+=a*s,this.moments[P]+=a*(o*o+i*i+s*s)}}computeMoments(){for(let t=1;t<et;t++){let e=Array.from({length:et}).fill(0),n=Array.from({length:et}).fill(0),a=Array.from({length:et}).fill(0),o=Array.from({length:et}).fill(0),i=Array.from({length:et}).fill(0);for(let s=1;s<et;s++){let l=0,p=0,u=0,d=0,P=0;for(let y=1;y<et;y++){let g=this.getIndex(t,s,y);l+=this.weights[g],p+=this.momentsR[g],u+=this.momentsG[g],d+=this.momentsB[g],P+=this.moments[g],e[y]+=l,n[y]+=p,a[y]+=u,o[y]+=d,i[y]+=P;let m=this.getIndex(t-1,s,y);this.weights[g]=this.weights[m]+e[y],this.momentsR[g]=this.momentsR[m]+n[y],this.momentsG[g]=this.momentsG[m]+a[y],this.momentsB[g]=this.momentsB[m]+o[y],this.moments[g]=this.moments[m]+i[y]}}}}createBoxes(t){this.cubes=Array.from({length:t}).fill(0).map(()=>new fe);let e=Array.from({length:t}).fill(0);this.cubes[0].r0=0,this.cubes[0].g0=0,this.cubes[0].b0=0,this.cubes[0].r1=et-1,this.cubes[0].g1=et-1,this.cubes[0].b1=et-1;let n=t,a=0;for(let o=1;o<t;o++){this.cut(this.cubes[a],this.cubes[o])?(e[a]=this.cubes[a].vol>1?this.variance(this.cubes[a]):0,e[o]=this.cubes[o].vol>1?this.variance(this.cubes[o]):0):(e[a]=0,o--),a=0;let i=e[0];for(let s=1;s<=o;s++)e[s]>i&&(i=e[s],a=s);if(i<=0){n=o+1;break}}return new pe(t,n)}createResult(t){let e=[];for(let n=0;n<t;++n){let a=this.cubes[n],o=this.volume(a,this.weights);if(o>0){let i=Math.round(this.volume(a,this.momentsR)/o),s=Math.round(this.volume(a,this.momentsG)/o),l=Math.round(this.volume(a,this.momentsB)/o),p=255<<24|(i&255)<<16|(s&255)<<8|l&255;e.push(p)}}return e}variance(t){let e=this.volume(t,this.momentsR),n=this.volume(t,this.momentsG),a=this.volume(t,this.momentsB),o=this.moments[this.getIndex(t.r1,t.g1,t.b1)]-this.moments[this.getIndex(t.r1,t.g1,t.b0)]-this.moments[this.getIndex(t.r1,t.g0,t.b1)]+this.moments[this.getIndex(t.r1,t.g0,t.b0)]-this.moments[this.getIndex(t.r0,t.g1,t.b1)]+this.moments[this.getIndex(t.r0,t.g1,t.b0)]+this.moments[this.getIndex(t.r0,t.g0,t.b1)]-this.moments[this.getIndex(t.r0,t.g0,t.b0)],i=e*e+n*n+a*a,s=this.volume(t,this.weights);return o-i/s}cut(t,e){let n=this.volume(t,this.momentsR),a=this.volume(t,this.momentsG),o=this.volume(t,this.momentsB),i=this.volume(t,this.weights),s=this.maximize(t,q.RED,t.r0+1,t.r1,n,a,o,i),l=this.maximize(t,q.GREEN,t.g0+1,t.g1,n,a,o,i),p=this.maximize(t,q.BLUE,t.b0+1,t.b1,n,a,o,i),u,d=s.maximum,P=l.maximum,y=p.maximum;if(d>=P&&d>=y){if(s.cutLocation<0)return!1;u=q.RED}else P>=d&&P>=y?u=q.GREEN:u=q.BLUE;switch(e.r1=t.r1,e.g1=t.g1,e.b1=t.b1,u){case q.RED:t.r1=s.cutLocation,e.r0=t.r1,e.g0=t.g0,e.b0=t.b0;break;case q.GREEN:t.g1=l.cutLocation,e.r0=t.r0,e.g0=t.g1,e.b0=t.b0;break;case q.BLUE:t.b1=p.cutLocation,e.r0=t.r0,e.g0=t.g0,e.b0=t.b1;break;default:throw new Error("unexpected direction "+u)}return t.vol=(t.r1-t.r0)*(t.g1-t.g0)*(t.b1-t.b0),e.vol=(e.r1-e.r0)*(e.g1-e.g0)*(e.b1-e.b0),!0}maximize(t,e,n,a,o,i,s,l){let p=this.bottom(t,e,this.momentsR),u=this.bottom(t,e,this.momentsG),d=this.bottom(t,e,this.momentsB),P=this.bottom(t,e,this.weights),y=0,g=-1,m=0,C=0,w=0,S=0;for(let D=n;D<a;D++){if(m=p+this.top(t,e,D,this.momentsR),C=u+this.top(t,e,D,this.momentsG),w=d+this.top(t,e,D,this.momentsB),S=P+this.top(t,e,D,this.weights),S===0)continue;let M=(m*m+C*C+w*w)*1,O=S*1,V=M/O;m=o-m,C=i-C,w=s-w,S=l-S,S!==0&&(M=(m*m+C*C+w*w)*1,O=S*1,V+=M/O,V>y&&(y=V,g=D))}return new de(g,y)}volume(t,e){return e[this.getIndex(t.r1,t.g1,t.b1)]-e[this.getIndex(t.r1,t.g1,t.b0)]-e[this.getIndex(t.r1,t.g0,t.b1)]+e[this.getIndex(t.r1,t.g0,t.b0)]-e[this.getIndex(t.r0,t.g1,t.b1)]+e[this.getIndex(t.r0,t.g1,t.b0)]+e[this.getIndex(t.r0,t.g0,t.b1)]-e[this.getIndex(t.r0,t.g0,t.b0)]}bottom(t,e,n){switch(e){case q.RED:return-n[this.getIndex(t.r0,t.g1,t.b1)]+n[this.getIndex(t.r0,t.g1,t.b0)]+n[this.getIndex(t.r0,t.g0,t.b1)]-n[this.getIndex(t.r0,t.g0,t.b0)];case q.GREEN:return-n[this.getIndex(t.r1,t.g0,t.b1)]+n[this.getIndex(t.r1,t.g0,t.b0)]+n[this.getIndex(t.r0,t.g0,t.b1)]-n[this.getIndex(t.r0,t.g0,t.b0)];case q.BLUE:return-n[this.getIndex(t.r1,t.g1,t.b0)]+n[this.getIndex(t.r1,t.g0,t.b0)]+n[this.getIndex(t.r0,t.g1,t.b0)]-n[this.getIndex(t.r0,t.g0,t.b0)];default:throw new Error("unexpected direction $direction")}}top(t,e,n,a){switch(e){case q.RED:return a[this.getIndex(n,t.g1,t.b1)]-a[this.getIndex(n,t.g1,t.b0)]-a[this.getIndex(n,t.g0,t.b1)]+a[this.getIndex(n,t.g0,t.b0)];case q.GREEN:return a[this.getIndex(t.r1,n,t.b1)]-a[this.getIndex(t.r1,n,t.b0)]-a[this.getIndex(t.r0,n,t.b1)]+a[this.getIndex(t.r0,n,t.b0)];case q.BLUE:return a[this.getIndex(t.r1,t.g1,n)]-a[this.getIndex(t.r1,t.g0,n)]-a[this.getIndex(t.r0,t.g1,n)]+a[this.getIndex(t.r0,t.g0,n)];default:throw new Error("unexpected direction $direction")}}getIndex(t,e,n){return(t<<$t*2)+(t<<$t+1)+t+(e<<$t)+e+n}},fe=class{constructor(t=0,e=0,n=0,a=0,o=0,i=0,s=0){this.r0=t,this.r1=e,this.g0=n,this.g1=a,this.b0=o,this.b1=i,this.vol=s}},pe=class{constructor(t,e){this.requestedCount=t,this.resultCount=e}},de=class{constructor(t,e){this.cutLocation=t,this.maximum=e}};var vt=class{static quantize(t,e){let a=new Gt().quantize(t,e);return _t.quantize(t,a,e)}};var Yt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.CONTENT,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Kt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.EXPRESSIVE,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var qt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.FIDELITY,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Xt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.FRUIT_SALAD,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var jt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.MONOCHROME,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Wt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.NEUTRAL,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Jt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.RAINBOW,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Zt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.TONAL_SPOT,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var Qt=class extends b{constructor(t,e,n,a=b.DEFAULT_SPEC_VERSION,o=b.DEFAULT_PLATFORM){super({sourceColorHct:t,variant:c.VIBRANT,contrastLevel:n,isDark:e,platform:o,specVersion:a})}};var sr={desired:4,fallbackColorARGB:4282549748,filter:!0};function cr(r,t){return r.score>t.score?-1:r.score<t.score?1:0}var rt=class r{constructor(){}static score(t,e){let{desired:n,fallbackColorARGB:a,filter:o}={...sr,...e},i=[],s=new Array(360).fill(0),l=0;for(let[y,g]of t.entries()){let m=A.fromInt(y);i.push(m);let C=Math.floor(m.hue);s[C]+=g,l+=g}let p=new Array(360).fill(0);for(let y=0;y<360;y++){let g=s[y]/l;for(let m=y-14;m<y+16;m++){let C=ft(m);p[C]+=g}}let u=new Array;for(let y of i){let g=ft(Math.round(y.hue)),m=p[g];if(o&&(y.chroma<r.CUTOFF_CHROMA||m<=r.CUTOFF_EXCITED_PROPORTION))continue;let C=m*100*r.WEIGHT_PROPORTION,w=y.chroma<r.TARGET_CHROMA?r.WEIGHT_CHROMA_BELOW:r.WEIGHT_CHROMA_ABOVE,S=(y.chroma-r.TARGET_CHROMA)*w,D=C+S;u.push({hct:y,score:D})}u.sort(cr);let d=[];for(let y=90;y>=15;y--){d.length=0;for(let{hct:g}of u)if(d.find(C=>Bt(g.hue,C.hue)<y)||d.push(g),d.length>=n)break;if(d.length>=n)break}let P=[];d.length===0&&P.push(a);for(let y of d)P.push(y.toInt());return P}};rt.TARGET_CHROMA=48;rt.WEIGHT_PROPORTION=.7;rt.WEIGHT_CHROMA_ABOVE=.3;rt.WEIGHT_CHROMA_BELOW=.1;rt.CUTOFF_CHROMA=5;rt.CUTOFF_EXCITED_PROPORTION=.01;function J(r){let t=dt(r),e=gt(r),n=yt(r),a=[t.toString(16),e.toString(16),n.toString(16)];for(let[o,i]of a.entries())i.length===1&&(a[o]="0"+i);return"#"+a.join("")}function Re(r){r=r.replace("#","");let t=r.length===3,e=r.length===6,n=r.length===8;if(!t&&!e&&!n)throw new Error("unexpected hex "+r);let a=0,o=0,i=0;return t?(a=ot(r.slice(0,1).repeat(2)),o=ot(r.slice(1,2).repeat(2)),i=ot(r.slice(2,3).repeat(2))):e?(a=ot(r.slice(0,2)),o=ot(r.slice(2,4)),i=ot(r.slice(4,6))):n&&(a=ot(r.slice(2,4)),o=ot(r.slice(4,6)),i=ot(r.slice(6,8))),(255<<24|(a&255)<<16|(o&255)<<8|i&255)>>>0}function ot(r){return parseInt(r,16)}var Et=["primary","on-primary","primary-container","on-primary-container","primary-fixed","primary-fixed-dim","on-primary-fixed","on-primary-fixed-variant","secondary","on-secondary","secondary-container","on-secondary-container","secondary-fixed","secondary-fixed-dim","on-secondary-fixed","on-secondary-fixed-variant","tertiary","on-tertiary","tertiary-container","on-tertiary-container","tertiary-fixed","tertiary-fixed-dim","on-tertiary-fixed","on-tertiary-fixed-variant","error","on-error","error-container","on-error-container","surface","surface-dim","surface-bright","surface-container-lowest","surface-container-low","surface-container","surface-container-high","surface-container-highest","on-surface","on-surface-variant","outline","outline-variant","inverse-surface","inverse-on-surface","inverse-primary","scrim","shadow"],F=new f,ur={primary:F.primary(),"on-primary":F.onPrimary(),"primary-container":F.primaryContainer(),"on-primary-container":F.onPrimaryContainer(),"primary-fixed":F.primaryFixed(),"primary-fixed-dim":F.primaryFixedDim(),"on-primary-fixed":F.onPrimaryFixed(),"on-primary-fixed-variant":F.onPrimaryFixedVariant(),secondary:F.secondary(),"on-secondary":F.onSecondary(),"secondary-container":F.secondaryContainer(),"on-secondary-container":F.onSecondaryContainer(),"secondary-fixed":F.secondaryFixed(),"secondary-fixed-dim":F.secondaryFixedDim(),"on-secondary-fixed":F.onSecondaryFixed(),"on-secondary-fixed-variant":F.onSecondaryFixedVariant(),tertiary:F.tertiary(),"on-tertiary":F.onTertiary(),"tertiary-container":F.tertiaryContainer(),"on-tertiary-container":F.onTertiaryContainer(),"tertiary-fixed":F.tertiaryFixed(),"tertiary-fixed-dim":F.tertiaryFixedDim(),"on-tertiary-fixed":F.onTertiaryFixed(),"on-tertiary-fixed-variant":F.onTertiaryFixedVariant(),error:F.error(),"on-error":F.onError(),"error-container":F.errorContainer(),"on-error-container":F.onErrorContainer(),surface:F.surface(),"surface-dim":F.surfaceDim(),"surface-bright":F.surfaceBright(),"surface-container-lowest":F.surfaceContainerLowest(),"surface-container-low":F.surfaceContainerLow(),"surface-container":F.surfaceContainer(),"surface-container-high":F.surfaceContainerHigh(),"surface-container-highest":F.surfaceContainerHighest(),"on-surface":F.onSurface(),"on-surface-variant":F.onSurfaceVariant(),outline:F.outline(),"outline-variant":F.outlineVariant(),"inverse-surface":F.inverseSurface(),"inverse-on-surface":F.inverseOnSurface(),"inverse-primary":F.inversePrimary(),scrim:F.scrim(),shadow:F.shadow()},lr=["tonal-spot","neutral","vibrant","expressive","fidelity","content","monochrome","rainbow","fruit-salad"],hr={standard:0,medium:.5,high:1},mr=["2021","2025"],Oe="2025",fr=["phone","watch"],pr=["tonal-spot","neutral","vibrant","expressive"];function mt(r){if(typeof r=="number")return r>>>0;if(!/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(r.trim()))throw new Error(`Invalid color "${r}": expected a hex color.`);return Re(r.trim())}function Ve(r="standard"){let t=typeof r=="number"?r:hr[r];if(t===void 0||Number.isNaN(t))throw new Error(`Invalid contrast level "${r}".`);return Math.min(1,Math.max(-1,t))}var dr={"tonal-spot":Zt,neutral:Wt,vibrant:Qt,expressive:Kt,fidelity:qt,content:Yt,monochrome:jt,rainbow:Jt,"fruit-salad":Xt};function Ne(r=Oe){if(!mr.includes(r))throw new Error(`Unknown color spec version "${r}".`);return r}function He(r="phone"){if(!fr.includes(r))throw new Error(`Unknown platform "${r}".`);return r}function gr(r,t=Oe){return pr.includes(r)?t:"2021"}function ge(r,t="tonal-spot",e=!1,n="standard",{specVersion:a,platform:o}={}){let i=A.fromInt(mt(r)),s=Ve(n),l=dr[t];if(!l)throw new Error(`Unknown scheme variant "${t}".`);return new l(i,e,s,Ne(a),He(o))}function ye(r){let t={};for(let e of Et)t[e]=J(ur[e].getArgb(r));return t}function yo(r,t){return J(Pt.harmonize(mt(r),mt(t)))}function Ue(r){return typeof r=="object"?x.fromHueAndChroma(r.hue,r.chroma):x.fromInt(mt(r))}function yr(r,t){let e=(n,a)=>n===void 0?a:Ue(n);return new b({sourceColorHct:r.sourceColorHct,variant:r.variant,contrastLevel:r.contrastLevel,isDark:r.isDark,specVersion:r.specVersion,platform:r.platform,primaryPalette:e(t.primary,r.primaryPalette),secondaryPalette:e(t.secondary,r.secondaryPalette),tertiaryPalette:e(t.tertiary,r.tertiaryPalette),neutralPalette:e(t.neutral,r.neutralPalette),neutralVariantPalette:e(t.neutralVariant,r.neutralVariantPalette),errorPalette:e(t.error,r.errorPalette)})}var Be=/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;function _e(r){return[r,`on-${r}`,`${r}-container`,`on-${r}-container`]}function Pr(r,t){let e=mt(t.value);t.harmonize!==!1&&(e=Pt.harmonize(e,r.sourceColorArgb));let n=r.variant===c.MONOCHROME?c.TONAL_SPOT:r.variant,a=new b({sourceColorHct:A.fromInt(e),variant:n,contrastLevel:r.contrastLevel,isDark:r.isDark,specVersion:r.specVersion,platform:r.platform,primaryPalette:x.fromInt(e),secondaryPalette:r.secondaryPalette,tertiaryPalette:r.tertiaryPalette,neutralPalette:r.neutralPalette,neutralVariantPalette:r.neutralVariantPalette,errorPalette:r.errorPalette}),[o,i,s,l]=_e(t.name);return{[o]:J(F.primary().getArgb(a)),[i]:J(F.onPrimary().getArgb(a)),[s]:J(F.primaryContainer().getArgb(a)),[l]:J(F.onPrimaryContainer().getArgb(a))}}var ze=["primary","secondary","tertiary","neutral","neutralVariant","error"];function Cr(r,t){switch(t){case"primary":return r.primaryPalette;case"secondary":return r.secondaryPalette;case"tertiary":return r.tertiaryPalette;case"neutral":return r.neutralPalette;case"neutralVariant":return r.neutralVariantPalette;case"error":return r.errorPalette}}function Sr(r,t){if(typeof r=="number")return r;let{standard:e}=r,n=r.medium??e,a=r.high??n;return t<=0?e:t<=.5?e+(n-e)*(t/.5):n+(a-n)*((t-.5)/.5)}function xr(r){let t=a=>typeof a=="number"?[a]:[a.standard,a.medium??0,a.high??0],e=r.tone,n=e&&typeof e=="object"&&"light"in e?[...t(e.light),...t(e.dark)]:t(r.tone);for(let a of n)if(typeof a!="number"||!(a>=0&&a<=100))throw new Error(`Custom role "${r.name}": tones are numbers from 0 to 100.`)}function Ar(r,t){let e=t.source!==void 0?Ue(t.source):Cr(r,t.palette??"primary"),n=t.tone,a=n&&typeof n=="object"&&"light"in n?r.isDark?n.dark:n.light:t.tone;return J(e.tone(Math.round(Sr(a,r.contrastLevel))))}function xt(r){let{source:t,variant:e="tonal-spot",customColors:n=[]}=r,a=Ve(r.contrast),o=Ne(r.specVersion),i=He(r.platform),s=[];for(let u of n){if(!Be.test(u.name))throw new Error(`Invalid custom color name "${u.name}": use kebab-case.`);for(let d of _e(u.name)){if(Et.includes(d))throw new Error(`Custom color "${u.name}" overrides "${d}".`);if(s.includes(d))throw new Error(`Duplicate custom color role "${d}".`);s.push(d)}}let l=r.customRoles??[];for(let u of l){if(!Be.test(u.name))throw new Error(`Invalid custom role name "${u.name}": use kebab-case.`);if(Et.includes(u.name)||s.includes(u.name))throw new Error(`Custom role "${u.name}" is already a role.`);if(u.palette&&!ze.includes(u.palette))throw new Error(`Unknown palette "${u.palette}" in "${u.name}".`);xr(u),s.push(u.name)}let p=u=>{let d=ge(t,e,u,a,{specVersion:o,platform:i}),P=r.palettes?yr(d,r.palettes):d,y=ye(P),g=Object.entries(r.fidelity??{});if(g.length){let m=ye(ge(t,"fidelity",u,a,{specVersion:o,platform:i})),C=e==="fidelity"?ye(ge(t,"tonal-spot",u,a,{specVersion:o,platform:i})):y;for(let[w,S]of g){if(!Et.includes(w))throw new Error(`Unknown color role "${w}" in fidelity.`);y[w]=S?m[w]:C[w]}}for(let m of n)Object.assign(y,Pr(d,m));for(let m of l)y[m.name]=Ar(P,m);return y};return{source:J(mt(t)),variant:e,contrast:a,specVersion:gr(e,o),platform:i,light:p(!1),dark:p(!0),customRoles:s}}function Tr(r){return[...Et,...r.customRoles]}function Ft(r,t){return Tr(r).map(e=>{let n=r.light[e],a=r.dark[e],o;return t===!0?o=a:t===!1?o=n:o=n===a?n:`light-dark(${n}, ${a})`,[`--md-sys-color-${e}`,o]})}function $e(r){return r===void 0?"light dark":r?"dark":"light"}var Ge="(color: light-dark(#000, #fff))";function Pe(r,t,e){let n=u=>u.map(([d,P])=>`${d}: ${P};`).join(" ");if(e!==void 0)return`${t} { color-scheme: ${$e(e)}; ${n(Ft(r,e))} }`;let a=Ft(r,!1),o=Ft(r,!0),i=Ft(r),s=a.map((u,d)=>d).filter(u=>a[u][1]!==o[u][1]),l=u=>s.map(d=>u[d]),p=`${t} { color-scheme: light dark; ${n(a)} }`;return s.length&&(p+=` @media (prefers-color-scheme: dark) { ${t} { ${n(l(o))} } }`,p+=` @supports ${Ge} { ${t} { ${n(l(i))} } }`),p}function Ye(r,t){return t?`@layer ${t} { ${r} }`:r}function Ke(r,{selector:t=":root",dark:e,layer:n="md.sys.color"}={}){return Ye(Pe(r,t,e),n)}function Po(r,t){let e=new CSSStyleSheet;return e.replaceSync(Ke(r,t)),e}var te=new WeakMap,Ce=new WeakMap;function Co(r,t){let{contrast:e="standard",dark:n,...a}=t;if(r instanceof HTMLElement){let p=e==="auto"?matchMedia("(prefers-contrast: more)").matches?"high":"standard":e,u=xt({...a,contrast:p});return kr(r,u,n),u}let o=r instanceof ShadowRoot?":host":":root",i,s;if(e==="auto"){s=xt({...a,contrast:"standard"});let p=xt({...a,contrast:"high"});i=Ye(`${Pe(s,o,n)} @media (prefers-contrast: more) { ${Pe(p,o,n)} }`,"md.sys.color")}else s=xt({...a,contrast:e}),i=Ke(s,{selector:o,dark:n});let l=te.get(r);return l||(l=new CSSStyleSheet,te.set(r,l)),l.replaceSync(i),r.adoptedStyleSheets=[...r.adoptedStyleSheets.filter(p=>p!==l),l],s}function kr(r,t,e){br(r);let n=e===void 0&&!CSS.supports(Ge.slice(1,-1))?matchMedia("(prefers-color-scheme: dark)").matches:e,a=Ft(t,n);for(let[i,s]of a)r.style.setProperty(i,s);let o=a.map(([i])=>i);e!==void 0&&(r.style.setProperty("color-scheme",$e(e)),o.push("color-scheme")),Ce.set(r,o)}function br(r){if(r instanceof HTMLElement){for(let e of Ce.get(r)??[])r.style.removeProperty(e);Ce.delete(r);return}let t=te.get(r);t&&(r.adoptedStyleSheets=r.adoptedStyleSheets.filter(e=>e!==t),te.delete(r))}function Dr(r){let t=[];for(let n=0;n+3<r.length;n+=4)r[n+3]<255||t.push(pt(r[n],r[n+1],r[n+2]));let e=rt.score(vt.quantize(t,128));return J(e[0])}async function wr(r){let t=new Image;return t.crossOrigin="anonymous",t.src=r,await t.decode(),t}async function vr(r,t){if(r instanceof ImageData)return r.data;let e=typeof r=="string"?await wr(r):r,n,a;if(e instanceof HTMLImageElement?((!e.complete||!e.naturalWidth)&&await e.decode(),n=e.naturalWidth,a=e.naturalHeight):e instanceof HTMLVideoElement?(n=e.videoWidth,a=e.videoHeight):(n=e.width,a=e.height),!n||!a)throw new Error("The image has no pixels.");let o=Math.min(1,t/Math.max(n,a)),i=document.createElement("canvas");i.width=Math.max(1,Math.round(n*o)),i.height=Math.max(1,Math.round(a*o));let s=i.getContext("2d",{willReadFrequently:!0});if(!s)throw new Error("Could not get a 2D canvas context.");return s.drawImage(e,0,0,i.width,i.height),s.getImageData(0,0,i.width,i.height).data}async function Fr(r,{maxSize:t=128}={}){return Dr(await vr(r,t))}async function So(r,t={}){let{maxSize:e,variant:n="content",...a}=t,o=await Fr(r,{maxSize:e});return xt({...a,variant:n,source:o})}function Er(r){let t=A.fromInt(mt(r));return{hue:t.hue,chroma:t.chroma,tone:t.tone}}function Ir({hue:r,chroma:t,tone:e}){return A.from(r,t,e).toInt()}function Mr(r){return J(Ir(r))}function xo(r,t){return Mr({...Er(r),...t})}function Le(r){let t=r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");return/^[a-z]/.test(t)?t:`color-${t}`}function Rr(r,t={}){let e=typeof r=="string"?JSON.parse(r):r,n=e.coreColors??{},a=e.seed??n.primary;if(!a)throw new Error("Theme Builder export has no seed or primary color.");let o={};for(let l of ze){let p=n[l];p&&!(l==="primary"&&p===a)&&(o[l]=p)}let i=Le(e.schemeVariant??e.variant??"tonal-spot");if(!lr.includes(i))throw new Error(`Unknown scheme variant "${i}" in export.`);let s={source:a,variant:i,customColors:(e.extendedColors??[]).map(l=>({name:Le(l.name),value:l.color,harmonize:l.harmonized!==!1}))};return Object.keys(o).length&&(s.palettes=o),e.contrast!==void 0&&(s.contrast=e.contrast),{...s,...t}}function Ao(r,t){return xt(Rr(r,t))}export{Et as COLOR_ROLES,hr as CONTRAST_LEVELS,Oe as DEFAULT_SPEC_VERSION,fr as PLATFORMS,lr as SCHEME_VARIANTS,pr as SPEC_2025_VARIANTS,mr as SPEC_VERSIONS,Co as applyTheme,kr as applyThemeToElement,br as clearTheme,Ve as contrastValue,ge as createScheme,_e as customColorRoles,gr as effectiveSpecVersion,yo as harmonize,Er as hctFromColor,Ir as hctToArgb,Mr as hctToHex,xo as hctWith,ye as rolesFromScheme,Fr as sourceColorFromImage,Dr as sourceColorFromPixels,So as themeFromImage,xt as themeFromSource,Ao as themeFromThemeBuilder,Rr as themeOptionsFromThemeBuilder,Ft as themeProperties,Ke as themeToCss,Po as themeToStyleSheet};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

@material/material-color-utilities/utils/math_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/utils/color_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/hct/viewing_conditions.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/hct/cam16.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/hct/hct_solver.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/hct/hct.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/blend/blend.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/contrast/contrast.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dislike/dislike_analyzer.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/dynamic_color.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/palettes/tonal_palette.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/temperature/temperature_cache.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/contrast_curve.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/tone_delta_pair.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/variant.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/color_spec_2021.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/color_spec_2025.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/material_dynamic_colors.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/dynamiccolor/dynamic_scheme.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/palettes/core_palette.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/quantize/lab_point_provider.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/quantize/quantizer_wsmeans.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/quantize/quantizer_map.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/quantize/quantizer_wu.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/quantize/quantizer_celebi.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_android.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_content.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_expressive.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_fidelity.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_fruit_salad.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_monochrome.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_neutral.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_rainbow.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_tonal_spot.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/scheme/scheme_vibrant.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/score/score.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/utils/string_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/utils/image_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/utils/theme_utils.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@material/material-color-utilities/index.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
