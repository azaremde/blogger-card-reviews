var windowWidth = parseInt($(window).width());
var mobile = parseInt($(window).width()) < 768;

HeaderLoad = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'header.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState !== 4) {
            return;
        }
    
        if (this.status !== 200) {
            return;
        }
    
        document.getElementById('to-include').innerHTML= this.responseText;
    };
    
    xhr.send();    
}

TooltipHandler = () => {
    if(!mobile) {
        let tdCons = $('.td-con');
        let textesBase = [];
        let tooltip = $('#mouseover-tooltip');
        tooltip.fadeOut(0);
    
        $.map(tdCons, (element, i) => {
            textesBase.push(element.innerHTML);
    
            new Dotdotdot(element);
    
            if($(element).hasClass('ddd-truncated')) {
                $(element).hover(() => {
                    tooltip.fadeIn(50);
                    tooltip.offset({left: $(element).offset().left - 5, top: $(element).offset().top});

                    tooltip.html(textesBase[i]);

                    //$(element).append(tooltip);
                }, () => {
                    tooltip.fadeOut(50);
                });
            }
        });
    } else {
        let tooltip = $('#mobile-tooltip');
        let tooltipBtns = $('.tooltip .tooltip__button');
        let open = false;

        $.map(tooltipBtns, (element) => {
            $(element).on('click', () => {
                if(!open) {
                    tooltip.addClass('mobile-tooltip--open');
                    tooltip.offset({ top: $(element).offset().top + 20, left: 30 })
                    setTimeout(() => {
                        open = true;
                    }, 1);
                } else {
                    tooltip.removeClass('mobile-tooltip--open');
                    open = false;
                }
            });
        });

        $(window).on('click', (event) => {
            if(event.target != tooltipBtns.get(0)) {
                if(open) {
                    tooltip.removeClass('mobile-tooltip--open');
                    open = false;
                }
            }
        });
    }
}

PlusHandler = () => {
    let bloggers = $('.blogger');
    let tableOpen = new Array(bloggers.length).fill(false);

    OpenReviews = (element, i, mustBeLoaded) => {
        if(!tableOpen[i]) {
            if(mustBeLoaded) {
                $(element).addClass('blogger--loading');
                setTimeout(() => {
                    $(element).removeClass('blogger--loading');
                    $(element).addClass('blogger--open');
                }, 1000);
            } else {
                $(element).removeClass('blogger--loading');
                $(element).addClass('blogger--open');                
            }
            tableOpen[i] = true;
        } else {
            $(element).removeClass('blogger--open');
            tableOpen[i] = false;
        }
    }

    $.map(bloggers, (element, i) => {
        $(element).find('.table-blogger__open-copies').on('click', () => {
            OpenReviews(element, i, true);
        });

        $(element).find('.review-control__open').on('click', (event) => {
            event.preventDefault();
            OpenReviews(element, i, false);
            if(tableOpen[i]) {
                $(element).find('.review-control__open').html('Скрыть');
            } else {
                $(element).find('.review-control__open').html('Все отзывы на блогера');
            }
        });
    });
}

SetTableWidth = () => {
    if(!mobile) {
        let cols = [];
    
        for(var i = 1; i < 14; i++) {
            cols.push( $( '.table-col--' + i.toString() ) );
        }
    
        let biggestWidth = Array(cols.length).fill(0);
        
        $.map(cols, (element, i) => {
            $.map($(element), (_element) => {
                if(parseInt($(_element).css('width')) > biggestWidth[i] ) {
                    biggestWidth[i] = parseInt($(_element).width());
                }
            });
        });
    
        $.map(cols, (element, i) => {
            $(element).css({
                'max-width' : biggestWidth[i] + 'px',
                'min-width' : biggestWidth[i] + 'px'
            });
        });
    }
}

CloseBloggersReviews = () => {
    let bloggers = $('.blogger');

    $.map(bloggers, (element) => {
        if($(element).hasClass('blogger--open')) {
            $(element).removeClass('blogger--open');
        }
    });
}

ReviewsHandler = () => {
    let reviewBtns = $('.table-blogger__reviews-button');
    let mobileReviewBtns = $('.review-control__full');
    let reviews = $('.blogger-review');

    $.map(reviewBtns, (element, i) => {
        $(element).on('click', (event) => {
            event.preventDefault();
            if(!$(reviews[i]).hasClass('blogger-review--open')) {
                $(reviews[i]).addClass('blogger-review--open');
            } else {
                $(reviews[i]).removeClass('blogger-review--open');
            }
        });
    });

    $.map(mobileReviewBtns, (element, i) => {
        $(element).on('click', (event) => {
            event.preventDefault();
            if(!$(reviews[i]).hasClass('blogger-review--open')) {
                $(reviews[i]).addClass('blogger-review--open');
                $(element).addClass('review-control__full--open');
            } else {
                $(reviews[i]).removeClass('blogger-review--open');
                $(element).removeClass('review-control__full--open');
            }
        });
    });
}

SwitchMode = () => {
    let modes = $('.left-part .buttons .button');
    let table = $('.full-table .rectangle-block-wrapper .rectangle-block');

    $(modes[0]).on('click', () => {
        if(table.hasClass('mode--commerce')) {
            table.removeClass('mode--commerce');
            table.addClass('mode--blogger');
            // Если таблица косится при большом объеме данных при переключении режима, раскомментить эту строку, чтобы ширина пересчитывалась
            //SetTableWidth();
        }
    });

    $(modes[1]).on('click', () => {
        if(table.hasClass('mode--blogger')) {
            table.removeClass('mode--blogger');
            table.addClass('mode--commerce');
            // Если таблица косится при большом объеме данных при переключении режима, раскомментить эту строку, чтобы ширина пересчитывалась
            //SetTableWidth();
        }
    });
}

FilterHandler = () => {
    let filterBtn = $('#filter-button');
    let filterWindow = $('.review');
    let filterCloseButton = $('#filter-close-button');
    let filterOpen = false;
    let percentToClose = 76;

    let rangeInput = $('#level');
    let rating = $('#rating');

    let resetBtn = $('#reset-button');
    let reviewInputs = $('.review input');

    FilterWindow = (action) => {
        if(action) {
            if(filterBtn.hasClass('not-visited')) {
                filterBtn.removeClass('not-visited');
            }    
            filterWindow.addClass('review--open');    
            $('body, html').addClass('scroll-disabled');
        } else {
            filterWindow.removeClass('review--open');    
            $('body, html').removeClass('scroll-disabled');
        }

        filterOpen = action;
    }

    rangeInput.on('input', () => {
        rating.html(rangeInput.val());
    });

    filterBtn.on('click', () => {
        FilterWindow(true);
    });

    resetBtn.on('click', () => {
        $.map(reviewInputs, (element) => {
            if($(element).attr('type') == 'text' || $(element).attr('type') == 'number') {
                $(element).val('');
            } else {
                $(element).val('0');
            }
        });

        $.map($('.review .option'), (element) => {
            if($(element).hasClass('option--active')) {
                $(element).removeClass('option--active');
            }
        });

        $.map($('.review .select-wrapper .select'), (element) => {
            $(element).val('0');
        });

        rating.html('');
    });

    filterCloseButton.on('click', () => {
        FilterWindow(false);
    });

    $(window).on('click', (event) => {
        if(filterOpen) {
            if(100 / (windowWidth / event.clientX) > percentToClose) {
                FilterWindow(false);
            }
        }
    });
}

OptionsHandler = () => {
    let options = $('.option');

    $.map(options, (element) => {
        $(element).on('click', () => {
            $(element).toggleClass('option--active');
        });
    });
}

$(document).ready(() => {











  $.fn.moveIt = function(){
    var $window = $(window);
    var instances = [];
    
    $(this).each(function(){
      instances.push(new moveItItem($(this)));
    });
    
    $('[data-scroll-speed]')[0].addEventListener('scroll', function() {
      var scrollTop = $('[data-scroll-speed]').scrollTop();
      instances.forEach(function(inst){
        inst.update(scrollTop);
      });
    }, {passive: true});
  }
  
  var moveItItem = function(el){
    this.el = $(el);
    this.speed = parseInt(this.el.attr('data-scroll-speed')) * 10;
  };
  
  moveItItem.prototype.update = function(scrollTop){
    $($('[data-scroll-speed]')[0]).css('transform', 'translateY(' + -(scrollTop * 500 / this.speed) + 'px)');
  };
  
  // Initialization
  $(function(){
    $('[data-scroll-speed]').moveIt();
  });














    HeaderLoad();
    PlusHandler();
    TooltipHandler();
    SetTableWidth();
    ReviewsHandler();
    SwitchMode();
    FilterHandler();
    OptionsHandler();
});