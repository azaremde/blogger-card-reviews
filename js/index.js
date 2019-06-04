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
                $(element).append(tooltip);
            }, () => {
                tooltip.fadeOut(50);
            });
        }
    });
}

PlusHandler = () => {
    let bloggers = $('.blogger');
    let tableOpen = new Array(bloggers.length).fill(false);

    $.map(bloggers, (element, i) => {
        $(element).find('.table-blogger__open-copies').on('click', () => {
            if(!tableOpen[i]) {
                $(element).addClass('blogger--loading');
                setTimeout(() => {
                    $(element).removeClass('blogger--loading');
                    $(element).addClass('blogger--open');
                }, 1000);
                tableOpen[i] = true;
            } else {
                $(element).removeClass('blogger--open');
                tableOpen[i] = false;
            }
        });
    });
}

SetTableWidth = () => {
    let cols = [
        $('.table-col--1'),
        $('.table-col--2'),
        $('.table-col--3'),
        $('.table-col--4'),
        $('.table-col--5'),
        $('.table-col--6'),
        $('.table-col--7'),
        $('.table-col--8'),
        $('.table-col--9'),
        $('.table-col--10'),
        $('.table-col--11'),
        $('.table-col--12'),
        $('.table-col--13'),
    ];

    let biggestWidth = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    
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

$(document).ready(() => {
    HeaderLoad();
    TooltipHandler();
    PlusHandler();
    SetTableWidth();
});