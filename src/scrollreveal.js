// =================================================================================================
// Slate.js | Scrollreveal
// (c) 2014 Mathigon / Philipp Legner
// =================================================================================================


// M.scrollReveal($$('[scroll-reveal]'));

M.scrollReveal = function($els) {

    if (M.browser.isMobile && M.browser.width < 800 && M.browser.height < 800) return;

    // Viewport height reference
    var viewportHeight;
    function getHeight() { viewportHeight = window.innerHeight; }
    M.resize(getHeight);
    getHeight();

    // Scroll position reference;
    var viewportScroll;
    function getScroll() { viewportScroll = window.pageYOffset; }

    // Check if an element is visible
    function isInViewport($el, factor) {
        var elTop = $el.$el.offsetTop;
        var elHeight = $el.$el.offsetHeight;
        return (elTop + elHeight) >= viewportScroll +    factor  * viewportHeight &&
                elTop             <= viewportScroll + (1-factor) * viewportHeight;
    }

    // Initialise element and
    function makeElement($el) {
        var isShown = true;
        var options = ($el.attr('data-scroll') || '').split('|');

        var axis      = M.isOneOf(options[0], 'left', 'right') ? 'X' : 'Y';
        var direction = M.isOneOf(options[0], 'top', 'left') ? '-' : '';
        var factor    = M.isNaN(+options[1]) ? 0.2 : +options[1];
        var distance  = options[2] || '40px';
        var duration  = options[3] || '.5s';
        var delay     = options[4] || '0s';

        function show() {
            isShown = true;
            $el.css('opacity', '1');
            $el.transform('translate' + axis + '(0)');
        }

        function hide() {
            isShown = false;
            $el.css('opacity', '0');
            $el.transform('translate' + axis + '(' + direction + distance + ')');
        }

        $el.transition(['opacity', duration, delay, ',', M.prefix('transform'), duration, delay].join(' '));

        return function() {
            if (!isShown && isInViewport($el, factor)) show();
            if ( isShown && !isInViewport($el, 0)) hide();
        };
    }

    // Initialise Elements
    var updateFns = $els.each(function($el){ return makeElement($el); });
    var n = updateFns.length;

    // Trigger Updates
    function updatePage() { getScroll(); for (var i=0; i<n; ++i) updateFns[i](); }
    M.$body.scroll(updatePage);
    M.resize(updatePage);
    updatePage();
    setTimeout(function() { updatePage(); }, 500);

};
