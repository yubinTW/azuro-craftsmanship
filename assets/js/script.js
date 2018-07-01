
(function ($) {
    //disabling scrolling

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1};
    var $body = $('body');
    var parallax, indexSlideVideo;

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    //disable scroll
    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
    }

    //enable scroll
    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }


    $('.container').on('mousewheel', function (event) {
        if (event.deltaY > 0) {
            animateSlideTop(currentSlide);
        } else if (event.deltaY < 0) {
            animateSlideBottom(currentSlide);
        }
    });

    var totalSlides = $('.hero-slide').length;
    var currentSlide = 1;
    var $heroSlideActive = $('.hero-slide.active');

    var animateSlideBottom = function () {
        if (!$body.hasClass('animating') && currentSlide < totalSlides) {
            var $slidesPaginationLi = $('.slides-pagination li');

            $slidesPaginationLi.removeClass('active');
            $('.slides-pagination li[data-goto=' + (currentSlide + 1) + ']').addClass('active');
            $body.addClass('animating');
            $('.slide-' + currentSlide).addClass('animateout-top').removeClass('active');
            $('.slide-' + (currentSlide + 1)).addClass('active').removeClass('animateout-bottom');
            window.location.hash = '#slide' + (currentSlide + 1);
            currentSlide += 1;
            slideChanged($('.hero-slide.active'));

            setTimeout(function () {
                $body.removeClass('animating');
            }, 1500)
        }
    };

    var animateSlideTop = function () {
        if (!$body.hasClass('animating') && currentSlide > 1) {
            var $slidesPaginationLi = $('.slides-pagination li');

            $slidesPaginationLi.removeClass('active');
            $('.slides-pagination li[data-goto=' + (currentSlide - 1) + ']').addClass('active');
            $body.addClass('animating');
            $('.slide-' + currentSlide).addClass('animateout-bottom').removeClass('active');
            $('.slide-' + (currentSlide - 1)).addClass('active').removeClass('animateout-top');
            window.location.hash = '#slide' + (currentSlide - 1);
            currentSlide -= 1;

            slideChanged($('.hero-slide.active'));

            setTimeout(function () {
                $body.removeClass('animating');
            }, 1500)
        }
    };


    //animate circle
    var circleRunning = 0;

    var animateCircle = function (circle) {
        var offset = parseInt(circle.find('.circle-svg').css('stroke-dashoffset').split('px')[0]);
        var currentOffset = parseInt(circle.find('.circle-svg').css('stroke-dashoffset').split('px')[0]);
        var hoursArray = [];
        var totalHours = 0;
        var counter = 0;
        var hoursId = circle.find('.rotating_circle-text_hours').attr('id');

        circle.find('.rotating_circle-single-step').each(function () {
            hoursArray.push(parseInt($(this).attr('data-hours')));
        });

        totalHours = hoursArray.reduce(add, 0);

        function add(a, b) {
            return a + b;
        }

        var countup = new CountUp(hoursId, 0, 0, 0, 1.5, options);
        countup.start();

        setInterval(function () {
            //calculating current step percentage and offset in pixels
            var stepPercent = (hoursArray[counter] / totalHours * 100).toFixed(2);
            var stepOffset = ((offset / 100) * stepPercent ).toFixed(2);

            //countup switch
            countup.update(hoursArray[counter]);
            $('.rotating_circle-text-content').show();

            //stroke offset switch
            currentOffset -= stepOffset;
            circle.find('.circle-svg').css('stroke-dashoffset', currentOffset + 'px');

            //text switch
            var $rotatingCircleSingleStep = $('.rotating_circle-single-step');
            circle.find($rotatingCircleSingleStep.hide());
            circle.find($rotatingCircleSingleStep[counter]).show();

            counter += 1;
            if (counter == hoursArray.length) {
                counter = 0;
                currentOffset += offset;
            }
        }, 3000);
    };

//top nav

    var navDark = 0;

    $('.nav_menu-trigger').on('click', function (e) {
        e.preventDefault();

        var $menu = $('.menu');
        var $nav = $('nav');

        $(this).toggleClass('active');
        $menu.toggleClass('active');
        disableScroll();

        var $shoppingCartLink = $('.nav_shopping-cart-link');

        if ($nav.hasClass('nav-dark')) {
            navDark = 1;
            $nav.removeClass('nav-dark scrolled');
            $shoppingCartLink.removeClass('nav-dark_shopping-cart-link');
        }

        if (!$(this).hasClass('active')) {
            $menu.addClass('fout-bottom');

            setTimeout(function () {
                $menu.removeClass('fout-bottom');
            }, 500);

            enableScroll();

            //re-adding nav classes
            if (navDark == 1) {
                $nav.addClass('nav-dark');
                $shoppingCartLink.addClass('nav-dark_shopping-cart-link');
                navDark = 0;
            }
        }

        $menu.on('click', function (e) {

            if (jQuery(e.target).hasClass('menu-item') || jQuery(e.target).hasClass('menu-items-list')) {
                $menu.removeClass('active');
                jQuery('.nav_menu-trigger').removeClass('active');
                enableScroll();
                if (navDark == 1) {
                    $('nav').addClass('nav-dark');
                    $('.nav_shopping-cart-link').addClass('nav-dark_shopping-cart-link');
                }
            }

        });


    });


    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 0) {
            $('nav').addClass('has-background');
        } else {
            $('nav').removeClass('has-background');
        }
    });

    //countup animation options
    var options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
    };

    //skrollr
    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        skrollr.init({
            forceHeight: false
        });
    }

    //product page carousel
    var $productPageCarouselTop = $('.product-page_carousel-top');

    if ($productPageCarouselTop.length > 0) {
        $productPageCarouselTop.owlCarousel({
            singleItem: true
        });
    }

    //index page carousel
    var $indexCarousel = $('.hero_img-carousel');

    if ($indexCarousel.length > 0) {
        $indexCarousel.owlCarousel({
            singleItem: true,
            dots: false,
            nav: false,
            autoPlay: true,
            transitionStyle : "fade",
            loop: true
        });
    }


    //similar items carousel

    var $similarItemsCarousel = $('.product_page-similar-items-carousel');

    if ($similarItemsCarousel.length > 0) {
        $similarItemsCarousel.owlCarousel({
            items: 3,
            itemsDesktop: [1000, 3],
            itemsDesktopSmall: [900, 3],
            itemsTablet: [600, 2],
            itemsMobile: false,
            nav: true
        });
    }

    //contact maps
    var $map = $('#map');
    if ($map.length > 0) {
        var lat = $map.data('lat');
        var lng = $map.data('lng');

        var myLatLng = {lat: lat, lng: lng};

        var map = new google.maps.Map(document.getElementById('map'), {
            center: myLatLng,
            zoom: 15,
            streetViewControl: false,
            scrollwheel: false,
            styles: [{
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
            }, {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
            }, {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
            }, {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{"color": "#dedede"}, {"lightness": 21}]
            }, {
                "elementType": "labels.text.stroke",
                "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
            }, {
                "elementType": "labels.text.fill",
                "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
            }, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
            }, {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
            }]
        });

        new google.maps.Marker({map: map, position: myLatLng});
    }


    //cart functions
    $('.nav_shopping-cart-link, .cart-overlay').on('click', function (e) {
        e.preventDefault();

        $('.cart, .nav_shopping-cart-link, .cart-overlay').toggleClass('active');

        if ($('.nav_menu-trigger').hasClass('active')) {
            $('.nav_menu-trigger, .menu').removeClass('active');
            enableScroll();

            if (navDark == 1) {
                $('nav').addClass('nav-dark');
                $('.nav_shopping-cart-link').addClass('nav-dark_shopping-cart-link');
            }
        }
    });


    //proccess page functions
    if (totalSlides > 0) {
        var $slidesPagination = $('<ul class="pagination slides-pagination"></ul>');
        $body.append($slidesPagination);

        for (var i = 1; i < totalSlides + 1; i++) {
            if (i == 1) {
                $slidesPagination.append('<li class="active" data-goto=' + i + '></li>');
            } else {
                $slidesPagination.append('<li data-goto=' + i + '></li>');
            }
        }

        var $slidesPaginationLi = $slidesPagination.find('li');

        $slidesPaginationLi.click(function () {
            //adjust pagination
            $slidesPaginationLi.removeClass('active');
            $(this).addClass('active');

            //getting the slide we want to hop to
            var goTo = $(this).attr('data-goto');

            if (goTo > currentSlide) {
                $heroSlideActive.addClass('animateout-top');
            } else {
                $heroSlideActive.addClass('animateout-bottom');
            }

            currentSlide = parseInt(goTo);

            for (var i = 0; i < currentSlide; i++) {
                $('.slide-' + i).removeClass('animateout-bottom').addClass('animateout-top');
            }

            for (var i = currentSlide + 1; i <= totalSlides; i++) {
                $('.slide-' + i).removeClass('animateout-top').addClass('animateout-bottom');
            }

            $('.hero-slide').removeClass('active');
            $('.slide-' + goTo).removeClass('animateout-bottom animateout-top').addClass('active');
            window.location.hash = '#slide' + goTo;
            slideChanged($('.hero-slide.active'));
        });
    }

    //parallax
    if ($('#parallax-scene').length > 0) {
        var scene = document.getElementById('parallax-scene');
        parallax = new Parallax(scene);
        parallax.disable();
    }

    //disabling video in index

    if( $('.page-template-home').length > 0 && $('.index-slide-3_video').length > 0 ){
      indexSlideVideo = $('.index-slide-3_video')[0];
      indexSlideVideo.pause();
    }

    //on load slide change

    $(window).on('load', function () {
        if ($('.hero-slide').length > 0 && window.location.hash.length > 0) {
            var goTo = window.location.hash.split('#slide').pop();

            $('.pagination li').removeClass('active');
            $('.pagination li[data-goto=' + goTo + ']').addClass('active');

            if (goTo > currentSlide) {
                $heroSlideActive.addClass('animateout-top');
            } else {
                $heroSlideActive.addClass('animateout-bottom');
            }

            currentSlide = parseInt(goTo);

            for (var i = 0; i < currentSlide; i++) {
                $('.slide-' + i).removeClass('animateout-bottom').addClass('animateout-top');
            }

            for (var i = currentSlide + 1; i <= totalSlides; i++) {
                $('.slide-' + i).removeClass('animateout-top').addClass('animateout-bottom');
            }

            $('.hero-slide').removeClass('active');
            $('.slide-' + goTo).removeClass('animateout-bottom animateout-top').addClass('active');
            window.location.hash = '#slide' + goTo;
            slideChanged($('.hero-slide.active'));

        }
    });


    //all the functionality we want to trigger after slide change
    var slideChanged = function (slide) {
        //adjust rotating circle
        if (typeof(slide.attr('data-time')) != "undefined") {
            var totalTimesArray = [];

            for (var i = 1; i <= totalSlides; i++) {
                var time = $('.slide-' + i).attr('data-time');
                totalTimesArray.push(time);
            }

            var circle = $('.proccess-page .rotating_circle');
            var currentStepHours = parseInt(slide.attr('data-time'));

            var currentStepTotalHours = 0;

            for (var i = 0; i < currentSlide; i++) {
                currentStepTotalHours = parseInt(currentStepTotalHours) + parseInt(totalTimesArray[i]);
            }
            animateCircleManually(currentStepTotalHours, currentStepHours, circle);
        }

        //adjust process page navigation

        $('.proccess-page .navigation_arrows .nav-arrow').removeClass('hidden');

        if (currentSlide == 1) {
            $('.proccess-page .navigation_arrows .nav-arrow[data-goto=top]').addClass('hidden');
        } else if (currentSlide == totalSlides) {
            $('.proccess-page .navigation_arrows .nav-arrow[data-goto=bottom]').addClass('hidden');
        }

        //index rotating circle

        // if (slide.find('.rotating_circle').length > 0 && circleRunning == 0) {
        //  circleRunning += 1;
        /*$('.rotating_circle.autorotate').each(function () {
         var circle = $(this);
         animateCircle(circle);
         });*/
        //}

        //index nav adjust

        if ($('.home').length > 0) {
            if (currentSlide == 3 || currentSlide == 4 || currentSlide == 5) {
                $('nav').addClass('has-background');
            } else {
                $('nav').removeClass('has-background');
            }
        }

        //hero animations
        var $heroContentWrapper = $('.hero_content-wrapper');
        $heroContentWrapper.removeClass('active');

        if (currentSlide == 1) {
            $heroContentWrapper.addClass('active');
        }

        //index slide 2 animations

        if (currentSlide == 2) {
            $('.index-slide-2').addClass('animated');
        } else {
            $('.index-slide-2').removeClass('animated');
        }

        if (currentSlide == 2 && $('#parallax-scene').length > 0 ) {
            parallax.enable();
        } else if( $('#parallax-scene').length > 0 ) {
            parallax.disable();
        }

        if (currentSlide == 3 && $('.page-template-home').length > 0 ){
          var slideVideoTimeout = window.setTimeout(function(){
            indexSlideVideo.play();
          }, 1400);
        }else if( $('.page-template-home').length > 0 ){
          indexSlideVideo.pause();
        }

    };

    $('.proccess-page .navigation_arrows .nav-arrow').on('click', function () {
        var goto = $(this).attr('data-goto');
        if (goto == "bottom") {
            animateSlideBottom(currentSlide);
        } else if (goto == "top") {
            animateSlideTop(currentSlide);
        }
    });


//animateCircleManually(currentStepTotalHours, currentStepHours, circle);
    var animateCircleManually = function (currentStepTotalHours, currentStepHours, circle) {

        var countup = new CountUp($('.proccess-page .rotating_circle-text_hours').attr('id'), 0, 0, 0, 1.5, options);
        countup.start();
        $('.rotating_circle-text-content').show();

        var totalHours = 0;

        for (var i = 1; i <= totalSlides; i++) {
            var time = $('.slide-' + i).attr('data-time');
            totalHours += parseInt(time);
        }

        var totalOffset = 1300;
        var stepPercent = ((currentStepTotalHours / totalHours) * 100).toFixed(2);
        var currentOffset = ((totalOffset / 100) * stepPercent ).toFixed(2);

        circle.find('.circle-svg').css('stroke-dashoffset', totalOffset - currentOffset + 'px');
        countup.update(currentStepHours);
    };

    slideChanged($('.hero-slide.active'));

    //footer and menu hover effects

    var $menuInnerWrapperA = $('.menu_inner-wrapper a');
    var $footerLeftBottomA = $('.footer_left-bottom ul a');

    $menuInnerWrapperA.on('mouseover', function () {
        $menuInnerWrapperA.addClass('inactive');
        $(this).removeClass('inactive').addClass('active');
    });

    $menuInnerWrapperA.on('mouseleave', function () {
        $menuInnerWrapperA.removeClass('inactive active');
    });

    $footerLeftBottomA.on('mouseover', function () {
        $footerLeftBottomA.addClass('inactive');
        $(this).removeClass('inactive').addClass('active');
    });

    $footerLeftBottomA.on('mouseleave', function () {
        $footerLeftBottomA.removeClass('inactive active');
    });


//product page info toggling

    $('.product-page_info-toggler').on('click', function () {
        if (!$(this).hasClass('active')) {
            $('.product-page_info-toggler').removeClass('active');
            $(this).addClass('active');

            var opensContent = $(this).attr('data-content');

            if( opensContent == 1 ){
              $('.product-page_info-content-wrapper').removeClass('active');
            }

            if( opensContent == 2 ){
              $('.product-page_info-content-wrapper').addClass('active');
            }

            //$('.product-page_info-content-wrapper .content').removeClass('active');
            //$('.product-page_info-content-wrapper .content-' + opensContent).addClass('active');
        }
    });

//contacts validation

    var $contactForm = $('.contacts-form');

    $contactForm.validate({
        //errorLabelContainer: ".contacts-form .form-errors div"
    });

    $contactForm.on('submit', function (e) {
        e.preventDefault();

        if ($('.contacts-form input, .contacts-form textarea').valid()) {
            var action = $(this).attr('action');
            var formData = $(this).serialize();

            $.post(action, formData, function () {
                $('.contacts-form').addClass('success');
            });
        }
    });

    $contactForm.find('textarea').on('change keyup', function () {
        if ($(this).val().length > 0) {
            $(this).addClass('dirty');
        } else {
            $(this).removeClass('dirty');
        }
    });


    //index media images carousel
    var mediaCarousel = function (sliderWrapper) {
        var totalImages = $(sliderWrapper).find($('.media-block-images img')).length;
        var slidesInnerWrapper = $(sliderWrapper).find('.media_slider-outter-wrapper');
        var step = 100 / totalImages;

        //debugger;

        for (var i = 0; i < totalImages; i++) {
            slidesInnerWrapper.append('<div class="media_slider-item" style="background-image:url(' + $($(sliderWrapper).find('img')[i]).attr('src') + ');"></div>');
        }

        //updating slide dimensions
        slidesInnerWrapper.css('width', 100 * totalImages + "%");
        slidesInnerWrapper.find($('.media_slider-item')).css(step + "%");

        //animation

        var currentStep = 0;
        var sliderStep = 0;

        setInterval(function () {
            currentStep = currentStep + step;
            sliderStep += 1;

            if (sliderStep == totalImages) {
                currentStep = 0;
                sliderStep = 0;
            }

            slidesInnerWrapper.css('transform', 'translateX(-' + currentStep.toFixed(4) + '%)');
        }, 5000);
    };

    $('.index-slide-5_community-img-wrapper').each(function () {
        mediaCarousel(this);
    });


    $('.product_page-visuals-group .button').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 1000)
    });

    var $cartItem = $('.cart_item');

    $cartItem.find('.cart_remove').click(function () {
        var productId = $(this).data('product-id');
        var variationId = $(this).data('variation-id');

        var postData = {
            action: 'nov_remove_from_cart',
            product_id: productId,
            variation_id: variationId
        };

        var $item = $(this).parent();

        $.post(window.params.ajaxUrl, postData, function (response) {
            if (response.success) {
                $item.fadeOut();

                var $cartTotal = $('.cart_total .price');
                var total = response.data.total;

                $cartTotal.html(total);

                if (!response.data.items) {
                    var $emptyCartEl = $('.cart.empty');
                    var $cart = $('.cart:not(.empty)');

                    $emptyCartEl.css('display', 'table');
                    $cart.remove();
                }
            } else {
                alert('An error occurred while trying to remove item');
            }
        });
    });


    $('.rotating_circle.autorotate').each(function () {
        var circle = $(this);
        animateCircle(circle);
    });


    //popup functions

    $('.invokes-popup').on('click', function(e){
      e.preventDefault();
      var $target = $('.'+ $(this).attr('data-target-popup'));
      if( $target.length > 0 ){
        $target.addClass('active');
        $('html, body').addClass('popup-active');
      }
    });

    $('.popup-close-icon').on('click', function(){
      $('.popup.active').removeClass('active');
      $('html, body').removeClass('popup-active');
    });


    //wholesale calculations

    $('.number-input-col input').on('change keyup', function(){
      var value = $(this).val();
      var $thisCol = $(this).closest('.number-input-col');
      calcInput($thisCol, value);
    });

    $('.number-input-col .controls li').on('click', function(){
      var $thisCol = $(this).closest('.number-input-col');
      var modifier = $(this).attr('data-control');
      var count = parseInt($thisCol.attr('data-itemcount'));
      if( modifier == 'plus' ){
        count+=1;
      }else if( modifier == 'minus' && count > 0){
        count-=1;
      }
      calcInput($thisCol, count);
      $thisCol.find('input').val(count);
    });

    var calcInput = function($col, value ){
      var count = value;
      var price = (parseFloat($col.attr('data-price'))).toFixed(2);
      var adjusts = $col.attr('data-adjusts');
      var parent = $col.closest('.content');
      $col.attr('data-itemcount', count);
      parent.find('span[data-col='+adjusts+']' ).html( (count*price).toFixed(2)  );
      parent.find('span[data-col='+adjusts+']' ).attr('data-total', (count*price).toFixed(2) );

      var totalPrice = 0;

      $('span[data-total]').each(function(){
        totalPrice += parseFloat($(this).attr('data-total'));
      });

      $('.total-price-number').html(totalPrice);

    }



    //input only numbers

    jQuery.fn.ForceNumericOnly =
    function()
    {
        return this.each(function()
        {
            $(this).keydown(function(e)
            {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
                // home, end, period, and numpad decimal
                return (
                    key == 8 ||
                    key == 9 ||
                    key == 13 ||
                    key == 46 ||
                    key == 110 ||
                    key == 190 ||
                    (key >= 35 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105));
            });
        });
    };

    $('.item-info-table_col input').ForceNumericOnly();



})(jQuery);


//product features animation

var $productFeaturesTextContent = jQuery('.product_features-text-content');
var $featuresPlus = jQuery('.features-plus');

var calculateTopOffset = function (item) {
    var topOffset = jQuery('.features-plus.active').offset().top - jQuery('.product_page-features-wrapper').offset().top;

    if (topOffset - jQuery('.product_features-text-content.content-' + item).height() < 0) {
        jQuery('.product_features-text-content.content-' + item).css('top', topOffset + $featuresPlus.height());
    } else {
        jQuery('.product_features-text-content.content-' + item).css('top', topOffset - jQuery('.product_features-text-content.content-' + item).height());
    }
};

$featuresPlus.on('click', function () {
    $featuresPlus.removeClass('active');
    jQuery(this).addClass('active');
    var content = jQuery(this).attr('data-content');

    $productFeaturesTextContent.removeClass('active');
    setTimeout(function () {
        calculateTopOffset(content);
        jQuery('.product_features-text-content.content-' + content).addClass('active');
    }, 400);
});

jQuery(window).on('load', function () {
    if ($featuresPlus.length > 0) {
        $featuresPlus.first().addClass('active');
        calculateTopOffset(0);
        jQuery('.product_features-text-content.content-' + $featuresPlus.first().attr('data-content')).addClass('active');
    }

    //select2
    jQuery('.checkout').validate({
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().find('.error-container'));
        }
    });

    var $checkoutInput = jQuery('.checkout input');
    $checkoutInput.each(function () {
        if (jQuery(this).val().length > 0) {
            jQuery(this).addClass('dirty');
        }
    });

    jQuery('.input-block input').each(function () {
        if (jQuery(this).val().length > 0) {
            jQuery(this).addClass('dirty');
        }
    });

    $checkoutInput.on('change', function () {
        if (jQuery(this).val().length > 0) {
            jQuery(this).addClass('dirty');
        } else {
            jQuery(this).removeClass('dirty');
        }
    });

    jQuery('.input-block input').on('change', function () {
        if (jQuery(this).val().length > 0) {
            jQuery(this).addClass('dirty');
        } else {
            jQuery(this).removeClass('dirty');
        }
    });

});

//lookbook js
jQuery(window).on('load resize', function(){
  jQuery('.lookbook_index_block').each(function(){
    var imagesWrapper = jQuery(this).find(jQuery('.images_wrapper'));
    lookbookSlide(imagesWrapper);
    jQuery(this).addClass('loaded');
  });
});

function lookbookSlide(container){
  var imagesInnerWrapper = container.find('.inner-wrapper');
  var totalLength = 0;
  imagesInnerWrapper.find('img').each(function(){
    totalLength+=jQuery(this).width();
  });
  imagesInnerWrapper.width(totalLength);
}

//adding video controls on mobile devices
jQuery(window).on('load resize', function(){
  if( jQuery(window).width() < 640 ){
    jQuery('.index-slide-3_video').each(function(){
      jQuery(this).attr('controls', true);
    })
  }else{
    jQuery('.index-slide-3_video').each(function(){
      jQuery(this).removeAttr('controls');
    });
  }
});

//video play on load
jQuery(window).on('load', function(){
  jQuery('.visual-box.video-visual-box').each(function(){
    var targetVideo = jQuery(this).find('.index-slide-3_video');
    jQuery(targetVideo)[0].play();
  });
});
