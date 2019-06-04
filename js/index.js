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
    let bloggers = $('.table-blogger');
    let tableOpen = new Array(bloggers.length).fill(false);

    $.map(bloggers, (element, i) => {
        $(element).find('.table-blogger__open-copies').on('click', () => {
            if(!tableOpen[i]) {
                $(element).addClass('table-blogger--loading');
                setTimeout(() => {
                    $(element).removeClass('table-blogger--loading');
                    $(element).addClass('table-blogger--open');
                }, 1000);
                tableOpen[i] = true;
            } else {
                $(element).removeClass('table-blogger--open');
                tableOpen[i] = false;
            }
        });
    });
}

$(document).ready(() => {
    HeaderLoad();
    TooltipHandler();
    PlusHandler();
});