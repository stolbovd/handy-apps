var CopinyNewWidget = {
    initialized: false,
    mobileWrapperId: 'copiny-mobile-wrapper',
    mobileActivatorId: 'copiny-tab-activator',
    mobileSessionHelperId: 'copiny-mwidget-sessionhelper'
};

CopinyNewWidget.gId = function(e) {
    return document.getElementById(e)
};

CopinyNewWidget.hasClass = function(e, c) {
    var eC = e.className;
    return (eC.length > 0 && (eC == c ||
    new RegExp("(^|\\s)" + c + "(\\s|$)").test(eC)));
};

CopinyNewWidget.addClass = function(e, c) {
    if (!this.hasClass(e, c)) {
        e.className += ' '+c;
    }
};

CopinyNewWidget.removeClass = function(e, c) {
    e.className = e.className.replace(new RegExp("(^|\\s+)" + c + "(\\s+|$)"), '');
};

CopinyNewWidget.getCookie = function(cn) {
    var c=document.cookie;
    if (c.length>0) {
        var cs=c.indexOf(cn + "=");
        if (cs!=-1) {
            cs=cs + cn.length+1;
            var ce=c.indexOf(";",cs);
            if (ce==-1) ce=c.length;
            return c.substring(cs,ce);
        }
    }
    return false;
};

//pattern from http://detectmobilebrowsers.com/
CopinyNewWidget.DetectMobile = function(){
    var a = navigator.userAgent || navigator.vendor || window.opera;
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
};

CopinyNewWidget.DetectIOS = function(){
    return (/ip(hone|od)/i.test(navigator.userAgent));
};

CopinyNewWidget.getInitializer = function ()
{
    try{
        return (CopinyNewWidget.DetectMobile()) ?  CopinyNewWidget.mobileWidgetInitializer : CopinyNewWidget.PCWidgetInitializer;
    }catch(e){
        return CopinyNewWidget.PCWidgetInitializer;
    }
};

//Fix для браузеров, которые не знают про matchMedia
CopinyNewWidget.initMatchMedia = function(){
    /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
    window.matchMedia || (window.matchMedia = function() {
        "use strict";
        // For browsers that support matchMedium api such as IE 9 and webkit
        var styleMedia = (window.styleMedia || window.media);
        // For those that don't support matchMedium
        if (!styleMedia) {
            var style       = document.createElement('style'),
                script      = document.getElementsByTagName('script')[0],
                info        = null;
            style.type  = 'text/css';
            style.id    = 'matchmediajs-test';
            script.parentNode.insertBefore(style, script);
            // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
            info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;
            styleMedia = {
                matchMedium: function(media) {
                    var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
                    // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                    if (style.styleSheet) {
                        style.styleSheet.cssText = text;
                    } else {
                        style.textContent = text;
                    }
                    // Test if media query is true or false
                    return info.width === '1px';
                }
            };
        }
        return function(media) {
            return {
                matches: styleMedia.matchMedium(media || 'all'),
                media: media || 'all'
            };
        };
    }());
};

CopinyNewWidget.mobileWidgetInitializer = function (options)
{
    CopinyNewWidget.initOptions(options);
    CopinyNewWidget.mobileAddFont();
    CopinyNewWidget.initJSON();
    CopinyNewWidget.initMatchMedia();
    CopinyNewWidget.mobileAddMeta();
    CopinyNewWidget.mobileAddTab();
    CopinyNewWidget.mobileShowTab();
};

CopinyNewWidget.mobileAddFont = function(){
    var viewPortTag=document.createElement('link');
    viewPortTag.type="text/css";
    viewPortTag.href = "//static." + this.mainhost + '/library/fonts/open-sans/open-sans.css';
    viewPortTag.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
};

CopinyNewWidget.getMainUrl = function(){
    return (!this.testmode ? 'https' : this.proto) + '://' + this.host;
};

CopinyNewWidget.mobileClick = function(elem){
    if (CopinyNewWidget.href) {
        window.location = CopinyNewWidget.href;
        return ;
    }
    //elem - ссылка (dom-объект a)
    //Создать iframe, приготовить слушателя
    var iframeId = CopinyNewWidget.mobileSessionHelperId;
    if(!document.getElementById(iframeId)){
        (function(){
            //обработчик сообщений iframe
            if (window.addEventListener) {
                window.addEventListener("message", CopinyNewWidget.mwMessageListener, false);
            } else if (window.attachEvent) {
                window.attachEvent("onmessage", CopinyNewWidget.mwMessageListener);
            }

            var iframe = document.createElement('iframe');
            iframe.style.display='none';
            iframe.src = CopinyNewWidget.getMainUrl() + '/mwsessionhelper.html?r=' + Math.floor(Math.random()*10000);
            iframe.id = iframeId;
            document.getElementById(CopinyNewWidget.mobileWrapperId).appendChild(iframe);
        })();
    } else {
        CopinyNewWidget.onReadySessionHelper();
    }
    return false;
};

CopinyNewWidget.mwMessageListener = function(event){
    if (event.origin !== CopinyNewWidget.getMainUrl())
        return;

    var data = event.data.split(' ', 2);
    if(data[0] == 'copiny-mwsessionhelper-isReady'){
        CopinyNewWidget.onReadySessionHelper();
    }

    if(data[0] == 'copiny-mwsessionhelper-started' && data[1]){
        CopinyNewWidget.onReadySession(data[1]);
    }
};

//iframe-помошник готов
CopinyNewWidget.onReadySessionHelper = function(){
    var iframe = document.getElementById(CopinyNewWidget.mobileSessionHelperId);
    iframe.contentWindow.postMessage("copiny-mssessionhelper-start " + this.JSON.stringify(this.getAddInfo()), "*");
};

//данные сессии сохранены, готовы к переходу
CopinyNewWidget.onReadySession = function(mwSession){
    var ainfo = this.getAddInfo();
    var url = CopinyNewWidget.getMainUrl() + '/m/?';
    var params = 'commid='+encodeURIComponent(this.community) + '&loc=' + encodeURIComponent(ainfo.loc);
    if (this.integration && this.getCookie(this.integration)) {
        params += '&'+encodeURIComponent(this.integration) + '=' + encodeURIComponent(this.getCookie(this.integration));
    }
    params += '&session='+encodeURIComponent(mwSession);
    window.location = url + params;
};

CopinyNewWidget.mobileShowTab = function(show){
    show = show === false ? 'none' : 'block';
    document.getElementById(CopinyNewWidget.mobileWrapperId).style.display = show;
};

CopinyNewWidget.mobileAddTab = function(){
    var wrap = document.createElement('div');
    wrap.id = CopinyNewWidget.mobileWrapperId;
    wrap.style.display = 'none';
    wrap.style.margin = '0';
    wrap.style.padding = '0';
    wrap.style.border = '0';
    wrap.style.borderRadius = '2px';
    wrap.style.overflow = 'hidden';
    wrap.style.position = 'fixed';
    wrap.style.zIndex = '16000160';
    wrap.style.width = '157px';
    wrap.style.height = '28px';
    if (CopinyNewWidget.tabPositionMobile == 'left' || CopinyNewWidget.tabPositionMobile == 'left-bottom') {
        wrap.style.left = '3px';
    } else {
        wrap.style.right = '3px';
    }
    wrap.style.bottom = '3px';
    wrap.style.backgroundColor = CopinyNewWidget.colorMobile;
    wrap.style.zoom = CopinyNewWidget.mobileGetZoomRatio();
    wrap.style.textAlign = 'center';
    wrap.innerHTML =
        '<span id="' + CopinyNewWidget.mobileActivatorId + '_text" style="-webkit-text-size-adjust: 100%; font-size: ' + (CopinyNewWidget.DetectIOS() ? 28 : 12) + 'px; font-family: \'Open Sans\'; line-height: 28px; color: #FFFFFF"></span>'
        +'<a id="' + CopinyNewWidget.mobileActivatorId + '" onclick="return CopinyNewWidget.mobileClick(this);" class="copiny-activator" style="position: absolute; width:100%; height: 100%; top: 0px; left: 0px;" href="javascript:void(0);"></a>';

    document.body.insertBefore(wrap, document.body.getElementsByTagName('*')[0]);
    document.getElementById(CopinyNewWidget.mobileActivatorId + '_text').innerText = CopinyNewWidget.textMobile;

    window.addEventListener('resize', function() {
        CopinyNewWidget.mobileGetZoomRatio(true);
    });

    window.addEventListener('orientationChanged', function() {
        CopinyNewWidget.mobileGetZoomRatio(true);
    });

    setInterval(function(){
        CopinyNewWidget.mobileGetZoomRatio(true);
    }, 100);
};

CopinyNewWidget.mobileAddMeta = function(){
    var viewPortTag=document.createElement('meta');
    viewPortTag.id="copiny-viewport";
    viewPortTag.name = "viewport";
    //todo: check if meta exists and... what?
    /*
    if(CopinyNewWidget.DetectIOS()){
        viewPortTag.content = "width=device-width, initial-scale=0.49, maximum-scale=0.49";
    }else {
        viewPortTag.content = "width=device-width, initial-scale=1.0";
    }
    */
    /*viewPortTag.content = "width=device-width, initial-scale=0.33, maximum-scale=0.33";*/
    viewPortTag.content = "width=device-width";
    document.getElementsByTagName('head')[0].appendChild(viewPortTag);
};

CopinyNewWidget.mobileGetZoomRatio = function(doSet){
    var i5width = 320;
    var i5height = 568;

    var w = window.screen.width;
    var ratio = 1;

    //true - landscape orientation
    var wO = (window.matchMedia("(orientation: landscape)").matches|| Math.abs(window.orientation)===90);
    if(w != 0){
        ratio = (w/(wO ? i5height : i5width)).toFixed(3);
    }

    ratio = Math.max(Math.min(ratio, 1.5), 0.3);

    //коррекция с учётом  user-scaled ratio
    var wW = (window.innerWidth||document.documentElement.clientWidth).toFixed(0);
    if(w != wW){
        ratio = ratio*wW/w;
        ratio = Math.max(0.33, ratio);
    }

    if(doSet){
        var elem = document.getElementById(CopinyNewWidget.mobileWrapperId);
        elem.style.zoom = ratio;
        if(CopinyNewWidget.DetectIOS()){
            var text = document.getElementById(CopinyNewWidget.mobileActivatorId + '_text');
            text.style.fontSize = (12*ratio + 4) + 'px';
        }
    }
    return ratio;
};

CopinyNewWidget.PCWidgetInitializer  = function (options)
{
    CopinyNewWidget.initOptions(options);

    if(CopinyNewWidget.cache!=0)
        var css = "a.widget-tab {position:fixed; background: "+CopinyNewWidget.color+" 6px 11px no-repeat; color: #ffffff; display: block; border: solid 2px #ffffff;  z-index:100000; box-shadow: 0px 0px 5px #333;}\n";
    else
        var css = "a.widget-tab {position:fixed; background: url(\""+CopinyNewWidget.proto+"://"+CopinyNewWidget.host+"/static/images/text.png\") "+CopinyNewWidget.color+" 6px 11px no-repeat; color: #ffffff; display: block; height: 145px; border: solid 2px #ffffff; z-index:100000; box-shadow: 0px 0px 5px #333;}\n";
    if (window.operamini) {
        css = css+"noindex:-o-prefocus, a.widget-tab { position: absolute; }\n";
    }
    css = css+"\
     a.widget-tab img{padding:3px;margin-left:4px;border:0;background: transparent;} \n\
     * html a.widget-tab {position:absolute;}\n\
     a.widget-tab-left:hover{width: 32px; background-position: 11px 11px;} \n\
     a.widget-tab-left:hover img{margin-left:9px;} \n\
     a.widget-tab-right:hover {width: 32px} \n\
     a.widget-tab-left-bottom:hover, a.widget-tab-right-bottom:hover {height: 32px} \n\
     a.widget-tab-left .widget-img, a.widget-tab-right .widget-img {width:16px;box-sizing:content-box;}\n\
     a.widget-tab-right-bottom .widget-img, a.widget-tab-left-bottom .widget-img {height:16px;box-sizing:content-box;}\n\
     a.widget-tab-left{left:0; width:27px; top: 25%; border-left:none; border-radius: 0 3px 3px 0;  -moz-border-radius: 0 3px 3px 0; -o-border-radius: 0 3px 3px 0; -webkit-border-radius: 0 3px 3px 0;} \n\
     a.widget-tab-right{right:0; width:27px; top: 25%; border-right:none; border-radius: 3px 0 0 3px;  -moz-border-radius: 3px 0 0 3px; -o-border-radius: 3px 0 0 3px; -webkit-border-radius: 3px 0 0 3px;} \n\
     a.widget-tab-right-bottom{height:27px; bottom:0; right:0; border-bottom:none; border-radius: 3px 3px 0 0;  -moz-border-radius: 3px 3px 0 0; -o-border-radius: 3px 3px 0 0; -webkit-border-radius: 3px 3px 0 0;} \n\
     a.widget-tab-left-bottom{height:27px;bottom:0; left:0; border-bottom:none; border-radius: 3px 3px 0 0;  -moz-border-radius: 3px 3px 0 0; -o-border-radius: 3px 3px 0 0; -webkit-border-radius: 3px 3px 0 0;} \n\
     a.widget-tab-left-bottom img, a.widget-tab-right-bottom img {margin-left: 0} \n\
    #copiny-wrapper {width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 1000000;\n  position: fixed;}\n\
    #copiny-loading {text-align: center;\n position: absolute;\n top: 0;\n left: 0;\n z-index: 2;\n margin: 0;\n padding: 0;\n height: 100%;\n width: 100%;\n background: url('"+CopinyNewWidget.proto+"://"+CopinyNewWidget.host+"/static/images/widget-loading.gif') center center no-repeat; } \
    #copiny-overlay {text-align: center; position: absolute; left: 0;top: 0;\n z-index: 1;\n margin: 0;\n padding: 0;\n height: 100%;\n width: 100%;\n background-color: #000;\n filter:progid:DXImageTransform.Microsoft.Alpha(opacity=40);\n -moz-opacity: 0.4;\n -khtml-opacity: 0.4;\n opacity: 0.4;\n}\n* html #copiny-overlay {\n position: absolute;\n height: expression(document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight + \"px\");\n}\n\
    #copiny-popup-container {\n position:relative; z-index:2; margin: 0 auto; padding:0; width:780px; border:none;}\n\
    #copiny-popup-iframe {background: transparent; position: static; margin: 0; padding:0; border: none; display: none;} \
    .widget_on embed, .widget_on select, .widget_on object, .widget_on iframe.youtube-player { visibility: hidden; }\n";
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        var rules = document.createTextNode(css);
        style.appendChild(rules);
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    var wrap = document.createElement('div');
    wrap.id = 'copiny-wrapper';
    wrap.style.display = 'none';
    wrap.innerHTML = '<div id="copiny-popup-container">\n\n\
    <iframe id="copiny-popup-iframe" allowtransparency="true" src="'+CopinyNewWidget.blankUrl()+'" scrolling="no" frameborder="0" style="width: 780px; height: 430px; background-color: transparent" ></iframe></div>\n\
    <div id="copiny-overlay"></div>\
    <div id="copiny-loading"></div>';
    document.body.insertBefore(wrap, document.body.getElementsByTagName('*')[0]);
    CopinyNewWidget.initJSON();

    CopinyNewWidget.initialized = true;
};

CopinyNewWidget.initOptions = function(options){
    CopinyNewWidget.info = CopinyNewWidget.info || {};
    CopinyNewWidget.community = options.community;
    CopinyNewWidget.text    = options.text;
    CopinyNewWidget.cache    = options.cache?options.cache:0;
    CopinyNewWidget.ssl     = (options.use_ssl || (document.location.protocol == 'https:'));
    CopinyNewWidget.proto   = CopinyNewWidget.ssl?'https':'http';
    CopinyNewWidget.mainhost = options.mainHost;
    CopinyNewWidget.host = 'widget.'+CopinyNewWidget.mainhost;
    CopinyNewWidget.tabPosition = options.position?options.position:'left';
    CopinyNewWidget.title   = options.title?options.title:'Оставить отзыв';
    CopinyNewWidget.color   = options.color?options.color:'#61a8f0';
    CopinyNewWidget.tabBorder = options.border?options.border:'#ffffff';
    CopinyNewWidget.type    = options.type?options.type:'question';
    CopinyNewWidget.testmode   = options.testmode;
    CopinyNewWidget.href = options.href?options.href:false;
    if (options.integration) {
        CopinyNewWidget.integration = options.integration;
    }
    CopinyNewWidget.textMobile = options.textMobile || CopinyNewWidget.title;
    CopinyNewWidget.colorMobile = options.colorMobile || CopinyNewWidget.color;
    CopinyNewWidget.tabPositionMobile = options.positionMobile || CopinyNewWidget.tabPosition;
};

function initCopinyWidget(options)
{
    options.community = parseInt(options.community);
    if (options.community == 0) {
        return false;
    }
    options.mainHost = '';
    if(options.testmode) {
        options.mainHost = (options.testmode==1) ? 'idea.test' : 'crowd2community.com';
    } else {
        options.mainHost = 'copiny.com';
    }

    (CopinyNewWidget.getInitializer())(options);
    return true;
}

CopinyNewWidget.showTab = function() {
    //Заглушка для совместимости старой линейной и новой асинхронной системы инициализации
    if(!CopinyNewWidget.initialized) {
        setTimeout("CopinyNewWidget.showTab()", 100);
        return;
    }
    var tab = document.createElement('a');
    tab.className = "widget-tab widget-tab-"+this.tabPosition;
    tab.id = "copiny-widget-tab";
    tab.title = this.title;
    tab.href = CopinyNewWidget.href ? CopinyNewWidget.href : '#';
    if (CopinyNewWidget.href === false) {
        tab.onclick = function () {
            CopinyNewWidget.show();
            return false;
        };
    }
    tab.style.borderColor = this.tabBorder;
    document.body.insertBefore(tab, document.body.getElementsByTagName('*')[0]);
    if(CopinyNewWidget.cache!=0){
        var img = document.createElement('img');
        //img.css('margin-right:10px');
        img.className='widget-img';
        img.src = CopinyNewWidget.proto+"://"+CopinyNewWidget.host+"/image.php?text="+CopinyNewWidget.cache;
        tab.appendChild(img);
    }
};

CopinyNewWidget.timeout = function()
{
    CopinyNewWidget.hide();
    CopinyNewWidget.timeoutId = 0;
};

CopinyNewWidget.resize = function(height)
{
    var clientHeight=window.innerHeight||document.documentElement.clientHeight||d.getElementsByTagName('body')[0].clientHeight;
    height = parseInt(height);
    this.gId('copiny-popup-iframe').style.height = height + "px";
    var top = Math.max(Math.floor((clientHeight - height) / 2), 0);
    this.gId('copiny-popup-container').style.top = top + "px";
};

CopinyNewWidget.show = function()
{
    var iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; ++i) {
        var iframe = iframes[i];
        if (iframe.src.search(/http:\/\/www\.youtube\.com\//i) != -1
            && !this.hasClass(iframe, 'youtube-player')) {
            this.addClass(iframe, 'youtube-player');
        }
    }
    this.gId('copiny-wrapper').style.display = 'block';
    var src = this.proto+'://'+this.host+'/new?'+this.buildUriParams();
    var iframe = this.gId('copiny-popup-iframe');
    if (iframe.addEventListener) {
        iframe.addEventListener("load", this.loaded, false);
        window.addEventListener("message", CopinyNewWidget.receiveMessage, false);
    } else if (iframe.attachEvent) {
        iframe.attachEvent("onload", this.loaded);
        window.attachEvent("onmessage", CopinyNewWidget.receiveMessage);
    }
    this.timeoutId = setTimeout(this.timeout, 10000);
    iframe.src = src;
    this.resize(430);
    this.addClass(document.getElementsByTagName('html')[0], 'widget_on');
};

CopinyNewWidget.buildUriParams = function() {
    var params = 'commid='+encodeURIComponent(this.community)+'&type='+encodeURIComponent(this.type);
    if (this.integration && this.getCookie(this.integration)) {
        params += '&'+encodeURIComponent(this.integration)+'='+encodeURIComponent(this.getCookie(this.integration));
    }
    params += '&ainfo='+encodeURIComponent(this.JSON.stringify(this.getAddInfo()));
    return params;
};

CopinyNewWidget.loaded = function()
{
    if (CopinyNewWidget.timeoutId > 0) {
        clearTimeout(CopinyNewWidget.timeoutId);
        CopinyNewWidget.timeoutId = 0;
    }
    CopinyNewWidget.gId('copiny-loading').style.display='none';
    CopinyNewWidget.gId('copiny-popup-iframe').style.display='block';
};

CopinyNewWidget.hide = function()
{
    var iframe = this.gId('copiny-popup-iframe');
    if (iframe.addEventListener) {
        iframe.removeEventListener("load", this.loaded, false);
        window.removeEventListener("message", CopinyNewWidget.receiveMessage, false);
    } else if (iframe.attachEvent) {
        iframe.detachEvent("onload", this.loaded);
        window.detachEvent("onmessage", CopinyNewWidget.receiveMessage);
    }
    this.gId('copiny-wrapper').style.display='none';
    this.gId('copiny-loading').style.display='block';
    iframe.src = this.blankUrl();
    iframe.style.display = 'none';
    this.removeClass(document.getElementsByTagName('html')[0], 'widget_on');
};

CopinyNewWidget.blankUrl = function()
{
    return 'about:blank';//this.proto+'://'+this.host+'/static/main/images/blank.gif';
};

CopinyNewWidget.addInfo = function(param, value)
{
    var key = param.toString();
    key.replace(/(^\s+)|(\s+$)/g, "");
    if (key.length > 0) {
        this.info = this.info || {};
        this.info[key] = value;
    }
};

CopinyNewWidget.getAddInfo = function()
{
    this.info.loc = document.location.href;
    this.info.ref = document.referrer;
    this.info.scr = {"x": screen.width, "y": screen.height};
    this.info.flash = this.getFlash();
    return this.info;
};

CopinyNewWidget.initJSON = function()
{
    if(!this.JSON)this.JSON={};
    (function(){function g(b){return b<10?"0"+b:b}function l(b){j.lastIndex=0;return j.test(b)?'"'+b.replace(j,function(h){var c=m[h];return typeof c==="string"?c:"\\u"+("0000"+h.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+b+'"'}function k(b,h){var c,f,i=d,e,a=h[b];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(b);switch(typeof a){case "string":return l(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);case "object":if(!a)return"null";e=
        [];if(Object.prototype.toString.apply(a)==="[object Array]"){f=a.length;for(c=0;c<f;c+=1)e[c]=k(c,a)||"null";f=e.length===0?"[]":d?"[\n"+d+e.join(",\n"+d)+"\n"+i+"]":"["+e.join(",")+"]";d=i;return f}for(c in a)if(Object.hasOwnProperty.call(a,c))if(f=k(c,a))e.push(l(c)+(d?": ":":")+f);f=e.length===0?"{}":d?"{\n"+d+e.join(",\n"+d)+"\n"+i+"}":"{"+e.join(",")+"}";d=i;return f}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+
    "-"+g(this.getUTCMonth()+1)+"-"+g(this.getUTCDate())+"T"+g(this.getUTCHours())+":"+g(this.getUTCMinutes())+":"+g(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var j=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,d,m={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};if(typeof CopinyNewWidget.JSON.stringify!==
        "function")CopinyNewWidget.JSON.stringify=function(b){d="";return k("",{"":b})}})();
};

CopinyNewWidget.getFlash = function (){
    try{try{var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");try{a.AllowScriptAccess="always"}catch(b){return"6,0,0"}}catch(c){}return(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version").replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}catch(d){try{if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)return(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}catch(e){}}return"0,0,0"
};

CopinyNewWidget.receiveMessage = function(event) {
    if (event.origin !== (CopinyNewWidget.proto + '://' + CopinyNewWidget.host))
        return;

    var data = event.data.split(' ', 2);
    if (data[0] == 'copiny-close-new-widget') {
        CopinyNewWidget.hide();
        return;
    }
    if (data[0] == 'copiny-resize-new-widget') {
        /*Resize iframe*/
        CopinyNewWidget.resize(data[1]);
        
    }
};

define(function () {
	return {
		CopinyNewWidget: CopinyNewWidget,
		initCopinyWidget: initCopinyWidget
	}
});